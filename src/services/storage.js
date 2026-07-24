import localforage from 'localforage';

// Konfigurasi IndexedDB
localforage.config({
  name: 'HarproUltgBekasi',
  storeName: 'harpro_data'
});

const INITIAL_SUBSTATIONS = [
  { id: 'gi-1', name: 'GI 150kV Bekasi', code: 'BKS', voltage: '150kV' },
  { id: 'gi-2', name: 'GI 150kV Tambun', code: 'TBN', voltage: '150kV' },
  { id: 'gi-4', name: 'GI 150kV Blimbing', code: 'BLM', voltage: '150kV' },
  { id: 'gi-5', name: 'GI 150kV Poncol', code: 'PCL', voltage: '150kV' },
  { id: 'gi-6', name: 'GI 150kV Babelan', code: 'BBL', voltage: '150kV' },
  { id: 'gi-7', name: 'GI 150kV Pondok Kelapa', code: 'PONKEL', voltage: '150kV' },
];

const INITIAL_SCHEDULES = [
  {
    id: 'sch-1',
    title: 'Pengujian Rutin 2 Tahunan Relay Dif Trafo #1',
    substation: 'GI 150kV Bekasi',
    bay: 'Trafo Daya 1 (60MVA)',
    date: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
    team: 'Tim Harpro 1',
    notes: 'Periksa juga burden arus CT sekunder'
  },
  {
    id: 'sch-2',
    title: 'Kalibrasi Relay Jarak (Distance Relay) SEL-421',
    substation: 'GI 150kV Tambun',
    bay: 'Bay Penghantar Tambun - Bekasi #1',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    status: 'In Progress',
    team: 'Tim Harpro 2',
    notes: 'Koordinasi pembebasan tegangan dengan Dispatcher UP2B'
  },
  {
    id: 'sch-3',
    title: 'Inspeksi & Pengukuran Tegangan Battery DC 110V',
    substation: 'GI 150kV Blimbing',
    bay: 'Ruang Panel Kontrol / DC Supply',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    status: 'Scheduled',
    team: 'Tim Harpro 1',
    notes: 'Cek indikasi DC Ground'
  }
];

const INITIAL_RELAYS = [
  {
    id: 'rel-1',
    substation: 'GI 150kV Bekasi',
    bay: 'Trafo Daya 1',
    brand: 'SIEMENS',
    type: '7UT613 (Differential)',
    serialNumber: 'BF7482-019',
    ipAddress: '192.168.10.14',
    protocol: 'IEC 61850',
    installedYear: '2018'
  },
  {
    id: 'rel-2',
    substation: 'GI 150kV Bekasi',
    bay: 'Penghantar Bekasi - Pulogadung #1',
    brand: 'SEL (Schweitzer)',
    type: 'SEL-421 (Distance)',
    serialNumber: 'SEL421-9921',
    ipAddress: '192.168.10.25',
    protocol: 'DNP3 / IEC 61850',
    installedYear: '2020'
  },
  {
    id: 'rel-3',
    substation: 'GI 150kV Tambun',
    bay: 'Kopel 150kV',
    brand: 'ABB',
    type: 'REF615 (OCR/GFR)',
    serialNumber: 'ABB-615-1102',
    ipAddress: '10.20.104.5',
    protocol: 'Modbus TCP',
    installedYear: '2019'
  },
  {
    id: 'rel-4',
    substation: 'GI 150kV Babelan',
    bay: 'Trafo Daya 1',
    brand: 'GE Multilin',
    type: 'SR745 (Transformer Dif)',
    serialNumber: 'GE-745-8831',
    ipAddress: '192.168.12.50',
    protocol: 'IEC 61850',
    installedYear: '2017'
  }
];

