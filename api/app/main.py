from fastapi import FastAPI

from .routers import gemini

app = FastAPI()

app.include_router(gemini.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}