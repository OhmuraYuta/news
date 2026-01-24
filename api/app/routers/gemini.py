from fastapi import APIRouter

from ..schemas.gemini import GeminiResponse, GeminiRequest
from ..services.gemini import gemini as gemini_service

router = APIRouter()

@router.post("/gemini", response_model=GeminiResponse)
async def gemini(request: GeminiRequest):
  res, title = await gemini_service(request)
  return {"text": res, "title": title}