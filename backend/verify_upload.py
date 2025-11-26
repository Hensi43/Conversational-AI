import urllib.request
import urllib.parse
import mimetypes
import uuid

url = "http://localhost:8001/api/upload"
file_path = "/Users/hensi/.gemini/antigravity/brain/979973f7-0087-4075-91bd-abb9a377421c/uploaded_image_1764143818300.png"
boundary = uuid.uuid4().hex

data = []
data.append(f'--{boundary}')
data.append(f'Content-Disposition: form-data; name="file"; filename="{file_path.split("/")[-1]}"')
data.append(f'Content-Type: image/png')
data.append('')

with open(file_path, 'rb') as f:
    data.append(f.read())

data.append(f'--{boundary}--')
data.append('')

body = b''
for item in data:
    if isinstance(item, str):
        body += item.encode('utf-8') + b'\r\n'
    else:
        body += item + b'\r\n'

req = urllib.request.Request(url, data=body)
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"Error: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
