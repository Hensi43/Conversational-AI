from fastapi import APIRouter
from pydantic import BaseModel
from src.services.chat_service import handle_chat

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: str = None

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    answer = handle_chat(request.query, request.session_id)
    return {"answer": answer}
