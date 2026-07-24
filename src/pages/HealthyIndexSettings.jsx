import React, { useState, useEffect } from 'react';

export default function HealthyIndexSettings() {
  const [settings, setSettings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gi: '',
    bay: '',
    merk_relay: '',
    jenis_peralatan: 'Penghantar'
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/relay/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const newSettings = [...settings, { ...formData, id: Date.now().toString(), updated_at: new Date().toISOString().split('T')[0] }];
      const res = await fetch('/api/relay/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSettings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <h2 style={{ color: '#0F172A', marginBottom: '16px', fontWeight: 800 }}>HI: Data Setting Relay</h2>
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#1E293B', fontSize: '1.1rem' }}>Master Data Setting</h3>
          <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#00A2E9', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Tambah Setting Baru</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#475569' }}>GI</th>
                <th style={{ padding: '12px', color: '#475569' }}>Bay</th>
                <th style={{ padding: '12px', color: '#475569' }}>Merk Relay</th>
                <th style={{ padding: '12px', color: '#475569' }}>Jenis Peralatan</th>
                <th style={{ padding: '12px', color: '#475569' }}>Tgl Update</th>
              </tr>
            </thead>
            <tbody>
              {settings.length > 0 ? settings.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px' }}>{s.gi}</td>
                  <td style={{ padding: '12px' }}>{s.bay}</td>
                  <td style={{ padding: '12px' }}>{s.merk_relay}</td>
                  <td style={{ padding: '12px' }}>{s.jenis_peralatan}</td>
                  <td style={{ padding: '12px' }}>{s.updated_at}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Belum ada data setting tersimpan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#0F172A' }}>Tambah Master Setting Baru</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Jenis Peralatan</label>
              <select value={formData.jenis_peralatan} onChange={e => setFormData({...formData, jenis_peralatan: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                <option value="Penghantar">Bay Penghantar</option>
                <option value="Trafo">Bay Trafo</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>GI (Gardu Induk)</label>
              <input type="text" value={formData.gi} onChange={e => setFormData({...formData, gi: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} placeholder="Misal: CIKARANG" />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Nama Bay</label>
              <input type="text" value={formData.bay} onChange={e => setFormData({...formData, bay: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} placeholder="Misal: RAJAPAKSI #2" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Merk Relay</label>
              <input type="text" value={formData.merk_relay} onChange={e => setFormData({...formData, merk_relay: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} placeholder="Misal: ALSTOM P545" />
            </div>
            
            <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#0369A1' }}>
              ℹ️ Parameter spesifik ({formData.jenis_peralatan === 'Trafo' ? 'Diff Trafo, OCR-GFR HV, dll' : 'Distance, OCR-GFR, dll'}) akan diinput pada tahap selanjutnya melalui mekanisme Form Dinamis.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan Master</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
