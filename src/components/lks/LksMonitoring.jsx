import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, Clock, Trash2, 
  Eye, Plus, RefreshCw, XCircle, Pencil, Filter, X
} from 'lucide-react';
import lksService from '../../services/lksService';
import OfficialPlnDocView from './OfficialPlnDocView';

export default function LksMonitoring({ onAddNew }) {
  const [lksList, setLksList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('SEMUA');
  const [selectedStatus, setSelectedStatus] = useState('SEMUA');

  // Modal State for Official Printable View
  const [viewItem, setViewItem] = useState(null);

  // Modal State for Pop-Up Edit Status (Pena)
  const [editItem, setEditItem] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState('Open');
  const [statusNotes, setStatusNotes] = useState('');

  const loadData = () => {
    setLksList(lksService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = lksList.filter(item => {
    const matchBidang = selectedBidang === 'SEMUA' || (item.bidang || 'HARPRO') === selectedBidang;
    const matchStatus = selectedStatus === 'SEMUA' || (item.status || 'Open').toUpperCase() === selectedStatus.toUpperCase();
    const q = searchQuery.toLowerCase();
    const matchQuery = !searchQuery || 
      (item.nomorLks || '').toLowerCase().includes(q) ||
      (item.dataPeralatan?.namaPeralatan || '').toLowerCase().includes(q) ||
      (item.penempatanPeralatan || '').toLowerCase().includes(q) ||
      (item.pengaju?.nama || '').toLowerCase().includes(q);
    return matchBidang && matchStatus && matchQuery;
  });

  const getStatusBadge = (status) => {
    if (status === 'Close') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', backgroundColor: '#D1FAE5', color: '#059669', fontSize: '0.78rem', fontWeight: 800 }}>
          <CheckCircle2 size={14} /> CLOSE
        </span>
      );
    }
    // Default: Open
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.78rem', fontWeight: 800 }}>
        <Clock size={14} /> OPEN
      </span>
    );
  };

  const handleOpenEditModal = (item) => {
    setEditItem(item);
    setNewStatusValue(item.status || 'Open');
    setStatusNotes('');
  };

  const handleSaveStatusEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;
    lksService.updateStatus(editItem.id, newStatusValue);
    setEditItem(null);
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus dokumen LKS ini?')) {
      lksService.delete(id);
      loadData();
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Dashboard Monitoring LKS / LKP</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>Sistem Pemantauan Status Dokumen & Team Pemeliharaan (OPEN / CLOSE)</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              <Plus size={16} /> Upload LKS Baru
            </button>
          )}

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari No. LKS / Judul / GI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '20px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      {/* Filter Bar: Status & Team Pemeliharaan Terkait */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Filter Status OPEN / CLOSE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} color="#00A2E9" /> Filter Status:
          </span>
          {['SEMUA', 'OPEN', 'CLOSE'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedStatus(s)}
              style={{
                padding: '5px 14px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: selectedStatus === s ? (s === 'CLOSE' ? '#059669' : s === 'OPEN' ? '#D97706' : '#0F172A') : '#F1F5F9',
                color: selectedStatus === s ? '#FFFFFF' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Filter Team Pemeliharaan Terkait: HARGI / HARPRO / HARJAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569' }}>Team Pemeliharaan:</span>
          {['SEMUA', 'HARGI', 'HARPRO', 'HARJAR'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBidang(b)}
              style={{
                padding: '5px 14px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: selectedBidang === b ? '#00A2E9' : '#F1F5F9',
                color: selectedBidang === b ? '#FFFFFF' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Monitoring Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '10px 12px' }}>No. LKS & Tanggal</th>
              <th style={{ padding: '10px 12px' }}>Judul LKS</th>
              <th style={{ padding: '10px 12px' }}>Team Terkait</th>
              <th style={{ padding: '10px 12px' }}>Penempatan Peralatan / GI</th>
              <th style={{ padding: '10px 12px' }}>Status LKS</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>Belum ada data LKS yang sesuai filter.</td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.nomorLks}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{item.tanggalKejadian}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#334155' }}>{item.dataPeralatan?.namaPeralatan || item.judulLks || '-'}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#0284C7', fontWeight: 800, fontSize: '0.75rem' }}>
                      {item.bidang || 'HARPRO'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                    {item.penempatanPeralatan || '-'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      
                      {/* Tombol Pratinjau / Export */}
                      <button
                        type="button"
                        onClick={() => setViewItem(item)}
                        title="Lihat Draf / Pratinjau Dokumen"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', cursor: 'pointer', fontWeight: 600, fontSize: '0.76rem' }}
                      >
                        <Eye size={14} /> Pratinjau
                      </button>

                      {/* Tombol Pena untuk Ubah Status Pop-Up Modal */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        title="Ubah Status LKS (OPEN / CLOSE)"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #00A2E9', backgroundColor: '#EFF6FF', color: '#00A2E9', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}
                      >
                        <Pencil size={13} /> Ubah Status
                      </button>

                      {/* Tombol Hapus */}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        title="Hapus Dokumen"
                        style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POP-UP MODAL: Ubah Status LKS (Redesigned Centered & Premium) */}
      {editItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '22px 26px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#00A2E9',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: '0 4px 12px rgba(0, 162, 233, 0.4)',
                  flexShrink: 0
                }}>
                  <Pencil size={22} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    Ubah Status Dokumen LKS
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.78rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      No: {editItem.nomorLks}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                      • {editItem.bidang || 'HARPRO'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                style={{
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} color="#FFFFFF" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveStatusEdit} style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  PILIH STATUS TERBARU LKS:
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* OPEN Status Selector Card */}
                  <div
                    onClick={() => setNewStatusValue('Open')}
                    style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: newStatusValue === 'Open' ? '2px solid #D97706' : '1px solid #E2E8F0',
                      backgroundColor: newStatusValue === 'Open' ? '#FFFBEB' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: newStatusValue === 'Open' ? '0 4px 12px rgba(217, 119, 6, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: newStatusValue === 'Open' ? '#D97706' : '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        color: newStatusValue === 'Open' ? '#FFFFFF' : '#64748B'
                      }}>
                        <Clock size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: newStatusValue === 'Open' ? '#B45309' : '#1E293B' }}>
                          STATUS OPEN
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                          Temuan sedang ditindaklanjuti & proses pemeliharaan aktif
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: newStatusValue === 'Open' ? '6px solid #D97706' : '2px solid #CBD5E1',
                      backgroundColor: '#FFFFFF'
                    }} />
                  </div>

                  {/* CLOSE Status Selector Card */}
                  <div
                    onClick={() => setNewStatusValue('Close')}
                    style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: newStatusValue === 'Close' ? '2px solid #059669' : '1px solid #E2E8F0',
                      backgroundColor: newStatusValue === 'Close' ? '#ECFDF5' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: newStatusValue === 'Close' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: newStatusValue === 'Close' ? '#059669' : '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        color: newStatusValue === 'Close' ? '#FFFFFF' : '#64748B'
                      }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: newStatusValue === 'Close' ? '#047857' : '#1E293B' }}>
                          STATUS CLOSE
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                          Pekerjaan perbaikan 100% selesai & dokumen diarsip
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: newStatusValue === 'Close' ? '6px solid #059669' : '2px solid #CBD5E1',
                      backgroundColor: '#FFFFFF'
                    }} />
                  </div>

                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Catatan Perubahan Status (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan catatan perbaikan (contoh: Klem jumper telah dikencangkan dan thermovisi ulang aman)..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '6px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  style={{
                    padding: '11px 20px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '11px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #00A2E9 0%, #0284C7 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 162, 233, 0.4)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={17} /> Simpan Perubahan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View 1:1 Official PLN Doc Output */}
      {viewItem && (
        <OfficialPlnDocView
          lksData={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  );
}
