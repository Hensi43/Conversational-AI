from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from src.chat_db import create_session, get_all_sessions, get_session, delete_session, get_messages_by_session

router = APIRouter()

class SessionBase(BaseModel):
    title: str

class SessionResponse(BaseModel):
    id: str
    title: str
    created_at: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: str

@router.get("/sessions", response_model=List[SessionResponse])
async def list_sessions():
    sessions = get_all_sessions()
    return sessions

@router.post("/sessions", response_model=SessionResponse)
async def create_new_session(session: SessionBase):
    session_id = create_session(session.title)
    created_session = get_session(session_id)
    if not created_session:
        raise HTTPException(status_code=500, detail="Failed to create session")
    return created_session

@router.get("/sessions/{session_id}", response_model=List[MessageResponse])
async def get_session_history(session_id: str):
    messages = get_messages_by_session(session_id)
    return messages

@router.delete("/sessions/{session_id}")
async def delete_chat_session(session_id: str):
    delete_session(session_id)
    return {"status": "deleted"}
