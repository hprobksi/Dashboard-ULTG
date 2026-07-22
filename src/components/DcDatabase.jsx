import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Server, Activity, ArrowLeft } from 'lucide-react';

const DcDatabase = ({ forceRefresh }) => {
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({ 
    nama_gi: '', ip_gi: '', channels: [1], isQmodMaster: true,
    custom_regs: {
      1: { V_PN: '1,2', Arus: '7,8', V_PG: '13,14', V_NG: '15,16' },
      2: { V_PN: '21,22', Arus: '27,28', V_PG: '33,34', V_NG: '35,36' }
    }
  });
  const [editForm, setEditForm] = useState({ id: null, register_address: '1,2', isQmodMaster: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRegisters();
  }, []);

  const fetchRegisters = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dc/registers');
      if (!res.ok) throw new Error('Gagal mengambil data register');
      const data = await res.json();
      setRegisters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedRegs = { 1: {}, 2: {} };
      for (const ch of addForm.channels) {
        for (const sig in addForm.custom_regs[ch]) {
           const val = String(addForm.custom_regs[ch][sig]).split(',')[0].trim();
           let num = parseInt(val) || 0;
           if (addForm.isQmodMaster) num = Math.max(0, num - 1);
           parsedRegs[ch][sig] = num;
        }
      }
      
      const payload = {
        ...addForm,
        custom_regs: parsedRegs
      };

      const res = await fetch('/api/dc/registers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal menambahkan peralatan');
      setShowAddModal(false);
      fetchRegisters();
      forceRefresh(); // refresh the main dashboard data too
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const val = String(editForm.register_address).split(',')[0].trim();
      let num = parseInt(val) || 0;
      if (editForm.isQmodMaster) num = Math.max(0, num - 1);
      const payload = { ...editForm, register_address: num };
      const res = await fetch('/api/dc/registers/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal mengubah register');
      setShowEditModal(false);
      fetchRegisters();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGI = async (ip_gi) => {
    if (!confirm(`Hapus semua konfigurasi untuk IP: ${ip_gi}?`)) return;
    try {
      const res = await fetch(`/api/dc/registers/${ip_gi}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus peralatan');
      fetchRegisters();
      forceRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 5px 0', color: '#0F172A', fontWeight: 800 }}>
            Database Konfigurasi Modbus DC
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Kelola daftar gardu dan alamat register untuk Modbus Polling</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Tambah Peralatan
        </button>
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>UNIT / GI</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>IP ADDRESS</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>CHANNEL</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>NAMA SINYAL</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>REGISTER MODBUS</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Memuat data...</td></tr>
            ) : registers.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Belum ada konfigurasi. Klik Tambah Peralatan.</td></tr>
            ) : (
              registers.map((reg, idx) => (
                <tr key={reg.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{reg.nama_gi}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontFamily: 'monospace' }}>{reg.ip_gi}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: reg.channel === 1 ? '#DBEAFE' : '#FEF3C7', color: reg.channel === 1 ? '#1D4ED8' : '#B45309', fontSize: '0.75rem', fontWeight: 800 }}>
                      CH {reg.channel}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0284C7' }}>{reg.sinyal}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>{reg.register_address},{reg.register_address + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => { setEditForm({ id: reg.id, register_address: `${reg.register_address},${reg.register_address+1}`, isQmodMaster: false }); setShowEditModal(true); }}
                        style={{ padding: '6px', border: 'none', backgroundColor: '#F1F5F9', color: '#F59E0B', borderRadius: '6px', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteGI(reg.ip_gi)}
                        title="Hapus Seluruh Konfigurasi GI Ini"
                        style={{ padding: '6px', border: 'none', backgroundColor: '#FEE2E2', color: '#EF4444', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Tambah Peralatan</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Nama GI</label>
                <input required type="text" value={addForm.nama_gi} onChange={(e) => setAddForm({...addForm, nama_gi: e.target.value})} placeholder="Cth: GI Cikarang" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>IP Address</label>
                <input required type="text" value={addForm.ip_gi} onChange={(e) => setAddForm({...addForm, ip_gi: e.target.value})} placeholder="Cth: 172.20.17.154" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Channel Aktif</label>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={addForm.channels.includes(1)} onChange={(e) => {
                      const ch = e.target.checked ? [...addForm.channels, 1] : addForm.channels.filter(c => c !== 1);
                      setAddForm({...addForm, channels: ch});
                    }} /> Channel 1
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={addForm.channels.includes(2)} onChange={(e) => {
                      const ch = e.target.checked ? [...addForm.channels, 2] : addForm.channels.filter(c => c !== 2);
                      setAddForm({...addForm, channels: ch});
                    }} /> Channel 2
                  </label>
                </div>

                {addForm.channels.length > 0 && (
                  <div style={{ padding: '10px 12px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#1D4ED8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Info: Masukkan angka persis sesuai QModMaster. Sistem akan otomatis mengurangi 1 untuk penyesuaian index Pymodbus.</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A' }}>
                      <input type="checkbox" checked={addForm.isQmodMaster} onChange={(e) => setAddForm({...addForm, isQmodMaster: e.target.checked})} />
                      Otomatis kurangi 1 (Format QModMaster)
                    </label>
                  </div>
                )}
                {addForm.channels.includes(1) && (
                  <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '10px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Register Channel 1</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['V_PN', 'Arus', 'V_PG', 'V_NG'].map(sig => (
                        <div key={`ch1_${sig}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '35px' }}>{sig}</span>
                          <input type="text" value={addForm.custom_regs[1][sig]} onChange={(e) => setAddForm({...addForm, custom_regs: {...addForm.custom_regs, 1: {...addForm.custom_regs[1], [sig]: e.target.value}}})} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {addForm.channels.includes(2) && (
                  <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Register Channel 2</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['V_PN', 'Arus', 'V_PG', 'V_NG'].map(sig => (
                        <div key={`ch2_${sig}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '35px' }}>{sig}</span>
                          <input type="text" value={addForm.custom_regs[2][sig]} onChange={(e) => setAddForm({...addForm, custom_regs: {...addForm.custom_regs, 2: {...addForm.custom_regs[2], [sig]: e.target.value}}})} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button disabled={saving || addForm.channels.length === 0} type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00A2E9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Register */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Edit Register</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Register Address Baru</label>
                <input required type="text" value={editForm.register_address} onChange={(e) => setEditForm({...editForm, register_address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '10px' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                  <input type="checkbox" checked={editForm.isQmodMaster} onChange={(e) => setEditForm({...editForm, isQmodMaster: e.target.checked})} />
                  Otomatis kurangi 1 (Format QModMaster)
                </label>
              </div>
              <button disabled={saving} type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                {saving ? 'Menyimpan...' : 'Update Register'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DcDatabase;
