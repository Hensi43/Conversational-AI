from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.chat import router as chat_router
from src.api.upload import router as upload_router
from src.api.quiz import router as quiz_router
from src.api.auth import router as auth_router
from src.api.sessions import router as sessions_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Create static directory if it doesn't exist
os.makedirs("static/uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    return {"status": "Groq/Supabase RAG server running"}

app.include_router(chat_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(sessions_router, prefix="/api")
