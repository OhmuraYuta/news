from pydantic import BaseModel
from typing import List

class Message(BaseModel):
  role: str
  text: str

class GeminiRequest(BaseModel):
  messages: List[Message]
  text: str

class GeminiResponse(BaseModel):
  text: str