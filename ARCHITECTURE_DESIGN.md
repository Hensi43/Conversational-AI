# Architecture Design

## System Overview

The **Conversational AI Education Platform** follows a modern decoupled architecture, separating the interactive Next.js frontend from the high-performance FastAPI backend.

### High-Level Data Flow

```mermaid
graph TD
    User[User] -->|Interacts| UI[Next.js Frontend]
    UI -->|HTTP Requests| API[FastAPI Backend]
    
    subgraph Backend Services
        API -->|Route| Controller[API Controllers]
        Controller -->|Logic| Service[Service Layer]
        
        Service -->|Inference| Groq[Groq AI API]
        Service -->|Data/Vector| Supabase[Supabase DB]
        Service -->|Files| Storage[Supabase Storage]
    end
```

## Component Breakdown

### 1. Frontend (Next.js)
- **App Router**: Handles navigation.
- **Chat Interface**: Websocket-like experience using polling/REST.
- **File Upload**: Direct stream to backend.

### 2. Backend (FastAPI)
- **Service Layer**: 
    - `chat_service.py`: Retrieval Augmented Generation (RAG) logic.
    - `upload_service.py`: File parsing (PDF/Image), Chunking, and Embedding.
- **Database Layer**:
    - `vector_store.py`: Abstraction over Supabase `pgvector`.

## RAG Workflow (Retrieval Augmented Generation)

1. **Ingestion**: 
   - User uploads file -> Text extracted -> Chunked -> Embedded -> Stored in Supabase.
2. **Retrieval**:
   - User asks question -> Use current context + History -> Vector Search in Supabase -> Top K chunks retrieved.
3. **Generation**:
   - Prompt constructed with Context + History -> Sent to Groq (Llama 3) -> Response returned.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Supabase
    participant A as Groq AI

    U->>F: Upload Document
    F->>B: POST /upload
    B->>D: Store Vectors & Content
    B-->>F: Success

    U->>F: Ask Question
    F->>B: POST /chat
    B->>D: Query Similar Chunks
    D-->>B: Return Context
    B->>A: Send Prompt + Context
    A-->>B: AI Response
    B-->>F: Display Answer
```
