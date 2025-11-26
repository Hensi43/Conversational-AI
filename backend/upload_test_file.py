import requests

url = "http://localhost:8001/api/upload"
file_path = "/Users/hensi/.gemini/antigravity/brain/979973f7-0087-4075-91bd-abb9a377421c/uploaded_image_1764143818300.png"

try:
    with open(file_path, "rb") as f:
        files = {"file": (file_path.split("/")[-1], f, "image/png")}
        response = requests.post(url, files=files)
        
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
