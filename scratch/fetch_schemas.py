import urllib.request
import json

endpoints = ['pqm', 'dfr', 'annunciator']

for ep in endpoints:
    url = f"http://localhost:8000/api/{ep}"
    print(f"\n--- {ep.upper()} ---")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(json.dumps(data, indent=2)[:500] + "\n... (truncated)")
    except Exception as e:
        print(f"Error fetching {ep}: {e}")
