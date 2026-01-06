from pydantic import BaseModel
from typing import List

class Message(BaseModel):
  role: str
  text: str

class GeminiRequest(BaseModel):
  messages: List[Message]
  character: str | None = None
  text: str

class GeminiResponse(BaseModel):
  text: str