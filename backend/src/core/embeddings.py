from fastembed import TextEmbedding

# Use a lightweight ONNX model
MODEL_NAME = "BAAI/bge-small-en-v1.5" # or "Qdrant/all-MiniLM-L6-v2-onnx"

print(f"Loading embedding model: {MODEL_NAME}")

# threads=1 to minimize memory usage
model = TextEmbedding(model_name=MODEL_NAME, threads=1)

def get_embedding(text: str):
    # fastembed returns a generator of embeddings
    embeddings = list(model.embed([text]))
    return embeddings[0].tolist()
