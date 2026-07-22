import os

root_dir = r'C:\Users\rhard'
target = 'jadwal'

print("Searching for files containing 'jadwal' or 'juli' or 'nr' in C:\\Users\\rhard...")
found = []
for dirpath, dirnames, filenames in os.walk(root_dir):
    # skip node_modules, AppData, etc. for speed
    if 'node_modules' in dirpath or 'AppData' in dirpath or 'Virtual Machines' in dirpath or '.gemini' in dirpath:
        continue
    for f in filenames:
        if 'jadwal' in f.lower() or ('pekerjaan' in f.lower() and 'pdf' in f.lower()):
            full_path = os.path.join(dirpath, f)
            found.append(full_path)
            print("FOUND:", full_path)

if not found:
    print("No matching files found.")
