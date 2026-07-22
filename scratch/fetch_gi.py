import urllib.request
import json

url = "http://localhost:8000/api/gi"
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2)[:1000] + "\n... (truncated)")
except Exception as e:
    print(f"Error fetching gi: {e}")
