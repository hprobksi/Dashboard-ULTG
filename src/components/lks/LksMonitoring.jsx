import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, Clock, Trash2, 
  Eye, Plus, Check, RefreshCw, XCircle
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

  const loadData = () => {
    setLksList(lksService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = lksList.filter(item => {
    const matchBidang = selectedBidang === 'SEMUA' || item.bidang === selectedBidang;
    const matchStatus = selectedStatus === 'SEMUA' || item.status === selectedStatus;
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
          <CheckCircle2 size={14} /> Close
        </span>
      );
    }
    // Default: Open
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.78rem', fontWeight: 800 }}>
        <Clock size={14} /> Open
      </span>
    );
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'Open' ? 'Close' : 'Open';
    const actionText = nextStatus === 'Close' ? 'menutup (Close)' : 'membuka kembali (Open)';
    if (window.confirm(`Apakah Anda yakin ingin ${actionText} LKS No. ${item.nomorLks}?`)) {
      lksService.updateStatus(item.id, nextStatus);
      loadData();
    }
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
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>Sistem Manajemen Status Lembar Kerja Pemeliharaan (Open / Close)</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              <Plus size={16} /> Input LKS Baru
            </button>
          )}

          <div style={{ position: 'relative', width: '230px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari No. LKS / Peralatan / GI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '20px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>


        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
          {['SEMUA', 'Open', 'Close'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedStatus(s)}
              style={{ padding: '4px 12px', borderRadius: '14px', border: 'none', backgroundColor: selectedStatus === s ? '#0F172A' : '#F1F5F9', color: selectedStatus === s ? '#FFFFFF' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {s}
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
              <th style={{ padding: '10px 12px' }}>Penempatan Peralatan</th>
              <th style={{ padding: '10px 12px' }}>Jenis Kerusakan</th>
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
                    <div style={{ fontWeight: 700, color: '#334155' }}>{item.dataPeralatan?.namaPeralatan || '-'}</div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                    {item.penempatanPeralatan}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#0F172A', fontWeight: 600 }}>
                    {item.jenisKerusakan}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setViewItem(item)}
                        title="Lihat Draf Official / Cetak / Export"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', cursor: 'pointer', fontWeight: 600, fontSize: '0.76rem' }}
                      >
                        <Eye size={14} /> Pratinjau / Export
                      </button>

                      {item.status === 'Open' ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="Tutup LKS ini (Set status jadi Close)"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <CheckCircle2 size={13} /> Set Close
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="Buka kembali LKS ini (Set status jadi Open)"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D97706', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <RefreshCw size={13} /> Reopen
                        </button>
                      )}

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
