import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, CalendarClock, UserX, 
  Search, Eye, Pencil, Trash2, Plus, AlertTriangle, Camera, X
} from 'lucide-react';

const ALL_STANDARD_BIDANG = [
  'ULTG BEKASI', 'TL HAR GARDU INDUK', 'TL HAR PROTEKSI & MTR', 
  'TL HAR JARINGAN', 'TL SIPIL', 'TL K3 & KAM', 'TL KSA'
];

const EMPTY_PEGAWAI_FORM = {
  id: '',
  nip: '',
  nama: '',
  jabatan: '',
  bidang: 'ULTG BEKASI',
  status: 'Aktif',
  noHp: '',
  photo: ''
};

const getInitials = (name = '') => {
  const cleaned = String(name ?? '').trim();
  if (!cleaned) return '?';
  return cleaned.substring(0, 2).toUpperCase();
};

const renderAvatar = (item, size = 36, fontSize = '0.9rem') => {
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    flexShrink: 0
  };

  if (item?.photo) {
    return (
      <img
        src={item.photo}
        alt={`Foto ${item.nama || 'pegawai'}`}
        style={{ ...baseStyle, objectFit: 'cover', border: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}
      />
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: '#E2E8F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#64748B',
        fontSize,
        fontWeight: 800
      }}
    >
      {getInitials(item?.nama)}
    </div>
  );
};

function StatCard({ label, value, icon: Icon, color, bgColor }) {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '18px 18px 18px 20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        borderLeft: `6px solid ${color}`,
        boxShadow: isHovered ? `0 12px 28px ${color}25` : '0 8px 22px rgba(15,23,42,0.06)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '116px',
        cursor: 'default'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 700, lineHeight: 1.35 }}>{label}</span>
        <div style={{ backgroundColor: bgColor, padding: '9px', borderRadius: '10px', color }}>
          <Icon size={21} />
        </div>
      </div>
      <span style={{ fontSize: '2.05rem', fontWeight: 900, color: '#0F172A', marginTop: '14px', lineHeight: 1 }}>{value}</span>
    </div>
  );
}

