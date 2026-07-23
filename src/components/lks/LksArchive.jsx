import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, File, Search, Filter, Eye } from 'lucide-react';
import lksService from '../../services/lksService';
import OfficialPlnDocView from './OfficialPlnDocView';

export default function LksArchive() {
  const [archiveList, setArchiveList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('SEMUA');
  const [viewItem, setViewItem] = useState(null);

  const loadData = () => {
    const allRecords = lksService.getAll();
    setArchiveList(allRecords.filter(item => item.filePdfName || item.isUploadedScan));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUpload = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berkas arsip LKS ini?')) {
      lksService.delete(id);
      loadData();
    }
  };

  const filteredList = archiveList.filter(item => {
    const matchBidang = selectedBidang === 'SEMUA' || (item.bidang || 'HARPRO') === selectedBidang;
    const q = searchQuery.toLowerCase();
    const matchQuery = !searchQuery || 
      (item.nomorLks || '').toLowerCase().includes(q) ||
      (item.dataPeralatan?.namaPeralatan || item.judulLks || '').toLowerCase().includes(q) ||
      (item.penempatanPeralatan || '').toLowerCase().includes(q) ||
      (item.filePdfName || '').toLowerCase().includes(q) ||
      (item.pengaju?.nama || '').toLowerCase().includes(q);
    return matchBidang && matchQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header & Filter Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={24} color="#00A2E9" /> Arsip Dokumen LKS ({filteredList.length})
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>Daftar seluruh berkas scan & dokumen LKS yang telah terunggah</p>
          </div>

          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari No. LKS / Judul / Nama File..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '20px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {/* Filter Bar: Team Pemeliharaan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} color="#00A2E9" /> Team Pemeliharaan:
          </span>
          {['SEMUA', 'HARGI', 'HARPRO', 'HARJAR'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBidang(b)}
              style={{
                padding: '4px 12px',
                borderRadius: '14px',
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

      {/* Archives Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '10px 12px' }}>No. LKS & Tanggal</th>
                <th style={{ padding: '10px 12px' }}>Judul LKS</th>
                <th style={{ padding: '10px 12px' }}>Team Terkait</th>
                <th style={{ padding: '10px 12px' }}>Nama Berkas Scan</th>
                <th style={{ padding: '10px 12px' }}>Pengunggah</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                    Belum ada berkas arsip LKS yang sesuai filter.
                  </td>
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
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0284C7' }}>
                        <File size={14} /> {item.filePdfName || 'Dokumen_LKS_Scan.pdf'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.fileSize || 'Dokumen Terlampir'}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>
                      {item.pengaju?.nama || 'Staff ULTG'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setViewItem(item)}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#334155', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={13} /> Lihat
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Mengunduh berkas: ${item.filePdfName || 'Dokumen_LKS.pdf'}`)}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#00A2E9', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Download size={13} /> Unduh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUpload(item.id)}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
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

      {/* Modal View Document */}
      {viewItem && (
        <OfficialPlnDocView
          lksData={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  );
}
