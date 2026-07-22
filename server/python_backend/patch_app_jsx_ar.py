import re

with open('dashboard-ui/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace header
old_header = '''                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Daftar Auto-Recloser</h2>
                      <p className="section-subtitle">Mapping default dari SCD AR BEKASI GISTET NEW TAMBUN .scd untuk CB1 dan CB2.</p>
                    </div>'''

new_header = '''                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Daftar Auto-Recloser</h2>
                      <p className="section-subtitle">Pantauan status kesiapan Auto Reclose untuk Gardu Induk dan Bay.</p>
                    </div>'''

content = content.replace(old_header, new_header)

# Replace mapping loop
old_loop = '''                  <div className="pqm-device-grid avr-device-grid ar-device-grid">
                    {arDevices.length > 0 ? (
                      arDevices.map((device) => {'''

new_loop = '''                  <div className="ar-gi-groups">
                    {arDevices.length > 0 ? (
                      Object.entries(arDevices.reduce((acc, device) => {
                        const gi = device.nama_gi || 'Unknown GI';
                        if (!acc[gi]) acc[gi] = [];
                        acc[gi].push(device);
                        return acc;
                      }, {})).map(([giName, devices]) => (
                        <div key={giName} className="ar-gi-group">
                          <h3 className="ar-gi-title"><Building2 className="icon" size={20} /> Gardu Induk: {giName}</h3>
                          <div className="pqm-device-grid avr-device-grid ar-device-grid">
                            {devices.map((device) => {'''

content = content.replace(old_loop, new_loop)

# Replace loop closing
old_close = '''                            </article>
                          );
                        })
                    ) : ('''

new_close = '''                            </article>
                            );
                            })}
                          </div>
                        </div>
                      ))
                    ) : ('''

content = content.replace(old_close, new_close)

with open('dashboard-ui/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.jsx")
