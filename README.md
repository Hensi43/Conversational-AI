# Conversational AI Education Platform

A futuristic educational platform featuring an AI chatbot with RAG capabilities, file uploads, and quizzes.

## Features

- **AI Chatbot**: Powered by Groq (Llama 3) for intelligent responses.
- **RAG System**: Upload documents (PDF, TXT, MD, Images) to enhance the AI's knowledge.
- **File Management**: Upload, preview, and delete files.
- **Quiz System**: Interactive quizzes generated from uploaded content (In Progress).
- **Futuristic UI**: Built with Next.js and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Axios
- **Backend**: FastAPI, LangChain, ChromaDB (In-memory), Groq API

## Getting Started

### Prerequisites

- Node.js
- Python 3.10+
- Groq API Key

### Installation

1.  Clone the repository.
2.  **Backend**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
    Create a `.env` file in `backend/` with:
    ```
    GROQ_API_KEY=your_api_key_here
    ```
    Run the server:
    ```bash
    uvicorn src.main:app --reload --port 8001
    ```

3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions.