export default function DatabasePegawai() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentFormData, setCurrentFormData] = useState(EMPTY_PEGAWAI_FORM);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/master-pegawai');
      const data = await res.json();
      if (data.success) {
        setPegawaiList(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  const totalPegawai = pegawaiList.length;
  const aktifPegawai = pegawaiList.filter(p => p.status === 'Aktif' || !p.status).length;
  const cutiPegawai = pegawaiList.filter(p => p.status === 'Cuti').length;
  const sakitPegawai = pegawaiList.filter(p => p.status === 'Sakit').length;

  const filteredList = pegawaiList.filter(p => {
    const q = searchQuery.toLowerCase();
    return (p.nama || '').toLowerCase().includes(q) || 
           (p.nip || '').toLowerCase().includes(q) || 
           (p.jabatan || '').toLowerCase().includes(q);
  });

  const openAddModal = () => {
    setModalMode('add');
    setCurrentFormData(EMPTY_PEGAWAI_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setCurrentFormData({
      id: item.id || '',
      nip: item.nip || '',
      nama: item.nama || '',
      jabatan: item.jabatan || '',
      bidang: item.bidang || 'ULTG BEKASI',
      status: item.status || 'Aktif',
      noHp: item.noHp || '',
      photo: item.photo || ''
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCurrentFormData(prev => ({ ...prev, photo: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const saveForm = async () => {
    if (!currentFormData.nama || !currentFormData.nip) {
      alert("Nama dan NIP wajib diisi!");
      return;
    }
    try {
      let finalFormData = { ...currentFormData };
      
      // If photo is a new base64 upload, save it to server first
      if (finalFormData.photo && finalFormData.photo.startsWith('data:image')) {
        const uploadRes = await fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarData: finalFormData.photo, id: finalFormData.nip || Date.now().toString() })
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalFormData.photo = uploadData.url;
        } else {
          console.error("Gagal mengupload foto:", uploadData.error);
        }
      }

      const res = await fetch('/api/master-pegawai/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchPegawai();
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (e) {
      alert("Terjadi kesalahan: " + e.message);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const executeDelete = async () => {
    try {
      const res = await fetch(`/api/master-pegawai/item?id=${encodeURIComponent(deleteId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setIsDeleteOpen(false);
        fetchPegawai();
      }
    } catch (e) {
      alert("Gagal menghapus data: " + e.message);
    }
  };

  const getStatusBadge = (status) => {
    const s = status || 'Aktif';
    if (s === 'Aktif') return <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>;
    if (s === 'Cuti') return <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: '#FFEDD5', color: '#9A3412', fontSize: '0.75rem', fontWeight: 700 }}>On Leave</span>;
    return <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '0.75rem', fontWeight: 700 }}>Inactive</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Pegawai" value={totalPegawai} icon={Users} color="#2563EB" bgColor="#EFF6FF" />
        <StatCard label="Pegawai Aktif" value={aktifPegawai} icon={CheckCircle2} color="#059669" bgColor="#D1FAE5" />
        <StatCard label="Pegawai Cuti / Ijin" value={cutiPegawai} icon={CalendarClock} color="#F97316" bgColor="#FFEDD5" />
        <StatCard label="Pegawai Sakit / Nonaktif" value={sakitPegawai} icon={UserX} color="#DC2626" bgColor="#FEE2E2" />
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Cari nama pegawai, NIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 14px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '0.9rem',
                width: '320px',
                fontWeight: 600,
                backgroundColor: '#F8FAFC'
              }}
            />
          </div>
          <button 
            onClick={openAddModal}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', 
              backgroundColor: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '8px', 
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' 
            }}
          >
            <Plus size={18} /> Tambah Personil
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>No</th>
                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Nama Lengkap & NIP</th>
                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Bidang</th>
                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Jabatan</th>
                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontWeight: 600 }}>Memuat data personil...</td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontWeight: 600 }}>Data tidak ditemukan</td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'all 0.2s' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {renderAvatar(item)}
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{item.nama}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{item.nip}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>{item.bidang}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>{item.jabatan}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {getStatusBadge(item.status)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button onClick={() => { setPreviewData(item); setIsPreviewOpen(true); }} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }} title="Detail Profil">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => openEditModal(item)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => confirmDelete(item.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }} title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Form Modal (Add/Edit) */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                {modalMode === 'add' ? 'Tambah Personil' : 'Edit Personil'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                {renderAvatar(currentFormData, 68, '1.25rem')}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>Foto Profil</div>
                  <div style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px' }}>Upload foto pegawai dari device. Maksimal 2 MB.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#334155', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <Camera size={16} />
                      Pilih Foto
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    </label>
                    {currentFormData.photo && (
                      <button
                        type="button"
                        onClick={() => setCurrentFormData(prev => ({ ...prev, photo: '' }))}
                        style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #FCA5A5', backgroundColor: '#FFF', color: '#DC2626', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Nama Lengkap *</label>
                  <input type="text" value={currentFormData.nama} onChange={e => setCurrentFormData({...currentFormData, nama: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>NIP *</label>
                  <input type="text" value={currentFormData.nip} onChange={e => setCurrentFormData({...currentFormData, nip: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Bidang</label>
                  <select value={currentFormData.bidang} onChange={e => setCurrentFormData({...currentFormData, bidang: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}>
                    {ALL_STANDARD_BIDANG.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Jabatan</label>
                  <input type="text" value={currentFormData.jabatan} onChange={e => setCurrentFormData({...currentFormData, jabatan: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>No HP</label>
                  <input type="text" value={currentFormData.noHp} onChange={e => setCurrentFormData({...currentFormData, noHp: e.target.value})} placeholder="Contoh: 0812345678" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Status</label>
                  <select value={currentFormData.status} onChange={e => setCurrentFormData({...currentFormData, status: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}>
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti / Ijin</option>
                    <option value="Sakit">Sakit / Nonaktif</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
              <button onClick={saveForm} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#3B82F6', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', backgroundColor: '#FEE2E2', padding: '16px', borderRadius: '50%', color: '#EF4444', marginBottom: '16px' }}>
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>Hapus Data Personil?</h2>
            <p style={{ margin: '0 0 24px 0', color: '#64748B', fontSize: '0.95rem' }}>Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setIsDeleteOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
              <button onClick={executeDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#EF4444', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 22px 45px rgba(15,23,42,0.22)' }}>
            <div style={{ height: '104px', background: 'linear-gradient(135deg, #2563EB 0%, #0F766E 100%)', position: 'relative' }}>
              <button onClick={() => setIsPreviewOpen(false)} style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px', cursor: 'pointer', color: '#FFF', display: 'inline-flex', padding: '6px' }} aria-label="Tutup detail profil">
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px 24px', textAlign: 'center', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#FFF', padding: '4px', borderRadius: '50%', marginBottom: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                {renderAvatar(previewData, 82, '1.5rem')}
              </div>
              <div style={{ color: '#2563EB', fontWeight: 900, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '4px' }}>Detail Profil Pegawai</div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: 900, color: '#0F172A' }}>{previewData.nama}</h2>
              <div style={{ color: '#64748B', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>{previewData.nip}</div>
              
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Bidang</div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{previewData.bidang}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Jabatan</div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{previewData.jabatan || '-'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Status</div>
                    <div>{getStatusBadge(previewData.status)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>No. HP</div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{previewData.noHp || '-'}</div>
                  </div>
                </div>
              </div>
              
              <button onClick={() => setIsPreviewOpen(false)} style={{ width: '100%', padding: '12px', marginTop: '20px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Tutup Profil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
