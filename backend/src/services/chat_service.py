from src.core.llm import ask_llm

from src.db.vector_store import query_documents

def handle_chat(query: str):
    # 1. Retrieve relevant context from vector store
    context = query_documents(query)
    
    # 2. Build prompt with context
    if context:
        prompt = f"""
You are a helpful AI assistant for an educational platform. 
Use the following context to answer the user's question. 
If the answer is not in the context, you can use your general knowledge but mention that it's not from the uploaded documents.

Context:
{context}

User Question: {query}
"""
    else:
        # No context found, just use the query directly
        prompt = query

    print(f"\nSending prompt to Groq (Context length: {len(context) if context else 0}):\n")
    # print(prompt) # Debugging

    response = ask_llm(prompt)
    return response
