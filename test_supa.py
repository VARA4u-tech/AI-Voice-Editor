import urllib.request
import json
import os
from dotenv import load_dotenv
import uuid

load_dotenv('backend/.env')
url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_ANON_KEY')

data = {
    "user_id": str(uuid.uuid4()),
    "file_hash": "test",
    "content": ["test"],
    "page_count": 1
}

req = urllib.request.Request(f"{url}/rest/v1/user_documents?on_conflict=id", 
    data=json.dumps(data).encode('utf-8'),
    headers={
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode())
except urllib.error.HTTPError as e:
    res = e.read().decode()
    print("Error:", res)
