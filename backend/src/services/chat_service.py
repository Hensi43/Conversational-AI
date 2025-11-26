from src.core.llm import ask_llm

def handle_chat(query: str):
    # context = retrieve_context(query)
    # prompt = build_prompt(query, context)

    print("\nSending prompt to Groq (Direct):\n")
    print(query)

    response = ask_llm(query)
    return response
