import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, Search, Building2, MapPin, Hash, Layers, RefreshCw, LayoutGrid, Table, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ShieldCheck, Edit3, Save, X, CheckCircle2, AlertCircle, Filter, Check } from 'lucide-react';
import { storageService } from '../services/storage';

export default function PeralatanRelay() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('ALL'); // Gardu Induk
  const [selectedBay, setSelectedBay] = useState('ALL');
  const [selectedPst, setSelectedPst] = useState('ALL'); // Peralatan (jenisAsset)
  const [categoryMode, setCategoryMode] = useState('ALL'); // 'ALL' atau 'RELAY_ONLY'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Edit Mode state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    jenisAsset: '',
    garduInduk: '',
    bay: '',
    serialId: '',
    merk: '',
    tipe: '',
    status: ''
  });
  const [toastMessage, setToastMessage] = useState(null);

  const IGNORED_BAYS = ['SPAN', 'TOWER', 'GEDUNG', 'GANTRY', 'SERANDANG', 'JOIN SKTT', 'JOINT SKTT'];
  
  const RELAY_KEYWORDS = [
    'RELAY', 'OCR', 'DISTANCE', 'DIFFERENTIAL', '87', '50 ', '51 ', '64', 'RECLOSE',
    'AVR', 'SBEF', 'REF', 'VOLTAGE RELAY', 'FAULT LOCATOR', 'SYNCHROCHECK'
  ];

  const filterAndCleanData = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter(item => {
      if (!item) return false;
      const bayStr = String(item.bay || '').toUpperCase();
      if (IGNORED_BAYS.some(kw => bayStr.includes(kw))) return false;
      return true;
    });
  };

  // Load data dari file JSON master yang dihasilkan dari Master_Asset_Register_ULTG_Bekasi_4270_Lengkap.csv
  const loadMasterData = async () => {
    setIsLoading(true);
    try {
      // Selalu coba ambil data terbaru dari server agar hasil CSV terbaru langsung masuk
      const response = await fetch('/data/peralatan_ultg_bekasi.json?v=' + new Date().getTime());
      if (response.ok) {
        const data = await response.json();
        const cleanData = filterAndCleanData(data);
        setEquipmentList(cleanData);
        await storageService.set('master_peralatan_ultg_bekasi', cleanData);
      } else {
        const cached = await storageService.get('master_peralatan_ultg_bekasi');
        if (cached && cached.length > 0) {
          setEquipmentList(filterAndCleanData(cached));
        }
      }
    } catch (error) {
      console.error('Gagal memuat master data peralatan:', error);
      const cached = await storageService.get('master_peralatan_ultg_bekasi');
      if (cached && cached.length > 0) {
        setEquipmentList(filterAndCleanData(cached));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  // Handlers untuk reset cascading filter
  const handleSheetChange = (newSheet) => {
    setSelectedSheet(newSheet);
    setSelectedBay('ALL');
    setSelectedPst('ALL');
  };

  const handleBayChange = (newBay) => {
    setSelectedBay(newBay);
    setSelectedPst('ALL');
  };

  // Daftar Gardu Induk dari data
  const sheetList = useMemo(() => {
    const counts = {};
    equipmentList.forEach((item) => {
      const giName = item.garduInduk || item.gi || item.sheet || '-';
      counts[giName] = (counts[giName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [equipmentList]);

  // Daftar Bay bergantung pada Gardu Induk yang dipilih
  const bayList = useMemo(() => {
    const unique = new Set();
    equipmentList.forEach((item) => {
      const giName = item.garduInduk || item.gi || item.sheet || '-';
      const matchSheet = selectedSheet === 'ALL' || giName === selectedSheet;
      if (matchSheet && item.bay && item.bay !== '-') {
        unique.add(item.bay);
      }
    });
    return Array.from(unique).sort();
  }, [equipmentList, selectedSheet]);

  // Daftar Peralatan (jenisAsset) unik bergantung pada Gardu Induk & Bay yang dipilih
  const pstList = useMemo(() => {
    const unique = new Set();
    equipmentList.forEach((item) => {
      const giName = item.garduInduk || item.gi || item.sheet || '-';
      const matchSheet = selectedSheet === 'ALL' || giName === selectedSheet;
      const matchBay = selectedBay === 'ALL' || item.bay === selectedBay;
      const jaName = item.jenisAsset || item.pst || '-';
      if (matchSheet && matchBay && jaName && jaName !== '-') {
        if (categoryMode === 'RELAY_ONLY') {
          const upperJa = String(jaName).toUpperCase();
          if (!RELAY_KEYWORDS.some(kw => upperJa.includes(kw))) return;
        }
        unique.add(jaName);
      }
    });
    return Array.from(unique).sort();
  }, [equipmentList, selectedSheet, selectedBay, categoryMode]);

  // Filter & Pencarian
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const sheetVal = item.garduInduk || item.gi || item.sheet || '-';
      const bayVal = item.bay || '-';
      const pstVal = item.jenisAsset || item.pst || '-';

      if (categoryMode === 'RELAY_ONLY') {
        const upperJa = String(pstVal).toUpperCase();
        const isRelay = RELAY_KEYWORDS.some(kw => upperJa.includes(kw));
        if (!isRelay) return false;
      }

      const matchSheet = selectedSheet === 'ALL' || sheetVal === selectedSheet;
      if (!matchSheet) return false;

      const matchBay = selectedBay === 'ALL' || bayVal === selectedBay;
      if (!matchBay) return false;

      const matchPst = selectedPst === 'ALL' || pstVal === selectedPst;
      if (!matchPst) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        pstVal.toLowerCase().includes(q) ||
        sheetVal.toLowerCase().includes(q) ||
        bayVal.toLowerCase().includes(q) ||
        (item.serialId || item.sid || '').toLowerCase().includes(q) ||
        (item.merk || '').toLowerCase().includes(q) ||
        (item.tipe || item.type || '').toLowerCase().includes(q)
      );
    });
  }, [equipmentList, categoryMode, selectedSheet, selectedBay, selectedPst, searchQuery]);

  // Reset ke halaman 1 jika filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryMode, selectedSheet, selectedBay, selectedPst, searchQuery, pageSize]);

  // Paginasi
  const totalItems = filteredEquipment.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEquipment.slice(start, start + pageSize);
  }, [filteredEquipment, currentPage, pageSize]);

  // Format Status Helper
  const formatStatus = (st) => {
    if (!st || st === '-') return { label: '-', bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1' };
    const upper = String(st).toUpperCase();
    if (upper.includes('OPERASI') && !upper.includes('TIDAK') && !upper.includes('BELUM')) {
      return { label: 'Operasi', bg: '#DCFCE7', color: '#16A34A', border: '#86EFAC' };
    }
    if (upper.includes('TIDAK') || upper.includes('BELUM')) {
      return { label: 'Tidak Operasi', bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' };
    }
    if (upper.includes('DIGUDANGKAN')) {
      return { label: 'Digudangkan', bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
    }
    if (upper.includes('SPARE')) {
      return { label: 'Spare', bg: '#E0E7FF', color: '#4F46E5', border: '#C7D2FE' };
    }
    return { label: st.replace(/^PLN_/i, ''), bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
  };

  // Handler Edit Aset
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      jenisAsset: item.jenisAsset || item.pst || '',
      garduInduk: item.garduInduk || item.gi || item.sheet || '',
      bay: item.bay || '',
      serialId: item.serialId || item.sid || '',
      merk: item.merk || '',
      tipe: item.tipe || item.type || '',
      status: item.status || 'PLN_OPERASI'
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id) => {
    const updatedList = equipmentList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          jenisAsset: editForm.jenisAsset || '-',
          pst: editForm.jenisAsset || '-',
          garduInduk: editForm.garduInduk || '-',
          gi: editForm.garduInduk || '-',
          sheet: editForm.garduInduk || '-',
          bay: editForm.bay || '-',
          serialId: editForm.serialId || '-',
          sid: editForm.serialId || '-',
          merk: editForm.merk || '-',
          tipe: editForm.tipe || '-',
          type: editForm.tipe || '-',
          status: editForm.status || 'PLN_OPERASI'
        };
      }
      return item;
    });

    setEquipmentList(updatedList);
    setEditingId(null);
    await storageService.set('master_peralatan_ultg_bekasi', updatedList);

    setToastMessage('Perubahan data peralatan berhasil disimpan!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const relayCount = useMemo(() => {
    return equipmentList.filter(item => {
      const ja = String(item.jenisAsset || item.pst || '').toUpperCase();
      return RELAY_KEYWORDS.some(kw => ja.includes(kw));
    }).length;
  }, [equipmentList]);

  return (
    <div className="animate-fade-in" style={{ padding: '24px', maxWidth: '1360px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#16A34A',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 999,
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 style={{ width: 20, height: 20 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #00A2E9 0%, #006699 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        color: '#FFFFFF',
        marginBottom: '24px',
        boxShadow: '0 10px 25px -5px rgba(0, 162, 233, 0.35)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                backgroundColor: '#FFD100',
                color: '#0F172A',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Database Master Asset Register PLN
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#E0F5FF', fontWeight: 600 }}>
                <ShieldCheck style={{ width: 14, height: 14, color: '#4ADE80' }} />
                Total Database: {equipmentList.length.toLocaleString()} Aset
              </span>
            </div>
            <h1 style={{ fontSize: '2.15rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              Master Peralatan & Relay
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={loadMasterData}
              disabled={isLoading}
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '10px 18px',
                fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                fontSize: '0.82rem',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <RefreshCw style={{ width: 15, height: 15, animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
              {isLoading ? 'Memuat...' : 'Reload Master Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Filter Cepat: Semua vs Khusus Relay Proteksi */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCategoryMode('ALL')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: categoryMode === 'ALL' ? '2px solid #00A2E9' : '1px solid #E2E8F0',
            backgroundColor: categoryMode === 'ALL' ? '#E0F5FF' : '#FFFFFF',
            color: categoryMode === 'ALL' ? '#0078AE' : '#475569',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: categoryMode === 'ALL' ? '0 4px 12px rgba(0, 162, 233, 0.15)' : 'none',
            transition: 'all 0.15s'
          }}
        >
          <Building2 style={{ width: 16, height: 16 }} />
          <span>Semua Peralatan ({equipmentList.length.toLocaleString()} Aset)</span>
          {categoryMode === 'ALL' && <Check style={{ width: 16, height: 16, color: '#00A2E9' }} />}
        </button>

        <button
          onClick={() => setCategoryMode('RELAY_ONLY')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: categoryMode === 'RELAY_ONLY' ? '2px solid #16A34A' : '1px solid #E2E8F0',
            backgroundColor: categoryMode === 'RELAY_ONLY' ? '#DCFCE7' : '#FFFFFF',
            color: categoryMode === 'RELAY_ONLY' ? '#15803D' : '#475569',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: categoryMode === 'RELAY_ONLY' ? '0 4px 12px rgba(22, 163, 74, 0.15)' : 'none',
            transition: 'all 0.15s'
          }}
        >
          <ShieldCheck style={{ width: 16, height: 16 }} />
          <span>Khusus Peralatan Relay & Proteksi ({relayCount.toLocaleString()} Aset)</span>
          {categoryMode === 'RELAY_ONLY' && <Check style={{ width: 16, height: 16, color: '#16A34A' }} />}
        </button>
      </div>

      {/* Panel Kendali Eksekutif: Filter Dropdown & Pencarian */}
      <div className="pk-card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Row 1: Dropdown Filter GI, Bay, dan PST (Cascading) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {/* Dropdown 1: Filter Gardu Induk */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <Building2 style={{ width: 15, height: 15, color: '#00A2E9' }} />
              1. Filter Gardu Induk:
            </label>
            <select
              value={selectedSheet}
              onChange={(e) => handleSheetChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="ALL">🏢 Semua Gardu Induk ({sheetList.length} GI)</option>
              {sheetList.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.count.toLocaleString()} Aset)
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Filter Bay */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <MapPin style={{ width: 15, height: 15, color: '#00A2E9' }} />
              2. Filter Bay:
            </label>
            <select
              value={selectedBay}
              onChange={(e) => handleBayChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="ALL">📍 Semua Bay ({bayList.length} Bay)</option>
              {bayList.map((bay) => (
                <option key={bay} value={bay}>
                  {bay}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 3: Filter Peralatan (jenisAsset) */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <Layers style={{ width: 15, height: 15, color: '#00A2E9' }} />
              3. Filter Peralatan (Jenis Asset):
            </label>
            <select
              value={selectedPst}
              onChange={(e) => setSelectedPst(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="ALL">⚡ Semua Peralatan ({pstList.length} Kategori)</option>
              {pstList.map((pst) => (
                <option key={pst} value={pst}>
                  {pst}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Search Input & View Mode Controls */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ position: 'relative', flex: '1 1 340px', maxWidth: '540px' }}>
            <Search style={{ width: 16, height: 16, color: '#94A3B8', position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari Peralatan, Gardu Induk, Bay, No Seri, Merk, atau Tipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                fontSize: '0.85rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                backgroundColor: '#F8FAFC',
                color: '#0F172A',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00A2E9'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
              Menampilkan <strong style={{ color: '#0F172A' }}>{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)}</strong> dari <strong style={{ color: '#0F172A' }}>{totalItems.toLocaleString()}</strong> peralatan
            </div>

            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? '#00A2E9' : '#64748B',
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <LayoutGrid style={{ width: 14, height: 14 }} /> Kartu
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'table' ? '#00A2E9' : '#64748B',
                  boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <Table style={{ width: 14, height: 14 }} /> Tabel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Display Area */}
      {isLoading ? (
        <div className="pk-card" style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
          <RefreshCw style={{ width: 32, height: 32, color: '#00A2E9', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>Memuat database peralatan dari Master Asset Register...</div>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="pk-card" style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
          <Cpu style={{ width: 36, height: 36, color: '#94A3B8', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155' }}>Tidak Ditemukan Peralatan</div>
          <p style={{ fontSize: '0.85rem', margin: '6px 0 0' }}>Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Tampilan Kartu Eksekutif + Tombol Edit & Save) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {paginatedData.map((item) => {
            const isEditing = editingId === item.id;
            const stInfo = formatStatus(item.status);
            const giName = item.garduInduk || item.gi || item.sheet || '-';
            const jaName = item.jenisAsset || item.pst || '-';
            const tipeName = item.tipe || item.type || '-';
            const serialName = item.serialId || item.sid || '-';

            return (
              <div key={item.id} className="pk-card" style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: isEditing ? '4px solid #16A34A' : '4px solid #00A2E9',
                backgroundColor: isEditing ? '#F0FDF4' : '#FFFFFF',
                transition: 'all 0.2s'
              }}>
                <div>
                  {/* Header: Merk, Status & Tipe */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '100%' }}>
                      {isEditing ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <div>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#15803D', display: 'block', marginBottom: '2px' }}>Merk:</label>
                            <input
                              type="text"
                              value={editForm.merk}
                              onChange={(e) => setEditForm({ ...editForm, merk: e.target.value })}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.8rem', fontWeight: 700 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#15803D', display: 'block', marginBottom: '2px' }}>Tipe:</label>
                            <input
                              type="text"
                              value={editForm.tipe}
                              onChange={(e) => setEditForm({ ...editForm, tipe: e.target.value })}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.8rem', fontWeight: 700 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: '#0078AE',
                              backgroundColor: '#E0F5FF',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}>
                              Merk: {item.merk !== '-' ? item.merk : 'Umum'}
                            </span>

                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: stInfo.color,
                              backgroundColor: stInfo.bg,
                              border: `1px solid ${stInfo.border}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {stInfo.label === 'Operasi' && <CheckCircle2 style={{ width: 11, height: 11 }} />}
                              {stInfo.label === 'Tidak Operasi' && <AlertCircle style={{ width: 11, height: 11 }} />}
                              {stInfo.label}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            {tipeName !== '-' ? tipeName : 'Tanpa Tipe'}
                          </h4>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(item)}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#475569',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
                        title="Edit Aset Ini"
                      >
                        <Edit3 style={{ width: 13, height: 13 }} /> Edit
                      </button>
                    )}
                  </div>

                  {/* Peralatan (jenisAsset) */}
                  <div style={{ backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC', padding: '12px', borderRadius: '8px', border: isEditing ? '1px solid #86EFAC' : '1px solid #E2E8F0', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.7rem', color: isEditing ? '#15803D' : '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <Layers style={{ width: 13, height: 13, color: isEditing ? '#16A34A' : '#00A2E9' }} /> Peralatan (Jenis Asset):
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.jenisAsset}
                        onChange={(e) => setEditForm({ ...editForm, jenisAsset: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    ) : (
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.4 }}>
                        {jaName}
                      </div>
                    )}
                  </div>

                  {/* Gardu Induk & Bay */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#334155' }}>
                      <Building2 style={{ width: 16, height: 16, color: '#00A2E9', flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ width: '100%' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Gardu Induk:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.garduInduk}
                            onChange={(e) => setEditForm({ ...editForm, garduInduk: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}
                          />
                        ) : (
                          <strong style={{ color: '#0F172A' }}>{giName}</strong>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#334155' }}>
                      <MapPin style={{ width: 16, height: 16, color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ width: '100%' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Bay:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bay}
                            onChange={(e) => setEditForm({ ...editForm, bay: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #86EFAC', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}
                          />
                        ) : (
                          <strong style={{ color: '#0F172A' }}>{item.bay || '-'}</strong>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: No Seri (SID) */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                    <Hash style={{ width: 14, height: 14 }} /> No Seri:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.serialId}
                      onChange={(e) => setEditForm({ ...editForm, serialId: e.target.value })}
                      style={{ width: '160px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #86EFAC', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700 }}
                    />
                  ) : (
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px' }}>
                      {serialName}
                    </span>
                  )}
                </div>

                {/* Save & Cancel Action Buttons when editing */}
                {isEditing && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #86EFAC' }}>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
                      }}
                    >
                      <Save style={{ width: 14, height: 14 }} /> Simpan
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <X style={{ width: 14, height: 14 }} /> Batal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW (Tampilan Tabel Eksekutif + Tombol Edit & Save) */
        <div className="pk-card" style={{ overflow: 'hidden', marginBottom: '28px' }}>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#334155', fontWeight: 700 }}>
                  <th style={{ padding: '12px 14px', width: '45px', textAlign: 'center' }}>No</th>
                  <th style={{ padding: '12px 14px', width: '22%' }}>Peralatan</th>
                  <th style={{ padding: '12px 14px', width: '18%' }}>Gardu Induk</th>
                  <th style={{ padding: '12px 14px', width: '18%' }}>Bay</th>
                  <th style={{ padding: '12px 14px', width: '11%' }}>Merk</th>
                  <th style={{ padding: '12px 14px', width: '11%' }}>Tipe</th>
                  <th style={{ padding: '12px 14px', width: '12%' }}>No Seri</th>
                  <th style={{ padding: '12px 14px', width: '100px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px 14px', width: '80px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const isEditing = editingId === item.id;
                  const stInfo = formatStatus(item.status);
                  const giName = item.garduInduk || item.gi || item.sheet || '-';
                  const jaName = item.jenisAsset || item.pst || '-';
                  const tipeName = item.tipe || item.type || '-';
                  const serialName = item.serialId || item.sid || '-';

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isEditing ? '#F0FDF4' : index % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.jenisAsset}
                            onChange={(e) => setEditForm({ ...editForm, jenisAsset: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86EFAC', fontWeight: 700 }}
                          />
                        ) : (
                          jaName
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 700 }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.garduInduk}
                            onChange={(e) => setEditForm({ ...editForm, garduInduk: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86EFAC' }}
                          />
                        ) : (
                          giName
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bay}
                            onChange={(e) => setEditForm({ ...editForm, bay: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86EFAC' }}
                          />
                        ) : (
                          item.bay || '-'
                        )}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.merk}
                            onChange={(e) => setEditForm({ ...editForm, merk: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86EFAC' }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0078AE', backgroundColor: '#E0F5FF', padding: '3px 8px', borderRadius: '4px' }}>
                            {item.merk !== '-' ? item.merk : 'Umum'}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1E293B' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.tipe}
                            onChange={(e) => setEditForm({ ...editForm, tipe: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86EFAC' }}
                          />
                        ) : (
                          tipeName
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#475569', fontWeight: 700 }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.serialId}
                            onChange={(e) => setEditForm({ ...editForm, serialId: e.target.value })}
                            style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86EFAC', fontFamily: 'monospace' }}
                          />
                        ) : (
                          serialName
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: stInfo.color,
                          backgroundColor: stInfo.bg,
                          border: `1px solid ${stInfo.border}`,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          display: 'inline-block'
                        }}>
                          {stInfo.label}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#16A34A', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
                              title="Simpan"
                            >
                              <Save style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#64748B', cursor: 'pointer' }}
                              title="Batal"
                            >
                              <X style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#475569', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.75rem' }}
                            title="Edit"
                          >
                            <Edit3 style={{ width: 13, height: 13 }} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pk-card" style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            <span>Item per halaman:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}
            >
              <option value={24}>24 item</option>
              <option value={48}>48 item</option>
              <option value={96}>96 item</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: '#334155' }}
              title="Halaman Pertama"
            >
              <ChevronsLeft style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} /> Sebelumnya
            </button>

            <span style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              Halaman {currentPage} dari {totalPages.toLocaleString()}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Selanjutnya <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: '#334155' }}
              title="Halaman Terakhir"
            >
              <ChevronsRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
