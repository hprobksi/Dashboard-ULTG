import json

log_file = r'C:\Users\rhard\.gemini\antigravity\brain\52ea4848-9807-48e6-b224-4a134e0de01b\.system_generated\logs\transcript.jsonl'
lines = open(log_file, 'r', encoding='utf-8').readlines()
valid_outputs = []

for line in lines:
    try:
        d = json.loads(line)
        
        # Check tool_calls args (we wrote App.jsx via a tool maybe?)
        if 'tool_calls' in d:
            for tc in d['tool_calls']:
                if 'args' in tc and isinstance(tc['args'], dict):
                    args = tc['args']
                    for v in args.values():
                        if isinstance(v, str) and 'const renderDashboard = () =>' in v:
                            valid_outputs.append(v)
                            
        # Check output
        if 'output' in d and isinstance(d['output'], str) and 'const renderDashboard = () =>' in d['output']:
            valid_outputs.append(d['output'])
            
    except Exception as e:
        pass

if valid_outputs:
    with open('full_app_backup.txt', 'w', encoding='utf-8') as f:
        f.write(valid_outputs[-1])
    print('Saved to full_app_backup.txt, length:', len(valid_outputs[-1]))
else:
    print('Not found anywhere')
