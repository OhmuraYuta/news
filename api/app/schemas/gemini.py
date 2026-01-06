from pydantic import BaseModel
from typing import List

class Message(BaseModel):
  role: str
  text: str

class GeminiRequest(BaseModel):
  messages: List[Message]
  character: str | None = None
  text: str
  makeTitle: bool | None = False

class GeminiResponse(BaseModel):
  text: str
  title: str | None