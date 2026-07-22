import os

filepath = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\api.py"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Trim background workers
content = content.replace('        ("avr-polling", avr_worker),\n', '')
content = content.replace('        ("kapasitor-polling", kapasitor_worker),\n', '')
content = content.replace('        ("ar-polling", ar_worker),\n', '')

# 2. Bypass Auth
auth_target = """    if not is_session_valid(session_token):
        raise HTTPException(status_code=401, detail="Session dashboard tidak valid.")
    verify_csrf_request(request)"""

auth_replacement = """    pass # Auth bypassed for internal microservice"""

if auth_target in content:
    content = content.replace(auth_target, auth_replacement)
else:
    print("WARNING: Auth target not found in api.py!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("api.py patched successfully.")
