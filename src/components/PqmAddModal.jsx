import React, { useState } from 'react';
import { X, Server, Plus, Loader2, Save } from 'lucide-react';

export default function PqmAddModal({ isOpen, onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    nama_gi: '',
    nama_bay: '',
    ip: '',
    pqm_type: 'ion7650'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.nama_gi || !formData.nama_bay || !formData.ip) {
      setError('Nama GI, Nama Bay, dan IP Address wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/pqm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Gagal menambahkan peralatan PQM');
      }

      onAddSuccess(data.pqm_devices || []);
      setFormData({ nama_gi: '', nama_bay: '', ip: '', pqm_type: 'ion7650' });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="#00A2E9" /> Tambah Peralatan PQM
          </h3>
          <button onClick={onClose} disabled={isSubmitting} style={{ background: 'none', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', color: '#64748B' }}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#B91C1C', marginBottom: '16px', borderRadius: '4px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Nama GI <span style={{ color: '#EF4444' }}>*</span></label>
            <input 
              type="text" 
              name="nama_gi"
              value={formData.nama_gi}
              onChange={handleChange}
              placeholder="Contoh: GI Cikarang"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Nama Bay <span style={{ color: '#EF4444' }}>*</span></label>
            <input 
              type="text" 
              name="nama_bay"
              value={formData.nama_bay}
              onChange={handleChange}
              placeholder="Contoh: Trafo 1"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>IP Address <span style={{ color: '#EF4444' }}>*</span></label>
            <input 
              type="text" 
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              placeholder="Contoh: 192.168.1.10"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Type PQM <span style={{ color: '#EF4444' }}>*</span></label>
            <select 
              name="pqm_type"
              value={formData.pqm_type}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', backgroundColor: '#F8FAFC' }}
              disabled={isSubmitting}
            >
              <option value="ion7650">ION 7650 (Standard Polling)</option>
              <option value="ion9000">ION 9000 (HTTPS Polling)</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
              Pilih tipe untuk menentukan metode pengambilan data secara otomatis.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '12px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Peralatan'}
          </button>
        </form>
      </div>
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
