from fastapi import APIRouter
from pydantic import BaseModel
from src.services.chat_service import handle_chat

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    answer = handle_chat(request.query)
    return {"answer": answer}
