import os
import glob

history_path = r'C:\Users\rhard\AppData\Roaming\Code\User\History'
for root, dirs, files in os.walk(history_path):
    for f in files:
        path = os.path.join(root, f)
        try:
            content = open(path, 'r', encoding='utf-8').read()
            if 'const renderDashboard = () => {' in content and len(content) > 100000:
                print(f"FOUND: {path} - {os.path.getmtime(path)} - length {len(content)}")
        except Exception as e:
            pass
