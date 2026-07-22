import sys

file_path = 'src/components/DfrCleanModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Add HardDrive icon
import_target = "import { X, Server, Lock, User, Terminal, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';"
import_replacement = "import { X, Server, Lock, User, Terminal, Loader2, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';"
content = content.replace(import_target, import_replacement)

# Replace 2: Replace memory status block
target_block = """              {activeDevice && (
                <div style={{ backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #FECACA' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>
                    Status Memori Induk (/home)
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B91C1C' }}>
                    {homeStorage ? `${homeStorage.used_percent}% Terpakai` : 'Data tidak tersedia'}
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#7F1D1D' }}>
                    Peringatan: Aksi ini akan menghapus semua file di dalam folder logs, pq, ddrt, dfr, dan css, kemudian melakukan reboot.
                  </p>
                </div>
              )}"""

replacement_block = """              {activeDevice && homeStorage && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    <HardDrive size={14} /> Status Memori Induk (/home)
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                      <span>{homeStorage.mount}</span>
                      <span style={{ color: homeStorage.used_percent >= 90 ? '#EF4444' : homeStorage.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>
                        {homeStorage.used_percent.toFixed(1).replace('.0', '')}%
                      </span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(100, Math.max(0, homeStorage.used_percent))}%`, 
                        backgroundColor: homeStorage.used_percent >= 90 ? '#EF4444' : homeStorage.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                        height: '100%' 
                      }}></div>
                    </div>
                  </div>
                </div>
              )}"""

content = content.replace(target_block, replacement_block)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Modal patched successfully')
