# 新しいライブラリのインポート
from google import genai
from google.genai import types

from ..schemas.gemini import GeminiRequest

async def gemini(request: GeminiRequest):
  
  messages = request.messages

  history = [types.Content(role=message.role, parts=[types.Part(text=message.text)]) for message in messages]

  client = genai.Client()

  chat = client.chats.create(
    model="gemini-3-flash-preview",
    history=history
  )

  res = chat.send_message(request.text)
  print(res.text, type(res.text))

  return res.text

  # return 'test response'
