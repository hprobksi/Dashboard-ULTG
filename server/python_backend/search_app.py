import sys
content = open('dashboard-ui/src/App.jsx', encoding='utf-8').read()
for i, line in enumerate(content.splitlines()):
    if 'MENUS =' in line or 'label: \'AVR' in line or 'useState({' in line or 'const [avr, setAvr]' in line:
        print(f'{i}: {line}')
