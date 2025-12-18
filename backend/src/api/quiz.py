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
    
    IMPORTANT: Return ONLY a JSON list of objects. Do not include any other text, explanations, or markdown formatting (like ```json).
    
    Format:
    [
      {{
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Option B" 
      }}
    ]
    
    Constraint: The "answer" field MUST be an exact string copy of one of the items in the "options" list.
    
    Context:
    {context}
    """
    
    try:
        response = ask_llm(prompt)
        print(f"LLM Response for Quiz: {response}") # Debug log
        
        # Clean up response
        json_str = response.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:]
        if json_str.endswith("```"):
            json_str = json_str[:-3]
        
        json_str = json_str.strip()
        
        import json
        quiz_data = json.loads(json_str)
        return {"quiz": quiz_data}
    except Exception as e:
        print(f"Quiz Generation Error: {e}")
        print(f"Raw Response: {response}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")