const INITIAL_ANOMALIES = [
  {
    id: 'ano-1',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    substation: 'GI 150kV Blimbing',
    bay: 'Trafo Daya 2',
    equipment: 'Relay OCR SIEMENS 7SJ62',
    indication: 'LED Alarm Fault menyala terus meskipun sistem normal. Tombol reset lokal tidak merespons.',
    temporaryAction: 'Pelaporan ke Supervisor Harpro, monitoring ketat beban trafo',
    status: 'Open',
    historyUpdate: 'Belum dilakukan pengujian injeksi sekunder karena trafo beroperasi berbeban tinggi.'
  },
  {
    id: 'ano-2',
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    substation: 'GI 150kV Poncol',
    bay: 'Panel DC Supply',
    equipment: 'Peralatan Ground Fault Detector DC',
    indication: 'Muncul alarm positif DC Ground (+) sebesar 45V saat cuaca hujan deras.',
    temporaryAction: 'Pencarian titik ground secara parsial per MCB cabang proteksi.',
    status: 'On Progress',
    historyUpdate: 'Diisolasi sementara pada jalur terminal outdoor marshalling kiosk trafo 1.'
  },
  {
    id: 'ano-3',
    date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
    substation: 'GI 150kV Tambun',
    bay: 'Penghantar Tambun - Cibatu #2',
    equipment: 'Relay Jarak SEL-311C',
    indication: 'Komunikasi port ethernet ke Gateway SCADA putus nyambung (intermittent).',
    temporaryAction: 'Penggantian kabel patch cord RJ45 cat6.',
    status: 'Closed',
    historyUpdate: 'Sudah diperbaiki pada 22 Juni. Komunikasi stabil normal.'
  }
];

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Template Berita Acara (BA) Standarisasi Pengujian Relay',
    category: 'BA Standarisasi',
    updatedAt: new Date().toISOString().split('T')[0],
    templateContent: `PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH
UNIT PELAKSANA TRANSMISI BEKASI - ULTG BEKASI
=====================================================================
BERITA ACARA STANDARISASI DAN PENGUJIAN RELAY PROTEKSI

Pada hari ini [HARI_TANGGAL], telah dilaksanakan pengujian rutin pemeliharaan proteksi pada:
Gardu Induk    : [NAMA_GI]
Bay / Trafo    : [NAMA_BAY]
Merk / Tipe    : [MERK_TIPE]

A. HASIL PEMERIKSAAN VISUAL & BURDEN
- Kondisi Wiring & Terminal : Baik / Bersih
- Pengukuran Burden Arus    : Fasa R: [ARUS_R] A, Fasa S: [ARUS_S] A, Fasa T: [ARUS_T] A

B. HASIL PENGUJIAN INJEKSI SEKUNDER
[HASIL_PENGUJIAN]

C. KESIMPULAN DAN REKOMENDASI
[KESIMPULAN_TEKNIS]

Dikerjakan Oleh Tim Harpro ULTG Bekasi:
1. Penguji Proteksi: ............................
2. Supervisor Proteksi: ..........................`
  },
  {
    id: 'doc-2',
    title: 'Template Berita Acara (BA) Penyempurnaan Tripping Gangguan',
    category: 'BA Tripping',
    updatedAt: new Date().toISOString().split('T')[0],
    templateContent: `PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH
ULTG BEKASI - BAGIAN PEMELIHARAAN PROTEKSI
=====================================================================
BERITA ACARA PENYEMPURNAAN DAN INVESTIGASI TRIPPING

Sehubungan dengan terjadinya gangguan tripping sistem tenaga listrik pada:
Waktu Kejadian : [WAKTU_TRIP] WIB
Gardu Induk    : [NAMA_GI]
Peralatan Trip : [PERALATAN_TRIP]

I. INDIKASI RELAY DI LAPANGAN
- Bendera Mekanik / LED : [INDIKASI_LED]
- Arus Gangguan (Fault) : [ARUS_GANGGUAN]

II. TINDAKAN PENYEMPURNAAN & INVESTIGASI
[TINDAKAN_INVESTIGASI]

III. ANALISA SEBAB AKIBAT (AI ENGINEER ASSISTED)
[ANALISA_SEBAB_AKIBAT]

Status Akhir Peralatan: [Siap Diberi Tegangan / Normal Kembali]`
  },
  {
    id: 'doc-3',
    title: 'Instruksi Kerja (IK) Kalibrasi Relay OCR Digital',
    category: 'Instruksi Kerja (IK)',
    updatedAt: '2026-01-10',
    templateContent: `INSTRUKSI KERJA PEMELIHARAAN PROTEKSI - PLN ULTG BEKASI
Judul: Pengujian Relay Over Current Relay (OCR) Digital

Langkah Kerja Persiapan:
1. Koordinasi dengan Dispatcher dan Operator Gardu Induk.
2. Pasang papan peringatan "sedang dikerjakan" pada panel kontrol.
3. Buka (posisi Open) Link Trip ke rangkaian PMT agar PMT tidak ikut bekerja saat injeksi sekunder.
4. Short terminal CT sekunder pada blok uji (Test Block) sebelum membuka wiring relay.
5. Gunakan alat uji Omicron / Megger Freja dengan arus injeksi bertahap mulai 1.0 x I_setting.`
  }
];

