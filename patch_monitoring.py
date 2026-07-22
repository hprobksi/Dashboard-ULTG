import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Add import and state
import_target = "import DcAlarmLog from '../components/DcAlarmLog';\nimport PqmDetailModal from '../components/PqmDetailModal';"
import_replacement = "import DcAlarmLog from '../components/DcAlarmLog';\nimport PqmDetailModal from '../components/PqmDetailModal';\nimport DfrCleanModal from '../components/DfrCleanModal';"

content = content.replace(import_target, import_replacement)

state_target = "  const [error, setError] = useState('');"
state_replacement = "  const [error, setError] = useState('');\n  const [isDfrCleanModalOpen, setIsDfrCleanModalOpen] = useState(false);\n  const [selectedDfrForClean, setSelectedDfrForClean] = useState(null);"

content = content.replace(state_target, state_replacement)

# Replace 2: Add Clean Memory Button
button_target = """              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>"""

button_replacement = """              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsDfrCleanModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Trash2 size={16} /> Clean Memory
                </button>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>"""

content = content.replace(button_target, button_replacement)

# Replace 3: Add Modal at the end of return
modal_target = "      {trendModalOpen && ("
modal_replacement = """      <DfrCleanModal 
        isOpen={isDfrCleanModalOpen} 
        onClose={() => { setIsDfrCleanModalOpen(false); setSelectedDfrForClean(null); }} 
        selectedDfrInitial={selectedDfrForClean} 
        dfrList={dfrList} 
      />

      {trendModalOpen && ("""

content = content.replace(modal_target, modal_replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Monitoring.jsx patched successfully')
