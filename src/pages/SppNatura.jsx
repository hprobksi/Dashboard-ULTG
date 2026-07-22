import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Archive, PlusCircle, CheckCircle, Search, Calendar, User, 
  Building, Users, FileCheck, Eye, Download, Trash2, Edit3, Check, 
  AlertCircle, ArrowLeft, Printer, RefreshCw, ShieldCheck, Clock,
  LayoutDashboard, CalendarDays, BarChart3, PieChart, TrendingUp, Filter,
  UserPlus, XCircle, ChevronDown, CheckSquare, ExternalLink
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { 
  MASTER_PEGAWAI_ALL, getMasterPegawaiList, saveMasterPegawaiList, 
  ALL_STANDARD_BIDANG, getAvatarUrl 
} from '../data/pegawaiMaster';
import JadwalPiketNatura from '../components/JadwalPiketNatura';


const getDefaultPenerima = (bidang) => {
  if (bidang === 'Harjar' || bidang === 'HARJAR') return 'AHMAD YAZID AL BASTOMY';
  if (bidang === 'Hargi' || bidang === 'HARGI') return 'SAEPUL ROHMAT';
  if (bidang === 'Harpro' || bidang === 'HARPRO') return 'ERVAN JAGI MARTHA WIBOWO';
  return 'SAEPUL ROHMAT';
};

// Kategori Resmi 100% dari web-natura/src/app/page.tsx
const VALID_CATEGORIES = [
  "SUTT 70 KV", "SUTT 150 KV", "SUTET 500 KV", 
  "TRAFO 70 KV", "TRAFO 150 KV", "TRAFO 500 KV", 
  "SWITCHYARD 70 KV", "SWITCHYARD 150 KV", "SWITCHYARD 500 KV"
];

// Warna Grafik Resmi 100% dari web-natura/src/components/DashboardChart.tsx
const CHART_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1'  // indigo
];

