import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = "setAnnunciatorList(data.devices || []);"
replacement1 = "setAnnunciatorList(Object.values(data.devices || {}));"
content = content.replace(target1, replacement1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched Annunciator array')
