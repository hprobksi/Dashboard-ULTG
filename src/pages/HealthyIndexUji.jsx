import React, { useState, useEffect } from 'react';

export default function HealthyIndexUji() {
  const [tests, setTests] = useState([]);
  const [settings, setSettings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState('');

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/relay/tests');
      if (res.ok) setTests(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/relay/settings');
      if (res.ok) setSettings(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchTests();
    fetchSettings();
  }, []);

  const getSelectedSettingData = () => {
    return settings.find(s => s.id === selectedSetting);
  };

  const handleSave = async () => {
    try {
      const settingData = getSelectedSettingData();
      const newTest = {
        setting_id: selectedSetting,
        gi: settingData?.gi,
        bay: settingData?.bay,
        jenis_peralatan: settingData?.jenis_peralatan,
        regu: 'Regu Proteksi',
        healthy_index: Math.floor(Math.random() * 20) + 80 // Placeholder 80-100%
      };
      
      const res = await fetch('/api/relay/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchTests();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <h2 style={{ color: '#0F172A', marginBottom: '16px', fontWeight: 800 }}>HI: Form Hasil Uji</h2>
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#1E293B', fontSize: '1.1rem' }}>Riwayat Hasil Uji & Pengisian Baru</h3>
          <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Form Uji Baru</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#475569' }}>Tanggal Uji</th>
                <th style={{ padding: '12px', color: '#475569' }}>GI</th>
                <th style={{ padding: '12px', color: '#475569' }}>Bay</th>
                <th style={{ padding: '12px', color: '#475569' }}>Healthy Index</th>
                <th style={{ padding: '12px', color: '#475569' }}>Regu Uji</th>
              </tr>
            </thead>
            <tbody>
              {tests.length > 0 ? tests.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{t.gi}</td>
                  <td style={{ padding: '12px' }}>{t.bay}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: t.healthy_index >= 95 ? '#10B981' : '#F59E0B' }}>{t.healthy_index}%</td>
                  <td style={{ padding: '12px' }}>{t.regu}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Belum ada hasil uji tersimpan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', width: '700px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Form Input Hasil Uji Relay</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Pilih Master Data Setting Acuan</label>
              <select value={selectedSetting} onChange={e => setSelectedSetting(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                <option value="">-- Pilih Peralatan --</option>
                {settings.map(s => (
                  <option key={s.id} value={s.id}>{s.gi} - {s.bay} ({s.jenis_peralatan})</option>
                ))}
              </select>
            </div>

            {selectedSetting && getSelectedSettingData()?.jenis_peralatan === 'Penghantar' && (
               <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                 <h4 style={{ margin: '0 0 10px 0', color: '#0369A1' }}>Parameter Uji: Bay Penghantar</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>[ Form Distance ]</div>
                    <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>[ Form OCR-GFR ]</div>
                 </div>
               </div>
            )}

            {selectedSetting && getSelectedSettingData()?.jenis_peralatan === 'Trafo' && (
               <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                 <h4 style={{ margin: '0 0 10px 0', color: '#10B981' }}>Parameter Uji: Bay Trafo</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>[ Form Diff Trafo ]</div>
                    <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>[ Form SBEF & OCR-GFR HV/LV ]</div>
                 </div>
               </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
              <button onClick={handleSave} disabled={!selectedSetting} style={{ padding: '8px 16px', backgroundColor: selectedSetting ? '#10B981' : '#CBD5E1', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan & Hitung Index</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
