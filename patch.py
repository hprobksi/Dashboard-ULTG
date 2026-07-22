import sys

file_path = 'src/pages/Monitoring.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                      <span style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>IP: {dev.ip}</span>
                      <span style={{ backgroundColor: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{dev.merk_tipe}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <HardDrive size={16} color="#64748B"/>
                         <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{dev.kondisi_peralatan || 'Normal'}</span>
                      </div>
                    </div>"""

replacement = """                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                      <span style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>IP: {dev.ip}</span>
                      <span style={{ backgroundColor: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{dev.merk_tipe}</span>
                    </div>

                    {dev.connected && (dev.ram?.used_percent != null || (dev.storage && dev.storage.length > 0)) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dev.ram?.used_percent != null && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={14} /> RAM Usage</span>
                              <span style={{ color: dev.ram.used_percent >= 90 ? '#EF4444' : dev.ram.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>{formatNumber(dev.ram.used_percent)}%</span>
                            </div>
                            <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${Math.min(100, Math.max(0, dev.ram.used_percent))}%`, 
                                backgroundColor: dev.ram.used_percent >= 90 ? '#EF4444' : dev.ram.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                                height: '100%' 
                              }}></div>
                            </div>
                          </div>
                        )}
                        
                        {dev.storage && dev.storage.length > 0 && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              <HardDrive size={14} /> Storage Usage
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dev.storage.map((disk, dIdx) => (
                                <div key={dIdx}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                                    <span>{disk.mount}</span>
                                    <span style={{ color: disk.used_percent >= 90 ? '#EF4444' : disk.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>{formatNumber(disk.used_percent)}%</span>
                                  </div>
                                  <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ 
                                      width: `${Math.min(100, Math.max(0, disk.used_percent))}%`, 
                                      backgroundColor: disk.used_percent >= 90 ? '#EF4444' : disk.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                                      height: '100%' 
                                    }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <HardDrive size={16} color="#64748B"/>
                           <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{dev.kondisi_peralatan || 'Normal'}</span>
                        </div>
                      </div>
                    )}"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully patched Monitoring.jsx')
else:
    print('Target not found in Monitoring.jsx')
