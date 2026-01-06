from google import genai
from google.genai import types

from ..schemas.gemini import GeminiRequest
from .prompt import Prompt
from .youtube import get_youtube_video_info
from .apitube import get_news_from_apitube
from .scrape import scrape_news, scrape_with_playwright

async def gemini(request: GeminiRequest):
  
  messages = request.messages

  history = [types.Content(role=message.role, parts=[types.Part(text=message.text)]) for message in messages]

  client = genai.Client()

  chat = client.chats.create(
    model="gemini-3-flash-preview",
    config=types.GenerateContentConfig(
      system_instruction=Prompt.system_instruction(request.character),
      tools=[get_youtube_video_info, get_news_from_apitube, scrape_news, scrape_with_playwright],
    ),
    history=history
  )

  res = chat.send_message(request.text)

  title = None
  if request.makeTitle:
    rawTitle = chat.send_message("この会話のタイトルを簡潔につけてください。純粋にタイトルのみを返してください。")
    title = rawTitle.text

  return res.text, title

  # return 'test response'
