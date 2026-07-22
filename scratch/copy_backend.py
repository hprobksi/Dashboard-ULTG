import os
import shutil

src = r"C:\Users\rhard\Documents\DC_Monitoring"
dst = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend"

os.makedirs(dst, exist_ok=True)

excludes = ['dashboard-ui', '.venv', '.release', 'release-packages', 'runtime-localhost', 'voltkraft-waha-image.tar', '__pycache__', '.rar', 'uvicorn-8000.err.log', 'uvicorn-8000.log']

for item in os.listdir(src):
    should_exclude = False
    for ex in excludes:
        if ex in item:
            should_exclude = True
            break
            
    if should_exclude:
        continue
        
    s = os.path.join(src, item)
    d = os.path.join(dst, item)
    
    if os.path.isdir(s):
        print(f"Copying directory {item}...")
        if not os.path.exists(d):
            shutil.copytree(s, d)
    else:
        # For the huge db file, print progress so we don't timeout silently
        print(f"Copying file {item}...")
        shutil.copy2(s, d)

print("Copy completed successfully.")
