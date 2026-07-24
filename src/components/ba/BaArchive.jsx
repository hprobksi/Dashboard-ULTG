import React, { useState, useEffect } from 'react';
import { Archive, Search, Download, Trash2, Eye, FileText, X, RefreshCw, Filter, FileCheck } from 'lucide-react';
import { storageService } from '../../services/storage';

export default function BaArchive({ onViewPdf }) {
  const [baList, setBaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedGI, setSelectedGI] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await storageService.getBaList();
      setBaList(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Berita Acara:\n"${title}"?`)) {
      const updated = await storageService.deleteBaItem(id);
      setBaList(updated);
    }
  };

  const filteredList = baList.filter(item => {
    const matchesBidang = selectedBidang === 'ALL' || item.bidang === selectedBidang;
    const matchesGI = selectedGI === 'ALL' || item.garduInduk === selectedGI;
    const matchesSearch = searchQuery === '' ||
      (item.noBA && item.noBA.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.judul && item.judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.garduInduk && item.garduInduk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.bay && item.bay.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.penandatangan && item.penandatangan.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBidang && matchesGI && matchesSearch;
  });

  const uniqueGIs = Array.from(new Set(baList.map(b => b.garduInduk).filter(Boolean)));

  const handleExportCsv = () => {
    if (filteredList.length === 0) return;
    const headers = ['No', 'No. BA', 'Judul BA', 'Bidang', 'Tanggal', 'Gardu Induk', 'Bay', 'Penandatangan', 'File Name'];
    const rows = filteredList.map((b, idx) => [
      idx + 1,
      `"${b.noBA || ''}"`,
      `"${b.judul || ''}"`,
      `"${b.bidang || ''}"`,
      `"${b.tanggal || ''}"`,
      `"${b.garduInduk || ''}"`,
      `"${b.bay || ''}"`,
      `"${b.penandatangan || ''}"`,
      `"${b.fileName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arsip_Berita_Acara_ULTG_Bekasi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* TOOLBAR ARSIP */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        padding: '20px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justify: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Archive size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Arsip Digital Berita Acara</h3>
            <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '0.82rem', fontWeight: 600 }}>
              Pencarian cepat, filter berkas, pratinjau PDF inline & manajemen dokumen BA
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <select
            value={selectedBidang}
            onChange={e => setSelectedBidang(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}
          >
            <option value="ALL">Semua Bidang</option>
            <option value="GI">GI</option>
            <option value="HARGI">HARGI</option>
            <option value="HARJAR">HARJAR</option>
            <option value="HARPRO">HARPRO</option>
          </select>

          <select
            value={selectedGI}
            onChange={e => setSelectedGI(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC' }}
          >
            <option value="ALL">Semua Gardu Induk</option>
            {uniqueGIs.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Cari dalam arsip BA..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', width: '220px', fontWeight: 600 }}
            />
          </div>

          <button
            onClick={handleExportCsv}
            style={{
              padding: '8px 14px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Download size={15} /> Export CSV
          </button>

        </div>
      </div>

      {/* TABEL ARSIP */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
              <th style={{ padding: '14px 18px', width: '40px' }}>No</th>
              <th style={{ padding: '14px 18px' }}>Dokumen BA</th>
              <th style={{ padding: '14px 18px' }}>Bidang</th>
              <th style={{ padding: '14px 18px' }}>Lokasi / Gardu Induk</th>
              <th style={{ padding: '14px 18px' }}>Tanggal & Penandatangan</th>
              <th style={{ padding: '14px 18px', textAlign: 'center', width: '180px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                  Memuat berkas arsip...
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                  Tidak ada arsip dokumen Berita Acara yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredList.map((item, index) => (
                <tr key={item.id || index} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748B' }}>{index + 1}</td>
                  
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <FileText size={22} style={{ color: '#0284C7', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{item.judul}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>
                          No: {item.noBA}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      backgroundColor: item.bidang === 'GI' ? '#F3E8FF' : item.bidang === 'HARPRO' ? '#E0F2FE' : item.bidang === 'HARGI' ? '#FEF3C7' : '#DCFCE7',
                      color: item.bidang === 'GI' ? '#7E22CE' : item.bidang === 'HARPRO' ? '#0369A1' : item.bidang === 'HARGI' ? '#B45309' : '#15803D'
                    }}>
                      {item.bidang}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#0284C7' }}>{item.garduInduk}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{item.bay || '-'}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>📅 {item.tanggal}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>✍️ {item.penandatangan || '-'}</div>
                  </td>

                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          if (onViewPdf) onViewPdf(item);
                          else setPreviewItem(item);
                        }}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#E0F2FE',
                          color: '#0369A1',
                          border: '1px solid #7DD3FC',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Pratinjau Dokumen PDF"
                      >
                        <Eye size={14} /> Lihat
                      </button>

                      <a
                        href={item.fileUrl || '/BA/29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf'}
                        download={item.fileName || 'BA_ULTG.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '6px 8px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                        title="Unduh PDF"
                      >
                        <Download size={14} />
                      </a>

                      <button
                        onClick={() => handleDelete(item.id, item.judul)}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          border: '1px solid #FCA5A5',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                        title="Hapus BA"
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

      {/* MODAL INLINE PREVIEW PDF */}
      {previewItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1000px',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{previewItem.judul}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>{previewItem.noBA} | {previewItem.garduInduk}</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, backgroundColor: '#525659' }}>
              <iframe
                src={previewItem.fileUrl || '/BA/29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf'}
                title="PDF Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
