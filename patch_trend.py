import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                      <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#0EA5E9" />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#F59E0B" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="v_pn" stroke="#0EA5E9" strokeWidth={3} dot={false} name="Tegangan P-N (V)" />
                      <Line yAxisId="right" type="monotone" dataKey="arus" stroke="#F59E0B" strokeWidth={3} dot={false} name="Arus (A)" />"""

replacement = """                      <XAxis dataKey="waktu" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#0EA5E9" />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#F59E0B" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="v_pn" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Teg P-N (V)" />
                      <Line yAxisId="left" type="monotone" dataKey="v_pg" stroke="#10B981" strokeWidth={2} dot={false} name="Teg P-G (V)" />
                      <Line yAxisId="left" type="monotone" dataKey="v_ng" stroke="#EF4444" strokeWidth={2} dot={false} name="Teg N-G (V)" />
                      <Line yAxisId="right" type="monotone" dataKey="arus" stroke="#F59E0B" strokeWidth={2} dot={false} name="Arus (A)" />"""

content = content.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched DC trend graph')
