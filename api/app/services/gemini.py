from google import genai
from google.genai import types

from ..schemas.gemini import GeminiRequest
from .prompt import Prompt
from .youtube import get_youtube_video_info

async def gemini(request: GeminiRequest):
  
  messages = request.messages

  history = [types.Content(role=message.role, parts=[types.Part(text=message.text)]) for message in messages]

  client = genai.Client()

  chat = client.chats.create(
    model="gemini-3-flash-preview",
    config=types.GenerateContentConfig(
      system_instruction=Prompt.system_instruction,
      tools=[get_youtube_video_info],
    ),
    history=history
  )

  res = chat.send_message(request.text)

  return res.text

  # return 'test response'
