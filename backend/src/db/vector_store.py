import json
import numpy as np
from src.db.supabase import supabase

def add_document(text, embedding, metadata=None):
    # Convert numpy array to list for Supabase
    embedding_list = np.array(embedding, dtype=np.float32).tolist()
    
    data = {
        "content": text,
        "metadata": metadata or {},
        "embedding": embedding_list
    }
    
    response = supabase.table("documents").insert(data).execute()
    return response

def get_all_uploads():
    # Fetch distinct filenames from metadata in documents table
    # This is less efficient in NoSQL/JSONB style, but workable.
    # We fetch all (limit to some number) and aggregate in python if needed, 
    # or better, use a specific RPC or just list all for now.
    
    # For now, let's just fetch the last 50 documents
    response = supabase.table("documents").select("metadata, created_at").order("created_at", desc=True).limit(50).execute()
    
    # Setup a set to track unique filenames
    seen_files = set()
    uploads = []
    
    for row in response.data:
        meta = row.get("metadata", {})
        filename = meta.get("filename")
        if filename and filename not in seen_files:
            seen_files.add(filename)
            # Add timestamp if not in metadata but in row
            if "created_at" in row and "created_at" not in meta:
                meta["created_at"] = row["created_at"]
            uploads.append(meta)
            
    return uploads

def delete_document(filename: str):
    # This is tricky with JSONB. We need to delete where metadata->>'filename' = filename
    # Supabase-py / postgrest supports filter on json columns
    
    response = supabase.table("documents").delete().eq("metadata->>filename", filename).execute()
    
    # Also delete from storage if possible, but the function signature just returns bool
    # We will handle storage deletion in the API layer or here if we want.
    # For this function, we just clear the DB records.
    return True

def query_documents(query_text: str, top_k=5):
    from src.core.embeddings import get_embedding
    
    query_emb = get_embedding(query_text)
    
    # Call the RPC function 'match_documents'
    params = {
        "query_embedding": query_emb,
        "match_threshold": 0.5, # Adjust as needed
        "match_count": top_k
    }
    
    try:
        response = supabase.rpc("match_documents", params).execute()
        
        results = []
        for match in response.data:
            results.append(match.get("content", ""))
            
        return "\n\n".join(results)
    except Exception as e:
        print(f"Error querying documents: {e}")
        return ""
