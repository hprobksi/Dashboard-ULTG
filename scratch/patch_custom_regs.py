import re

dcdb_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\src\components\DcDatabase.jsx"
with open(dcdb_path, 'r', encoding='utf-8') as f:
    dcdb_content = f.read()

# Replace addForm state
old_state = "const [addForm, setAddForm] = useState({ nama_gi: '', ip_gi: '', channels: [1] });"
new_state = """const [addForm, setAddForm] = useState({ 
    nama_gi: '', ip_gi: '', channels: [1],
    custom_regs: {
      1: { V_PN: 0, Arus: 6, V_PG: 12, V_NG: 14 },
      2: { V_PN: 20, Arus: 26, V_PG: 32, V_NG: 34 }
    }
  });"""
dcdb_content = dcdb_content.replace(old_state, new_state)

# Replace the modal form JSX part
old_form_channels = """                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={addForm.channels.includes(1)} onChange={(e) => {
                      const ch = e.target.checked ? [...addForm.channels, 1] : addForm.channels.filter(c => c !== 1);
                      setAddForm({...addForm, channels: ch});
                    }} /> Channel 1
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={addForm.channels.includes(2)} onChange={(e) => {
                      const ch = e.target.checked ? [...addForm.channels, 2] : addForm.channels.filter(c => c !== 2);
                      setAddForm({...addForm, channels: ch});
                    }} /> Channel 2
                  </label>
                </div>"""

new_form_channels = """                <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={addForm.channels.includes(1)} onChange={(e) => {
                      const ch = e.target.checked ? [...addForm.channels, 1] : addForm.channels.filter(c => c !== 1);
                      setAddForm({...addForm, channels: ch});
                    }} /> Channel 1
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={addForm.channels.includes(2)} onChange={(e) => {
                      const ch = e.target.checked ? [...addForm.channels, 2] : addForm.channels.filter(c => c !== 2);
                      setAddForm({...addForm, channels: ch});
                    }} /> Channel 2
                  </label>
                </div>

                {addForm.channels.includes(1) && (
                  <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '10px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Register Channel 1</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['V_PN', 'Arus', 'V_PG', 'V_NG'].map(sig => (
                        <div key={`ch1_${sig}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '35px' }}>{sig}</span>
                          <input type="number" min="0" value={addForm.custom_regs[1][sig]} onChange={(e) => setAddForm({...addForm, custom_regs: {...addForm.custom_regs, 1: {...addForm.custom_regs[1], [sig]: parseInt(e.target.value) || 0}}})} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {addForm.channels.includes(2) && (
                  <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Register Channel 2</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['V_PN', 'Arus', 'V_PG', 'V_NG'].map(sig => (
                        <div key={`ch2_${sig}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '35px' }}>{sig}</span>
                          <input type="number" min="0" value={addForm.custom_regs[2][sig]} onChange={(e) => setAddForm({...addForm, custom_regs: {...addForm.custom_regs, 2: {...addForm.custom_regs[2], [sig]: parseInt(e.target.value) || 0}}})} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}"""
dcdb_content = dcdb_content.replace(old_form_channels, new_form_channels)

with open(dcdb_path, 'w', encoding='utf-8') as f:
    f.write(dcdb_content)

print("DcDatabase.jsx patched.")

api_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\api.py"
with open(api_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

old_pydantic = """class DCRegisterConfig(BaseModel):
    ip_gi: str
    nama_gi: str
    channels: list

@app.get("/api/dc/registers")"""

new_pydantic = """class DCRegisterConfig(BaseModel):
    ip_gi: str
    nama_gi: str
    channels: list
    custom_regs: dict = None

@app.get("/api/dc/registers")"""
api_content = api_content.replace(old_pydantic, new_pydantic)

old_api_func = """@app.post("/api/dc/registers/add")
def add_dc_register(data: DCRegisterConfig):
    db.add_gi_device(data.nama_gi, data.ip_gi)
    defaults = {
        1: {"V_PN": 0, "Arus": 6, "V_PG": 12, "V_NG": 14},
        2: {"V_PN": 20, "Arus": 26, "V_PG": 32, "V_NG": 34}
    }
    for ch in data.channels:
        if ch in defaults:
            for sinyal, addr in defaults[ch].items():
                db.add_dc_register(data.ip_gi, data.nama_gi, ch, sinyal, addr)
    app_state["daftar_gi"] = db.get_gi_devices()
    return {"status": "success", "message": "Peralatan berhasil ditambahkan"}"""

new_api_func = """@app.post("/api/dc/registers/add")
def add_dc_register(data: DCRegisterConfig):
    db.add_gi_device(data.nama_gi, data.ip_gi)
    defaults = data.custom_regs or {
        "1": {"V_PN": 0, "Arus": 6, "V_PG": 12, "V_NG": 14},
        "2": {"V_PN": 20, "Arus": 26, "V_PG": 32, "V_NG": 34}
    }
    for ch_str in map(str, data.channels):
        if ch_str in defaults:
            for sinyal, addr in defaults[ch_str].items():
                db.add_dc_register(data.ip_gi, data.nama_gi, int(ch_str), sinyal, addr)
    app_state["daftar_gi"] = db.get_gi_devices()
    return {"status": "success", "message": "Peralatan berhasil ditambahkan"}"""
api_content = api_content.replace(old_api_func, new_api_func)

with open(api_path, 'w', encoding='utf-8') as f:
    f.write(api_content)
print("api.py patched.")
