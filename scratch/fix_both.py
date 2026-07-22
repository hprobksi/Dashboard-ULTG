import os
import re

# --- 1. Fix api.py (inject endpoints) ---
api_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\api.py"
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
    channels: list  # e.g. [1, 2]

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
    # Use regex to find @app.get("/api/status" (allowing dependencies)
    pattern = re.compile(r'(@app\.get\("/api/status".*?\))', re.DOTALL)
    api_content = pattern.sub(endpoints_code + r'\n\1', api_content, count=1)
    
    with open(api_path, 'w', encoding='utf-8') as f:
        f.write(api_content)
    print("api.py endpoints injected.")


# --- 2. Fix Monitoring.jsx UI ---
mon_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\src\pages\Monitoring.jsx"
with open(mon_path, 'r', encoding='utf-8') as f:
    mon_content = f.read()

# First, remove the old sub tabs div that I added earlier
old_subtabs = """            {/* Sub Tabs untuk DC Monitoring */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px' }}>
              <button 
                onClick={() => setDcSubTab('monitoring')}
                style={{ padding: '8px 20px', backgroundColor: dcSubTab === 'monitoring' ? '#0F172A' : 'transparent', color: dcSubTab === 'monitoring' ? '#FFFFFF' : '#64748B', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Monitoring
              </button>
              <button 
                onClick={() => setDcSubTab('database')}
                style={{ padding: '8px 20px', backgroundColor: dcSubTab === 'database' ? '#0F172A' : 'transparent', color: dcSubTab === 'database' ? '#FFFFFF' : '#64748B', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Database Konfigurasi
              </button>
            </div>"""

mon_content = mon_content.replace(old_subtabs, "")

# Now, we need to inject the buttons on the right side of the title.
# The title block is inside dcSubTab === 'monitoring' actually?
# Wait, I did: {dcSubTab === 'database' ? <DcDatabase/> : <> <div title> ...
# Let's completely revert my previous change to Monitoring.jsx and do it cleanly.

# Revert logic:
revert_pattern = re.compile(r"\{\s*dcSubTab === 'database' \? \(\s*<DcDatabase forceRefresh=\{forceRefresh\} />\s*\) : \(\s*<>\s*(<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' \}\}>.*?)</div>\s*</>\s*\)\}\s*</div>\s*\)\}\s*\{\/\* === TAMPILAN PQM === \*/\}", re.DOTALL)

def replacer(match):
    return match.group(1) + "</div>\n        )}\n\n        {/* === TAMPILAN PQM === */}"

if revert_pattern.search(mon_content):
    mon_content = revert_pattern.sub(replacer, mon_content)
else:
    # If regex fails, let's just do targeted replacements
    pass

# Let's do targeted replacements since it's safer.
# We want to find the title:
title_block = """            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Sistem Suplai DC Proteksi
              </h2>
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#F8FAFC', padding: '10px 20px', borderRadius: '30px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>"""

new_title_block = """            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                Sistem Suplai DC Proteksi
                
                {/* Toggle Monitoring / Database */}
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
              </h2>
              
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#F8FAFC', padding: '10px 20px', borderRadius: '30px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>"""

mon_content = mon_content.replace(title_block, new_title_block)

# And inject the conditional rendering for DcDatabase
# We want to hide everything below the title bar if dcSubTab === 'database'
# The title bar ends at `</div>` after `activeDcCount` span.
end_title_bar = """<span style={{ color: '#0F172A', fontWeight: 800 }}>{activeDcCount}</span></div>
              </div>
            </div>"""

new_end_title_bar = """<span style={{ color: '#0F172A', fontWeight: 800 }}>{activeDcCount}</span></div>
              </div>
            </div>
            
            {dcSubTab === 'database' ? (
              <DcDatabase forceRefresh={forceRefresh} />
            ) : (
            <>"""

mon_content = mon_content.replace(end_title_bar, new_end_title_bar)

# Now we need to close the `<>` at the very end of DC section.
end_dc_section = """            </div>
            </>
            )}
          </div>
        )}

        {/* === TAMPILAN PQM === */}"""

# Wait, the end_dc_section in the file might be different due to my previous patch.
# In my previous patch I put:
#             </div>
#             </>
#             )}
#           </div>
#         )}
# Wait, if I replace the `old_subtabs`, I didn't remove the `{dcSubTab === 'database' ? ( <DcDatabase forceRefresh={forceRefresh} /> ) : ( <> ` that was there!
# Let me just rewrite Monitoring.jsx cleanly using python script.

with open(r"C:\Users\rhard\Documents\DASHBOARD_AI\scratch\clean_monitoring.py", 'w') as f2:
    f2.write('''import re
path = r"C:\Users\rhard\Documents\DASHBOARD_AI\src\pages\Monitoring.jsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()
    
# Remove my previous messy injections
c = re.sub(r"\{\s*/\*\s*Sub Tabs untuk DC Monitoring\s*\*/\s*\}[\s\S]*?Database Konfigurasi\s*</button>\s*</div>", "", c)
c = c.replace("{dcSubTab === 'database' ? (\\n              <DcDatabase forceRefresh={forceRefresh} />\\n            ) : (\\n            <>\\n", "")
c = c.replace("</div>\\n            </>\\n            )}\\n          </div>", "</div>\\n          </div>")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Cleaned up")
''')

# Since it's getting complicated to patch a patched file, I'll let another script clean it first.
with open(mon_path, 'w', encoding='utf-8') as f:
    f.write(mon_content)

print("Monitoring.jsx UI patched.")
