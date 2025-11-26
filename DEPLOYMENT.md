# Deployment Guide

## 1. Upload to GitHub

1.  Create a new repository on GitHub (do not initialize with README, .gitignore, or license).
2.  Run the following commands in your terminal (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Deploy Frontend (Vercel)

1.  Go to [Vercel](https://vercel.com) and sign up/login.
2.  Click "Add New..." -> "Project".
3.  Import your GitHub repository.
4.  Configure the project:
    -   **Framework Preset**: Next.js (should be auto-detected).
    -   **Root Directory**: `frontend` (Click "Edit" and select the `frontend` folder).
    -   **Environment Variables**: Add any variables from `frontend/.env` (if any).
5.  Click "Deploy".

## 3. Deploy Backend (Render)

**Method A: Manual Deployment (Recommended for Free Tier)**

1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your `Conversational-AI` repository.
4.  Configure the service:
    -   **Name**: `conversational-ai-backend` (or similar)
    -   **Root Directory**: `backend`
    -   **Runtime**: Python 3
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port 10000`
5.  **Instance Type**: Select **"Free"**.
6.  **Environment Variables** (Click "Add Environment Variable"):
    -   Key: `GROQ_API_KEY` | Value: `your_groq_api_key`
    -   Key: `PYTHON_VERSION` | Value: `3.10.0`
7.  Click **"Create Web Service"**.

**Method B: Blueprint (Automated)**

1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **"New +"** -> **"Blueprint"**.
3.  Connect your repository.
4.  Click **"Apply"**.
    *   *Note: This might require adding a payment method even for free plans.*

## 4. Connect Frontend to Backend

1.  Once the backend is deployed, copy its URL (e.g., `https://your-backend.onrender.com`).
2.  Go back to your Vercel project settings -> Environment Variables.
3.  Add `NEXT_PUBLIC_API_URL` with the backend URL.
4.  Redeploy the frontend.
