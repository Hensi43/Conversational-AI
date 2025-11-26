from src.core.embeddings import get_embedding
from src.db.vector_store import search

def retrieve_context(query: str):
    embedding = get_embedding(query)
    return search(embedding, top_k=5)

def build_prompt(query: str, context_list):
    context = "\n".join(context_list)
    return f"""
You are an educational AI tutor. Use this context to answer the question.

Context:
{context}

Question:
{query}
"""
