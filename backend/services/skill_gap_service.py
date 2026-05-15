import json
from core.claude import client
from core.supabase import supabase


class SkillGapService:
    async def analyze(self, cv_id: str, target_role: str) -> dict:
        cv_result = supabase.table("profiles").select("parsed_cv").eq("id", cv_id).execute()
        if not cv_result.data:
            return {}
        parsed = cv_result.data[0]["parsed_cv"]

        prompt = f"""You are a career coach. Analyze the skill gap between this candidate and their target role.

Candidate Skills: {json.dumps(parsed.get("skills", []))}
Candidate Experience: {json.dumps([{"title": e.get("title"), "company": e.get("company")} for e in parsed.get("experience", [])])}
Target Role: {target_role}

Return ONLY valid JSON:
{{
  "match_percent": 0-100,
  "strong_skills": ["skills candidate already has that are relevant"],
  "missing_skills": [
    {{
      "skill": "skill name",
      "priority": "high|medium|low",
      "reason": "why this matters for the role",
      "how_to_learn": "specific course or resource"
    }}
  ],
  "overall_advice": "2-3 sentence career advice"
}}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"},
        )

        return json.loads(response.choices[0].message.content)
