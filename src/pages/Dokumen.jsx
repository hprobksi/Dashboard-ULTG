import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Plus, Edit3, Trash2, Zap, Copy, Check, BookOpen, Sparkles, FolderArchive, Layers, Printer, Save, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storage';

export default function Dokumen({ setActiveTab }) {
  const [activeTabMode, setActiveTabMode] = useState('generator'); // 'generator' | 'arsip'
  
  // State untuk Arsip Manual (Fitur lama tetap terjaga)
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'BA Standarisasi', templateContent: '' });

  // State untuk Generator BA Resmi PLN (Modul 1: BA Aktivasi Tripping 1 dan 2)
  const [activeModule, setActiveModule] = useState('tripping_1_2');
  
  // 16 Item Input Default dari File PDF Acuan + Lampiran Foto
  const [baForm, setBaForm] = useState({
    // 1. Identitas & Waktu
    noBA: '005/BAPS/NWTBN/ULTG-BKSI/IV/2026',
    hariTanggal: 'Rabu, 29 April 2026',
    pukul: '14.00 WIB',
    kotaTTD: 'Bekasi, 29 April 2026',

    // 2. Lokasi & Objek Proteksi
    gi: 'GIS 150 kV NEW TAMBUN',
    bay: 'Bay Jatiwaringin #1',
    peralatan: 'Relay Line Differential Merk Siemens 7SL87',

    // 3. Tim Pelaksana & Penanggung Jawab
    pelaksana: [
      'Rizky Wira H',
      'Edwar Dendy V.',
      'Riki H'
    ],
    jabatanKiri: 'TL JarGIS New Tambun',
    namaKiri: 'M. JAENAL M.',
    jabatanKanan: 'TL HarProMet & Otomasi',
    namaKanan: 'ERVAN JAGI M. W.',

    // 4. Rincian Teknis & Hasil (Halaman 2)
    langkah: [
      'Melakukan scanning wiring tripping',
      'Melakukan pengaturan logic PSL untuk menambahkan tripping 2',
      'Melakukan penambahan hard wiring ke tripping 2',
      'Melakukan uji fungsi'
    ],
    anomali: 'Nihil',
    perbaikan: 'Nihil',
    tertunda: 'Nihil',
    kesimpulan: 'Telah dilakukan pekerjaan Aktivasi Tripping 1 dan 2 Relay Differential Bay Jatiwaringin #1 GIS New Tambun untuk menambah keandalan sistem proteksi sesuai dengan rekomendasi dengan hasil uji baik.',
    statusPernyataan: 'TELAH SELESAI DILAKSANAKAN',

    // 5. Lampiran Foto Dokumentasi (Halaman 3+)
    lampiran: [
      {
        id: 1,
        judul: 'Desain tripping 1 dari BO rele MPU',
        fotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        judul: 'Penambahan desain tripping 2 dari BO Rele MPU',
        fotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
      }
    ]
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [dbSubstations, setDbSubstations] = useState([]);
  const [dbRelays, setDbRelays] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const IGNORED_BAYS = ['SPAN', 'TOWER', 'GEDUNG', 'GANTRY', 'SERANDANG', 'JOIN SKTT', 'JOINT SKTT'];
  const filterAndCleanData = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter(item => {
      if (!item) return false;
      if (item.bay && item.bay !== '-') {
        const upperBay = String(item.bay).toUpperCase();
        if (IGNORED_BAYS.some(kw => upperBay.includes(kw))) return false;
      }
      const s = String(item.sheet || '').toUpperCase();
      const g = String(item.gi || '').toUpperCase();
      if (s === 'GI TAMBUN') {
        if (g.includes('GIS') || g.includes('GISTET') || g.includes('NEW TAMBUN') || g.includes('500KV')) return false;
      }
      if (s === 'GIS NEW TAMBUN') {
        if (!g.includes('GIS') || g.includes('GISTET') || g.includes('500KV')) return false;
      }
      if (s === 'GISTET NEW TAMBUN') {
        if (!g.includes('GISTET') && !g.includes('500KV')) return false;
      }
      return true;
    });
  };

  const loadData = async () => {
    try {
      const docs = await storageService.get('documents');
      if (docs && Array.isArray(docs)) {
        setDocuments(docs);
      } else {
        setDocuments([]);
      }

      const subs = await storageService.get('substations');
      if (subs && Array.isArray(subs)) setDbSubstations(subs);

      // Load Master Data Peralatan Relay (persis seperti menu Peralatan Relay)
      let masterRelays = await storageService.get('master_peralatan_ultg_bekasi');
      if (!masterRelays || !Array.isArray(masterRelays) || masterRelays.length === 0) {
        try {
          const res = await fetch('/data/peralatan_ultg_bekasi.json');
          if (res.ok) {
            const json = await res.json();
            masterRelays = json;
            await storageService.set('master_peralatan_ultg_bekasi', json);
          }
        } catch (e) {
          console.error('Fetch json error in Dokumen:', e);
        }
      }
      if (!masterRelays || !Array.isArray(masterRelays) || masterRelays.length === 0) {
        masterRelays = await storageService.get('relays') || [];
      }
      setDbRelays(filterAndCleanData(masterRelays));

      const savedBa = await storageService.get('saved_ba_tripping_form');
      if (savedBa && typeof savedBa === 'object') {
        setBaForm(prev => ({
          ...prev,
          ...savedBa,
          pelaksana: Array.isArray(savedBa.pelaksana) && savedBa.pelaksana.length > 0 ? savedBa.pelaksana : prev.pelaksana,
          langkah: Array.isArray(savedBa.langkah) && savedBa.langkah.length > 0 ? savedBa.langkah : prev.langkah,
          lampiran: Array.isArray(savedBa.lampiran) ? savedBa.lampiran : prev.lampiran
        }));
      }
    } catch (err) {
      console.error('Error loading data in Dokumen:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save BA Form ke Storage
  const handleSaveBaForm = async () => {
    await storageService.set('saved_ba_tripping_form', baForm);
    showToast('✅ Form Berita Acara berhasil disimpan ke memori lokal!');
  };

  // Reset BA Form ke Default PDF
  const handleResetBaForm = () => {
    if (!window.confirm('Kembalikan seluruh isi form ke data contoh standar (PDF Jatiwaringin)?')) return;
    const defaultData = {
      noBA: '005/BAPS/NWTBN/ULTG-BKSI/IV/2026',
      hariTanggal: 'Rabu, 29 April 2026',
      pukul: '14.00 WIB',
      kotaTTD: 'Bekasi, 29 April 2026',
      gi: 'GIS 150 kV NEW TAMBUN',
      bay: 'Bay Jatiwaringin #1',
      peralatan: 'Relay Line Differential Merk Siemens 7SL87',
      pelaksana: ['Rizky Wira H', 'Edwar Dendy V.', 'Riki H'],
      jabatanKiri: 'TL JarGIS New Tambun',
      namaKiri: 'M. JAENAL M.',
      jabatanKanan: 'TL HarProMet & Otomasi',
      namaKanan: 'ERVAN JAGI M. W.',
      langkah: [
        'Melakukan scanning wiring tripping',
        'Melakukan pengaturan logic PSL untuk menambahkan tripping 2',
        'Melakukan penambahan hard wiring ke tripping 2',
        'Melakukan uji fungsi'
      ],
      anomali: 'Nihil',
      perbaikan: 'Nihil',
      tertunda: 'Nihil',
      kesimpulan: 'Telah dilakukan pekerjaan Aktivasi Tripping 1 dan 2 Relay Differential Bay Jatiwaringin #1 GIS New Tambun untuk menambah keandalan sistem proteksi sesuai dengan rekomendasi dengan hasil uji baik.',
      statusPernyataan: 'TELAH SELESAI DILAKSANAKAN',
      lampiran: [
        {
          id: 1,
          judul: 'Desain tripping 1 dari BO rele MPU',
          fotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 2,
          judul: 'Penambahan desain tripping 2 dari BO Rele MPU',
          fotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
        }
      ]
    };
    setBaForm(defaultData);
    showToast('🔄 Form dikembalikan ke data default!');
  };

  // Auto-generate Kesimpulan
  const handleAutoKesimpulan = () => {
    const bayName = baForm?.bay || 'Bay Jatiwaringin #1';
    const giName = baForm?.gi || 'GIS 150 kV NEW TAMBUN';
    const autoText = `Telah dilakukan pekerjaan Aktivasi Tripping 1 dan 2 Relay Differential ${bayName} ${giName} untuk menambah keandalan sistem proteksi sesuai dengan rekomendasi dengan hasil uji baik.`;
    setBaForm(prev => ({ ...prev, kesimpulan: autoText }));
    showToast('✨ Kesimpulan otomatis diperbarui sesuai nama Bay & GI!');
  };

  // Handler Pelaksana List
  const handleAddPelaksana = () => {
    const currentList = Array.isArray(baForm?.pelaksana) ? baForm.pelaksana : [];
    setBaForm(prev => ({ ...prev, pelaksana: [...currentList, 'Teknisi Baru'] }));
  };
  const handleRemovePelaksana = (idx) => {
    const currentList = Array.isArray(baForm?.pelaksana) ? baForm.pelaksana : [];
    setBaForm(prev => ({ ...prev, pelaksana: currentList.filter((_, i) => i !== idx) }));
  };
  const handleChangePelaksana = (idx, val) => {
    const currentList = Array.isArray(baForm?.pelaksana) ? [...baForm.pelaksana] : [];
    currentList[idx] = val;
    setBaForm(prev => ({ ...prev, pelaksana: currentList }));
  };

  // Handler Langkah Kegiatan List
  const handleAddLangkah = () => {
    const currentList = Array.isArray(baForm?.langkah) ? baForm.langkah : [];
    setBaForm(prev => ({ ...prev, langkah: [...currentList, 'Langkah pemeriksaan baru...'] }));
  };
  const handleRemoveLangkah = (idx) => {
    const currentList = Array.isArray(baForm?.langkah) ? baForm.langkah : [];
    setBaForm(prev => ({ ...prev, langkah: currentList.filter((_, i) => i !== idx) }));
  };
  const handleChangeLangkah = (idx, val) => {
    const currentList = Array.isArray(baForm?.langkah) ? [...baForm.langkah] : [];
    currentList[idx] = val;
    setBaForm(prev => ({ ...prev, langkah: currentList }));
  };

  // Handler Lampiran Foto
  const handleAddLampiran = () => {
    const currentList = Array.isArray(baForm?.lampiran) ? baForm.lampiran : [];
    setBaForm(prev => ({
      ...prev,
      lampiran: [
        ...currentList,
        { id: Date.now(), judul: `Foto Dokumentasi Kegiatan ${currentList.length + 1}`, fotoUrl: '' }
      ]
    }));
  };
  const handleRemoveLampiran = (idx) => {
    const currentList = Array.isArray(baForm?.lampiran) ? baForm.lampiran : [];
    setBaForm(prev => ({ ...prev, lampiran: currentList.filter((_, i) => i !== idx) }));
  };
  const handleChangeLampiranJudul = (idx, val) => {
    const currentList = Array.isArray(baForm?.lampiran) ? [...baForm.lampiran] : [];
    currentList[idx] = { ...currentList[idx], judul: val };
    setBaForm(prev => ({ ...prev, lampiran: currentList }));
  };
  const handleFileUpload = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const currentList = Array.isArray(baForm?.lampiran) ? [...baForm.lampiran] : [];
      currentList[idx] = { ...currentList[idx], fotoUrl: reader.result };
      setBaForm(prev => ({ ...prev, lampiran: currentList }));
      showToast('📸 Foto berhasil diunggah ke lampiran!');
    };
    reader.readAsDataURL(file);
  };

  // Cetak Dokumen via window.print()
  const handlePrintPDF = () => {
    showToast('🖨️ Membuka jendela cetak / simpan PDF browser...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // --- CRUD ARSIP MANUAL FUNCTIONS ---
  const handleSaveDoc = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.templateContent) return;
    let updated;
    const currentDocs = Array.isArray(documents) ? documents : [];
    if (activeDoc) {
      updated = currentDocs.map(d => d.id === activeDoc.id ? { ...d, ...formData, updatedAt: new Date().toISOString().split('T')[0] } : d);
    } else {
      const newDoc = { ...formData, id: 'doc-' + Date.now(), updatedAt: new Date().toISOString().split('T')[0] };
      updated = [newDoc, ...currentDocs];
    }
    await storageService.set('documents', updated);
    setDocuments(updated);
    setIsModalOpen(false);
    setActiveDoc(null);
    setFormData({ title: '', category: 'BA Standarisasi', templateContent: '' });
  };

  const openEdit = (doc) => {
    setActiveDoc(doc);
    setFormData({ title: doc.title, category: doc.category, templateContent: doc.templateContent });
    setIsModalOpen(true);
  };

  const deleteDoc = async (id) => {
    if (!window.confirm('Hapus template dokumen baku ini?')) return;
    const currentDocs = Array.isArray(documents) ? documents : [];
    const updated = currentDocs.filter(d => d.id !== id);
    await storageService.set('documents', updated);
    setDocuments(updated);
  };

  const copyContent = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['ALL', 'BA Standarisasi', 'BA Tripping', 'Instruksi Kerja (IK)'];
  const safeDocs = Array.isArray(documents) ? documents : [];
  const filteredDocs = selectedCategory === 'ALL' ? safeDocs : safeDocs.filter(d => d.category === selectedCategory);

  // Safe fallback values untuk rendering
  const pelaksanaList = Array.isArray(baForm?.pelaksana) && baForm.pelaksana.length > 0 ? baForm.pelaksana : ['Rizky Wira H', 'Edwar Dendy V.', 'Riki H'];
  const langkahList = Array.isArray(baForm?.langkah) && baForm.langkah.length > 0 ? baForm.langkah : ['Melakukan scanning wiring tripping', 'Melakukan pengaturan logic PSL untuk menambahkan tripping 2', 'Melakukan penambahan hard wiring ke tripping 2', 'Melakukan uji fungsi'];
  const lampiranList = Array.isArray(baForm?.lampiran) ? baForm.lampiran : [];
  const hariTanggalStr = baForm?.hariTanggal || 'Rabu, 29 April 2026';
  const bayStr = baForm?.bay || 'Bay Jatiwaringin #1';
  const giStr = baForm?.gi || 'GIS 150 kV NEW TAMBUN';
  const noBAStr = baForm?.noBA || '005/BAPS/NWTBN/ULTG-BKSI/IV/2026';
  const pukulStr = baForm?.pukul || '14.00 WIB';
  const kotaTTDStr = baForm?.kotaTTD || 'Bekasi, 29 April 2026';
  const peralatanStr = baForm?.peralatan || 'Relay Line Differential Merk Siemens 7SL87';
  const jabatanKiriStr = baForm?.jabatanKiri || 'TL JarGIS New Tambun';
  const namaKiriStr = baForm?.namaKiri || 'M. JAENAL M.';
  const jabatanKananStr = baForm?.jabatanKanan || 'TL HarProMet & Otomasi';
  const namaKananStr = baForm?.namaKanan || 'ERVAN JAGI M. W.';
  const kesimpulanStr = baForm?.kesimpulan || 'Telah dilakukan pekerjaan Aktivasi Tripping 1 dan 2 Relay Differential Bay Jatiwaringin #1 GIS New Tambun untuk menambah keandalan sistem proteksi sesuai dengan rekomendasi dengan hasil uji baik.';
  const statusPernyataanStr = baForm?.statusPernyataan || 'TELAH SELESAI DILAKSANAKAN';

  // Perhitungan Halaman Lampiran (2 Foto per Halaman A4 agar persis seperti PDF)
  const lampiranPagesCount = Math.ceil(lampiranList.length / 2);
  const totalPages = 2 + (lampiranList.length > 0 ? lampiranPagesCount : 0);

  // Helper format tanggal dari YYYY-MM-DD ke format Indonesia baku
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    if (!dateVal) return;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const formatted = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      const kotaOnly = kotaTTDStr.split(',')[0] || 'Bekasi';
      setBaForm(prev => ({
        ...prev,
        hariTanggal: formatted,
        kotaTTD: `${kotaOnly}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
      }));
      showToast('📅 Tanggal & Kota TTD otomatis diperbarui!');
    }
  };

  // Helper ekstrak nama singkat GI (misal 'GI 150kV Tambun' -> 'Tambun')
  const getShortGiName = (name) => {
    if (!name) return 'Bekasi';
    return name
      .replace(/GISTET\s*[0-9]+\s*kV\s*/i, '')
      .replace(/GIS\s*[0-9]+\s*kV\s*/i, '')
      .replace(/GI\s*[0-9]+\s*kV\s*/i, '')
      .replace(/GISTET\s*/i, '')
      .replace(/GIS\s*/i, '')
      .replace(/GI\s*/i, '')
      .trim();
  };

  // Opsi Dropdown GI dari Database Peralatan Relay (STRICTLY ONLY dari Peralatan Relay!)
  const giOptions = useMemo(() => {
    const uniqueGis = new Set();
    dbRelays.forEach(r => {
      const gName = r.sheet || r.gi || r.substation;
      if (gName && gName !== '-') uniqueGis.add(gName);
    });
    const list = Array.from(uniqueGis).sort();
    return list.length > 0 ? list : ['GIS 150 kV NEW TAMBUN', 'GI 150 kV TAMBUN'];
  }, [dbRelays]);

  // Filter relays khusus milik GI yang sedang dipilih
  const filteredRelays = useMemo(() => {
    return dbRelays.filter(r => {
      const gName = String(r.sheet || r.gi || r.substation || '').toLowerCase();
      const targetGi = String(giStr || '').toLowerCase();
      return gName === targetGi || gName.includes(targetGi) || targetGi.includes(gName);
    });
  }, [dbRelays, giStr]);

  // Daftar Bay HANYA milik GI yang dipilih
  const bayOptions = useMemo(() => {
    const uniqueBays = new Set();
    filteredRelays.forEach(r => {
      if (r.bay && r.bay !== '-') uniqueBays.add(r.bay);
    });
    const list = Array.from(uniqueBays).sort();
    return list.length > 0 ? list : ['Bay Jatiwaringin #1', 'Trafo Daya 1', 'Trafo Daya 2'];
  }, [filteredRelays]);

  // Daftar Peralatan HANYA milik GI / Bay yang dipilih
  const peralatanOptions = useMemo(() => {
    const uniquePst = new Set();
    filteredRelays.forEach(r => {
      const merk = r.merk || r.brand || '';
      const tipe = r.type || '';
      const pst = r.pst || (tipe.toLowerCase().includes('dif') ? 'Relay Line Differential' : tipe.toLowerCase().includes('dis') ? 'Relay Distance' : 'Relay Proteksi');
      const formatted = `${pst} Merk ${merk} ${tipe}`.trim();
      if (formatted && formatted !== 'Relay Proteksi Merk') uniquePst.add(formatted);
    });
    const list = Array.from(uniquePst).sort();
    return list.length > 0 ? list : ['Relay Line Differential Merk Siemens 7SL87', 'Relay Differential Merk SIEMENS 7UT613'];
  }, [filteredRelays]);

  // Handler perubahan GI -> Otomatis menyesuaikan Bay dan Peralatan Terpasang HANYA dari database relay GI tersebut!
  const handleGiChange = (e) => {
    const selectedGi = e.target.value;
    const shortName = getShortGiName(selectedGi);
    
    // Cari relays untuk GI yang dipilih
    const matchingRelays = dbRelays.filter(r => {
      const gName = String(r.sheet || r.gi || r.substation || '').toLowerCase();
      const targetGi = String(selectedGi).toLowerCase();
      return gName === targetGi || gName.includes(targetGi) || targetGi.includes(gName);
    });

    let newBay = bayStr;
    let newPeralatan = peralatanStr;

    if (matchingRelays.length > 0) {
      const firstRelay = matchingRelays[0];
      newBay = firstRelay.bay || newBay;
      const merk = firstRelay.merk || firstRelay.brand || '';
      const tipe = firstRelay.type || '';
      const pst = firstRelay.pst || (tipe.toLowerCase().includes('dif') ? 'Relay Line Differential' : tipe.toLowerCase().includes('dis') ? 'Relay Distance' : 'Relay Proteksi');
      newPeralatan = `${pst} Merk ${merk} ${tipe}`.trim();
    }

    setBaForm(prev => ({
      ...prev,
      gi: selectedGi,
      jabatanKiri: `TL JarGIS ${shortName}`,
      bay: newBay,
      peralatan: newPeralatan
    }));
    showToast(`🏢 GI ${selectedGi} dipilih! Bay & Peralatan otomatis menyesuaikan ke database Peralatan Relay.`);
  };

  // Handler pemilihan Bay dari database
  const handleBaySelect = (e) => {
    const selectedBayName = e.target.value;
    if (!selectedBayName) return;
    
    const foundRelay = filteredRelays.find(r => 
      String(r.bay || '').toLowerCase() === selectedBayName.toLowerCase()
    ) || dbRelays.find(r => String(r.bay || '').toLowerCase() === selectedBayName.toLowerCase());

    let newPeralatan = peralatanStr;
    if (foundRelay) {
      const merk = foundRelay.merk || foundRelay.brand || '';
      const tipe = foundRelay.type || '';
      const pst = foundRelay.pst || (tipe.toLowerCase().includes('dif') ? 'Relay Line Differential' : tipe.toLowerCase().includes('dis') ? 'Relay Distance' : 'Relay Proteksi');
      newPeralatan = `${pst} Merk ${merk} ${tipe}`.trim();
    }

    setBaForm(prev => ({
      ...prev,
      bay: selectedBayName,
      peralatan: newPeralatan
    }));
    showToast('⚡ Bay & Peralatan Terpasang otomatis disesuaikan dari database!');
  };

  // Helper untuk memecah array lampiran menjadi per 2 foto per halaman
  const getLampiranPageChunks = () => {
    const chunks = [];
    for (let i = 0; i < lampiranList.length; i += 2) {
      chunks.push(lampiranList.slice(i, i + 2));
    }
    return chunks;
  };

  // Helper Render Tabel Kop ISO PLN Level 5 (100% Persis 5 Kolom PDF Asli)
  const renderIsoHeader = (pageNum) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', marginBottom: '24px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10pt', color: '#000000', backgroundColor: '#FFFFFF' }}>
      <tbody>
        <tr>
          <td rowSpan={2} style={{ border: '1px solid #000000', textAlign: 'center', width: '15%', padding: '6px 4px', verticalAlign: 'middle', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '16pt', fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif', letterSpacing: '0.02em', color: '#000000', marginBottom: '2px' }}>LEVEL</div>
            <div style={{ fontSize: '22pt', fontWeight: 'normal', fontFamily: 'Arial, Helvetica, sans-serif', color: '#000000', lineHeight: 1 }}>5</div>
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', width: '22%', verticalAlign: 'middle', lineHeight: 1.25 }}>
            No. Informasi<br />Terdokumentasi
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', width: '28%', verticalAlign: 'middle' }}>
            0003.DOK/BA/HAR/UITJBT/2024
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', width: '16%', verticalAlign: 'middle', lineHeight: 1.25 }}>
            Berlaku<br />Efektif
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', width: '19%', verticalAlign: 'middle' }}>
            05 Maret 2024
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', verticalAlign: 'middle' }}>
            Status
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', verticalAlign: 'middle' }}>
            Edisi : 01 / Revisi : 00
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', verticalAlign: 'middle' }}>
            Halaman
          </td>
          <td style={{ border: '1px solid #000000', padding: '5px 8px', verticalAlign: 'middle' }}>
            {pageNum} dari {totalPages}
          </td>
        </tr>
        <tr>
          <td colSpan={5} style={{ border: '1px solid #000000', textAlign: 'center', fontWeight: 'bold', padding: '6px 10px', fontSize: '10.5pt', letterSpacing: '0.02em', backgroundColor: '#FFFFFF' }}>
            BERITA ACARA PEMELIHARAAN ALAT UJI / ALAT KERJA<br />
            PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: '24px 28px', backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 71px)', color: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0F172A', color: '#FFFFFF',
          padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, fontSize: '0.88rem', fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & TAB SWITCHER (No Print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFFFFF', borderRadius: '14px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}>
            <FileText size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <h1 style={{ fontSize: '2.15rem', fontWeight: 900, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Laporan & Dokumen Harpro
              </h1>
              <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', border: '1px solid #BBF7D0' }}>
                100% ISO PLN STANDAR
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#E2E8F0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          <button
            onClick={() => setActiveTabMode('generator')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTabMode === 'generator' ? '#0284C7' : 'transparent',
              color: activeTabMode === 'generator' ? '#FFFFFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTabMode === 'generator' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={16} /> Generator BA Resmi (100% PLN)
          </button>
          <button
            onClick={() => setActiveTabMode('arsip')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTabMode === 'arsip' ? '#0F172A' : 'transparent',
              color: activeTabMode === 'arsip' ? '#FFFFFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTabMode === 'arsip' ? '0 2px 8px rgba(15, 23, 42, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <FolderArchive size={16} /> Arsip Template Manual
          </button>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* MODE 1: GENERATOR BERITA ACARA INTERAKTIF & CETAK PDF (FOKUS TRIPPING 1 DAN 2) */}
      {/* ========================================================================================= */}
      {activeTabMode === 'generator' && (
        <div>
          {/* Module Selector Bar (No Print) */}
          <div className="no-print" style={{ display: 'flex', gap: '12px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveModule('tripping_1_2')}
              style={{
                padding: '12px 20px',
                backgroundColor: activeModule === 'tripping_1_2' ? '#FFFFFF' : '#F1F5F9',
                border: '2px solid',
                borderColor: activeModule === 'tripping_1_2' ? '#0284C7' : '#E2E8F0',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: activeModule === 'tripping_1_2' ? '0 4px 15px rgba(2, 132, 199, 0.15)' : 'none',
                textAlign: 'left',
                minWidth: '280px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>BA Aktivasi Tripping 1 & 2</span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>FAVORIT</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '2px' }}>Relay Line Differential Bay GI/GIS</span>
              </div>
            </button>

            {/* Placeholder untuk judul BA lainnya nantinya */}
            <div style={{
              padding: '12px 20px',
              backgroundColor: '#F8FAFC',
              border: '2px dashed #CBD5E1',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              opacity: 0.7,
              minWidth: '280px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Judul BA Lainnya...</span>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>BA Pengujian, BA Penggantian, dll.</span>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN SPLIT LAYOUT: FORM INPUT (KIRI) vs LIVE PREVIEW (KANAN) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) minmax(680px, 1.4fr)', gap: '24px', alignItems: 'start' }}>
            
            {/* KOLOM KIRI: FORM INPUT 16 ITEM + LAMPIRAN (No Print) */}
            <div className="no-print" style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #CBD5E1', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '2px solid #F1F5F9', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={20} style={{ color: '#0284C7' }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Form Input Data Berita Acara</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleResetBaForm} style={{ padding: '6px 10px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} title="Reset ke default">
                    <RefreshCw size={13} /> Reset
                  </button>
                  <button onClick={handleSaveBaForm} style={{ padding: '6px 12px', backgroundColor: '#0284C7', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Save size={13} /> Simpan Form
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', paddingRight: '6px' }}>
                
                {/* SECTION 1: IDENTITAS & WAKTU */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
                    Identitas Dokumen & Waktu Pelaksanaan
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>No. Berita Acara *</label>
                      <input type="text" value={noBAStr} onChange={e => setBaForm({...baForm, noBA: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Hari & Tanggal (Pilih Kalender / Edit Teks) *</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="date"
                          onChange={handleDateChange}
                          style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 700, color: '#0284C7', cursor: 'pointer', backgroundColor: '#F0F9FF' }}
                          title="Pilih tanggal dari kalender"
                        />
                        <input type="text" value={hariTanggalStr} onChange={e => setBaForm({...baForm, hariTanggal: e.target.value})} placeholder="Misal: Rabu, 29 April 2026" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Pukul / Waktu *</label>
                      <input type="text" value={pukulStr} onChange={e => setBaForm({...baForm, pukul: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tempat & Tanggal TTD *</label>
                      <input type="text" value={kotaTTDStr} onChange={e => setBaForm({...baForm, kotaTTD: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: LOKASI & OBJEK PROTEKSI */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                    Lokasi & Objek Peralatan Proteksi
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Gardu Induk (GI / GIS / GISTET) *</label>
                      <select value={giStr} onChange={handleGiChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
                        {giOptions.map((g, idx) => (
                          <option key={idx} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Nama Bay / Line (Pilih DB / Edit Bebas) *</label>
                        <select onChange={handleBaySelect} value="" style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #0284C7', fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#E0F2FE', cursor: 'pointer' }}>
                          <option value="">⚡ Pilih dari DB Relay...</option>
                          {bayOptions.map((b, idx) => (
                            <option key={idx} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <input type="text" value={bayStr} onChange={e => setBaForm({...baForm, bay: e.target.value})} placeholder="Ketik atau pilih dari database di atas..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Peralatan Terpasang (Pilih DB / Edit Bebas) *</label>
                        <select onChange={e => { if (e.target.value) setBaForm({...baForm, peralatan: e.target.value}); }} value="" style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #0284C7', fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#E0F2FE', cursor: 'pointer' }}>
                          <option value="">⚡ Pilih Template Peralatan...</option>
                          {peralatanOptions.map((p, idx) => (
                            <option key={idx} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <input type="text" value={peralatanStr} onChange={e => setBaForm({...baForm, peralatan: e.target.value})} placeholder="Ketik atau pilih peralatan dari database di atas..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: TIM PELAKSANA & TTD */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>3</span>
                      Tim Pelaksana & Penanggung Jawab
                    </h4>
                    <button type="button" onClick={handleAddPelaksana} style={{ padding: '4px 8px', backgroundColor: '#E0F2FE', color: '#0284C7', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Plus size={12} /> Tambah Teknisi
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Daftar Nama Pelaksana:</label>
                    {pelaksanaList.map((name, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', width: '20px' }}>{idx + 1}.</span>
                        <input type="text" value={name} onChange={e => handleChangePelaksana(idx, e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 600 }} />
                        {pelaksanaList.length > 1 && (
                          <button type="button" onClick={() => handleRemovePelaksana(idx)} style={{ padding: '6px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px dashed #CBD5E1', paddingTop: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', marginBottom: '4px' }}>Mengetahui Kiri (Jargis/Aset)</label>
                      <input type="text" placeholder="Jabatan" value={jabatanKiriStr} onChange={e => setBaForm({...baForm, jabatanKiri: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', boxSizing: 'border-box' }} />
                      <input type="text" placeholder="Nama Lengkap" value={namaKiriStr} onChange={e => setBaForm({...baForm, namaKiri: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 800, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#16A34A', marginBottom: '4px' }}>Mengetahui Kanan (HarProMet)</label>
                      <input type="text" placeholder="Jabatan" value={jabatanKananStr} onChange={e => setBaForm({...baForm, jabatanKanan: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', boxSizing: 'border-box' }} />
                      <input type="text" placeholder="Nama Lengkap" value={namaKananStr} onChange={e => setBaForm({...baForm, namaKanan: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 800, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: RINCIAN TEKNIS & HASIL */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>4</span>
                      Rincian Teknis & Hasil (Halaman 2)
                    </h4>
                    <button type="button" onClick={handleAddLangkah} style={{ padding: '4px 8px', backgroundColor: '#E0F2FE', color: '#0284C7', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Plus size={12} /> Tambah Langkah
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Langkah Kegiatan:</label>
                    {langkahList.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', width: '20px' }}>{idx + 1}.</span>
                        <input type="text" value={step} onChange={e => handleChangeLangkah(idx, e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 600 }} />
                        {langkahList.length > 1 && (
                          <button type="button" onClick={() => handleRemoveLangkah(idx)} style={{ padding: '6px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Anomali</label>
                      <input type="text" value={baForm?.anomali || 'Nihil'} onChange={e => setBaForm({...baForm, anomali: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Langkah Perbaikan</label>
                      <input type="text" value={baForm?.perbaikan || 'Nihil'} onChange={e => setBaForm({...baForm, perbaikan: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Pekerjaan Tertunda</label>
                      <input type="text" value={baForm?.tertunda || 'Nihil'} onChange={e => setBaForm({...baForm, tertunda: e.target.value})} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 600, boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Kesimpulan dan Saran Kegiatan</label>
                      <button type="button" onClick={handleAutoKesimpulan} style={{ padding: '2px 8px', backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={11} /> Auto-Generate
                      </button>
                    </div>
                    <textarea value={kesimpulanStr} onChange={e => setBaForm({...baForm, kesimpulan: e.target.value})} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.4, boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Status Pernyataan Akhir *</label>
                    <input type="text" value={statusPernyataanStr} onChange={e => setBaForm({...baForm, statusPernyataan: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '2px solid #0284C7', fontSize: '0.88rem', fontWeight: 800, color: '#0284C7', textAlign: 'center', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* SECTION 5: LAMPIRAN FOTO DOKUMENTASI */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>5</span>
                      Lampiran Foto Dokumentasi Kegiatan
                    </h4>
                    <button type="button" onClick={handleAddLampiran} style={{ padding: '4px 8px', backgroundColor: '#E0F2FE', color: '#0284C7', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Plus size={12} /> Tambah Foto
                    </button>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 12px 0' }}>
                    Unggah foto dokumentasi dari PC/HP Anda. Foto otomatis ditata presisi <strong>2 Foto per Halaman A4</strong> persis struktur laporan asli PLN!
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {lampiranList.map((item, idx) => (
                      <div key={item.id || idx} style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284C7' }}>Foto Lampiran #{idx + 1}</span>
                          <button type="button" onClick={() => handleRemoveLampiran(idx)} style={{ padding: '4px 8px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Judul / Keterangan Foto:</label>
                          <input type="text" value={item.judul || ''} onChange={e => handleChangeLampiranJudul(idx, e.target.value)} placeholder="Misal: Desain tripping 1 dari BO rele MPU..." style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', fontWeight: 600, boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '180px' }}>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Unggah dari PC / HP:</label>
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(idx, e)} style={{ fontSize: '0.75rem', width: '100%' }} />
                          </div>
                          {item.fotoUrl && (
                            <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #CBD5E1', flexShrink: 0 }}>
                              <img src={item.fotoUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {lampiranList.length === 0 && (
                      <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#F1F5F9', borderRadius: '8px', color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>
                        Belum ada foto lampiran. Klik "+ Tambah Foto" di atas.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* KOLOM KANAN: LIVE DOCUMENT PREVIEW (100% IDENTIK DIMENSI & FORMAT PDF PLN) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', color: '#FFFFFF', padding: '14px 20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(15, 23, 42, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#38BDF8', color: '#0F172A', fontSize: '0.72rem', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
                    PREVIEW A4 PRESISI
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>Berita Acara Aktivasi Tripping 1 & 2</span>
                </div>
                <button
                  onClick={handlePrintPDF}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Printer size={16} /> Cetak / Simpan PDF
                </button>
              </div>

              {/* AREA KERTAS DOKUMEN RESMI (ID: print-ba-container) - DIPECAH PER LEMBAR A4 PERSIS */}
              <div id="print-ba-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* ===================================================================================== */}
                {/* HALAMAN 1 (A4 PORTRAIT SHEET - 210mm x 297mm) */}
                {/* ===================================================================================== */}
                <div className="a4-page-sheet">
                  {renderIsoHeader(1)}

                  {/* JUDUL BERITA ACARA */}
                  <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13pt', letterSpacing: '0.02em', marginBottom: '2px' }}>BERITA ACARA PEKERJAAN</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11.5pt', textDecoration: 'underline', marginBottom: '20px' }}>
                      No. : {noBAStr}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '13pt', marginBottom: '3px' }}>AKTIVASI TRIPPING 1 DAN 2</div>
                    <div style={{ fontWeight: 'bold', fontSize: '13pt', marginBottom: '3px' }}>RELAY LINE DIFFERENTIAL {bayStr.toUpperCase()}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '13pt' }}>{giStr.toUpperCase()}</div>
                  </div>

                  {/* PARAGRAF NARASI HUKUM */}
                  <p style={{ textAlign: 'justify', textIndent: '45px', margin: '0 0 18px 0', lineHeight: 1.75, fontSize: '11.5pt' }}>
                    Untuk peningkatan kehandalan sistem proteksi, maka pada hari <strong>{hariTanggalStr.split(',')[0] || 'Rabu'}</strong>, tanggal <strong>{hariTanggalStr.split(',')[1] || hariTanggalStr}</strong> pukul <strong>{pukulStr}</strong> PT PLN (Persero) UIT JBT, UPT BEKASI, ULTG BEKASI, Sub-bidang <strong>Pemeliharaan Proteksi, Meter dan Otomasi</strong> telah melaksanakan pekerjaan <strong>Aktivasi Tripping 1 dan 2 Relay Line Differential {bayStr} {giStr}</strong> sesuai dengan rekomendasi dan dinyatakan:
                  </p>

                  {/* STATUS PERNYATAAN */}
                  <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13.5pt', margin: '24px 0', letterSpacing: '0.03em' }}>
                    “{statusPernyataanStr}”
                  </div>

                  {/* KALIMAT PENUTUP & KOTA TTD */}
                  <p style={{ textAlign: 'justify', textIndent: '45px', margin: '0 0 14px 0', fontSize: '11.5pt' }}>
                    Demikian Berita Acara ini dibuat dan ditanda tangani di lokasi pekerjaan dengan sebenar-benarnya.
                  </p>
                  <div style={{ textAlign: 'right', margin: '0 0 24px 0', fontSize: '11.5pt', paddingRight: '15px' }}>
                    {kotaTTDStr}
                  </div>

                  {/* BLOK TANDA TANGAN HALAMAN 1 */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px', paddingRight: '50px' }}>
                    <div style={{ minWidth: '180px', fontSize: '11.5pt' }}>
                      <div style={{ marginBottom: '6px' }}>Pelaksana :</div>
                      {pelaksanaList.map((name, idx) => (
                        <div key={idx} style={{ marginBottom: '4px', display: 'flex' }}>
                          <span style={{ width: '22px' }}>{idx + 1}.</span>
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', fontSize: '11.5pt', marginTop: '10px' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%', verticalAlign: 'top', paddingBottom: '70px' }}>
                          <br />
                          {jabatanKiriStr}
                        </td>
                        <td style={{ width: '50%', verticalAlign: 'top', paddingBottom: '70px' }}>
                          Mengetahui,<br />
                          {jabatanKananStr}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                          ({namaKiriStr})
                        </td>
                        <td style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                          ({namaKananStr})
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* PEMBATAS VISUAL ANTAR HALAMAN (No Print) */}
                <div className="no-print" style={{ width: '100%', margin: '10px 0 25px 0', borderTop: '2px dashed #94A3B8', position: 'relative', textAlign: 'center' }}>
                  <span style={{ backgroundColor: '#E2E8F0', padding: '4px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#475569', borderRadius: '12px', border: '1px solid #CBD5E1', position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                    📄 BATAS HALAMAN 2 (RINCIAN TEKNIS A - F) 📄
                  </span>
                </div>

                {/* ===================================================================================== */}
                {/* HALAMAN 2 (A4 PORTRAIT SHEET - POIN A SAMPAI F) */}
                {/* ===================================================================================== */}
                <div className="a4-page-sheet">
                  {renderIsoHeader(2)}

                  {/* DETAIL TEKNIS POIN A - F */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '11.5pt', lineHeight: 1.6, color: '#000000' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>A. &nbsp;PERALATAN TERPASANG</div>
                      <div style={{ paddingLeft: '24px' }}>
                        1. &nbsp;{peralatanStr}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>B. &nbsp;LANGKAH KEGIATAN</div>
                      <div style={{ paddingLeft: '24px' }}>
                        {langkahList.map((step, idx) => (
                          <div key={idx} style={{ marginBottom: '6px', display: 'flex' }}>
                            <span style={{ width: '22px', flexShrink: 0 }}>{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>C. &nbsp;ANOMALI</div>
                      <div style={{ paddingLeft: '24px' }}>
                        {baForm?.anomali || 'Nihil'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>D. &nbsp;LANGKAH PERBAIKAN</div>
                      <div style={{ paddingLeft: '24px' }}>
                        {baForm?.perbaikan || 'Nihil'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>E. &nbsp;PEKERJAAN TERTUNDA</div>
                      <div style={{ paddingLeft: '24px' }}>
                        {baForm?.tertunda || 'Nihil'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>F. &nbsp;KESIMPULAN DAN SARAN KEGIATAN</div>
                      <div style={{ paddingLeft: '24px', textAlign: 'justify', display: 'flex' }}>
                        <span style={{ width: '22px', flexShrink: 0 }}>1.</span>
                        <span>{kesimpulanStr}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===================================================================================== */}
                {/* HALAMAN 3+ (A4 PORTRAIT SHEETS - LAMPIRAN DOKUMENTASI POIN G) */}
                {/* ===================================================================================== */}
                {getLampiranPageChunks().map((chunk, pageIndex) => {
                  const currentSheetNum = 3 + pageIndex;
                  return (
                    <React.Fragment key={pageIndex}>
                      {/* PEMBATAS VISUAL ANTAR HALAMAN (No Print) */}
                      <div className="no-print" style={{ width: '100%', margin: '10px 0 25px 0', borderTop: '2px dashed #94A3B8', position: 'relative', textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#E2E8F0', padding: '4px 16px', fontSize: '0.75rem', fontWeight: 800, color: '#475569', borderRadius: '12px', border: '1px solid #CBD5E1', position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                          📄 BATAS HALAMAN {currentSheetNum} (LAMPIRAN DOKUMENTASI FOTO) 📄
                        </span>
                      </div>

                      <div className="a4-page-sheet">
                        {renderIsoHeader(currentSheetNum)}

                        {/* POIN G HANYA MUNCUL DI HALAMAN PERTAMA LAMPIRAN (HALAMAN 3) */}
                        {pageIndex === 0 && (
                          <div style={{ fontWeight: 'bold', fontSize: '11.5pt', marginBottom: '16px' }}>
                            G. &nbsp;LAMPIRAN DOKUMENTASI
                          </div>
                        )}

                        {/* GRID FOTO DOKUMENTASI (2 FOTO PER HALAMAN A4 PERSIS STRUKTUR PDF ASLI) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: pageIndex === 0 ? '6px' : '16px' }}>
                          {chunk.map((item, idx) => (
                            <div key={item.id || idx} style={{ textAlign: 'center', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                              <div style={{ width: '100%', height: '260px', border: '1px solid #000000', backgroundColor: '#F8FAFC', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {item.fotoUrl ? (
                                  <img src={item.fotoUrl} alt="Foto Lampiran" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                ) : (
                                  <span style={{ color: '#94A3B8', fontSize: '10pt', fontStyle: 'italic' }}>[ Belum Ada Foto ]</span>
                                )}
                              </div>
                              <div style={{ fontWeight: 'bold', fontSize: '11pt', color: '#000000', fontFamily: '"Times New Roman", Times, serif' }}>
                                {item.judul || `Foto Dokumentasi #${(pageIndex * 2) + idx + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODE 2: ARSIP TEMPLATE TEKS MANUAL (FITUR LAMA TETAP ADA) */}
      {/* ========================================================================================= */}
      {activeTabMode === 'arsip' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '7px 16px',
                    fontSize: '0.82rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? '#0284C7' : '#CBD5E1',
                    backgroundColor: selectedCategory === cat ? '#0284C7' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Layers size={14} />
                  {cat === 'ALL' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setActiveDoc(null); setFormData({ title: '', category: 'BA Standarisasi', templateContent: '' }); setIsModalOpen(true); }}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Plus size={18} /> Buat Template Teks Baru
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {filteredDocs.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px dashed #CBD5E1', color: '#94A3B8' }}>
                <BookOpen size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, margin: 0 }}>Belum ada template dokumen pada kategori ini.</p>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div key={doc.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F172A', backgroundColor: '#FEF3C7', padding: '4px 10px', borderRadius: '6px' }}>
                        {doc.category}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(doc)} style={{ padding: '6px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Edit">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => deleteDoc(doc.id)} style={{ padding: '6px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>{doc.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 14px 0' }}>Diperbarui: {doc.updatedAt}</p>

                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#334155', maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
                      {doc.templateContent}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => copyContent(doc.templateContent, doc.id)}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      {copiedId === doc.id ? <Check size={16} color="#16A34A" /> : <Copy size={16} />}
                      {copiedId === doc.id ? 'Tersalin!' : 'Salin Draft'}
                    </button>
                    {doc?.category?.includes('BA') && (
                      <button
                        onClick={() => setActiveTab('pelaporan-gangguan')}
                        style={{ flex: 1.2, padding: '8px', backgroundColor: '#0284C7', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Sparkles size={16} color="#FEF08A" /> Isi via AI
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Add/Edit Arsip Manual */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '640px', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #CBD5E1', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <FileText size={22} color="#0284C7" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                {activeDoc ? 'Edit Template Teks' : 'Buat Template Teks Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveDoc} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Nama Template *</label>
                  <input type="text" placeholder="Misal: BA Standarisasi Dif Trafo" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Kategori *</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }}>
                    <option value="BA Standarisasi">BA Standarisasi</option>
                    <option value="BA Tripping">BA Tripping</option>
                    <option value="Instruksi Kerja (IK)">Instruksi Kerja (IK)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>Isi Teks Template Baku *</label>
                <textarea
                  placeholder="Salin dan tempelkan seluruh format teks dari Microsoft Word Anda di sini..."
                  value={formData.templateContent}
                  onChange={e => setFormData({ ...formData, templateContent: e.target.value })}
                  rows={10}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.4, boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => { setIsModalOpen(false); setActiveDoc(null); }} style={{ padding: '8px 18px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#0284C7', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Simpan Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS untuk Optimasi Print & Kertas A4 (@media print & sheet) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .a4-page-sheet {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm 20mm 20mm 20mm;
          margin: 0 auto 28px auto;
          background-color: #FFFFFF;
          color: #000000;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          border: 1px solid #CBD5E1;
          box-sizing: border-box;
          position: relative;
          font-family: "Times New Roman", Times, serif;
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #FFFFFF !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-ba-container, #print-ba-container * {
            visibility: visible !important;
          }
          #print-ba-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background-color: transparent !important;
          }
          .a4-page-sheet {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 20mm 20mm 20mm 20mm !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            box-sizing: border-box !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
