from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.core.llm import ask_llm
from src.db.vector_store import query_documents

router = APIRouter()

class QuizRequest(BaseModel):
    topic: str

@router.post("/quiz")
def generate_quiz(req: QuizRequest):
    # Retrieve relevant context
    context = query_documents(req.topic)
    
    prompt = f"""
    Based on the following context, generate a quiz with 5 multiple-choice questions about "{req.topic}".
    Format the output as a JSON list of objects, where each object has:
    - "question": The question text
    - "options": A list of 4 options
    - "answer": The correct option
    
    Context:
    {context}
    """
    
    try:
        response = ask_llm(prompt)
        # Basic parsing (assuming LLM returns valid JSON or close to it)
        # In a production app, we'd use structured output or more robust parsing
        import json
        import re
        
        # Extract JSON from response if wrapped in code blocks
        match = re.search(r'```json\n(.*?)\n```', response, re.DOTALL)
        if match:
            json_str = match.group(1)
        else:
            json_str = response
            
        quiz_data = json.loads(json_str)
        return {"quiz": quiz_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
