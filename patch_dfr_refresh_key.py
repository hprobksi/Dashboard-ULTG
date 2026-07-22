import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Add a refreshKey state
target_state = "  const [selectedDfrForClean, setSelectedDfrForClean] = useState(null);"
replacement_state = "  const [selectedDfrForClean, setSelectedDfrForClean] = useState(null);\n  const [refreshKey, setRefreshKey] = useState(0);"
content = content.replace(target_state, replacement_state)

# Replace 2: Increment refreshKey in forceRefresh
target_refresh = """      } else if (activeTab === 'dfr') {
        const res = await fetch('/api/dfr/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setDfrStatus(data);
          setDfrList(data.devices || []);
        }
      }"""

replacement_refresh = """      } else if (activeTab === 'dfr') {
        const res = await fetch('/api/dfr/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setDfrStatus(data);
          setDfrList(data.devices || []);
          setRefreshKey(prev => prev + 1); // Memaksa animasi garis untuk reset
        }
      }"""
content = content.replace(target_refresh, replacement_refresh)

# Replace 3: Add key to the animated div
target_div = """            {dfrStatus?.auto_polling_active && (
              <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${dfrStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}"""

replacement_div = """            {dfrStatus?.auto_polling_active && (
              <div key={refreshKey} style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${dfrStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}"""
content = content.replace(target_div, replacement_div)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Monitoring.jsx refresh key patched successfully')
