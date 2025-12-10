from src.core.llm import ask_llm

from src.db.vector_store import query_documents

def handle_chat(query: str):
    # 1. Retrieve relevant context from vector store
    context = query_documents(query)
    
    # 2. Build prompt with context
    if context:
        prompt = f"""
You are a friendly and helpful study buddy. You are here to help students learn and understand the material.
Use the following context to answer the user's question. 
Keep your tone casual, encouraging, and supportive. Avoid being overly formal or robotic.
If the answer is not in the context, you can use your general knowledge but mention that it's not from the uploaded documents.

Context:
{context}

User Question: {query}
"""
    else:
        # No context found, still maintain persona
        prompt = f"""
You are a friendly and helpful study buddy.
Answer the user's question in a casual, encouraging, and supportive tone.

User Question: {query}
"""

    print(f"\nSending prompt to Groq (Context length: {len(context) if context else 0}):\n")
    # print(prompt) # Debugging

    response = ask_llm(prompt)
    return response
