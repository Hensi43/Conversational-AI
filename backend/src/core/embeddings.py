import os
from sentence_transformers import SentenceTransformer

# Use the model name directly to allow automatic download/caching
MODEL_NAME = "all-MiniLM-L6-v2"

print(f"Loading embedding model: {MODEL_NAME}")

model = SentenceTransformer(MODEL_NAME)

def get_embedding(text: str):
    emb = model.encode(text)
    return emb.tolist()