const INITIAL_BA = [
  {
    id: 'ba-1',
    noBA: '29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN',
    judul: 'Aktivasi Tripping 1 dan 2 Bay Jatiwaringin #1 GIS New Tambun',
    bidang: 'HARPRO',
    tanggal: '2026-04-29',
    garduInduk: 'GIS New Tambun',
    bay: 'Bay Jatiwaringin #1',
    deskripsi: 'Aktivasi tripping 1 dan 2 setelah penyempurnaan pengujian proteksi.',
    penandatangan: 'Tim Harpro ULTG Bekasi',
    fileName: '29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf',
    fileUrl: '/BA/29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'ba-2',
    noBA: '012/BA-HARGI/ULTG-BKS/2026',
    judul: 'Berita Acara Pemeliharaan Bay Trafo #2 150kV GI Bekasi',
    bidang: 'HARGI',
    tanggal: '2026-05-10',
    garduInduk: 'GI 150kV Bekasi',
    bay: 'Trafo Daya 2',
    deskripsi: 'Pengujian tahanan isolasi & kontak PMT Trafo 2 GI Bekasi.',
    penandatangan: 'Tim Hargi ULTG Bekasi',
    fileName: 'BA_Pemeliharaan_Trafo2_GI_Bekasi.pdf',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'ba-3',
    noBA: '005/BA-HARJAR/ULTG-BKS/2026',
    judul: 'Berita Acara Perbaikan SUTT 150kV Tambun - Cikarang #1',
    bidang: 'HARJAR',
    tanggal: '2026-06-15',
    garduInduk: 'GI 150kV Tambun',
    bay: 'Penghantar Tambun - Cikarang #1',
    deskripsi: 'Pengantian isolator pecah pada Tower T.24 SUTT 150kV.',
    penandatangan: 'Tim Harjar ULTG Bekasi',
    fileName: 'BA_Perbaikan_SUTT_Tambun.pdf',
    uploadedAt: new Date().toISOString()
  }
];

export const storageService = {
  async init() {
    const initialized = await localforage.getItem('is_initialized');
    if (!initialized) {
      await localforage.setItem('substations', INITIAL_SUBSTATIONS);
      await localforage.setItem('schedules', INITIAL_SCHEDULES);
      await localforage.setItem('relays', INITIAL_RELAYS);
      await localforage.setItem('anomalies', INITIAL_ANOMALIES);
      await localforage.setItem('documents', INITIAL_DOCUMENTS);
      await localforage.setItem('ba_list', INITIAL_BA);
      await localforage.setItem('settings', {
        apiKey: '',
        engineModel: 'gemini-2.5-pro',
        companyName: 'PT PLN (Persero) ULTG Bekasi',
        unitName: 'HARPRO ULTG BEKASI'
      });
      await localforage.setItem('is_initialized', true);
    }
  },

  async get(key) {
    await this.init();
    return await localforage.getItem(key) || [];
  },

  async set(key, value) {
    return await localforage.setItem(key, value);
  },

  getBaListSync() {
    try {
      const data = localStorage.getItem('ultg_ba_list');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BA;
  },

  async getBaList() {
    await this.init();
    const stored = await localforage.getItem('ba_list');
    if (stored && stored.length > 0) return stored;
    return this.getBaListSync();
  },

  async saveBaItem(item) {
    const list = await this.getBaList();
    const existingIndex = list.findIndex(b => b.id === item.id);
    let updatedList = [];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...item, updatedAt: new Date().toISOString() };
    } else {
      const newItem = { ...item, id: item.id || `ba_${Date.now()}`, uploadedAt: new Date().toISOString() };
      updatedList = [newItem, ...list];
    }
    await localforage.setItem('ba_list', updatedList);
    try {
      localStorage.setItem('ultg_ba_list', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
    return updatedList;
  },

  async deleteBaItem(id) {
    const list = await this.getBaList();
    const updatedList = list.filter(b => b.id !== id);
    await localforage.setItem('ba_list', updatedList);
    try {
      localStorage.setItem('ultg_ba_list', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
    return updatedList;
  },

  async getSettings() {
    await this.init();
    return await localforage.getItem('settings');
  },

  async saveSettings(settings) {
    return await localforage.setItem('settings', settings);
  },

  async exportBackup() {
    const backup = {
      substations: await this.get('substations'),
      schedules: await this.get('schedules'),
      relays: await this.get('relays'),
      anomalies: await this.get('anomalies'),
      documents: await this.get('documents'),
      ba_list: await this.getBaList(),
      settings: await this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  async importBackup(jsonString) {
    const data = JSON.parse(jsonString);
    if (data.substations) await this.set('substations', data.substations);
    if (data.schedules) await this.set('schedules', data.schedules);
    if (data.relays) await this.set('relays', data.relays);
    if (data.anomalies) await this.set('anomalies', data.anomalies);
    if (data.documents) await this.set('documents', data.documents);
    if (data.ba_list) await this.set('ba_list', data.ba_list);
    if (data.settings) await this.saveSettings(data.settings);
    return true;
  }
};
