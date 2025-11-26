from fastapi import APIRouter, UploadFile, File, HTTPException
from src.core.embeddings import get_embedding
from src.db.vector_store import add_document

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
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
            text = content.decode("utf-8")
        
        # Save file to disk
        import os
        import shutil
        
        file_location = f"static/uploads/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(content)
            
        file_url = f"http://localhost:8001/{file_location}"
        
        # Simple chunking (can be improved)
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
                "file_url": file_url
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
    import os
    
    # Delete from vector store
    success = delete_document(filename)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
        
    # Delete from disk
    file_path = f"static/uploads/{filename}"
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return {"status": "deleted", "filename": filename}
