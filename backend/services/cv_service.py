import json
import PyPDF2
import docx
from io import BytesIO
from core.claude import client
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

    async def process_cv(self, content: bytes, filename: str, content_type: str) -> dict:
        text = await self.extract_text(content, content_type)
        parsed = await self.parse_with_ai(text)
        return {
            "filename": filename,
            "parsed": parsed.model_dump(),
            "raw_text": text[:500]
        }

    async def get_cv(self, cv_id: str) -> dict | None:
        return None
