# Conversational AI Education Platform

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/FrontEnd-Next.js-black)
![FastAPI](https://img.shields.io/badge/BackEnd-FastAPI-teal)
![Groq](https://img.shields.io/badge/AI-Groq-orange)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)

A futuristic educational platform featuring an AI chatbot with RAG capabilities, file uploads, and quizzes.

## 📚 Documentation

Detailed documentation is available in the following files:

- **[Quick Start Guide](QUICK_START.md)**: Steps to get the app running locally.
- **[Architecture Design](ARCHITECTURE_DESIGN.md)**: System diagrams and data flow.
- **[Feature Inventory](FEATURE_INVENTORY.md)**: Checklist of implemented features.
- **[Testing Guide](TESTING_GUIDE.md)**: How to verify system functionality.

## 🚀 Features

- **AI Chatbot**: Powered by Groq (Llama 3) for intelligent, context-aware responses.
- **RAG System**: Upload documents (PDF, TXT, MD, Images) to enhance the AI's knowledge.
- **Image Analysis**: Uses Llama 3.2 Vision to "see" and describe uploaded images.
- **File Management**: Upload, preview, and manage your knowledge base.
- **Modern UI**: Built with Next.js 16 and Tailwind CSS 4.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **State**: React Hooks + Axios
- **Visuals**: Framer Motion, Three.js (Drei)

### Backend
- **Framework**: FastAPI
- **AI Engine**: Groq (Llama 3.3 / Llama 3.2 Vision)
- **Vector Store**: Supabase (pgvector)
- **Embeddings**: FastEmbed
- **Storage**: Supabase Storage

## ⚡ Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

> **Note**: If you see deployment failures in Render/Vercel, ensure all Environment Variables (groq_api_key, supabase credentials) are correctly set in the dashboard.
