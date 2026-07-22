import os
import re

filepath = r"C:\Users\rhard\Documents\DASHBOARD_AI\src\pages\Monitoring.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if "import DcDatabase" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport DcDatabase from '../components/DcDatabase';")

# 2. Add sub-tab state
if "const [dcSubTab, setDcSubTab]" not in content:
    content = content.replace("const [activeTab, setActiveTab] = useState('dc');", "const [activeTab, setActiveTab] = useState('dc');\n  const [dcSubTab, setDcSubTab] = useState('monitoring');")

# 3. Wrap existing DC content
old_dc_header = """        {/* === TAMPILAN DC MONITORING === */}
        {activeTab === 'dc' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>"""

new_dc_header = """        {/* === TAMPILAN DC MONITORING === */}
        {activeTab === 'dc' && (
          <div>
            {/* Sub Tabs untuk DC Monitoring */}
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
            </div>

            {dcSubTab === 'database' ? (
              <DcDatabase forceRefresh={forceRefresh} />
            ) : (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>"""

content = content.replace(old_dc_header, new_dc_header)

old_dc_footer = """            </div>
          </div>
        )}

        {/* === TAMPILAN PQM === */}"""

new_dc_footer = """            </div>
            </>
            )}
          </div>
        )}

        {/* === TAMPILAN PQM === */}"""

content = content.replace(old_dc_footer, new_dc_footer)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Monitoring.jsx patched successfully.")
