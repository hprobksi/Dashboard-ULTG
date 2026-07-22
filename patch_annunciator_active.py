import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                          {ann.active_alarms.map((alarm, aIdx) => (
                            <div key={aIdx} style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#991B1B' }}>
                              {alarm}
                            </div>
                          ))}"""

replacement = """                          {ann.active_alarms.map((alarm, aIdx) => (
                            <div key={aIdx} style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#991B1B' }}>
                              Port {alarm.port}: {alarm.nama_alat || 'Alarm tanpa nama'} {alarm.flag ? `(Flag: ${alarm.flag})` : ''}
                            </div>
                          ))}"""

content = content.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched Annunciator active alarms rendering')
