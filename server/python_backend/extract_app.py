import json

log_file = r'C:\Users\rhard\.gemini\antigravity\brain\52ea4848-9807-48e6-b224-4a134e0de01b\.system_generated\logs\transcript.jsonl'
lines = open(log_file, 'r', encoding='utf-8').readlines()

# find the last time we saw the string 'const renderDashboard = () => {'
for i in range(len(lines) - 1, -1, -1):
    if 'const renderDashboard = () => {' in lines[i]:
        print(f"Found at line {i}")
        # Try to parse the json line
        data = json.loads(lines[i])
        if 'content' in data:
            with open('extracted_app_part.txt', 'w', encoding='utf-8') as f:
                f.write(data['content'])
            print("Extracted to extracted_app_part.txt")
            break
        elif 'output' in data:
            with open('extracted_app_part.txt', 'w', encoding='utf-8') as f:
                f.write(data['output'])
            print("Extracted output to extracted_app_part.txt")
            break
