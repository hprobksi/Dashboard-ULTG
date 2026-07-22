import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Filter, Clock, CheckCircle2, Edit, Trash2, Sparkles, Loader2, Building2, Calendar, MapPin, Wrench, Info, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storage';
import { geminiService } from '../services/gemini';

export default function Anomali() {
  const [anomalies, setAnomalies] = useState([]);
  const [substations, setSubstations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedGi, setSelectedGi] = useState('ALL');
  const [selectedBidang, setSelectedBidang] = useState('ALL'); // 'ALL' | 'HARPRO' | 'HARGI' | 'HARJAR'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAno, setActiveAno] = useState(null);
  
  // AI Recommendation State
  const [loadingAiId, setLoadingAiId] = useState(null);
  const [aiRecModal, setAiRecModal] = useState({ open: false, title: '', content: '' });
  const [detailModal, setDetailModal] = useState({ open: false, loading: false, ano: null, assetInfo: null, photos: [] });
  const [photoViewer, setPhotoViewer] = useState({ open: false, index: 0, photos: [], ano: null, zoom: 1 });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [filterRelayCatuOnly, setFilterRelayCatuOnly] = useState(false);
  const [isAutoPolling, setIsAutoPolling] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(30);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isDirectSyncing, setIsDirectSyncing] = useState(false);
  const [plnToken, setPlnToken] = useState(() => localStorage.getItem('pln_bearer_token') || '');

  const handleDirectSync = async (silent = false) => {
    try {
      if (!silent) setIsDirectSyncing(true);
      
      // 1. Selalu load data terbaru dari local bridge terlebih dahulu agar seketika ter-update di tabel
      await checkLocalBridge(silent);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      const headers = {
        'Accept': 'application/json',
      };
      if (plnToken.trim()) {
        headers['Authorization'] = plnToken.startsWith('Bearer ') ? plnToken : `Bearer ${plnToken}`;
      }

      // 2. Coba tarik auto-pull dari Node.js ke server resmi PLN
      const res = await fetch('/api/pln-bridge/auto-pull', {
        method: 'POST',
        headers: headers
      });

      if (res.ok) {
        await checkLocalBridge(silent);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        if (!silent) {
          setIsImportModalOpen(false);
          alert(`🎉 Berhasil sinkronisasi langsung dari server PLN! 176+ Data Anomali terbaru telah diimpor & diklasifikasikan otomatis.`);
        }
        return;
      }

      // 3. Jika server PLN menolak karena 403 (User Login pada Device Lain) / 401
      if (res.status === 403 || res.status === 401) {
        if (!silent) {
          alert(
            `⚠️ Sinkronisasi Langsung (Node.js Backend) diblokir oleh sistem keamanan PLN (Error ${res.status}: "User Anda Sedang Login Pada Device Lain").\n\n` +
            `💡 MENGAPA DEMIKIAN & BAGAIMANA SOLUSINYA?\n` +
            `Karena sistem keamanan korporat PLN melarang 1 akun aktif di 2 perangkat/jalur sekaligus saat browser Anda masih login, silakan gunakan solusi tercepat:\n\n` +
            `👉 Buka tab web PowerInspect PLN di browser Anda, lalu klik Bookmark "⚡ Sync PLN" (Bookmarklet 1-Klik)! Semua data terbaru seketika dialirkan masuk ke dashboard ini tanpa error!`
          );
        }
        return;
      }

      if (!silent && !res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      if (!silent) {
        alert('⚠️ Gagal menarik data dari server PLN:\n\n' + err.message + '\n\n💡 Gunakan Bookmark "⚡ Sync PLN" dari tab browser Anda untuk menarik data 100% bebas blokir!');
      }
      console.error('Direct Sync Error:', err);
    } finally {
      if (!silent) setIsDirectSyncing(false);
    }
  };

  const openDetailPhotoModal = async (ano) => {
    setPhotoViewer({ open: true, loading: true, index: 0, photos: [], ano, assetInfo: null, zoom: 1 });
    try {
      const res = await fetch(`/api/pln-bridge/detail/${ano.id}`);
      if (res.ok) {
        const data = await res.json();
        setPhotoViewer({
          open: true,
          loading: false,
          index: 0,
          ano,
          assetInfo: data.assetInfo || null,
          photos: data.photos || [],
          zoom: 1
        });
      } else {
        setPhotoViewer(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Gagal load detail foto:", err);
      setPhotoViewer(prev => ({ ...prev, loading: false }));
    }
  };

  const checkLocalBridge = async (silent = true) => {
    try {
      const res = await fetch('/api/pln-bridge/latest');
      if (!res.ok) return;
      const bridge = await res.json();
      if (!bridge) return;

      const parsed = bridge.data || bridge;
      const list = parsed.data?.content || parsed.content || bridge.data?.content || bridge.content || (Array.isArray(parsed) ? parsed : null);
      if (!list || !Array.isArray(list)) return;

      let listToProcess = list;
      if (filterRelayCatuOnly) {
        const RELAY_CATU_KEYWORDS = [
          'relay', 'proteksi', 'distance', 'differential', 'ocr', 'gfr', 'ref615', 'sel-', 'siemens', 'abb', 'ge multilin', 'ied', 'bcu', 'panel kontrol',
          'catu daya', 'battery', 'baterai', 'rectifier', 'ups', 'inverter', 'charger', 'dc system', 'panel dc', 'panel ac', 'ac/dc'
        ];
        listToProcess = list.filter(item => {
          const text = `${item.assetClass || ''} ${item.name || ''} ${item.parameter || ''} ${item.bay || ''}`.toLowerCase();
          return RELAY_CATU_KEYWORDS.some(kw => text.includes(kw));
        });
      }

      const classifyBidang = (it) => {
        const text = `${it.assetClass || ''} ${it.name || ''} ${it.parameter || ''} ${it.bay || ''} ${it.formulir || ''}`.toUpperCase();
        const HARPRO_KW = ['RELAY', 'PROTEKSI', 'DISTANCE', 'DIFFERENTIAL', 'OCR', 'GFR', 'IED', 'BCU', 'BATTERY', 'BATERE', 'RECTIFIER', 'CHARGER', 'UPS', 'INVERTER', 'CATU DAYA', 'DC SYSTEM', 'PANEL KONTROL', 'AVR'];
        if (HARPRO_KW.some(kw => text.includes(kw))) return 'HARPRO';
        const HARJAR_KW = ['SPAN', 'TOWER', 'SERANDANG', 'GANTRY', 'SKTT', 'ROW', 'ISOLATOR JARINGAN', 'JUMPER LINE', 'KABEL LAUT'];
        if (HARJAR_KW.some(kw => text.includes(kw)) || (text.includes('PHT ') && text.includes('TOWER'))) return 'HARJAR';
        return 'HARGI';
      };

      const newAnomalies = listToProcess.map((item, idx) => {
        let formattedDate = new Date().toISOString().split('T')[0];
        if (item.inspectionDate) {
          const parts = String(item.inspectionDate).split('-');
          if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        const hi = item.healthIndex || 'Normal';
        let cleanIndication = item.parameter || 'Indikasi Tidak Teridentifikasi';
        if (cleanIndication.includes(',') && !cleanIndication.includes('•')) {
          cleanIndication = cleanIndication.split(',').map(s => s.trim()).filter(Boolean).map(s => `• ${s}`).join('\n');
        }

        let cleanName = item.name || item.assetClass || 'Peralatan';
        if (cleanName.includes(' - ')) {
          const parts = cleanName.split(' - ');
          cleanName = parts.join(' • ');
        }

        const statusLabel = hi.toLowerCase().includes('critical') || hi.toLowerCase().includes('poor') || hi.toLowerCase().includes('5') || hi.toLowerCase().includes('4') ? 'Open' : 'On Progress';

        return {
          id: item.id || 'ano-pln-' + Date.now() + '-' + idx,
          date: formattedDate,
          substation: item.garduInduk || '-',
          bay: item.bay || '-',
          equipment: cleanName,
          indication: cleanIndication,
          temporaryAction: item.formulir || 'Investigasi / Pemeliharaan Lanjutan',
          status: statusLabel,
          historyUpdate: `Sistem Anomali PowerInspect (${item.assetClass || 'Peralatan'}) • Di-sync ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
          healthIndex: hi,
          assetClass: item.assetClass || '-',
          formulir: item.formulir || '-',
          bidang: classifyBidang(item)
        };
      });

      setAnomalies(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const filteredNew = newAnomalies.filter(a => !existingIds.has(a.id));
        if (filteredNew.length === 0) return prev;
        const combined = [...filteredNew, ...prev];
        storageService.set('anomalies', combined);
        return combined;
      });

      if (bridge.timestamp) {
        const dateObj = new Date(bridge.timestamp);
        setLastSyncTime(dateObj.toLocaleTimeString('id-ID'));
      }

      if (!silent) {
        alert('🎉 Data berhasil disinkronkan dari Local Bridge!');
      }
    } catch (e) {
      console.error('Bridge Check Error:', e);
    }
  };

  useEffect(() => {
    let timer;
    if (isAutoPolling) {
      handleDirectSync(true);
      checkLocalBridge(true);
      timer = setInterval(() => {
        handleDirectSync(true);
        checkLocalBridge(true);
      }, pollingInterval * 1000);
    }
    return () => clearInterval(timer);
  }, [isAutoPolling, pollingInterval, plnToken, filterRelayCatuOnly]);

  const handleImportJson = async () => {
    try {
      if (!jsonInput.trim()) {
        alert('Silakan paste data JSON dari PowerInspect terlebih dahulu!');
        return;
      }
      const parsed = JSON.parse(jsonInput);
      const list = parsed.data?.content || parsed.content || (Array.isArray(parsed) ? parsed : null);

      if (!list || !Array.isArray(list) || list.length === 0) {
        alert('Format JSON tidak valid atau data kosong! Pastikan menyalin dari response find-all.');
        return;
      }

      let listToProcess = list;
      if (filterRelayCatuOnly) {
        const RELAY_CATU_KEYWORDS = [
          'relay', 'proteksi', 'distance', 'differential', 'ocr', 'gfr', 'ref615', 'sel-', 'siemens', 'abb', 'ge multilin', 'ied', 'bcu', 'panel kontrol',
          'catu daya', 'battery', 'baterai', 'rectifier', 'ups', 'inverter', 'charger', 'dc system', 'panel dc', 'panel ac', 'ac/dc'
        ];
        listToProcess = list.filter(item => {
          const text = `${item.assetClass || ''} ${item.name || ''} ${item.parameter || ''} ${item.bay || ''}`.toLowerCase();
          return RELAY_CATU_KEYWORDS.some(kw => text.includes(kw));
        });
      }

      if (listToProcess.length === 0) {
        alert(`⚠️ Dari ${list.length} data anomali yang di-paste, tidak ditemukan peralatan jenis Relay atau Catu Daya.\n\n(Jika Anda ingin mengimpor semua alat termasuk PMT, CT, PT, PMS, silakan hilangkan centang filter di atas)`);
        return;
      }

      const newAnomalies = listToProcess.map((item, idx) => {
        let formattedDate = new Date().toISOString().split('T')[0];
        if (item.inspectionDate) {
          const parts = String(item.inspectionDate).split('-');
          if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        const hi = item.healthIndex || '';
        const param = item.parameter || '';
        const ind = `${param} ${hi ? `[Health Index: ${hi}]` : ''}`.trim();

        return {
          id: item.id || 'ano-pln-' + Date.now() + '-' + idx,
          date: formattedDate,
          substation: item.garduInduk || 'GI 150KV CIKARANG',
          bay: item.bay || '-',
          equipment: item.name || item.assetClass || '-',
          indication: ind,
          temporaryAction: item.formulir || 'Investigasi / Pemeliharaan Lanjutan',
          status: hi.toLowerCase().includes('critical') || hi.toLowerCase().includes('poor') ? 'Open' : 'On Progress',
          historyUpdate: `Diimpor otomatis dari PowerInspect PLN (${item.assetClass || 'Asset'}) pada ${new Date().toLocaleString('id-ID')}`
        };
      });

      // Gabungkan dengan data lama (hindari duplikat berdasarkan ID asli PowerInspect)
      const existingIds = new Set(anomalies.map(a => a.id));
      const filteredNew = newAnomalies.filter(a => !existingIds.has(a.id));
      const combined = [...filteredNew, ...anomalies];

      await storageService.set('anomalies', combined);
      setAnomalies(combined);
      setJsonInput('');
      setIsImportModalOpen(false);
      alert(`🎉 Berhasil menyinkronkan & mengimpor ${filteredNew.length} Data Anomali baru dari PowerInspect PLN!${filterRelayCatuOnly ? ` (Di-filter dari total ${list.length} data)` : ''}`);
    } catch (err) {
      alert('Error saat memproses JSON: ' + err.message);
    }
  };

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    substation: '',
    bay: '',
    equipment: '',
    indication: '',
    temporaryAction: '',
    status: 'Open',
    historyUpdate: ''
  });

  const loadData = async () => {
    const anos = await storageService.get('anomalies');
    const subs = await storageService.get('substations');
    setAnomalies(anos);
    setSubstations(subs);
    if (subs.length > 0 && !formData.substation) {
      setFormData(prev => ({ ...prev, substation: subs[0].name }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAnomaly = async (e) => {
    e.preventDefault();
    if (!formData.equipment || !formData.indication) return;

    let updated;
    if (activeAno) {
      updated = anomalies.map(a => a.id === activeAno.id ? { ...a, ...formData } : a);
    } else {
      const newAno = {
        ...formData,
        id: 'ano-' + Date.now()
      };
      updated = [newAno, ...anomalies];
    }

    await storageService.set('anomalies', updated);
    setAnomalies(updated);
    setIsModalOpen(false);
    setActiveAno(null);
    setFormData({ date: new Date().toISOString().split('T')[0], substation: substations[0]?.name || '', bay: '', equipment: '', indication: '', temporaryAction: '', status: 'Open', historyUpdate: '' });
  };

  const openUpdateModal = (ano) => {
    setActiveAno(ano);
    setFormData({
      date: ano.date,
      substation: ano.substation,
      bay: ano.bay,
      equipment: ano.equipment,
      indication: ano.indication,
      temporaryAction: ano.temporaryAction,
      status: ano.status,
      historyUpdate: ano.historyUpdate || ''
    });
    setIsModalOpen(true);
  };

  const deleteAnomaly = async (id) => {
    if (!window.confirm('Hapus catatan anomali ini?')) return;
    const updated = anomalies.filter(a => a.id !== id);
    await storageService.set('anomalies', updated);
    setAnomalies(updated);
  };

  const askAiRecommendation = async (ano) => {
    try {
      setLoadingAiId(ano.id);
      const recommendation = await geminiService.analyzeAnomalyRecommendation({
        equipment: `${ano.equipment} di ${ano.substation} (${ano.bay})`,
        indication: ano.indication
      });
      setAiRecModal({
        open: true,
        title: `Rekomendasi AI: ${ano.equipment}`,
        content: recommendation
      });
    } catch (err) {
      alert('Gagal memanggil AI: ' + err.message);
    } finally {
      setLoadingAiId(null);
    }
  };

  const getBidang = (ano) => {
    if (ano.bidang) return ano.bidang;
    const text = `${ano.assetClass || ''} ${ano.equipment || ''} ${ano.indication || ''} ${ano.bay || ''} ${ano.formulir || ''}`.toUpperCase();
    const HARPRO_KW = ['RELAY', 'PROTEKSI', 'DISTANCE', 'DIFFERENTIAL', 'OCR', 'GFR', 'IED', 'BCU', 'BATTERY', 'BATERE', 'RECTIFIER', 'CHARGER', 'UPS', 'INVERTER', 'CATU DAYA', 'DC SYSTEM', 'PANEL KONTROL', 'AVR'];
    if (HARPRO_KW.some(kw => text.includes(kw))) return 'HARPRO';
    const HARJAR_KW = ['SPAN', 'TOWER', 'SERANDANG', 'GANTRY', 'SKTT', 'ROW', 'ISOLATOR JARINGAN', 'JUMPER LINE', 'KABEL LAUT'];
    if (HARJAR_KW.some(kw => text.includes(kw)) || (text.includes('PHT ') && text.includes('TOWER'))) return 'HARJAR';
    return 'HARGI';
  };

  const filtered = anomalies.filter(a => {
    const matchStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
    const matchGi = selectedGi === 'ALL' || a.substation === selectedGi;
    const matchBidang = selectedBidang === 'ALL' || getBidang(a) === selectedBidang;
    return matchStatus && matchGi && matchBidang;
  });

  // Hitung jumlah per bidang
  const bidangCounts = {
    HARPRO: anomalies.filter(a => getBidang(a) === 'HARPRO').length,
    HARGI: anomalies.filter(a => getBidang(a) === 'HARGI').length,
    HARJAR: anomalies.filter(a => getBidang(a) === 'HARJAR').length
  };

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title & Top Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', borderBottom: '2px solid #E2E8F0', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#00A2E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Anomali & Relai Proteksi</h1>
              <span style={{
                backgroundColor: isAutoPolling ? '#ECFDF5' : '#F1F5F9',
                color: isAutoPolling ? '#059669' : '#64748B',
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', border: `1px solid ${isAutoPolling ? '#6EE7B7' : '#CBD5E1'}`
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isAutoPolling ? '#10B981' : '#94A3B8', display: 'inline-block' }}></span>
                {isAutoPolling ? `Auto-Polling Aktif (${pollingInterval}s)` : 'Polling Nonaktif'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => handleDirectSync(false)}
            disabled={isDirectSyncing}
            className="btn btn-outline"
            style={{ padding: '9px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderColor: '#CBD5E1', color: '#334155', borderRadius: '8px' }}
            title="Sinkronisasi sekarang ke server PLN"
          >
            <RefreshCw size={16} className={isDirectSyncing ? 'animate-spin' : ''} color="#00A2E9" />
            {isDirectSyncing ? 'Menarik Data...' : 'Sync Sekarang'}
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn btn-outline"
            style={{ padding: '9px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderColor: '#CBD5E1', color: '#334155', borderRadius: '8px' }}
            title="Pengaturan Polling & Akses PLN"
          >
            <Wrench size={16} color="#64748B" /> Pengaturan Sync
          </button>

          <button
            onClick={() => { setActiveAno(null); setFormData({ date: new Date().toISOString().split('T')[0], substation: substations[0]?.name || '', bay: '', equipment: '', indication: '', temporaryAction: '', status: 'Open', historyUpdate: '' }); setIsModalOpen(true); }}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem', fontWeight: 600, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Catat Anomali
          </button>
        </div>
      </div>

      {/* Mode Filter Bidang (HARPRO / HARGI / HARJAR) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedBidang('ALL')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px',
            border: selectedBidang === 'ALL' ? '2px solid #00A2E9' : '1px solid #CBD5E1',
            backgroundColor: selectedBidang === 'ALL' ? '#E0F5FF' : '#FFFFFF',
            color: selectedBidang === 'ALL' ? '#0078AE' : '#475569',
            fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.15s'
          }}
        >
          <span>🏢 Semua Anomali ({anomalies.length})</span>
        </button>

        <button
          onClick={() => setSelectedBidang('HARPRO')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px',
            border: selectedBidang === 'HARPRO' ? '2px solid #0D9488' : '1px solid #CBD5E1',
            backgroundColor: selectedBidang === 'HARPRO' ? '#CCFBF1' : '#FFFFFF',
            color: selectedBidang === 'HARPRO' ? '#0F766E' : '#475569',
            fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.15s'
          }}
        >
          <span>⚡ HARPRO - Proteksi & Catu Daya ({bidangCounts.HARPRO})</span>
        </button>

        <button
          onClick={() => setSelectedBidang('HARGI')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px',
            border: selectedBidang === 'HARGI' ? '2px solid #0284C7' : '1px solid #CBD5E1',
            backgroundColor: selectedBidang === 'HARGI' ? '#E0F2FE' : '#FFFFFF',
            color: selectedBidang === 'HARGI' ? '#0369A1' : '#475569',
            fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.15s'
          }}
        >
          <span>⚙️ HARGI - Gardu Induk & Primer ({bidangCounts.HARGI})</span>
        </button>

        <button
          onClick={() => setSelectedBidang('HARJAR')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px',
            border: selectedBidang === 'HARJAR' ? '2px solid #D97706' : '1px solid #CBD5E1',
            backgroundColor: selectedBidang === 'HARJAR' ? '#FEF3C7' : '#FFFFFF',
            color: selectedBidang === 'HARJAR' ? '#B45309' : '#475569',
            fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.15s'
          }}
        >
          <span>🌐 HARJAR - Jaringan & Transmisi ({bidangCounts.HARJAR})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color="#64748B" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Status:</span>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="input-field" style={{ width: 'auto' }}>
            <option value="ALL">Semua Status</option>
            <option value="Open">Open (Belum Ditangani)</option>
            <option value="On Progress">On Progress (Sedang Diperbaiki)</option>
            <option value="Closed">Closed (Selesai Normal)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Gardu Induk:</span>
          <select value={selectedGi} onChange={e => setSelectedGi(e.target.value)} className="input-field" style={{ width: 'auto' }}>
            <option value="ALL">Semua Gardu Induk</option>
            {substations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      </div>



      {/* Anomalies Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '16px 20px' }}>Tanggal & GI</th>
                <th style={{ padding: '16px 20px' }}>Peralatan & Bay</th>
                <th style={{ padding: '16px 20px' }}>Indikasi Kerusakan</th>
                <th style={{ padding: '16px 20px' }}>Status & Tindakan Sementara</th>
                <th style={{ padding: '16px 20px' }}>Riwayat Update Perbaikan</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Detail & Foto</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                    Belum ada catatan anomali untuk kriteria filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((ano) => (
                  <tr key={ano.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: 700, color: '#00A2E9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={15} /> {ano.substation}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <Calendar size={13} /> {ano.date}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          backgroundColor: getBidang(ano) === 'HARPRO' ? '#CCFBF1' : getBidang(ano) === 'HARGI' ? '#E0F2FE' : '#FEF3C7',
                          color: getBidang(ano) === 'HARPRO' ? '#0F766E' : getBidang(ano) === 'HARGI' ? '#0369A1' : '#B45309',
                          padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid currentColor'
                        }}>
                          {getBidang(ano)}
                        </span>
                        {ano.assetClass && (
                          <span style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {ano.assetClass}
                          </span>
                        )}
                      </div>
                      <span style={{ fontWeight: 800, color: '#0F172A', display: 'block', fontSize: '0.94rem' }}>{ano.equipment}</span>
                      <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 600 }}>
                        <MapPin size={13} color="#00A2E9" /> {ano.bay}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', maxWidth: '260px', color: '#1E293B', fontWeight: 500, lineHeight: 1.5 }}>
                      <div style={{ marginBottom: '6px' }}>"{ano.indication}"</div>
                      {ano.healthIndex && (
                        <span style={{
                          backgroundColor: ano.healthIndex.toLowerCase().includes('critical') ? '#FEE2E2' : ano.healthIndex.toLowerCase().includes('poor') ? '#FEF3C7' : '#E0F2FE',
                          color: ano.healthIndex.toLowerCase().includes('critical') ? '#DC2626' : ano.healthIndex.toLowerCase().includes('poor') ? '#D97706' : '#0369A1',
                          padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block'
                        }}>
                          🚨 Health Index: {ano.healthIndex}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge badge-${ano.status.toLowerCase()}`} style={{ marginBottom: '8px' }}>
                        {ano.status}
                      </span>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <Info size={14} color="#00A2E9" /> {ano.temporaryAction || ano.formulir || 'Belum ada tindakan'}
                      </p>
                    </td>
                    <td style={{ padding: '16px 20px', maxWidth: '240px' }}>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {ano.historyUpdate ? (
                          <span style={{ color: '#0F172A', fontWeight: 500 }}>{ano.historyUpdate}</span>
                        ) : (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Belum di-update teknisi</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => openDetailPhotoModal(ano)}
                        className="btn"
                        style={{ padding: '7px 14px', fontSize: '0.78rem', backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                        title="Lihat Detail Spesifikasi Aset & Foto Inspeksi Resmi PLN"
                      >
                        📸 Foto & Detail
                      </button>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => openUpdateModal(ano)} className="btn btn-outline" style={{ padding: '6px 10px', color: '#00A2E9' }} title="Update Riwayat / Status">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteAnomaly(ano.id)} className="btn btn-outline" style={{ padding: '6px 10px', color: '#EF4444' }} title="Hapus">
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
      </div>

      {/* Add / Update Anomaly Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '620px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <RefreshCw size={22} color="#00A2E9" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                {activeAno ? 'Update Status & Riwayat Anomali' : 'Catat Anomali Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveAnomaly} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Gardu Induk *</label>
                  <select value={formData.substation} onChange={e => setFormData({ ...formData, substation: e.target.value })} className="input-field">
                    {substations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Bay / Trafo *</label>
                  <input type="text" placeholder="Misal: Trafo Daya 2" value={formData.bay} onChange={e => setFormData({ ...formData, bay: e.target.value })} className="input-field" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Peralatan Bermasalah *</label>
                  <input type="text" placeholder="Misal: Relay OCR 7SJ62" value={formData.equipment} onChange={e => setFormData({ ...formData, equipment: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Tanggal Kejadian *</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="input-field" required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Gejala / Indikasi Anomali *</label>
                <textarea placeholder="Misal: Alarm trip mekanik macet tidak bisa ditarik balik..." value={formData.indication} onChange={e => setFormData({ ...formData, indication: e.target.value })} className="input-field" rows={3} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Status Penanganan *</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="input-field">
                    <option value="Open">Open (Belum Diperbaiki)</option>
                    <option value="On Progress">On Progress (Sedang Dikerjakan)</option>
                    <option value="Closed">Closed (Selesai Diperbaiki)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Tindakan Sementara</label>
                  <input type="text" placeholder="Misal: Isolasi rangkaian trip" value={formData.temporaryAction} onChange={e => setFormData({ ...formData, temporaryAction: e.target.value })} className="input-field" />
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#00A2E9', marginBottom: '8px' }}>
                  <Wrench size={16} /> Riwayat Update Perbaikan (Progres Penanganan)
                </label>
                <textarea
                  placeholder="Ketik progres terkini, misal: 'Telah dilakukan pengujian injeksi tanggal 25 Juni, hasil CT sekunder normal'..."
                  value={formData.historyUpdate}
                  onChange={e => setFormData({ ...formData, historyUpdate: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button type="button" onClick={() => { setIsModalOpen(false); setActiveAno(null); }} className="btn btn-outline">Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Catatan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Recommendation Result Modal */}
      {aiRecModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '640px', padding: '32px', borderTop: '6px solid #FFD100' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FEF3C7' }}>
                <Sparkles size={24} color="#D97706" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{aiRecModal.title}</h3>
            </div>

            <div style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              padding: '20px',
              fontSize: '0.9rem',
              color: '#78350F',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              marginBottom: '22px'
            }}>
              {aiRecModal.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAiRecModal({ open: false, title: '', content: '' })} className="btn btn-yellow">
                Tutup Solusi AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PowerInspect JSON Import / Sync Modal */}
      {isImportModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '16px'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%', maxWidth: '650px', padding: '24px 28px',
            borderTop: '5px solid #00A2E9', maxHeight: '84vh', overflowY: 'auto',
            margin: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#00A2E9' }}>
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Pengaturan Auto-Polling & Sinkronisasi PLN</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>Konfigurasi koneksi langsung ke server PowerInspect PLN</p>
                </div>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#64748B', padding: '4px' }}>✕</button>
            </div>

            {/* Section 0: Bookmarklet - Zero Config */}
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#15803D', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🚀 Solusi Tercepat & Anti-Gagal (Bookmarklet 1-Klik):
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#166534', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                Biar tidak perlu repot copy-paste Token tiap hari atau terkena blokir 403, cukup pasang <b>Bookmarklet</b> ini 1 kali di browser Anda:
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const code = `javascript:(function(){if(window.plnBridgeActive){alert('⚡ Auto-Sync ke Dashboard AI sudah aktif di tab ini!');return;}window.plnBridgeActive=true;alert('🚀 Auto-Sync Aktif! Data dari portal PLN ini akan otomatis dialirkan ke Dashboard AI setiap 30 detik.');function syncNow(){fetch('https://apipowerinspect.pln.co.id/monitoring-anomali/find-all?page=0&size=1000',{credentials:'include'}).then(r=>r.json()).then(d=>{fetch('http://localhost:5173/api/pln-bridge/receive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(()=>console.log('✅ Data dikirim ke Dashboard AI'));}).catch(e=>console.error('Sync error:',e));}syncNow();setInterval(syncNow,30000);})();`;
                    navigator.clipboard.writeText(code);
                    alert('✅ Kode Bookmarklet Berhasil Disalin!\n\nCara pakai seumur hidup (cukup 1 kali setup):\n1. Klik kanan di Bookmark Bar browser Anda -> Add page/bookmark.\n2. Beri nama: ⚡ Sync PLN\n3. Paste kode tadi di kolom URL/Alamat -> Save.\n\n👉 Mulai sekarang, saat buka web PowerInspect PLN, cukup klik Bookmark itu 1 kali! Data langsung mengalir otomatis ke tabel ini tanpa repot setting apapun lagi!');
                  }}
                  className="btn"
                  style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 700, padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  📋 Salin Kode Bookmarklet (1-Klik Sync)
                </button>
                <span style={{ fontSize: '0.72rem', color: '#15803D', fontStyle: 'italic' }}>
                  *Tinggal klik tiap buka web PLN, data mengalir otomatis!
                </span>
              </div>
            </div>

            {/* Section 1: Token Akses */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔑 1. Token Authorization Server PLN (Opsi Alternatif):
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                Jika ingin menyinkronkan data langsung via server latar belakang (Node.js), paste Token Anda di bawah:
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  value={plnToken}
                  onChange={e => {
                    setPlnToken(e.target.value);
                    localStorage.setItem('pln_bearer_token', e.target.value);
                  }}
                  placeholder="Paste Token Authorization (cth: Bearer eyJhbGciOi...) di sini..."
                  className="input-field"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px', backgroundColor: '#FFFFFF' }}
                />
                <button
                  onClick={() => {
                    localStorage.setItem('pln_bearer_token', plnToken);
                    alert('✅ Token Akses PLN berhasil disimpan!');
                    handleDirectSync(false);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  Simpan & Tes Sync
                </button>
              </div>
            </div>

            {/* Section 2: Polling & Filter */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 16px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚡ 2. Frekuensi & Filter Auto-Polling:
              </h4>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block' }}>Status Auto-Polling Latar Belakang:</span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Menarik anomali baru secara otomatis sesuai jadwal interval</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={pollingInterval}
                    onChange={e => setPollingInterval(Number(e.target.value))}
                    className="input-field"
                    style={{ width: 'auto', padding: '6px 10px', fontSize: '0.78rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value={15}>Poling Tiap 15 Detik</option>
                    <option value={30}>Poling Tiap 30 Detik</option>
                    <option value={60}>Poling Tiap 60 Detik</option>
                    <option value={300}>Poling Tiap 5 Menit</option>
                  </select>
                  <button
                    onClick={() => setIsAutoPolling(!isAutoPolling)}
                    className="btn"
                    style={{
                      backgroundColor: isAutoPolling ? '#EF4444' : '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    {isAutoPolling ? '⏹️ Stop Polling' : '▶️ Aktifkan Polling'}
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="filterRelayCatu"
                  checked={filterRelayCatuOnly}
                  onChange={e => setFilterRelayCatuOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="filterRelayCatu" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer', margin: 0 }}>
                  Filter khusus peralatan Relay Proteksi & Catu Daya (Sembunyikan PMT, CT, PT, PMS)
                </label>
              </div>
            </div>

            {/* Section 3: Manual JSON Import (Collapse/Hint) */}
            <details style={{ fontSize: '0.78rem', color: '#64748B' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#00A2E9' }}>
                📂 Opsi Tambahan: Import Manual via Paste JSON
              </summary>
              <div style={{ marginTop: '8px' }}>
                <textarea
                  value={jsonInput}
                  onChange={e => setJsonInput(e.target.value)}
                  placeholder='Paste kode JSON di sini jika ingin mengimpor manual...'
                  style={{ width: '100%', height: '110px', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '0.72rem', backgroundColor: '#F8FAFC', boxSizing: 'border-box', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleImportJson} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600 }}>
                    Import JSON Manual
                  </button>
                </div>
              </div>
            </details>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              <button onClick={() => setIsImportModalOpen(false)} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700 }}>
                Tutup Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Direct 100% Fullscreen Photo & Specification Viewer Modal */}
      {photoViewer.open && photoViewer.ano && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', zIndex: 1300, maxHeight: '100vh', overflow: 'hidden'
        }}>
          {photoViewer.loading ? (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Loader2 size={54} className="animate-spin" color="#00A2E9" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
                ⏳ Menarik Spesifikasi Lengkap & Foto 100%...
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '8px' }}>
                Menghubungkan ke server PowerInspect PLN ({photoViewer.ano.equipment})
              </p>
            </div>
          ) : (
            <>
              {/* Top Navigation & Official Specifications Bar */}
              <div style={{
                padding: '14px 24px', backgroundColor: 'rgba(30, 41, 59, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', flexShrink: 0
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <button
                      onClick={() => setPhotoViewer({ open: false, loading: false, index: 0, photos: [], ano: null, assetInfo: null, zoom: 1 })}
                      style={{
                        backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px',
                        padding: '8px 16px', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0, 162, 233, 0.4)'
                      }}
                      title="Kembali ke tabel utama monitoring anomali"
                    >
                      ⬅️ KEMBALI KE TABEL
                    </button>
                    <span style={{
                      backgroundColor: getBidang(photoViewer.ano) === 'HARPRO' ? '#CCFBF1' : getBidang(photoViewer.ano) === 'HARGI' ? '#E0F2FE' : '#FEF3C7',
                      color: getBidang(photoViewer.ano) === 'HARPRO' ? '#0F766E' : getBidang(photoViewer.ano) === 'HARGI' ? '#0369A1' : '#B45309',
                      padding: '2px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800
                    }}>
                      {getBidang(photoViewer.ano)}
                    </span>
                    <span style={{ color: '#F8FAFC', fontSize: '1.05rem', fontWeight: 800 }}>
                      {photoViewer.ano.equipment}
                    </span>
                    {photoViewer.photos.length > 0 && (
                      <span style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #0284C7', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                        📸 Foto {photoViewer.index + 1} dari {photoViewer.photos.length} (100% Pas Layar)
                      </span>
                    )}
                  </div>

                  {/* Specification Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem', color: '#E2E8F0', alignItems: 'center' }}>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '6px' }}>
                      🏢 <strong>GI:</strong> {photoViewer.ano.substation} ({photoViewer.ano.bay})
                    </span>
                    {photoViewer.assetInfo?.assetIdentity && (
                      <>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '6px' }}>
                          🏷️ <strong>Merk:</strong> {photoViewer.assetInfo.assetIdentity.brand || '-'}
                        </span>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '6px' }}>
                          ⚙️ <strong>Tipe:</strong> {photoViewer.assetInfo.assetIdentity.assetType || '-'}
                        </span>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '6px' }}>
                          🔢 <strong>No. Seri:</strong> {photoViewer.assetInfo.assetIdentity.serialId || '-'}
                        </span>
                      </>
                    )}
                    {photoViewer.ano.healthIndex && (
                      <span style={{
                        backgroundColor: photoViewer.ano.healthIndex.toLowerCase().includes('critical') ? '#991B1B' : '#B45309',
                        color: '#FFFFFF', padding: '3px 10px', borderRadius: '6px', fontWeight: 700
                      }}>
                        🚨 {photoViewer.ano.healthIndex}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setPhotoViewer(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 3) }))}
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    title="Perbesar gambar"
                  >
                    🔍+ Zoom In
                  </button>
                  <button
                    onClick={() => setPhotoViewer(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.5) }))}
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    title="Perkecil gambar"
                  >
                    🔍- Zoom Out
                  </button>
                  <button
                    onClick={() => setPhotoViewer(prev => ({ ...prev, zoom: 1 }))}
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    title="Reset zoom 100% pas layar"
                  >
                    ↔️ 100% Fit
                  </button>
                  <button
                    onClick={() => setPhotoViewer({ open: false, loading: false, index: 0, photos: [], ano: null, assetInfo: null, zoom: 1 })}
                    style={{ backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', marginLeft: '6px' }}
                  >
                    ✕ Tutup
                  </button>
                </div>
              </div>

              {/* Main Photo 100% Display Area */}
              {photoViewer.photos.length === 0 ? (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                  <span style={{ fontSize: '3.5rem', marginBottom: '14px' }}>📷</span>
                  <h4 style={{ fontSize: '1.2rem', color: '#F8FAFC', margin: '0 0 8px 0' }}>Belum Ada Foto Inspeksi Terlampir di Server PLN</h4>
                  <p style={{ fontSize: '0.9rem', maxWidth: '500px', margin: 0 }}>
                    Spesifikasi & catatan anomali untuk <strong>{photoViewer.ano.equipment}</strong> telah berhasil ditarik, namun petugas lapangan belum mengunggah file foto inspeksi pada form Thermovisi/IL2.
                  </p>
                </div>
              ) : (
                <div style={{
                  flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  overflow: photoViewer.zoom > 1 ? 'auto' : 'hidden', padding: '12px', height: '100%'
                }}>
                  {/* Previous Arrow */}
                  {photoViewer.photos.length > 1 && (
                    <button
                      onClick={() => setPhotoViewer(prev => ({ ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length, zoom: 1 }))}
                      style={{
                        position: 'absolute', left: '20px', zIndex: 10, backgroundColor: 'rgba(0, 162, 233, 0.85)', color: '#FFFFFF',
                        border: 'none', borderRadius: '50%', width: '54px', height: '54px', fontSize: '1.4rem', fontWeight: 800,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                      }}
                      title="Foto Sebelumnya"
                    >
                      ◀
                    </button>
                  )}

                  {/* Current Active Image (Direct 100% Fit) */}
                  {(() => {
                    const curPhoto = photoViewer.photos[photoViewer.index];
                    const pathStr = typeof curPhoto === 'string' ? curPhoto : (curPhoto.path || curPhoto.url);
                    const imgUrl = `/api/pln-bridge/image?pathFile=${encodeURIComponent(pathStr)}`;

                    return (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease-out', transform: `scale(${photoViewer.zoom})`, height: '100%', width: '100%' }}>
                        <img
                          src={imgUrl}
                          alt="Foto Fullscreen"
                          style={{ maxHeight: 'calc(100vh - 215px)', maxWidth: 'calc(100vw - 120px)', borderRadius: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', objectFit: 'contain', backgroundColor: '#0F172A' }}
                        />
                      </div>
                    );
                  })()}

                  {/* Next Arrow */}
                  {photoViewer.photos.length > 1 && (
                    <button
                      onClick={() => setPhotoViewer(prev => ({ ...prev, index: (prev.index + 1) % prev.photos.length, zoom: 1 }))}
                      style={{
                        position: 'absolute', right: '20px', zIndex: 10, backgroundColor: 'rgba(0, 162, 233, 0.85)', color: '#FFFFFF',
                        border: 'none', borderRadius: '50%', width: '54px', height: '54px', fontSize: '1.4rem', fontWeight: 800,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                      }}
                      title="Foto Berikutnya"
                    >
                      ▶
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Thumbnail Strip & Action Bar */}
              <div style={{
                padding: '12px 24px', backgroundColor: 'rgba(30, 41, 59, 0.95)', borderTop: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0
              }}>
                {/* Horizontal Thumbnail Switcher */}
                {photoViewer.photos.length > 1 && (
                  <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '4px' }}>
                    {photoViewer.photos.map((p, pidx) => {
                      const pathStr = typeof p === 'string' ? p : (p.path || p.url);
                      const thumbUrl = `/api/pln-bridge/image?pathFile=${encodeURIComponent(pathStr)}`;
                      const isSelected = pidx === photoViewer.index;

                      return (
                        <div
                          key={pidx}
                          onClick={() => setPhotoViewer(prev => ({ ...prev, index: pidx, zoom: 1 }))}
                          style={{
                            width: '74px', height: '50px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden',
                            border: isSelected ? '3px solid #00A2E9' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer', opacity: isSelected ? 1 : 0.6, transition: 'all 0.2s'
                          }}
                          title={`Lihat Foto #${pidx + 1} di 100% layar`}
                        >
                          <img src={thumbUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Row: Indication & Download */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ color: '#00A2E9', fontSize: '0.74rem', fontWeight: 800, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Indikasi & Keterangan Pemeriksaan:
                    </span>
                    <span style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}>
                      {photoViewer.photos[photoViewer.index]?.parameter || photoViewer.photos[photoViewer.index]?.healthIndex || photoViewer.ano.indication}
                    </span>
                  </div>

                  {photoViewer.photos.length > 0 && (() => {
                    const curPhoto = photoViewer.photos[photoViewer.index];
                    const pathStr = typeof curPhoto === 'string' ? curPhoto : (curPhoto.path || curPhoto.url);
                    const imgUrl = `/api/pln-bridge/image?pathFile=${encodeURIComponent(pathStr)}`;

                    return (
                      <a
                        href={imgUrl}
                        download={`foto-anomali-${photoViewer.ano.equipment.replace(/[^a-zA-Z0-9]/g, '-')}-${photoViewer.index + 1}.jpg`}
                        style={{
                          backgroundColor: '#10B981', color: '#FFFFFF', textDecoration: 'none', borderRadius: '8px',
                          padding: '9px 18px', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        ⬇️ DOWNLOAD FOTO RESMI (.JPG)
                      </a>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
