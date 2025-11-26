import numpy as np

DOCUMENTS = []
EMBEDDINGS = []
METADATA = []

def add_document(text, embedding, metadata=None):
    DOCUMENTS.append(text)
    EMBEDDINGS.append(np.array(embedding))
    METADATA.append(metadata or {})

def get_all_uploads():
    # Return unique uploads based on filename
    seen_files = set()
    uploads = []
    # Iterate in reverse to get most recent first
    for meta in reversed(METADATA):
        if meta and "filename" in meta and meta["filename"] not in seen_files:
            seen_files.add(meta["filename"])
            uploads.append(meta)
    return uploads

def delete_document(filename: str):
    global DOCUMENTS, EMBEDDINGS, METADATA
    
    new_docs = []
    new_embs = []
    new_meta = []
    
    for i, meta in enumerate(METADATA):
        if meta.get("filename") != filename:
            new_docs.append(DOCUMENTS[i])
            new_embs.append(EMBEDDINGS[i])
            new_meta.append(meta)
            
    DOCUMENTS = new_docs
    EMBEDDINGS = new_embs
    METADATA = new_meta
    return True

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search(query_embedding, top_k=5):
    if not EMBEDDINGS:
        return []

    scores = []
    for i, emb in enumerate(EMBEDDINGS):
        sim = cosine_similarity(query_embedding, emb)
        scores.append((sim, DOCUMENTS[i]))

    scores.sort(reverse=True, key=lambda x: x[0])
    return [doc for _, doc in scores[:top_k]]

def query_documents(query_text: str, top_k=5):
    from src.core.embeddings import get_embedding
    query_emb = get_embedding(query_text)
    results = search(query_emb, top_k)
    return "\n\n".join(results)
