import json
from core.claude import client
from core.supabase import supabase


class MatchingService:
    async def match_jobs(self, cv_id: str) -> list:
        # Fetch CV
        cv_result = supabase.table("profiles").select("*").eq("id", cv_id).execute()
        if not cv_result.data:
            return []
        cv = cv_result.data[0]
        parsed_cv = cv["parsed_cv"]

        # Fetch all job listings
        jobs_result = supabase.table("job_listings").select("*").order("created_at", desc=True).execute()
        jobs = jobs_result.data
        if not jobs:
            return []

        # Build prompt for bulk scoring
        cv_summary = {
            "skills": parsed_cv.get("skills", []),
            "experience": [
                {"title": e.get("title"), "company": e.get("company")}
                for e in parsed_cv.get("experience", [])
            ],
            "education": [
                {"degree": e.get("degree"), "field": e.get("field")}
                for e in parsed_cv.get("education", [])
            ],
            "summary": parsed_cv.get("summary", ""),
        }

        jobs_summary = [
            {
                "id": j["id"],
                "title": j["title"],
                "company": j["company_name"],
                "requirements": j.get("requirements", []),
                "description": j["description"][:300],
                "experience_level": j.get("experience_level"),
            }
            for j in jobs
        ]

        prompt = f"""You are a job matching expert. Score how well this candidate matches each job.

Candidate Profile:
{json.dumps(cv_summary, indent=2)}

Job Listings:
{json.dumps(jobs_summary, indent=2)}

Return ONLY valid JSON array. For each job return:
{{
  "id": "job_id",
  "score": 0-100,
  "reason": "one sentence why",
  "missing_skills": ["skill1", "skill2"]
}}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"},
        )

        raw = json.loads(response.choices[0].message.content)
        scores = raw if isinstance(raw, list) else raw.get("matches", raw.get("jobs", []))

        # Merge scores with full job data
        score_map = {s["id"]: s for s in scores}
        results = []
        for job in jobs:
            match = score_map.get(job["id"], {})
            results.append({
                **job,
                "match_score": match.get("score", 0),
                "match_reason": match.get("reason", ""),
                "missing_skills": match.get("missing_skills", []),
            })

        # Save matches to DB
        for r in results:
            existing = supabase.table("matches").select("id").eq("profile_id", cv_id).eq("job_id", r["id"]).execute()
            row = {"profile_id": cv_id, "job_id": r["id"], "score": r["match_score"], "gap_analysis": {"reason": r["match_reason"], "missing_skills": r["missing_skills"]}}
            if existing.data:
                supabase.table("matches").update(row).eq("profile_id", cv_id).eq("job_id", r["id"]).execute()
            else:
                supabase.table("matches").insert(row).execute()

        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    async def get_matches(self, cv_id: str) -> list:
        result = (
            supabase.table("matches")
            .select("*, job_listings(*)")
            .eq("profile_id", cv_id)
            .order("score", desc=True)
            .execute()
        )
        matches = []
        for m in result.data:
            job = m.get("job_listings") or {}
            matches.append({
                **job,
                "match_score": m["score"],
                "match_reason": (m.get("gap_analysis") or {}).get("reason", ""),
                "missing_skills": (m.get("gap_analysis") or {}).get("missing_skills", []),
            })
        return matches

    async def calculate_cv_score(self, cv_id: str) -> int:
        cv_result = supabase.table("profiles").select("parsed_cv").eq("id", cv_id).execute()
        if not cv_result.data:
            return 0
        parsed = cv_result.data[0]["parsed_cv"]

        score = 0
        if parsed.get("name"): score += 10
        if parsed.get("email"): score += 10
        if parsed.get("phone"): score += 5
        if parsed.get("location"): score += 5
        if parsed.get("summary"): score += 15
        skills = parsed.get("skills", [])
        score += min(len(skills) * 2, 20)
        experience = parsed.get("experience", [])
        score += min(len(experience) * 5, 20)
        education = parsed.get("education", [])
        score += min(len(education) * 5, 10)
        links = parsed.get("links") or {}
        if links.get("linkedin"): score += 3
        if links.get("github"): score += 2

        # Save score
        supabase.table("profiles").update({"cv_score": score}).eq("id", cv_id).execute()
        return score
