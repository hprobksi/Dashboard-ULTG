import os

mon_path = "C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\src\\pages\\Monitoring.jsx"
with open(mon_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if "import DcDatabase" not in content:
    content = content.replace(
        "import { Activity, Zap, Radio, Server, Check, Clock3, AlertTriangle, Bell, RefreshCw, Trash2, LineChart as LineChartIcon, Gauge, HardDrive, WifiOff } from 'lucide-react';",
        "import { Activity, Zap, Radio, Server, Check, Clock3, AlertTriangle, Bell, RefreshCw, Trash2, LineChart as LineChartIcon, Gauge, HardDrive, WifiOff } from 'lucide-react';\nimport DcDatabase from '../components/DcDatabase';"
    )

# 2. Fix the DC Monitoring structure
# Currently it is:
#         {activeTab === 'dc' && (
#           <div>
#             
# 
#             {dcSubTab === 'database' ? (
#               <DcDatabase forceRefresh={forceRefresh} />
#             ) : (
#             <>
#             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
#               <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
#                 Sistem Suplai DC Proteksi
#                 
#                 <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '4px', gap: '4px' }}>
#                   <button 

# I need to change it so the Title and Buttons are OUTSIDE the ternary, and the ternary only wraps the content.

bad_block = """        {activeTab === 'dc' && (
          <div>
            

            {dcSubTab === 'database' ? (
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
              </h2>
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#F8FAFC', padding: '10px 20px', borderRadius: '30px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} color="#00A2E9" /> Status: <span style={{ color: '#0F172A', fontWeight: 800 }}>{dcStatus?.is_scanning ? 'Memindai...' : 'Siap'}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={16} /> Total GI: <span style={{ color: '#0F172A', fontWeight: 800 }}>{giList.length}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#10B981" /> Online: <span style={{ color: '#0F172A', fontWeight: 800 }}>{activeDcCount}</span></div>
              </div>
            </div>"""

good_block = """        {activeTab === 'dc' && (
          <div>
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
              </h2>
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#F8FAFC', padding: '10px 20px', borderRadius: '30px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} color="#00A2E9" /> Status: <span style={{ color: '#0F172A', fontWeight: 800 }}>{dcStatus?.is_scanning ? 'Memindai...' : 'Siap'}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={16} /> Total GI: <span style={{ color: '#0F172A', fontWeight: 800 }}>{giList.length}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#10B981" /> Online: <span style={{ color: '#0F172A', fontWeight: 800 }}>{activeDcCount}</span></div>
              </div>
            </div>
            
            {dcSubTab === 'database' ? (
              <DcDatabase forceRefresh={forceRefresh} />
            ) : (
            <>"""

if bad_block in content:
    content = content.replace(bad_block, good_block)
else:
    print("Could not find the bad block. Attempting regex...")
    import re
    # Just to be safe if indentation differs slightly
    pattern = re.compile(r"\{\s*activeTab === 'dc' && \(\s*<div>\s*\{\s*dcSubTab === 'database' \? \(\s*<DcDatabase forceRefresh=\{forceRefresh\} />\s*\)\s*:\s*\(\s*<>\s*(<div style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between'.*?</div>\s*</div>)", re.DOTALL)
    
    def replacer(match):
        title_block = match.group(1)
        return f"{{activeTab === 'dc' && (\n          <div>\n            {title_block}\n            \n            {{dcSubTab === 'database' ? (\n              <DcDatabase forceRefresh={{forceRefresh}} />\n            ) : (\n            <>"
    
    content = pattern.sub(replacer, content)

with open(mon_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Monitoring.jsx fixed.")
