import json
import PyPDF2
import docx
from io import BytesIO
from core.claude import client
from core.supabase import supabase
from models.cv import ParsedCV


class CVService:
    async def extract_text(self, content: bytes, content_type: str) -> str:
        if content_type == "application/pdf":
            reader = PyPDF2.PdfReader(BytesIO(content))
            return "\n".join(page.extract_text() for page in reader.pages)
        else:
            doc = docx.Document(BytesIO(content))
            return "\n".join(p.text for p in doc.paragraphs)

    async def parse_with_ai(self, text: str) -> ParsedCV:
        prompt = f"""Extract structured information from this CV text and return ONLY valid JSON with no extra text.

CV Text:
{text}

Return JSON with this exact structure:
{{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "summary": "string or null",
  "skills": ["skill1", "skill2"],
  "languages": ["language1"],
  "links": {{
    "linkedin": "url or null",
    "github": "url or null",
    "portfolio": "url or null",
    "other": []
  }},
  "experience": [{{"company": "", "title": "", "start_date": "", "end_date": "", "description": ""}}],
  "education": [{{"institution": "", "degree": "", "field": "", "year": ""}}]
}}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content
        data = json.loads(raw)
        return ParsedCV(**data)

    async def save_to_db(self, filename: str, parsed: ParsedCV, raw_text: str) -> dict:
        row = {
            "filename": filename,
            "parsed_cv": parsed.model_dump(),
            "raw_text": raw_text[:2000],
        }
        result = supabase.table("profiles").insert(row).execute()
        return result.data[0]

    async def process_cv(self, content: bytes, filename: str, content_type: str) -> dict:
        text = await self.extract_text(content, content_type)
        parsed = await self.parse_with_ai(text)
        saved = await self.save_to_db(filename, parsed, text)
        return {
            "id": saved["id"],
            "filename": filename,
            "parsed": parsed.model_dump(),
            "created_at": saved["created_at"],
        }

    async def get_cv(self, cv_id: str) -> dict | None:
        result = supabase.table("profiles").select("*").eq("id", cv_id).execute()
        if not result.data:
            return None
        row = result.data[0]
        return {
            "id": row["id"],
            "filename": row["filename"],
            "parsed": row["parsed_cv"],
            "created_at": row["created_at"],
        }

    async def list_cvs(self) -> list:
        result = supabase.table("profiles").select("id, filename, cv_score, created_at").order("created_at", desc=True).execute()
        return result.data
