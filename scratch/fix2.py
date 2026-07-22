import os
import re

api_path = "C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\server\\python_backend\\api.py"
mon_path = "C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\src\\pages\\Monitoring.jsx"

# --- 1. Fix api.py ---
with open(api_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

endpoints_code = """
class DCRegisterData(BaseModel):
    ip_gi: str
    nama_gi: str
    channel: int
    sinyal: str
    register_address: int

class DCRegisterConfig(BaseModel):
    ip_gi: str
    nama_gi: str
    channels: list

@app.get("/api/dc/registers")
def get_dc_registers():
    return db.get_dc_registers()

@app.post("/api/dc/registers/add")
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
    return {"status": "success", "message": "Peralatan berhasil ditambahkan"}

class DCDynamicEdit(BaseModel):
    id: int
    register_address: int

@app.post("/api/dc/registers/edit")
def edit_dc_register(data: DCDynamicEdit):
    db.update_dc_register(data.id, data.register_address)
    return {"status": "success", "message": "Register berhasil diubah"}

@app.delete("/api/dc/registers/{ip}")
def delete_dc_registers(ip: str):
    db.delete_dc_registers_by_ip(ip)
    return {"status": "success"}

"""

if "@app.get(\"/api/dc/registers\")" not in api_content:
    pattern = re.compile(r'(@app\.get\("/api/status".*?\))', re.DOTALL)
    api_content = pattern.sub(endpoints_code + r'\\n\1', api_content, count=1)
    with open(api_path, 'w', encoding='utf-8') as f:
        f.write(api_content)
    print("api.py endpoints injected.")


# --- 2. Fix Monitoring.jsx ---
with open(mon_path, 'r', encoding='utf-8') as f:
    mon_content = f.read()

# Revert my previous messy sub tabs injection
# We want to remove the Sub Tabs section.
subtabs_pattern = r'\{\s*/\*\s*Sub Tabs untuk DC Monitoring\s*\*/\s*\}[\s\S]*?Database Konfigurasi\s*</button>\s*</div>'
mon_content = re.sub(subtabs_pattern, "", mon_content)

# We want to remove the conditional {dcSubTab === 'database' ? ... }
old_cond1 = """            {dcSubTab === 'database' ? (
              <DcDatabase forceRefresh={forceRefresh} />
            ) : (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Sistem Suplai DC Proteksi
              </h2>"""

new_cond1 = """            {dcSubTab === 'database' ? (
              <DcDatabase forceRefresh={forceRefresh} />
            ) : (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                Sistem Suplai DC Proteksi
                
                <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '4px', gap: '4px' }}>
                  <button 
                    onClick={() => setDcSubTab('monitoring')}
                    style={{ padding: '6px 12px', backgroundColor: dcSubTab === 'monitoring' ? '#FFFFFF' : 'transparent', color: dcSubTab === 'monitoring' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: dcSubTab === 'monitoring' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  >
                    Monitoring
                  </button>
                  <button 
                    onClick={() => setDcSubTab('database')}
                    style={{ padding: '6px 12px', backgroundColor: dcSubTab === 'database' ? '#FFFFFF' : 'transparent', color: dcSubTab === 'database' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: dcSubTab === 'database' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  >
                    Database Konfigurasi
                  </button>
                </div>
              </h2>"""
mon_content = mon_content.replace(old_cond1, new_cond1)


with open(mon_path, 'w', encoding='utf-8') as f:
    f.write(mon_content)

print("Monitoring.jsx UI patched.")
