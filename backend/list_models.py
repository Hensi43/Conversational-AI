from groq import Groq
from src.config import settings
import os

# Ensure API key is set
if not settings.GROQ_API_KEY:
    print("GROQ_API_KEY is not set in settings.")
    exit(1)

client = Groq(api_key=settings.GROQ_API_KEY)

try:
    models = client.models.list()
    print("Available Models:")
    for model in models.data:
        print(f"- {model.id}")
except Exception as e:
    print(f"Error listing models: {e}")
