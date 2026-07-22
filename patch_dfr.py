import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1
t1 = "  const [dfrList, setDfrList] = useState([]);"
r1 = "  const [dfrList, setDfrList] = useState([]);\n  const [dfrStatus, setDfrStatus] = useState({});"
content = content.replace(t1, r1)

# Replace 2
t2 = """      const data = await res.json();
      setDfrList(data.devices || []);"""
r2 = """      const data = await res.json();
      setDfrStatus(data);
      setDfrList(data.devices || []);"""
content = content.replace(t2, r2)

# Replace 3
t3 = """        {/* === TAMPILAN DFR === */}
        {activeTab === 'dfr' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Data Digital Fault Recorder (DFR)</h2>
              <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <RefreshCw size={16} /> Refresh Data
              </button>
            </div>"""
            
r3 = """        {/* === TAMPILAN DFR === */}
        {activeTab === 'dfr' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Data Digital Fault Recorder (DFR)</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '12px', marginBottom: dfrStatus?.auto_polling_active ? '12px' : '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  Menampilkan {dfrList.length} DFR | Interval Polling: {dfrStatus?.poll_interval_seconds || '--'} detik
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>
            </div>

            {/* Auto Polling Timer Line */}
            {dfrStatus?.auto_polling_active && (
              <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${dfrStatus?.poll_interval_seconds || 10}s linear infinite` }} />
              </div>
            )}"""
content = content.replace(t3, r3)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Patch applied successfully')
