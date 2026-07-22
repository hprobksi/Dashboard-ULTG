import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Make forceRefresh hit /api/dfr/refresh for DFR
target_refresh = """      } else if (activeTab === 'dfr') {
        await fetchDfrList();
      } else if (activeTab === 'annunciator') {"""

replacement_refresh = """      } else if (activeTab === 'dfr') {
        const res = await fetch('/api/dfr/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setDfrStatus(data);
          setDfrList(data.devices || []);
        }
      } else if (activeTab === 'annunciator') {"""

content = content.replace(target_refresh, replacement_refresh)

# Replace 2: Add keyframes style for timerLine in DFR tab
target_line = """            {/* Auto Polling Timer Line */}
            {dfrStatus?.auto_polling_active && (
              <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${dfrStatus?.poll_interval_seconds || 10}s linear infinite` }} />
              </div>
            )}"""

replacement_line = """            {/* Auto Polling Timer Line */}
            {dfrStatus?.auto_polling_active && (
              <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${dfrStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}"""

content = content.replace(target_line, replacement_line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Monitoring.jsx patched for DFR refresh & timerLine')