// Data Awal Arsip SPP (Referensi Data Eksisting web-natura)
export default function SppNatura({ initialSubTab = 'dashboard-natura' }) {
  const [subTab, setSubTab] = useState(initialSubTab);
  const [arsipList, setArsipList] = useState([]);
  const [pegawaiListState, setPegawaiListState] = useState(() => getMasterPegawaiList());
  const [isLoadingNatura, setIsLoadingNatura] = useState(false);

  useEffect(() => {
    saveMasterPegawaiList(pegawaiListState);
  }, [pegawaiListState]);

  const formatDateInput = (item) => {
    if (!item) return selectedDate;
    if (typeof item.tanggal === 'string' && item.tanggal.includes('-')) return item.tanggal;
    const y = item.tahun || new Date().getFullYear();
    const m = String(item.bulan || new Date().getMonth() + 1).padStart(2, '0');
    const d = String(item.tanggal || 1).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const loadNaturaData = async () => {
    setIsLoadingNatura(true);
    try {
      const [arsipRes, pegawaiRes] = await Promise.all([
        fetch('/api/natura'),
        fetch('/api/pegawai')
      ]);
      if (!arsipRes.ok) throw new Error('Gagal mengambil arsip NATURA');
      if (!pegawaiRes.ok) throw new Error('Gagal mengambil master pegawai NATURA');
      const arsipData = await arsipRes.json();
      const pegawaiData = await pegawaiRes.json();
      setArsipList(arsipData.sppData || []);
      setPegawaiListState(Array.isArray(pegawaiData) ? pegawaiData : []);
    } catch (e) {
      console.error('Gagal memuat dari API NATURA:', e);
    } finally {
      setIsLoadingNatura(false);
    }
  };

  useEffect(() => {
    loadNaturaData();
  }, []);

  // Synchronize initialSubTab change from sidebar
  useEffect(() => {
    if (initialSubTab) setSubTab(initialSubTab);
  }, [initialSubTab]);

  // State Form SPP Natura (Mengacu persis ke web-natura/src/app/natura/page.tsx)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [bidang, setBidang] = useState('Hargi');
  const [kategori, setKategori] = useState('SUTT 150 KV');
  const [jenisPekerjaan, setJenisPekerjaan] = useState('NON RUTIN');
  const [sppNomor, setSppNomor] = useState(`....../SPP/ULTGBKASI/NR/${new Date().getFullYear()}`);
  const [noWo, setNoWo] = useState('');
  const [uraianPekerjaan, setUraianPekerjaan] = useState('');
  const [lokasiKerja, setLokasiKerja] = useState('');
  const [waktuPelaksana, setWaktuPelaksana] = useState('08:00 - 16:00 WIB');
  const [penerimaTugas, setPenerimaTugas] = useState(getDefaultPenerima('Hargi'));
  const [namaMultg, setNamaMultg] = useState('TRIAWAN AZHARY PERMATA NUGRAHA');

  // State Personil Dinas di Form Input
  const [isSearchingPersonil, setIsSearchingPersonil] = useState(false);
  const [showPersonilList, setShowPersonilList] = useState(false);
  const [eligiblePersonil, setEligiblePersonil] = useState([]);
  const [selectedPersonilIds, setSelectedPersonilIds] = useState([]);
  const [inlineNamaBaru, setInlineNamaBaru] = useState('');

  // State Filter Arsip & Dashboard (100% dari web-natura)
  const [filterBulan, setFilterBulan] = useState(() => new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(() => String(new Date().getFullYear()));
  const [filterBidang, setFilterBidang] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // State Status Unduhan & Sinkronisasi (100% dari web-natura/src/app/arsip/page.tsx)
  const [downloadedItems, setDownloadedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('natura_downloaded');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [syncingId, setSyncingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const markAsDownloaded = (id) => {
    const key = String(id);
    setDownloadedItems(prev => {
      const next = { ...prev, [key]: true };
      try {
        localStorage.setItem('natura_downloaded', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // State Modal Preview Dokumen
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Manajemen Pegawai (web-natura/src/app/pegawai/page.tsx)
  const [filterPegawaiBidang, setFilterPegawaiBidang] = useState('SEMUA');
  const [searchPegawai, setSearchPegawai] = useState('');
  const [viewPegawaiMode, setViewPegawaiMode] = useState('tabel');
  const [showAddPegawaiModal, setShowAddPegawaiModal] = useState(false);
  const [newPegawaiNama, setNewPegawaiNama] = useState('');
  const [newPegawaiBidang, setNewPegawaiBidang] = useState('HARPRO');
  const [newPegawaiJabatan, setNewPegawaiJabatan] = useState('');

  // State Matriks Jadwal Piket (web-natura/src/app/jadwal/page.tsx)
  const [jadwalGardu, setJadwalGardu] = useState('global');
  const [jadwalMatrix, setJadwalMatrix] = useState(() => {
    const init = {};
    MASTER_PEGAWAI_ALL.slice(0, 10).forEach(p => {
      init[p.id] = { 1: 'Piket Pagi', 2: 'Piket Malam', 5: 'Standby', 6: 'Libur', 14: 'Dinas Luar', 15: 'Piket Pagi' };
    });
    return init;
  });

  // Efek ganti bidang form -> ganti default penerima & MULTG
  useEffect(() => {
    setPenerimaTugas(getDefaultPenerima(bidang));
    setNamaMultg('TRIAWAN AZHARY PERMATA NUGRAHA');
    if (showPersonilList) {
      const list = pegawaiListState.filter(p => p.bidang.toUpperCase() === bidang.toUpperCase());
      setEligiblePersonil(list);
      setSelectedPersonilIds(list.slice(0, 4).map(p => p.id));
    }
  }, [bidang, pegawaiListState]);

  // Efek ganti jenis pekerjaan -> ganti R / NR pada nomor SPP
  useEffect(() => {
    const isRutin = jenisPekerjaan === 'RUTIN';
    setSppNomor(prev => {
      if (!prev.includes('/SPP/ULTGBKASI/')) return prev;
      return prev.replace(/\/SPP\/ULTGBKASI\/(R|NR)\//, `/SPP/ULTGBKASI/${isRutin ? 'R' : 'NR'}/`);
    });
  }, [jenisPekerjaan]);

  const handleSearchPersonil = async () => {
    setIsSearchingPersonil(true);
    try {
      const d = new Date(selectedDate);
      const params = new URLSearchParams({
        tanggal: String(d.getDate()),
        bulan: String(d.getMonth() + 1),
        tahun: String(d.getFullYear()),
        shift: waktuPelaksana
      });
      if (isEditMode && editId) params.set('id', String(editId));
      const res = await fetch(`/api/natura/eligible?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal mengambil personil eligible');
      const data = await res.json();
      const list = Array.isArray(data) ? data.sort((a, b) => a.nama.localeCompare(b.nama)) : [];
      setEligiblePersonil(list);
      if (!isEditMode) setSelectedPersonilIds([]);
      setShowPersonilList(true);
    } catch (e) {
      const list = pegawaiListState
        .filter(p => p.bidang.toUpperCase() === bidang.toUpperCase())
        .sort((a, b) => a.nama.localeCompare(b.nama));
      setEligiblePersonil(list);
      if (!isEditMode) {
        setSelectedPersonilIds([]);
      }
      setShowPersonilList(true);
      alert(`Gagal mengambil data eligible dari database, memakai daftar lokal: ${e.message}`);
    } finally {
      setIsSearchingPersonil(false);
    }
  };

  const handleTogglePersonil = (id) => {
    setSelectedPersonilIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleTambahPersonilBaru = async () => {
    const nama = window.prompt('Masukkan nama personil baru (akan ditambahkan ke daftar bertugas):');
    if (!nama || !nama.trim()) return;
    try {
      const res = await fetch('/api/pegawai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: nama.toUpperCase().trim(),
          bidang: bidang.toUpperCase(),
          jabatan: `TEKNISI ${bidang.toUpperCase()}`
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal menambah pegawai');
      }
      const newPerson = await res.json();
      setPegawaiListState(prev => [...prev, newPerson]);
      setEligiblePersonil(prev => [...prev, newPerson].sort((a, b) => a.nama.localeCompare(b.nama)));
      setSelectedPersonilIds(prev => [...prev, newPerson.id]);
    } catch (e) {
      alert(`Gagal menambah personil: ${e.message}`);
    }
  };

  const handleInlineTambahPersonil = async () => {
    const nama = inlineNamaBaru.trim();
    if (!nama) return;
    try {
      const res = await fetch('/api/pegawai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: nama.toUpperCase(),
          bidang: bidang.toUpperCase(),
          jabatan: `TEKNISI ${bidang.toUpperCase()}`
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal menambah pegawai');
      }
      const newPerson = await res.json();
      setPegawaiListState(prev => [...prev, newPerson]);
      setEligiblePersonil(prev => [...prev, newPerson].sort((a, b) => a.nama.localeCompare(b.nama)));
      setSelectedPersonilIds(prev => [...prev, newPerson.id]);
      setInlineNamaBaru('');
      alert(`Personil "${newPerson.nama}" berhasil ditambahkan dan dipilih untuk dinas ini!`);
    } catch (e) {
      alert(`Gagal menambah personil inline: ${e.message}`);
    }
  };


  const getSelectedPersons = () => selectedPersonilIds
    .map(id => eligiblePersonil.find(p => p.id === id) || pegawaiListState.find(p => p.id === id))
    .filter(Boolean);

  const buildNaturaDraftPayload = (override = {}) => {
    const rawDate = override.tanggal || selectedDate;
    const dateObj = new Date(rawDate);
    const pegawaiList = override.pegawaiList || getSelectedPersons();

    return {
      tanggal: typeof rawDate === 'number' ? rawDate : (Number.isNaN(dateObj.getTime()) ? selectedDate : dateObj.getDate()),
      bulan: override.bulan || (Number.isNaN(dateObj.getTime()) ? new Date().getMonth() + 1 : dateObj.getMonth() + 1),
      tahun: override.tahun || (Number.isNaN(dateObj.getTime()) ? new Date().getFullYear() : dateObj.getFullYear()),
      bidangInput: override.bidangInput || bidang,
      sppNomor: override.sppNomor || sppNomor,
      noWo: override.noWo ?? noWo,
      kategori: override.kategori || kategori,
      jenisPekerjaan: override.jenisPekerjaan || jenisPekerjaan,
      uraianPekerjaan: override.uraianPekerjaan || uraianPekerjaan,
      lokasiKerja: override.lokasiKerja || lokasiKerja,
      waktuPelaksana: override.waktuPelaksana || waktuPelaksana,
      penerimaTugas: override.penerimaTugas || penerimaTugas,
      namaMultg: override.namaMultg || namaMultg,
      pegawaiList
    };
  };

  const generateNaturaPdfBlob = async (payload) => {
    const body = payload && (payload.draftData || payload.sppIds || payload.sppDataList) ? payload : { draftData: payload };
    const res = await fetch('/api/natura/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal membuat PDF Natura');
    }

    return res.blob();
  };

  const openPdfPreview = async (draftData) => {
    setIsPreviewing(true);
    try {
      const blob = await generateNaturaPdfBlob(draftData);
      const url = URL.createObjectURL(blob);
      if (previewPdfUrl) URL.revokeObjectURL(previewPdfUrl);
      setPreviewDoc(null);
      setPreviewPdfUrl(url);
    } catch (e) {
      alert(`Gagal membuat preview PDF: ${e.message}`);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handlePreviewDirect = async () => {
    if (!uraianPekerjaan.trim() || !lokasiKerja.trim()) {
      alert('⚠️ Mohon isi Uraian Pekerjaan dan Lokasi Kerja terlebih dahulu sebelum preview surat!');
      return;
    }
    if (selectedPersonilIds.length === 0) {
      alert('⚠️ Pilih minimal 1 personil yang berdinas!');
      return;
    }
    await openPdfPreview(buildNaturaDraftPayload());
  };

  const handleSimpanDanSync = async () => {
    if (!uraianPekerjaan.trim() || !lokasiKerja.trim()) {
      alert('⚠️ Mohon melengkapi Uraian Pekerjaan dan Lokasi Kerja!');
      return;
    }
    if (selectedPersonilIds.length === 0) {
      alert('⚠️ Pilih minimal 1 personil yang berdinas!');
      return;
    }

    const selectedPersons = selectedPersonilIds
      .map(id => eligiblePersonil.find(p => p.id === id) || pegawaiListState.find(p => p.id === id))
      .filter(Boolean);
    const dateObj = new Date(selectedDate);

    const payload = {
      ...(isEditMode && editId ? { id: editId } : {}),
      tanggal: dateObj.getDate(),
      bulan: dateObj.getMonth() + 1,
      tahun: dateObj.getFullYear(),
      bidangInput: bidang,
      pegawaiIds: selectedPersons.map(p => p.id),
      sppNomor,
      noWo,
      kategori,
      jenisPekerjaan,
      uraianPekerjaan,
      lokasiKerja,
      waktuPelaksana,
      penerimaTugas,
      namaMultg
    };

    try {
      const res = await fetch('/api/natura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal menyimpan SPP Natura');
      }
      const result = await res.json();
      await loadNaturaData();
      if (isEditMode) {
        alert('Perubahan tersimpan ke Arsip. Sinkronisasi Spreadsheet berjalan di background.');
        setIsEditMode(false);
        setEditId(null);
      } else {
        alert('Berhasil disimpan ke Arsip. Sinkronisasi Spreadsheet berjalan di background.');
      }
      if (result.id) setEditId(null);
    } catch (e) {
      alert(`Gagal menyimpan SPP Natura: ${e.message}`);
      return;
    }

    setUraianPekerjaan('');
    setLokasiKerja('');
    setNoWo('');
    setWaktuPelaksana('08:00 - 16:00 WIB');
    const nextJenisKode = jenisPekerjaan === 'RUTIN' ? 'R' : 'NR';
    setSppNomor(`....../SPP/ULTGBKASI/${nextJenisKode}/${new Date().getFullYear()}`);
    setSubTab('arsip-natura');
  };

  const handleEditArsip = (item) => {
    setSelectedDate(formatDateInput(item));
    setBidang(item.bidangInput);
    setKategori(item.kategori || 'SUTT 150 KV');
    setJenisPekerjaan(item.jenisPekerjaan || 'NON RUTIN');
    setSppNomor(item.sppNomor);
    setNoWo(item.noWo || '');
    setUraianPekerjaan(item.uraianPekerjaan);
    setLokasiKerja(item.lokasiKerja);
    setWaktuPelaksana(item.waktuPelaksana || '08:00 - 16:00 WIB');
    setPenerimaTugas(item.penerimaTugas || getDefaultPenerima(item.bidangInput));
    setNamaMultg(item.namaMultg || 'TRIAWAN AZHARY PERMATA NUGRAHA');
    
    const list = pegawaiListState.filter(p => p.bidang.toUpperCase() === item.bidangInput.toUpperCase());
    setEligiblePersonil(list);
    setSelectedPersonilIds(item.pegawaiList.map(p => p.id));
    setShowPersonilList(true);
    setIsEditMode(true);
    setEditId(item.id);
    setSubTab('kelola-natura');
  };

  const handleDeleteArsip = (itemOrId, nomor) => {
    const id = typeof itemOrId === 'object' ? itemOrId.id : itemOrId;
    const tanggal = typeof itemOrId === 'object' ? itemOrId.tanggal : '';
    const msg = typeof itemOrId === 'object'
      ? `Yakin ingin menghapus seluruh data SPP & Personil pada tanggal ${tanggal} (ID: ${id})? Sinkronisasi Spreadsheet akan dijalankan di background.`
      : `Yakin ingin menghapus dokumen SPP ${nomor}? Data akan dihapus dari arsip dan spreadsheet.`;
    if (window.confirm(msg)) {
      fetch(`/api/natura?id=${id}`, { method: 'DELETE' })
        .then(async res => {
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Gagal menghapus dari database');
          }
          await loadNaturaData();
        })
        .catch(e => alert(`Gagal menghapus SPP: ${e.message}`));
    }
  };

  const handleSyncArsip = async (spp) => {
    setSyncingId(spp.id);
    try {
      const res = await fetch('/api/natura/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulan: spp.bulan, tahun: spp.tahun })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal sinkronisasi');
      }
      await loadNaturaData();
      alert(`Sinkronisasi ${spp.bulan || new Date().getMonth() + 1}/${spp.tahun || new Date().getFullYear()} berhasil.`);
    } catch (e) {
      alert(`Sinkronisasi gagal: ${e.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  const handleDownloadArsipPdf = async (spp) => {
    setDownloadingId(spp.id);
    try {
      const blob = await generateNaturaPdfBlob({ sppIds: [spp.id] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SPP_NATURA_${spp.bidangInput || 'ULTG'}_TGL_${spp.tanggal}_${spp.bulan}_${spp.tahun}_ID_${spp.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      markAsDownloaded(spp.id);
    } catch (e) {
      alert(`Gagal mengunduh PDF: ${e.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const getSyncMeta = (spp) => {
    const status = spp.statusSync || spp.syncStatus || "PENDING";
    if (status === "Tersinkron" || status === "SYNCED") {
      return { label: "Sudah Sync", bg: "#dcfce7", color: "#166534", canSync: false };
    }
    if (status === "ERROR") {
      return { label: "Gagal Sync", bg: "#fee2e2", color: "#991b1b", canSync: true };
    }
    return { label: "Belum Sync", bg: "#fef3c7", color: "#92400e", canSync: true };
  };

  // Export Excel Otomatis Sesuai Request
  const handleExportExcel = () => {
    let tsvContent = "NO. SPP / DOKUMEN\tTANGGAL\tBIDANG\tKATEGORI\tURAIAN PEKERJAAN\tLOKASI KERJA\tJAM PELAKSANAAN\tKETUA TIM / PENGAWAS\tMANAGER ULTG\tJUMLAH PERSONIL\tDAFTAR NAMA PERSONIL\n";
    arsipList.forEach(item => {
      const names = item.pegawaiList.map(p => p.nama).join(', ');
      tsvContent += `${item.sppNomor}\t${item.tanggal}\t${item.bidangInput}\t${item.kategori}\t${item.uraianPekerjaan}\t${item.lokasiKerja}\t${item.waktuPelaksana}\t${item.penerimaTugas}\t${item.namaMultg}\t${item.pegawaiList.length} Orang\t${names}\n`;
    });

    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Natura_ULTG_Bekasi_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredArsip = useMemo(() => {
    return arsipList.filter(item => {
      if (filterBulan && Number(item.bulan) !== Number(filterBulan)) return false;
      if (filterTahun && Number(item.tahun) !== Number(filterTahun)) return false;
      if (filterBidang && item.bidangInput.toUpperCase() !== filterBidang.toUpperCase()) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNo = String(item.sppNomor || '').toLowerCase().includes(q);
        const matchUraian = String(item.uraianPekerjaan || '').toLowerCase().includes(q);
        const matchLokasi = String(item.lokasiKerja || '').toLowerCase().includes(q);
        const matchPerson = (item.pegawaiList || []).some(p => String(p.nama || '').toLowerCase().includes(q));
        if (!matchNo && !matchUraian && !matchLokasi && !matchPerson) return false;
      }
      return true;
    });
  }, [arsipList, filterBulan, filterTahun, filterBidang, searchQuery]);

  // Perhitungan Data untuk Dashboard (100% Sesuai web-natura/src/app/page.tsx)
  const dashboardStats = useMemo(() => {
    const filtered = arsipList.filter(item => {
      if (filterBulan && Number(item.bulan) !== Number(filterBulan)) return false;
      if (filterTahun && Number(item.tahun) !== Number(filterTahun)) return false;
      return true;
    });

    const hargiCount = filtered.filter(i => (i.bidangInput || '').toUpperCase() === 'HARGI').length;
    const harproCount = filtered.filter(i => (i.bidangInput || '').toUpperCase() === 'HARPRO').length;
    const harjarCount = filtered.filter(i => (i.bidangInput || '').toUpperCase() === 'HARJAR').length;

    const categorySums = {};
    VALID_CATEGORIES.forEach(cat => categorySums[cat] = 0);
    let grandTotal = 0;

    filtered.forEach(item => {
      const count = 1; // 1 Dokumen SPP
      const uraian = (item.kategori || item.uraianPekerjaan || "").toUpperCase().replace(/SUTT 500 KV/g, 'SUTET 500 KV');
      for (const kat of VALID_CATEGORIES) {
        if (uraian.includes(kat)) {
          categorySums[kat] += count;
          grandTotal += count;
          break;
        }
      }
    });

    const chartData = VALID_CATEGORIES.map(kat => ({
      name: kat,
      total: categorySums[kat] || 0
    }));

    const mNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    const monthName = mNames[Number(filterBulan) - 1] || "JULI";

    return {
      totalDocs: filtered.length,
      totalPegawai: pegawaiListState.length,
      hargiCount,
      harproCount,
      harjarCount,
      categorySums,
      chartData,
      grandTotal,
      monthName
    };
  }, [arsipList, filterBulan, filterTahun, pegawaiListState]);

  return (
    <div style={{ padding: '16px 22px', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-modal-overlay,
          .print-modal-overlay * {
            visibility: visible;
          }
          .print-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            padding: 0 !important;
            z-index: 99999 !important;
          }
          .print-modal-content {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .print-hide {
            display: none !important;
          }
          .printable-page {
            width: 100%;
            margin: 0 auto;
          }
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>


      {/* ========================================================================================= */}
      {/* SUB TAB 1: DASHBOARD NATURA (100% Skema Identik dari web-natura/src/app/page.tsx) */}
      {/* ========================================================================================= */}
      {subTab === 'dashboard-natura' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Periode Dashboard Filter Banner (100% dari web-natura page.tsx lines 86-111) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #CBD5E1',
            padding: '22px 26px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                Periode Dashboard
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
                Default menampilkan bulan berjalan. Pilih periode untuk melihat rekap bulan sebelumnya.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Bulan</label>
                <select
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(Number(e.target.value))}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 800, fontSize: '0.88rem', color: '#0F172A', backgroundColor: '#F8FAFC' }}
                >
                  <option value={1}>JANUARI</option>
                  <option value={2}>FEBRUARI</option>
                  <option value={3}>MARET</option>
                  <option value={4}>APRIL</option>
                  <option value={5}>MEI</option>
                  <option value={6}>JUNI</option>
                  <option value={7}>JULI</option>
                  <option value={8}>AGUSTUS</option>
                  <option value={9}>SEPTEMBER</option>
                  <option value={10}>OKTOBER</option>
                  <option value={11}>NOVEMBER</option>
                  <option value={12}>DESEMBER</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Tahun</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 800, fontSize: '0.88rem', color: '#0F172A', backgroundColor: '#F8FAFC' }}
                >
                  {[2023, 2024, 2025, 2026, 2027, 2028, 2029].map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {}}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  Tampilkan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setFilterBulan(now.getMonth() + 1);
                    setFilterTahun(String(now.getFullYear()));
                  }}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  Bulan Ini
                </button>
              </div>
            </div>
          </div>

          {/* 5 Cards Metrik Utama (grid-5 dari web-natura page.tsx lines 113-163) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px' }}>
            
            {/* Card 1: Total Pegawai */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Total Pegawai</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A' }}>{dashboardStats.totalPegawai}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
            </div>

            {/* Card 2: Hargi ({monthName}) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', borderLeft: '5px solid #3b82f6', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Hargi ({dashboardStats.monthName})</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#3b82f6' }}>{dashboardStats.hargiCount}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={24} />
              </div>
            </div>

            {/* Card 3: Harjar ({monthName}) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', borderLeft: '5px solid #10b981', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Harjar ({dashboardStats.monthName})</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>{dashboardStats.harjarCount}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} />
              </div>
            </div>

            {/* Card 4: Harpro ({monthName}) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', borderLeft: '5px solid #f59e0b', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Harpro ({dashboardStats.monthName})</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>{dashboardStats.harproCount}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={24} />
              </div>
            </div>

            {/* Card 5: Total SPP ({monthName}) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', borderLeft: '5px solid #ef4444', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Total SPP ({dashboardStats.monthName})</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ef4444' }}>{dashboardStats.totalDocs}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} />
              </div>
            </div>

          </div>

          {/* Card Grafik & Link Google Spreadsheet (100% dari web-natura page.tsx lines 165-180 & DashboardChart.tsx) */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', padding: '28px', minHeight: '420px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Rekap Personil {dashboardStats.monthName} {filterTahun}
              </h3>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <a 
                  href="https://docs.google.com/spreadsheets/d/1Z_wuVkcpQzeJ-dt72wJV7MeX9WQhYZEjTvYLgYV43YQ/edit" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    backgroundColor: '#10b981', color: '#FFFFFF', 
                    border: '1px solid #10b981', borderRadius: '10px', 
                    padding: '9px 18px', fontSize: '0.88rem', fontWeight: 800, 
                    textDecoration: 'none', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    transition: 'all 0.15s'
                  }}
                >
                  <ExternalLink size={17} /> Buka Google Spreadsheet
                </a>
                <span style={{ 
                  backgroundColor: '#EFF6FF', color: '#0284C7', border: '1px solid #BAE6FD',
                  padding: '7px 18px', borderRadius: '99px', fontSize: '0.88rem', fontWeight: 800 
                }}>
                  Total: {dashboardStats.grandTotal} Dokumen
                </span>
              </div>
            </div>

            {/* Recharts BarChart Sesuai DashboardChart.tsx */}
            <div style={{ width: '100%', height: '360px', marginTop: '16px' }}>
              {dashboardStats.chartData && dashboardStats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardStats.chartData}
                    margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
                    barSize={44}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                      axisLine={false} 
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '10px', border: '1px solid #CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`${value} Dokumen`, 'Total']}
                      labelStyle={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}
                    />
                    <Bar 
                      dataKey="total" 
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    >
                      <LabelList 
                        dataKey="total" 
                        position="top" 
                        style={{ fill: '#334155', fontSize: 13, fontWeight: 800 }} 
                        formatter={(val) => val > 0 ? val : ''}
                      />
                      {dashboardStats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                  <p style={{ color: '#64748b', fontWeight: 700 }}>Belum ada data aktivitas di bulan ini</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB TAB 2: FORM INPUT SPP & NATURA (Sesuai Referensi web-natura/src/app/natura/page.tsx) */}
      {/* ========================================================================================= */}
      {subTab === 'kelola-natura' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #CBD5E1',
          padding: '32px 38px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          maxWidth: '1040px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Header Judul Dokumen Form */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #F1F5F9', paddingBottom: '24px', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#E0F2FE',
              color: '#00A2E9',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              marginBottom: '12px',
              border: '1px solid #BAE6FD'
            }}>
              <FileText size={26} />
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
              {isEditMode ? `✏️ Edit Data SPP Natura (${sppNomor})` : 'Form Input Surat Perintah Perjalanan (SPP) Natura'}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', margin: 0, fontWeight: 600 }}>
              Sistem Rekapitulasi & Penerbitan Surat Tugas ULTG Bekasi
            </p>
          </div>

          {/* 1. PERIODE & BIDANG PENGINPUT */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              1. Periode & Bidang Penginput
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tanggal Dinas
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Bidang Penginput
                </label>
                <select
                  value={bidang}
                  onChange={(e) => setBidang(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#00A2E9',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Hargi">Hargi</option>
                  <option value="Harpro">Harpro</option>
                  <option value="Harjar">Harjar</option>
                </select>
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '26px 0' }} />

          {/* 2. DATA ADMINISTRASI PEKERJAAN */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              2. Data Administrasi Pekerjaan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Kategori Pekerjaan
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                >
                  {VALID_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Jenis Pekerjaan
                </label>
                <select
                  value={jenisPekerjaan}
                  onChange={(e) => {
                    const val = e.target.value;
                    setJenisPekerjaan(val);
                    const isRutin = val === 'RUTIN';
                    if (sppNomor.includes('/SPP/ULTGBKASI/')) {
                      setSppNomor(sppNomor.replace(/\/SPP\/ULTGBKASI\/(R|NR)\//, `/SPP/ULTGBKASI/${isRutin ? 'R' : 'NR'}/`));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="RUTIN">RUTIN</option>
                  <option value="NON RUTIN">NON RUTIN</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Nomor SPP
                </label>
                <input
                  type="text"
                  value={sppNomor}
                  onChange={(e) => setSppNomor(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  No WO <span style={{ fontWeight: 'normal', color: '#94A3B8', fontSize: '0.8rem' }}>(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="ISI JIKA ADA"
                  value={noWo}
                  onChange={(e) => setNoWo(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '26px 0' }} />

          {/* 3. DETAIL PELAKSANAAN PEKERJAAN */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              3. Detail Pelaksanaan Pekerjaan
            </h3>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Uraian Pekerjaan
              </label>
              <input
                type="text"
                placeholder="Contoh: PEMELIHARAAN RUTIN BAY TRAFO..."
                value={uraianPekerjaan}
                onChange={(e) => setUraianPekerjaan(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#0F172A',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Lokasi Kerja
                </label>
                <input
                  type="text"
                  placeholder="Contoh: GI TAMBUN"
                  value={lokasiKerja}
                  onChange={(e) => setLokasiKerja(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Jam Pelaksanaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08:00 - 16:00 WIB"
                  value={waktuPelaksana}
                  onChange={(e) => setWaktuPelaksana(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '26px 0' }} />

          {/* 4. PENUGASAN & APPROVAL */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              4. Penugasan & Approval
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Penerima Tugas (Ketua Tim / Pengawas)
                </label>
                <input
                  type="text"
                  placeholder="NAMA KETUA TIM / PENGAWAS"
                  value={penerimaTugas}
                  onChange={(e) => setPenerimaTugas(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Pemberi Penugasan (MULTG)
                </label>
                <input
                  type="text"
                  placeholder="NAMA MANAGER"
                  value={namaMultg}
                  onChange={(e) => setNamaMultg(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '26px 0' }} />

          {/* 5. PILIH PERSONIL BERTUGAS & SIMPAN */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              5. Pilih Personil yang Bertugas & Simpan
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '18px' }}>
              Klik tombol di bawah untuk memuat daftar personil yang berdinas pada tanggal tersebut
            </p>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '22px' }}>
              <button
                type="button"
                onClick={handleSearchPersonil}
                disabled={isSearchingPersonil}
                style={{
                  flex: 1,
                  padding: '13px 20px',
                  borderRadius: '10px',
                  border: '1px solid #00A2E9',
                  backgroundColor: isSearchingPersonil ? '#F1F5F9' : '#FFFFFF',
                  color: '#00A2E9',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: isSearchingPersonil ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Search size={18} /> {isSearchingPersonil ? '🔍 Mencari Personil...' : '🔍 Tampilkan Daftar Personil Dinas'}
              </button>
            </div>

            {/* Autocomplete Search to Add Personnel to List */}
            {showPersonilList && (
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  <UserPlus size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: '#00A2E9' }} />
                  Cari & Pilih Personil dari Jadwal Dinas:
                </span>
                <input
                  type="text"
                  placeholder="Ketik nama personil..."
                  value={inlineNamaBaru}
                  onChange={(e) => setInlineNamaBaru(e.target.value.toUpperCase())}
                  onFocus={() => setShowPersonilList(true)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
                
                {/* Dropdown Suggestions */}
                {inlineNamaBaru.trim() && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    zIndex: 20
                  }}>
                    {eligiblePersonil.filter(p => p.nama.includes(inlineNamaBaru.trim()) && !selectedPersonilIds.includes(p.id)).length > 0 ? (
                      eligiblePersonil
                        .filter(p => p.nama.includes(inlineNamaBaru.trim()) && !selectedPersonilIds.includes(p.id))
                        .map(p => (
                          <div
                            key={p.id}
                            onMouseDown={(e) => {
                              // onMouseDown fires before onBlur
                              e.preventDefault();
                              // Tandai personil jadwal sebagai terpilih
                              if (!selectedPersonilIds.includes(p.id)) {
                                setSelectedPersonilIds(prev => [...prev, p.id]);
                              }
                              setInlineNamaBaru('');
                            }}
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #F1F5F9',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F9FF'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                          >
                            <span>{p.nama}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>{p.bidang || 'UMUM'}</span>
                          </div>
                        ))
                    ) : (
                      <div style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>"{inlineNamaBaru}" tidak ada di jadwal dinas.</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (inlineNamaBaru.trim()) {
                              handleInlineTambahPersonil();
                            }
                          }}
                          style={{ padding: '6px 12px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}
                        >
                          + Daftarkan Personil Baru
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Grid Checkbox Personil */}
            {showPersonilList && (
              <div style={{ borderTop: '2px solid #F1F5F9', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                    Pilih Personil ({selectedPersonilIds.length} terpilih):
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedPersonilIds(eligiblePersonil.map(p => p.id))}
                      style={{ fontSize: '0.78rem', fontWeight: 600, color: '#00A2E9', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Pilih Semua
                    </button>
                    <span style={{ color: '#CBD5E1' }}>|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPersonilIds([])}
                      style={{ fontSize: '0.78rem', fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Reset Pilihan
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                  gap: '11px',
                  marginBottom: '28px'
                }}>
                  {eligiblePersonil.map(p => {
                    const isSelected = selectedPersonilIds.includes(p.id);
                    const selIndex = selectedPersonilIds.indexOf(p.id) + 1;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleTogglePersonil(p.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
                          border: isSelected ? '1.5px solid #00A2E9' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 2px 4px rgba(0, 162, 233, 0.12)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#00A2E9' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#0284C7' : '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.nama}
                          </div>
                        </div>
                        {isSelected && (
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#3B82F6',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            {selIndex}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isEditMode ? '1fr 1fr 1fr' : '1fr 1fr',
                  gap: '16px',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={handlePreviewDirect}
                    disabled={isPreviewing}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: '2px solid #00A2E9',
                      backgroundColor: '#FFFFFF',
                      color: '#00A2E9',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      cursor: isPreviewing ? 'wait' : 'pointer',
                      opacity: isPreviewing ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Eye size={18} /> {isPreviewing ? 'Membuat PDF...' : 'Preview Surat Tugas'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSimpanDanSync}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isEditMode ? '#3B82F6' : '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isEditMode ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    <CheckCircle size={18} /> {isEditMode ? '💾 Simpan Perubahan' : '💾 Simpan ke Arsip & Sync'}
                  </button>

                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditMode(false);
                        setEditId(null);
                        setSubTab('arsip-natura');
                      }}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      ❌ Batal
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB TAB 3: ARSIP & REKAP NATURA KESELURUHAN (Sesuai Referensi web-natura/src/app/arsip/page.tsx) */}
      {/* ========================================================================================= */}
      {subTab === 'arsip-natura' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Top Quick Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#00A2E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Archive size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Dokumen SPP</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A' }}>{arsipList.length} Dokumen</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Personil Terpenuhi</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10B981' }}>
                  {arsipList.reduce((acc, curr) => acc + (curr.pegawaiList ? curr.pegawaiList.length : 0), 0)} Personil
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Bidang Terlibatkan</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#D97706' }}>3 Bidang Kerja</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CBD5E1', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status Database</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16A34A' }}>✅ 100% Tersinkron</div>
              </div>
            </div>
          </div>

          {/* Filter Pencarian Card (100% dari web-natura/src/app/arsip/page.tsx) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #CBD5E1',
            padding: '22px 24px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              Filter Pencarian
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Bulan</label>
                <select
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(e.target.value === "" ? "" : Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.88rem', backgroundColor: '#F8FAFC' }}
                >
                  <option value="">Semua Bulan</option>
                  <option value={1}>Januari</option>
                  <option value={2}>Februari</option>
                  <option value={3}>Maret</option>
                  <option value={4}>April</option>
                  <option value={5}>Mei</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>Agustus</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>Desember</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Tahun</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value === "" ? "" : Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.88rem', backgroundColor: '#F8FAFC' }}
                >
                  <option value="">Semua Tahun</option>
                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Bidang</label>
                <select
                  value={filterBidang}
                  onChange={(e) => setFilterBidang(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.88rem', backgroundColor: '#F8FAFC' }}
                >
                  <option value="">Semua Bidang</option>
                  <option value="Hargi">HARGI</option>
                  <option value="Harpro">HARPRO</option>
                  <option value="Harjar">HARJAR</option>
                </select>
              </div>
            </div>

            {/* Pencarian Teks & Tombol Export Excel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Cari No SPP, Uraian Pekerjaan, Lokasi, atau Nama Personil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Daftar Dokumen Tersimpan Card (100% Sesuai web-natura/src/app/arsip/page.tsx) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #CBD5E1',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
              Daftar Dokumen Tersimpan
            </h3>

            {filteredArsip.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '12px', fontWeight: 600, border: '1px dashed #CBD5E1' }}>
                Belum ada SPP/Natura yang dibuat untuk filter ini.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[...filteredArsip].sort((a,b) => {
                  if (a.tahun !== b.tahun) return b.tahun - a.tahun;
                  if (a.bulan !== b.bulan) return b.bulan - a.bulan;
                  return Number(b.tanggal || 0) - Number(a.tanggal || 0);
                }).map((item) => {
                  const mNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
                  const downloadKey = String(item.id);
                  const isDownloaded = downloadedItems[downloadKey];
                  const syncMeta = getSyncMeta(item);

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                        padding: '18px 22px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        gap: '18px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '320px' }}>
                        <h4 style={{ color: '#00A2E9', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.02rem', fontWeight: 800, flexWrap: 'wrap' }}>
                          {item.tanggal} {mNames[Number(item.bulan) - 1] || ''} {item.tahun}
                          <span style={{ fontSize: '0.74rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                            👥 {item.pegawaiList ? item.pegawaiList.length : 0} Orang
                          </span>
                          {isDownloaded && (
                            <span style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                              Telah Diunduh
                            </span>
                          )}
                          <span style={{ fontSize: '0.72rem', backgroundColor: syncMeta.bg, color: syncMeta.color, padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                            ● {syncMeta.label}
                          </span>
                        </h4>

                        <div style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.65 }}>
                          <strong>No SPP:</strong> <span style={{ color: '#0F172A', fontWeight: 700 }}>{item.sppNomor || '-'}</span><br />
                          <strong>Kategori:</strong> <span style={{ color: '#00A2E9', fontWeight: 'bold' }}>{item.kategori || '-'}</span><br />
                          <strong>Uraian:</strong> <span style={{ color: '#334155', fontWeight: 600 }}>{item.uraianPekerjaan || 'Tanpa Uraian'}</span><br />
                          <strong>Sync terakhir:</strong> <span style={{ color: item.syncedAt ? '#10B981' : '#D97706', fontWeight: 600 }}>{item.syncedAt || 'Belum Sync'}</span><br />
                          <strong style={{ color: '#D97706' }}>ID: {item.id} | Bidang: {item.bidangInput || '-'}</strong>
                        </div>
                      </div>

                      {/* Tombol Aksi Kanan */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {syncMeta.canSync && (
                          <button
                            type="button"
                            onClick={() => handleSyncArsip(item)}
                            disabled={syncingId === item.id}
                            style={{
                              minWidth: '95px',
                              padding: '9px 14px',
                              borderRadius: '8px',
                              border: '1px solid #0F766E',
                              backgroundColor: '#FFFFFF',
                              color: '#0F766E',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: syncingId === item.id ? 'wait' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            {syncingId === item.id ? 'Sync...' : '🔄 Sync'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openPdfPreview({ sppIds: [item.id] })}
                          style={{
                            padding: '9px 14px',
                            borderRadius: '8px',
                            border: '1px solid #00A2E9',
                            backgroundColor: '#EFF6FF',
                            color: '#00A2E9',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Eye size={15} /> Preview
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditArsip(item)}
                          style={{
                            minWidth: '85px',
                            padding: '9px 14px',
                            borderRadius: '8px',
                            border: '1px solid #F59E0B',
                            backgroundColor: '#FFFFFF',
                            color: '#F59E0B',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteArsip(item, item.sppNomor)}
                          style={{
                            minWidth: '95px',
                            padding: '9px 14px',
                            borderRadius: '8px',
                            border: '1px solid #EF4444',
                            backgroundColor: '#FFFFFF',
                            color: '#EF4444',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          🗑️ Hapus
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadArsipPdf(item)}
                          disabled={downloadingId === item.id}
                          style={{
                            minWidth: '145px',
                            padding: '9px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isDownloaded ? '#64748B' : '#00A2E9',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            cursor: downloadingId === item.id ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: isDownloaded ? 'none' : '0 2px 6px rgba(0, 162, 233, 0.25)'
                          }}
                        >
                          {downloadingId === item.id ? 'Mengunduh...' : isDownloaded ? '⬇️ Download Ulang' : '⬇️ Download PDF'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB TAB 4: MANAJEMEN MASTER PERSONIL PEGAWAI (100% Skema dari web-natura/src/app/pegawai/page.tsx) */}
      {/* ========================================================================================= */}
      {subTab === 'pegawai-natura' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Filter Bar & View Toggle */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #CBD5E1',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#334155' }}>Filter Bidang:</span>
              <select
                value={filterPegawaiBidang}
                onChange={(e) => setFilterPegawaiBidang(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.86rem', backgroundColor: '#F8FAFC' }}
              >
                <option value="SEMUA">SEMUA BIDANG ({pegawaiListState.length})</option>
                {ALL_STANDARD_BIDANG.sort().map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Cari nama atau jabatan..."
                  value={searchPegawai}
                  onChange={(e) => setSearchPegawai(e.target.value)}
                  style={{
                    padding: '8px 14px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.86rem',
                    width: '260px',
                    fontWeight: 600
                  }}
                />
              </div>

              {/* View Mode Toggle Switch */}
              <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
                <button
                  type="button"
                  onClick={() => setViewPegawaiMode('tabel')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewPegawaiMode === 'tabel' ? '#FFFFFF' : 'transparent',
                    color: viewPegawaiMode === 'tabel' ? '#0F172A' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: viewPegawaiMode === 'tabel' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  📋 Tabel Lengkap
                </button>
                <button
                  type="button"
                  onClick={() => setViewPegawaiMode('grid')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewPegawaiMode === 'grid' ? '#FFFFFF' : 'transparent',
                    color: viewPegawaiMode === 'grid' ? '#0F172A' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: viewPegawaiMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  🗂️ Kartu Grid
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPegawaiModal(true)}
              style={{
                padding: '11px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
              }}
            >
              <UserPlus size={18} /> Tambah Personil
            </button>
          </div>

          {/* TABEL LENGKAP UNTUK MANAJEMEN MUDAH (100% Sesuai web-natura/src/app/pegawai/page.tsx) */}
          {viewPegawaiMode === 'tabel' ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#00A2E9" />
                Daftar Personil Keseluruhan
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#F8FAFC' }}>
                      <th style={{ width: '60px', textAlign: 'center', padding: '14px', color: '#475569', fontSize: '0.84rem', fontWeight: 800 }}>No</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#475569', fontSize: '0.84rem', fontWeight: 800 }}>Nama Lengkap</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#475569', fontSize: '0.84rem', fontWeight: 800 }}>Bidang</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#475569', fontSize: '0.84rem', fontWeight: 800 }}>Jabatan</th>
                      <th style={{ width: '100px', textAlign: 'center', padding: '14px', color: '#475569', fontSize: '0.84rem', fontWeight: 800 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawaiListState.filter(p => {
                      if (filterPegawaiBidang !== 'SEMUA' && p.bidang !== filterPegawaiBidang) return false;
                      if (searchPegawai && !p.nama.toLowerCase().includes(searchPegawai.toLowerCase()) && !(p.jabatan && p.jabatan.toLowerCase().includes(searchPegawai.toLowerCase()))) return false;
                      return true;
                    }).map((p, idx) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ textAlign: 'center', padding: '14px', color: '#64748B', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 800, padding: '14px', color: '#1E293B' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={getAvatarUrl(p.nama)} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8FAFC', border: '2px solid #E2E8F0' }} />
                            {p.nama}
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ background: '#E0F2FE', border: '1px solid #BAE6FD', padding: '0.35rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, color: '#0369A1', display: 'inline-block' }}>
                            {p.bidang}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: '#334155', fontWeight: 600 }}>{p.jabatan || '-'}</td>
                        <td style={{ textAlign: 'center', padding: '14px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus pegawai ${p.nama}?`)) {
                                setPegawaiListState(prev => prev.filter(item => item.id !== p.id));
                              }
                            }}
                            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444', border: '1px solid #EF4444', backgroundColor: '#FFFFFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid Pegawai */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
              {pegawaiListState.filter(p => {
                if (filterPegawaiBidang !== 'SEMUA' && p.bidang !== filterPegawaiBidang) return false;
                if (searchPegawai && !p.nama.toLowerCase().includes(searchPegawai.toLowerCase()) && !(p.jabatan && p.jabatan.toLowerCase().includes(searchPegawai.toLowerCase()))) return false;
                return true;
              }).map(p => (
                <div key={p.id} style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: p.bidang === 'HARGI' ? '#EFF6FF' : (p.bidang === 'HARPRO' ? '#FEF3C7' : '#ECFDF5'),
                    color: p.bidang === 'HARGI' ? '#00A2E9' : (p.bidang === 'HARPRO' ? '#D97706' : '#10B981'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    {p.nama.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.nama}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                      {p.jabatan}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#00A2E9',
                      backgroundColor: '#F1F5F9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginTop: '6px'
                    }}>
                      {p.bidang}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus pegawai ${p.nama}?`)) {
                        setPegawaiListState(prev => prev.filter(item => item.id !== p.id));
                      }
                    }}
                    title="Hapus Pegawai"
                    style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Pegawai (100% Sesuai skema web-natura/src/app/pegawai/page.tsx) */}
      {showAddPegawaiModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', width: '460px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'fadeIn 0.2s ease-out' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 18px 0' }}>➕ Tambah Personil Baru</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '26px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nama Lengkap *</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap..."
                  value={newPegawaiNama}
                  onChange={(e) => setNewPegawaiNama(e.target.value.toUpperCase())}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Bidang *</label>
                <input
                  type="text"
                  placeholder="Contoh: HARPRO / GI CIKARANG"
                  value={newPegawaiBidang}
                  onChange={(e) => setNewPegawaiBidang(e.target.value.toUpperCase())}
                  list="bidang-options-natura"
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700, boxSizing: 'border-box' }}
                />
                <datalist id="bidang-options-natura">
                  {ALL_STANDARD_BIDANG.sort().map(b => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Jabatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: TEKNISI HARGI / MANAGER"
                  value={newPegawaiJabatan}
                  onChange={(e) => setNewPegawaiJabatan(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAddPegawaiModal(false)}
                style={{ padding: '11px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', color: '#64748B', fontWeight: 800, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newPegawaiNama) return alert('Nama pegawai wajib diisi!');
                  setPegawaiListState(prev => [...prev, {
                    id: Date.now(),
                    nama: newPegawaiNama.trim(),
                    bidang: newPegawaiBidang || 'HARPRO',
                    jabatan: newPegawaiJabatan || `TEKNISI ${newPegawaiBidang || 'HARPRO'}`
                  }]);
                  setNewPegawaiNama('');
                  setNewPegawaiJabatan('');
                  setShowAddPegawaiModal(false);
                }}
                style={{ padding: '11px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
              >
                Simpan Personil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* SUB TAB 5: MATRIKS JADWAL PIKET (100% Skema dari web-natura/src/app/jadwal/page.tsx) */}
      {/* ========================================================================================= */}
      {subTab === 'jadwal-piket-natura' && <JadwalPiketNatura initialGardu="global" />}

      {previewPdfUrl && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            width: 'min(1100px, 96vw)',
            height: 'min(900px, 94vh)',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC'
            }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00A2E9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> Preview PDF Asli Template NATURA
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={previewPdfUrl}
                  download={`Surat_Penugasan_Natura_${new Date().toISOString().slice(0, 10)}.pdf`}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={16} /> Download PDF
                </a>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(previewPdfUrl);
                    setPreviewPdfUrl(null);
                  }}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Tutup
                </button>
              </div>
            </div>
            <iframe
              src={`${previewPdfUrl}#toolbar=1&navpanes=0`}
              title="Preview PDF SPP Natura"
              style={{ width: '100%', flex: 1, border: 'none', backgroundColor: '#E2E8F0' }}
            />
          </div>
        </div>
      )}


      {/* ========================================================================================= */}
      {/* MODAL PREVIEW SURAT TUGAS & SPP NATURA (Tampilan Resmi KOP PT PLN PERSERO UPT BEKASI) */}
      {/* ========================================================================================= */}
      {/* ========================================================================================= */}
      {/* MODAL PREVIEW SURAT TUGAS & SPP NATURA (Tampilan 100% Sesuai Template 3. NATURA HARPRO JUNI.xlsx) */}
      {/* ========================================================================================= */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} className="print-modal-overlay">
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '920px',
            width: '100%',
            maxHeight: '94vh',
            overflowY: 'auto',
            padding: '36px 44px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative'
          }} className="print-modal-content">
            {/* Action Bar Modal (Sembunyi saat Cetak/Print) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px' }} className="print-hide">
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00A2E9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📄 PREVIEW SURAT PENUGASAN PEKERJAAN & KLAIM NATURA (PDF READY)
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' }}
                >
                  <Printer size={16} /> Cetak / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* AREA DOKUMEN SIAP CETAK (100% IDENTIK TEMPLATE RESMI NATURA_ULTG_BEKASI) */}
            <div style={{ fontFamily: '"Arial", "Inter", sans-serif', color: '#000000', lineHeight: 1.4 }} className="printable-page">
              
              {/* KOP Surat Persis Row 1-3 */}
              <div style={{ marginBottom: '18px', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.3px', lineHeight: 1.3 }}>
                <div>PT PLN (PERSERO) UITJBT</div>
                <div>UPT BEKASI</div>
                <div>ULTG  BEKASI</div>
              </div>

              {/* Judul & Nomor Row 5-7 */}
              <div style={{ marginBottom: '16px', fontWeight: 800, fontSize: '1.02rem', lineHeight: 1.4 }}>
                <div style={{ textDecoration: 'underline', marginBottom: '4px', fontSize: '1.08rem' }}>Surat Penugasan Pekerjaan / Klaim Natura</div>
                <div>SPP Nomor : {previewDoc.sppNomor}</div>
                <div>WO Nomor  : {previewDoc.noWo || "-"}</div>
              </div>

              {/* Rincian Penugasan Row 8-14 */}
              <table style={{ width: '100%', marginBottom: '14px', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '200px', fontWeight: 700, padding: '3px 0' }}>1. Jenis Pekerjaan</td>
                    <td style={{ width: '20px', fontWeight: 700 }}>:</td>
                    <td style={{ fontWeight: 800 }}>{previewDoc.jenisPekerjaan}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: '3px 0' }}>2. Uraian Pekerjaan</td>
                    <td style={{ fontWeight: 700 }}>:</td>
                    <td style={{ fontWeight: 800 }}>{previewDoc.uraianPekerjaan}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: '3px 0' }}>3. Lokasi Pekerjaan</td>
                    <td style={{ fontWeight: 700 }}>:</td>
                    <td style={{ fontWeight: 800 }}>{previewDoc.lokasiKerja}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: '3px 0' }}>4. Tanggal dan Jam Pelaks</td>
                    <td style={{ fontWeight: 700 }}>:</td>
                    <td style={{ fontWeight: 800 }}>
                      <span style={{ display: 'inline-block', minWidth: '180px' }}>{previewDoc.tanggal}</span>
                      <span style={{ fontWeight: 700, marginLeft: '24px' }}>Jam : {previewDoc.waktuPelaksana}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: '3px 0' }}>5. Klarifikasi Pekerjaan</td>
                    <td style={{ fontWeight: 700 }}>:</td>
                    <td style={{ fontWeight: 800 }}>{previewDoc.kategori || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: '3px 0' }}>6. SDM Pelaksana</td>
                    <td style={{ fontWeight: 700 }}>:</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              {/* Tabel SDM Pelaksana persis 30+ Slot Baris (Row 15-46+) */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', marginBottom: '14px', fontSize: '0.82rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 800 }}>
                    <th style={{ border: '1px solid #000000', padding: '6px 4px', width: '36px' }}>No</th>
                    <th style={{ border: '1px solid #000000', padding: '6px 8px', textAlign: 'left' }}>Nama</th>
                    <th style={{ border: '1px solid #000000', padding: '6px 4px', width: '130px' }} colSpan={3}>SPPD (Rp)</th>
                    <th style={{ border: '1px solid #000000', padding: '6px 4px', width: '160px' }} colSpan={4}>Natura (Rp)</th>
                    <th style={{ border: '1px solid #000000', padding: '6px 6px', width: '120px' }}>Transport (Rp)</th>
                  </tr>
                  <tr style={{ backgroundColor: '#F1F5F9', fontWeight: 700, fontSize: '0.76rem' }}>
                    <th style={{ border: '1px solid #000000', padding: '3px' }}>1</th>
                    <th style={{ border: '1px solid #000000', padding: '3px' }}>2</th>
                    <th style={{ border: '1px solid #000000', padding: '3px' }} colSpan={3}>3</th>
                    <th style={{ border: '1px solid #000000', padding: '3px' }} colSpan={4}>4</th>
                    <th style={{ border: '1px solid #000000', padding: '3px' }}>5</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.max(30, previewDoc.pegawaiList.length) }).map((_, idx) => {
                    const p = previewDoc.pegawaiList[idx];
                    return (
                      <tr key={idx} style={{ height: '22px' }}>
                        <td style={{ border: '1px solid #000000', padding: '2px 4px', fontWeight: 700 }}>{p ? idx + 1 : ''}</td>
                        <td style={{ border: '1px solid #000000', padding: '2px 8px', textAlign: 'left', fontWeight: 800 }}>{p ? p.nama : ''}</td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }} colSpan={3}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }} colSpan={4}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                      </tr>
                    );
                  })}
                  {/* Baris Jumlah & Total Biaya SDM Row 47-48 */}
                  <tr style={{ fontWeight: 800, backgroundColor: '#F8FAFC' }}>
                    <td style={{ border: '1px solid #000000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000000', padding: '5px', textAlign: 'left' }}>Jumlah</td>
                    <td style={{ border: '1px solid #000000', padding: '5px' }} colSpan={3}></td>
                    <td style={{ border: '1px solid #000000', padding: '5px' }} colSpan={4}></td>
                    <td style={{ border: '1px solid #000000', padding: '5px' }}></td>
                  </tr>
                  <tr style={{ fontWeight: 800, backgroundColor: '#F8FAFC' }}>
                    <td style={{ border: '1px solid #000000', padding: '5px' }}></td>
                    <td style={{ border: '1px solid #000000', padding: '5px', textAlign: 'left' }}>Total Biaya SDM (3+4+5)</td>
                    <td style={{ border: '1px solid #000000', padding: '5px' }} colSpan={3}></td>
                    <td style={{ border: '1px solid #000000', padding: '5px' }} colSpan={4}></td>
                    <td style={{ border: '1px solid #000000', padding: '5px' }}></td>
                  </tr>
                </tbody>
              </table>

              {/* 7. Material & 8. Peralatan & 9. Kendaraan (Row 49-59) */}
              <div style={{ marginBottom: '18px', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 800, marginBottom: '6px' }}>7. Material</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', marginBottom: '12px', textAlign: 'center' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 800 }}>
                      <th style={{ border: '1px solid #000000', padding: '4px', width: '36px' }}>No</th>
                      <th style={{ border: '1px solid #000000', padding: '4px', textAlign: 'left' }}>Uraian</th>
                      <th style={{ border: '1px solid #000000', padding: '4px', width: '60px' }}>Vol</th>
                      <th style={{ border: '1px solid #000000', padding: '4px', width: '70px' }}>Satuan</th>
                      <th style={{ border: '1px solid #000000', padding: '4px', width: '130px' }}>Harga (Rp)</th>
                      <th style={{ border: '1px solid #000000', padding: '4px', width: '140px' }}>Jumlah Harga (Rp)</th>
                      <th style={{ border: '1px solid #000000', padding: '4px' }}>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2].map(num => (
                      <tr key={num} style={{ height: '20px' }}>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}>{num}</td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                        <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 800, backgroundColor: '#F8FAFC' }}>
                      <td style={{ border: '1px solid #000000', padding: '4px' }} colSpan={2}>Jumlah Material</td>
                      <td style={{ border: '1px solid #000000', padding: '4px' }}></td>
                      <td style={{ border: '1px solid #000000', padding: '4px' }}></td>
                      <td style={{ border: '1px solid #000000', padding: '4px' }}></td>
                      <td style={{ border: '1px solid #000000', padding: '4px' }}></td>
                      <td style={{ border: '1px solid #000000', padding: '4px' }}></td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: '4px' }}>8. Peralatan Kerja</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', textAlign: 'center' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 800 }}>
                          <th style={{ border: '1px solid #000000', padding: '4px', width: '36px' }}>No</th>
                          <th style={{ border: '1px solid #000000', padding: '4px', textAlign: 'left' }}>Nama Alat Kerja</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2].map(num => (
                          <tr key={num} style={{ height: '20px' }}>
                            <td style={{ border: '1px solid #000000', padding: '2px' }}>{num}</td>
                            <td style={{ border: '1px solid #000000', padding: '2px' }}></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, marginBottom: '4px' }}>9. Kendaraan</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', fontSize: '0.78rem' }}>
                      <tbody>
                        <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 800 }}>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }} colSpan={2}>A. BBM</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px', width: '50px', textAlign: 'center' }}>Vol</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px', width: '45px', textAlign: 'center' }}>Sat</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px', textAlign: 'right' }}>Harga</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px', width: '20px' }}>1.</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px', textAlign: 'center' }}>ltr</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}></td>
                        </tr>
                        <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 800 }}>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }} colSpan={2}>B. Tol/Parkir/Retribusi</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}></td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}>1.</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px' }}></td>
                          <td style={{ border: '1px solid #000000', padding: '3px 4px', textAlign: 'center' }}>lot</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}></td>
                        </tr>
                        <tr style={{ fontWeight: 800, backgroundColor: '#F8FAFC' }}>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }} colSpan={4}>Jumlah Biaya Kendaraan</td>
                          <td style={{ border: '1px solid #000000', padding: '3px 6px' }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ padding: '8px 12px', border: '2px solid #000000', fontWeight: 800, fontSize: '0.9rem', marginBottom: '22px', backgroundColor: '#F8FAFC' }}>
                  11. Total Biaya (6+7+8+10) : Rp ................................................................
                </div>
              </div>

              {/* Kolom Tanda Tangan Persis Row 60-66 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', fontSize: '0.86rem', marginBottom: '24px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, marginBottom: '2px' }}>Yang Menerima Penugasan</div>
                  <div style={{ fontWeight: 800, marginBottom: '65px' }}>TL HARGI/JAR/PRO / PENGAWAS</div>
                  <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.92rem' }}>
                    {previewDoc.penerimaTugas}
                  </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, marginBottom: '2px' }}>Bekasi, {previewDoc.tanggal}</div>
                  <div style={{ fontWeight: 800, marginBottom: '2px' }}>Pemberi Penugasan</div>
                  <div style={{ fontWeight: 800, marginBottom: '65px' }}>MULTG BEKASI</div>
                  <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.92rem' }}>
                    {previewDoc.namaMultg}
                  </div>
                </div>
              </div>

              {/* Catatan Bawah Persis Row 67-69 */}
              <div style={{ fontSize: '0.82rem', fontWeight: 700, borderTop: '1px solid #CBD5E1', paddingTop: '10px' }}>
                <div>Catatan :</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                  <span style={{ width: '180px' }}>Pekerjaan dilaksanakan tgl</span>
                  <span>: {previewDoc.tanggal}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <span style={{ width: '180px' }}>Progres fisik</span>
                  <span>: ................................................................</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
