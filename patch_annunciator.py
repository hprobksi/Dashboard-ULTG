import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Add annunciatorStatus state
target_state = "  const [annunciatorList, setAnnunciatorList] = useState([]);"
replacement_state = "  const [annunciatorList, setAnnunciatorList] = useState([]);\n  const [annunciatorStatus, setAnnunciatorStatus] = useState({});"
content = content.replace(target_state, replacement_state)

# Replace 2: Fix fetchAnnunciatorList
target_fetch = """  const fetchAnnunciatorList = useCallback(async () => {
    try {
      const res = await fetch(`/api/annunciator`);
      if (!res.ok) throw new Error('Gagal memuat data Annunciator');
      const data = await res.json();
      setAnnunciatorList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);"""
replacement_fetch = """  const fetchAnnunciatorList = useCallback(async () => {
    try {
      const res = await fetch(`/api/annunciator`);
      if (!res.ok) throw new Error('Gagal memuat data Annunciator');
      const data = await res.json();
      setAnnunciatorStatus(data);
      setAnnunciatorList(data.devices || []);
    } catch (err) {
      console.error(err);
    }
  }, []);"""
content = content.replace(target_fetch, replacement_fetch)

# Replace 3: Fix forceRefresh for Annunciator
target_refresh = """      } else if (activeTab === 'annunciator') {
        await fetchAnnunciatorList();
      }"""
replacement_refresh = """      } else if (activeTab === 'annunciator') {
        const res = await fetch('/api/annunciator/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setAnnunciatorStatus(data);
          setAnnunciatorList(data.devices || []);
          setRefreshKey(prev => prev + 1);
        }
      }"""
content = content.replace(target_refresh, replacement_refresh)

# Replace 4: Add timer line to Annunciator rendering
target_render = """             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell color="#EF4444" size={24} /> Alarm Center (Annunciator)
              </h2>
              <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <RefreshCw size={16} /> Refresh Data
              </button>
            </div>"""

replacement_render = """             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell color="#EF4444" size={24} /> Alarm Center (Annunciator)
              </h2>
              <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <RefreshCw size={16} /> Refresh Data
              </button>
            </div>

            {/* Auto Polling Timer Line */}
            {annunciatorStatus?.auto_polling_active && (
              <div key={refreshKey} style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#EF4444', animation: `timerLine ${annunciatorStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}"""

content = content.replace(target_render, replacement_render)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Annunciator patch applied successfully')
