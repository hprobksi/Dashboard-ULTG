import React, { useState, useEffect } from 'react';
import { Activity, FileText, Building2, Eye, Download, Search, Filter, Cpu, Wrench, Layers } from 'lucide-react';
import { storageService } from '../../services/storage';

export default function BaMonitoring({ onViewPdf }) {
  const [baList, setBaList] = useState([]);
  const [activeBidang, setActiveBidang] = useState('ALL');
  const [selectedGI, setSelectedGI] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await storageService.getBaList();
      setBaList(data || []);
    } catch (e) {
      console.error('Error loading BA list:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  const filteredList = baList.filter(item => {
    const matchesBidang = activeBidang === 'ALL' || item.bidang === activeBidang;
    const matchesGI = selectedGI === 'ALL' || item.garduInduk === selectedGI;
    const matchesSearch = searchQuery === '' || 
      (item.noBA && item.noBA.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.judul && item.judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.garduInduk && item.garduInduk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.bay && item.bay.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBidang && matchesGI && matchesSearch;
  });

  // Calculate statistics
  const totalCount = baList.length;
  const hargiCount = baList.filter(b => b.bidang === 'HARGI').length;
  const harjarCount = baList.filter(b => b.bidang === 'HARJAR').length;
  const harproCount = baList.filter(b => b.bidang === 'HARPRO').length;
  
  const uniqueGIs = Array.from(new Set(baList.map(b => b.garduInduk).filter(Boolean)));

  const getBidangBadgeStyle = (bidang) => {
    switch (bidang) {
      case 'GI':
        return { backgroundColor: '#F3E8FF', color: '#7E22CE', border: '1px solid #C084FC' };
      case 'HARPRO':
        return { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #7DD3FC' };
      case 'HARGI':
        return { backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' };
      case 'HARJAR':
        return { backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' };
      default:
        return { backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. STATISTIK HEADER CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        {/* Total BA */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Total Berita Acara</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalCount}</div>
          </div>
        </div>

        {/* HARGI */}
        <div 
          onClick={() => setActiveBidang('HARGI')}
          style={{ 
            backgroundColor: activeBidang === 'HARGI' ? '#FFFBEB' : '#FFFFFF', 
            padding: '20px', 
            borderRadius: '16px', 
            border: activeBidang === 'HARGI' ? '2px solid #F59E0B' : '1px solid #E2E8F0', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>BA HARGI</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#B45309' }}>{hargiCount}</div>
          </div>
        </div>

        {/* HARJAR */}
        <div 
          onClick={() => setActiveBidang('HARJAR')}
          style={{ 
            backgroundColor: activeBidang === 'HARJAR' ? '#F0FDF4' : '#FFFFFF', 
            padding: '20px', 
            borderRadius: '16px', 
            border: activeBidang === 'HARJAR' ? '2px solid #10B981' : '1px solid #E2E8F0', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>BA HARJAR</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803D' }}>{harjarCount}</div>
          </div>
        </div>

        {/* HARPRO */}
        <div 
          onClick={() => setActiveBidang('HARPRO')}
          style={{ 
            backgroundColor: activeBidang === 'HARPRO' ? '#F0F9FF' : '#FFFFFF', 
            padding: '20px', 
            borderRadius: '16px', 
            border: activeBidang === 'HARPRO' ? '2px solid #0284C7' : '1px solid #E2E8F0', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>BA HARPRO</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369A1' }}>{harproCount}</div>
          </div>
        </div>

        {/* Total GI */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Gardu Induk Terdaftar</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{uniqueGIs.length}</div>
          </div>
        </div>

      </div>

      {/* 2. FILTER & TOOLBAR */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        padding: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justify: 'space-between'
      }}>
        
        {/* SUB-TAB FILTER BIDANG */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Semua Bidang' },
            { id: 'GI', label: 'GI (Gardu Induk)' },
            { id: 'HARGI', label: 'HARGI' },
            { id: 'HARJAR', label: 'HARJAR' },
            { id: 'HARPRO', label: 'HARPRO' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveBidang(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeBidang === tab.id ? '#0284C7' : '#F1F5F9',
                color: activeBidang === tab.id ? '#FFFFFF' : '#475569',
                fontWeight: activeBidang === tab.id ? 800 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH & GI FILTER */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
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
              placeholder="Cari No. BA / Judul / Bay..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', width: '220px', fontWeight: 600 }}
            />
          </div>
        </div>

      </div>

      {/* 3. TABEL MONITORING REKAPITULASI BA */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
              <th style={{ padding: '14px 18px', width: '50px' }}>No</th>
              <th style={{ padding: '14px 18px' }}>No. Berita Acara & Tanggal</th>
              <th style={{ padding: '14px 18px' }}>Bidang</th>
              <th style={{ padding: '14px 18px' }}>Gardu Induk & Bay</th>
              <th style={{ padding: '14px 18px' }}>Judul & Uraian Pekerjaan</th>
              <th style={{ padding: '14px 18px' }}>Penandatangan</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Dokumen Berkas</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                  Memuat data monitoring Berita Acara...
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                  Tidak ada Berita Acara yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filteredList.map((item, index) => {
                const bStyle = getBidangBadgeStyle(item.bidang);
                return (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748B' }}>{index + 1}</td>
                    
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.noBA}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        📅 {item.tanggal}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        ...bStyle
                      }}>
                        {item.bidang}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0284C7' }}>{item.garduInduk}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        {item.bay || '-'}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', maxWidth: '320px' }}>{item.judul}</div>
                      {item.deskripsi && (
                        <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.deskripsi}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#475569' }}>
                      {item.penandatangan || '-'}
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {onViewPdf && (
                          <button
                            onClick={() => onViewPdf(item)}
                            style={{
                              padding: '6px 12px',
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
                            title="Pratinjau Dokumen BA"
                          >
                            <Eye size={14} /> Lihat BA
                          </button>
                        )}
                        <a
                          href={item.fileUrl || '/BA/29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf'}
                          download={item.fileName || 'BA_ULTG.pdf'}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Unduh Berkas"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
