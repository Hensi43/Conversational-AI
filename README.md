# Conversational AI Education Platform

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/FrontEnd-Next.js-black)
![FastAPI](https://img.shields.io/badge/BackEnd-FastAPI-teal)
![Groq](https://img.shields.io/badge/AI-Groq-orange)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)

A futuristic educational platform featuring an AI chatbot with RAG capabilities, file uploads, and quizzes.

---

## 🚀 Quick Start
*Full guide: [QUICK_START.md](QUICK_START.md)*

1. **Backend**: 
   ```bash
   cd backend && python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   # Set GROQ_API_KEY & SUPABASE credentials in .env
   uvicorn src.main:app --reload --port 8000
   ```
2. **Frontend**:
   ```bash
   cd frontend && npm install
   npm run dev
   # App runs at http://localhost:3000
   ```

---

## 🏗️ Architecture
*Full design: [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md)*

The system uses a **Decoupled Architecture**:
- **Frontend**: Next.js 16 (App Router) for a responsive UI.
- **Backend**: FastAPI services handling logic and AI orchestration.
- **RAG Pipeline**: 
  - **Ingest**: Uploads -> PDF/Image Parsing -> Chunking -> Supabase Vector Store.
  - **Retrieve**: User Query -> Vector Search -> Context + Prompt -> Groq (Llama 3).

---

## ✨ Features
*Full list: [FEATURE_INVENTORY.md](FEATURE_INVENTORY.md)*

- **AI Chatbot**: Context-aware conversations with Llama 3.
- **RAG System**: "Chat with your data" using PDF/Text uploads.
- **Vision Integration**: Upload images; the AI uses Llama 3.2 Vision to "see" them.
- **Modern UI**: Dark mode, drag-and-drop, and markdown rendering.

---

## 🧪 Testing & Verification
*Full guide: [TESTING_GUIDE.md](TESTING_GUIDE.md)*

- **Health Check**: Visit `http://localhost:8000` -> `{"status": "Groq/Supabase RAG server running"}`.
- **Upload Test**: Upload a PDF. Check console for "Embedding..." logs.
- **Chat Test**: Ask questions about the specific content you just uploaded.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS 4, Axios, Framer Motion
- **Backend**: FastAPI, Groq API, Supabase (pgvector + Storage)
- **Deployment**: Configured for Vercel (Frontend) and Render (Backend).

> **Note**: For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).
