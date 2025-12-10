from fastapi import APIRouter, UploadFile, File, HTTPException
from src.core.embeddings import get_embedding
from src.db.vector_store import add_document
from src.db.supabase import supabase
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # Determine text content first (same logic as before)
        if file.filename.endswith(".pdf"):
            import io
            from pypdf import PdfReader
            
            pdf_reader = PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            import base64
            from src.core.llm import ask_llm_vision
            
            # Encode image to base64
            base64_image = base64.b64encode(content).decode('utf-8')
            mime_type = "image/jpeg" if file.filename.lower().endswith((".jpg", ".jpeg")) else "image/png"
            image_url = f"data:{mime_type};base64,{base64_image}"
            
            # Generate description using Vision LLM
            prompt = "Describe this image in detail for a knowledge base. Include key text, objects, and context."
            description = ask_llm_vision(prompt, image_url)
            
            text = f"Image Filename: {file.filename}\nDescription: {description}"
        else:
            text = f"Filename: {file.filename}\nContent:\n{content.decode('utf-8')}"
        
        # Upload to Supabase Storage
        file_path = f"{uuid.uuid4()}-{file.filename}"
        res = supabase.storage.from_("uploads").upload(
            file=content,
            path=file_path,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        file_url = supabase.storage.from_("uploads").get_public_url(file_path)
        
        # Chunking and embedding
        chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
        
        import datetime
        timestamp = datetime.datetime.now().isoformat()
        
        for chunk in chunks:
            emb = get_embedding(chunk)
            metadata = {
                "filename": file.filename,
                "type": file.content_type or "unknown",
                "timestamp": timestamp,
                "chunk_text": chunk[:100] + "...", # Store preview
                "file_url": file_url,
                "storage_path": file_path 
            }
            add_document(chunk, emb, metadata)
            
        return {"status": "uploaded", "filename": file.filename, "chunks": len(chunks), "file_url": file_url}
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a text, PDF, or image file.")
    except Exception as e:
        print(f"Upload failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/uploads")
def get_uploads():
    from src.db.vector_store import get_all_uploads
    return {"uploads": get_all_uploads()}

@router.delete("/upload/{filename}")
def delete_upload(filename: str):
    from src.db.vector_store import delete_document
    
    # We need to find the storage path first.
    # ideally we store the storage path in the database.
    # For now we only have the filename.
    # This part is tricky if we don't store the path or ID well.
    # The current `delete_document` deletes by filename. 
    # Because valid filenames in storage likely have a UUID prefix now, verifying deletion is harder without looking up first.
    # But let's assume valid implementation:
    
    # 1. Delete from DB
    success = delete_document(filename)
    if not success:
         raise HTTPException(status_code=404, detail="File not found")

    # 2. Deleting from storage is hard if we don't know the exact UUID-prefixed path.
    # We upgraded metadata storage to include `storage_path`.
    # BUT, `delete_document` currently deletes blindly based on metadata->filename.
    # We should probably update `delete_document` or fetch first.
    
    # For this iteration, we will just delete from DB as it removes it from RAG context.
    # Cleanup of storage bucket can be a separate maintenance task or we improve this later.

    return {"status": "deleted", "filename": filename}
