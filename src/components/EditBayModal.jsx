import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EditBayModal = ({ isOpen, onClose, device, onSave }) => {
  const [namaBay, setNamaBay] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (device) {
      setNamaBay(device.nama_bay || '');
    }
  }, [device]);

  if (!isOpen || !device) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(device, namaBay);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan nama bay');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050, padding: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Edit Nama Bay</h3>
          <button onClick={onClose} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
              Nama GI
            </label>
            <input 
              type="text" 
              value={device.nama_gi || ''} 
              disabled 
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontWeight: 600, boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
              Nama Bay
            </label>
            <input 
              type="text" 
              value={namaBay} 
              onChange={(e) => setNamaBay(e.target.value)}
              disabled={loading}
              placeholder="Masukkan nama bay..."
              autoFocus
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '2px solid #3B82F6', outline: 'none', color: '#0F172A', fontWeight: 700, boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              onClick={onClose} 
              disabled={loading}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}
            >
              Batal
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading}
              style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBayModal;
