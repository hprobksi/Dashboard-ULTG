import re

filepath = "src/pages/Monitoring.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
target_import = "import DfrCleanModal from '../components/DfrCleanModal';"
if "EditBayModal" not in content:
    content = content.replace(target_import, target_import + "\nimport EditBayModal from '../components/EditBayModal';\nimport { Edit2 } from 'lucide-react';")

# 2. States
target_state = "  const [annunciatorStatus, setAnnunciatorStatus] = useState({});"
if "flList" not in content:
    content = content.replace(target_state, target_state + "\n  const [flList, setFlList] = useState([]);\n  const [flStatus, setFlStatus] = useState({});\n  const [editModalOpen, setEditModalOpen] = useState(false);\n  const [editDevice, setEditDevice] = useState(null);\n  const [editType, setEditType] = useState('dfr');")

# 3. forceRefresh
if "activeTab === 'fl'" not in content:
    # Need to find the forceRefresh block
    target_refresh = """        if (activeTab === 'dfr') {
          const res = await fetch('/api/dfr');
          if (res.ok) {
            const data = await res.json();
            setDfrStatus(data.metadata || {});
            setDfrList(Object.values(data.devices || {}));
            setRefreshKey(prev => prev + 1);
          }
        }"""
    replacement_refresh = target_refresh + """
        if (activeTab === 'fl') {
          const res = await fetch('/api/fl');
          if (res.ok) {
            const data = await res.json();
            setFlStatus(data.metadata || {});
            setFlList(Object.values(data.devices || {}));
            setRefreshKey(prev => prev + 1);
          }
        }"""
    content = content.replace(target_refresh, replacement_refresh)

# 4. useEffect polling
target_effect = """      } else if (activeTab === 'dfr') {
        fetchDfrList();
        intervalId = setInterval(fetchDfrList, 60000);
      }"""
replacement_effect = target_effect + """ else if (activeTab === 'fl') {
        const fetchFlList = async () => {
          try {
            const res = await fetch('/api/fl');
            if (res.ok) {
              const data = await res.json();
              setFlStatus(data.metadata || {});
              setFlList(Object.values(data.devices || {}));
            }
          } catch (err) {}
        };
        fetchFlList();
        intervalId = setInterval(fetchFlList, 60000);
      }"""
if "const fetchFlList" not in content:
    content = content.replace(target_effect, replacement_effect)

# 5. UI Tabs
target_tabs = """        <button
          onClick={() => { setActiveTab('annunciator'); setDcSubTab('monitoring'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeTab === 'annunciator' ? '#EF4444' : 'transparent',
            color: activeTab === 'annunciator' ? '#FFFFFF' : '#64748B',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'annunciator' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
          }}
        >
          <Bell size={20} /> Annunciator
        </button>"""
replacement_tabs = target_tabs + """
        <button
          onClick={() => { setActiveTab('fl'); setDcSubTab('monitoring'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeTab === 'fl' ? '#F59E0B' : 'transparent',
            color: activeTab === 'fl' ? '#FFFFFF' : '#64748B',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'fl' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
          }}
        >
          <Activity size={20} /> FL (Fault Locator)
        </button>"""
if "Activity size={20} /> FL" not in content:
    content = content.replace(target_tabs, replacement_tabs)

# 6. Save edit handler
target_handler = "  const togglePqmPolling = async (device) => {"
replacement_handler = """  const handleSaveBayName = async (device, newName) => {
    try {
      const res = await fetch(`/api/${editType}/devices/${device.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_bay: newName })
      });
      if (!res.ok) throw new Error('Gagal update bay');
      
      if (editType === 'dfr') {
        const resDfr = await fetch('/api/dfr');
        if (resDfr.ok) {
          const data = await resDfr.json();
          setDfrList(Object.values(data.devices || {}));
        }
      } else {
        const resFl = await fetch('/api/fl');
        if (resFl.ok) {
          const data = await resFl.json();
          setFlList(Object.values(data.devices || {}));
        }
      }
    } catch(e) {
      console.error(e);
      alert('Gagal update nama bay');
    }
  };

  const togglePqmPolling = async (device) => {"""
if "handleSaveBayName" not in content:
    content = content.replace(target_handler, replacement_handler)

# 7. Render FL Panel (duplicating DFR but replacing "DFR" with "FL")
# We need to accurately extract the `{activeTab === 'dfr' && (...)}` block
dfr_match = re.search(r"(\{\s*activeTab === 'dfr' && \(\s*<div.*?(?=\{\s*activeTab === 'annunciator'))", content, re.DOTALL)
if dfr_match and "{activeTab === 'fl' && (" not in content:
    dfr_block = dfr_match.group(1).rstrip()
    fl_block = dfr_block.replace("activeTab === 'dfr'", "activeTab === 'fl'")
    fl_block = fl_block.replace("dfrList", "flList")
    fl_block = fl_block.replace("dfrStatus", "flStatus")
    fl_block = fl_block.replace("DFR Memory Status", "FL Memory Status")
    fl_block = fl_block.replace("Belum ada data DFR", "Belum ada data FL")
    fl_block = fl_block.replace("DFR", "FL") # Be careful! "setDfrList" -> "setFlList"? Wait, it's already "flList".
    # But wait, there is `setSelectedDfrForClean(dev); setIsDfrCleanModalOpen(true);`
    # Let's fix those individually.
    fl_block = fl_block.replace("setSelectedDfrForClean", "setSelectedDfrForClean") # Wait, we can reuse DfrCleanModal for FL!
    fl_block = fl_block.replace("setIsDfrCleanModalOpen", "setIsDfrCleanModalOpen")
    fl_block = fl_block.replace("setEditType('dfr')", "setEditType('fl')")
    
    # Let's inject Edit button into DFR
    edit_dfr_btn = """<button onClick={() => { setEditDevice(dev); setEditType('dfr'); setEditModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: '6px' }}><Edit2 size={14} color="#64748B" /></button>"""
    dfr_block_new = dfr_block.replace(
        "<p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 700 }}>{dev.nama_bay}</p>",
        "<p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{dev.nama_bay} " + edit_dfr_btn + "</p>"
    )
    
    edit_fl_btn = """<button onClick={() => { setEditDevice(dev); setEditType('fl'); setEditModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: '6px' }}><Edit2 size={14} color="#64748B" /></button>"""
    fl_block = fl_block.replace(
        "<p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 700 }}>{dev.nama_bay}</p>",
        "<p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{dev.nama_bay} " + edit_fl_btn + "</p>"
    )
    
    content = content.replace(dfr_block, dfr_block_new + "\n\n        " + fl_block + "\n")

# 8. Update DfrCleanModal logic in Monitoring.jsx to handle FL URLs dynamically.
# Ah, actually DfrCleanModal calls `/api/dfr/clean/${device.id}` hardcoded!
# Let's look at DfrCleanModal.jsx... Wait, the user wants the ability to clean FL memory.
# In `Monitoring.jsx`, we just passed `selectedDfrForClean`. The modal will POST to `/api/dfr/clean/`.
# If `editType` state was added, maybe we can add a `cleanType` state?
# Or just let FL use `/api/fl/clean/{device_id}`.
# I will check DfrCleanModal.jsx first, but for now I'll add EditBayModal at the bottom.
if "EditBayModal" not in content[-500:]:
    content = content.replace("    </div>\n  );\n}", """      <EditBayModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        device={editDevice}
        onSave={handleSaveBayName}
      />
    </div>
  );
}""")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Monitoring.jsx patched successfully!")
