const STORAGE_KEY = 'ultg_lks_data_v3';

const INITIAL_MOCK_DATA = [
  {
    id: 'lks-101',
    nomorLks: '001/LKS/HARPRO/2026',
    tanggalKejadian: '2026-07-08',
    bidang: 'HARPRO',
    dataPeralatan: {
      namaPeralatan: 'Relay 7UT631 Bay Trafo 2 150kV',
      merk: 'SIEMENS',
      type: '7UT631',
      noSeri: 'SN-9482910',
      harga: '-',
      kodeAsset: 'AST-HARPRO-001',
      tahunOperasi: '2015',
      tahunBuat: '2014'
    },
    penempatanPeralatan: 'GI 150kV Bekasi Tambun Bay Trafo 2',
    jenisKerusakan: 'Indikasi alarm SF6 pressure stage 1 pada CB 150kV',
    penyebabKerusakan: 'Kerapatan gas SF6 berkurang akibat micro leak pada valve',
    akibatKerusakan: 'Dapat memicu lock-out trip jika tekanan SF6 mencapai stage 2',
    usulDanSaran: 'Refill gas SF6 dan kalibrasi ulang densiti switch',
    lampiranText: '- Foto Kerusakan & Hasil Uji Ulang (Terlampir)',
    pengaju: {
      nama: 'FAJAR KURNIAWAN',
      nip: '941823901',
      jabatan: 'Staff HARPRO',
      signatureDataUrl: ''
    },
    status: 'Open',
    approval: {
      tlNama: 'AHMAD Y. AL BASTOMY',
      tlNip: '921839182',
      tlJabatan: 'TL HARPRO ULTG BEKASI',
      managerNama: 'TRIAWAN AZHARY P. N.',
      managerNip: '891726351',
      managerJabatan: 'MANAGER ULTG BEKASI'
    },
    createdAt: new Date('2026-07-08T08:30:00Z').toISOString()
  },
  {
    id: 'lks-102',
    nomorLks: '002/LKS/HARJAR/2026',
    tanggalKejadian: '2026-07-08',
    bidang: 'HARJAR',
    dataPeralatan: {
      namaPeralatan: 'KLEM JUMPER Tower No. T.4 arah T.5 SUTT CKRNG-JBBKA Penghantar 1 Fasa S',
      merk: '-',
      type: '-',
      noSeri: '-',
      harga: '-',
      kodeAsset: '-',
      tahunOperasi: '-',
      tahunBuat: '-'
    },
    penempatanPeralatan: 'SUTT CKRNG-JBBKA T.4 ARAH T.5 Penghantar 1 Fasa S',
    jenisKerusakan: 'Temuan Thermovisi ( Hotspot )',
    penyebabKerusakan: 'Kemungkinan klem kendor atau kotor',
    akibatKerusakan: 'Dapat menyebabkan kerusakan pada klem',
    usulDanSaran: 'Segera di Lakukan Perbaikan',
    lampiranText: '- Foto Kerusakan (Terlampir)',
    pengaju: {
      nama: 'AHMAD Y. AL BASTOMY',
      nip: '921839182',
      jabatan: 'TL HARJAR ULTG BEKASI',
      signatureDataUrl: ''
    },
    status: 'Close',
    approval: {
      tlNama: 'AHMAD Y. AL BASTOMY',
      tlNip: '921839182',
      tlJabatan: 'TL HARJAR ULTG BEKASI',
      managerNama: 'TRIAWAN AZHARY P. N.',
      managerNip: '891726351',
      managerJabatan: 'MANAGER ULTG BEKASI'
    },
    createdAt: new Date('2026-07-08T10:15:00Z').toISOString()
  }
];

export const lksService = {
  getAll: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
        return INITIAL_MOCK_DATA;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error fetching LKS data', e);
      return INITIAL_MOCK_DATA;
    }
  },

  getById: (id) => {
    const list = lksService.getAll();
    return list.find(item => item.id === id) || null;
  },

  create: (formData) => {
    const list = lksService.getAll();
    const year = new Date().getFullYear();
    const nextSeq = list.length + 1;
    const formattedSeq = String(nextSeq).padStart(3, '0');
    const bidang = formData.bidang || 'HARPRO';

    const newLks = {
      id: `lks-${Date.now()}`,
      nomorLks: formData.nomorLks || `${formattedSeq}/LKS/${bidang}/${year}`,
      tanggalKejadian: formData.tanggalKejadian || new Date().toISOString().split('T')[0],
      bidang: bidang,
      dataPeralatan: {
        namaPeralatan: formData.namaPeralatan || '',
        merk: formData.merk || '-',
        type: formData.type || '-',
        noSeri: formData.noSeri || '-',
        harga: formData.harga || '-',
        kodeAsset: formData.kodeAsset || '-',
        tahunOperasi: formData.tahunOperasi || '-',
        tahunBuat: formData.tahunBuat || '-'
      },
      penempatanPeralatan: formData.penempatanPeralatan || '',
      jenisKerusakan: formData.jenisKerusakan || '',
      penyebabKerusakan: formData.penyebabKerusakan || '',
      akibatKerusakan: formData.akibatKerusakan || '',
      usulDanSaran: formData.usulDanSaran || '',
      lampiranText: formData.lampiranText || '- Foto Kerusakan (Terlampir)',
      pengaju: {
        nama: formData.pengajuNama || '',
        nip: formData.pengajuNip || '',
        jabatan: formData.pengajuJabatan || '',
        signatureDataUrl: formData.pengajuSignature || ''
      },
      status: 'Open',
      approval: {
        tlNama: formData.tlNama || 'FAJAR KURNIAWAN',
        tlNip: formData.tlNip || '',
        tlJabatan: formData.tlJabatan || `TL ${bidang} ULTG BEKASI`,
        managerNama: 'TRIAWAN AZHARY P. N.',
        managerNip: '',
        managerJabatan: 'MANAGER ULTG BEKASI'
      },
      filePdfName: formData.filePdfName || null,
      createdAt: new Date().toISOString()
    };
    list.unshift(newLks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newLks;
  },

  updateStatus: (id, newStatus) => {
    const list = lksService.getAll();
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx].status = newStatus;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  delete: (id) => {
    let list = lksService.getAll();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  }
};

export default lksService;
