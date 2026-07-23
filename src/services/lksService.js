/**
 * LKS Service - Service layer for managing Lembar Kerja Selesai (LKS) data
 * Storage Key: ultg_lks_data_v1
 * PLN ULTG Bekasi
 */

export const STORAGE_KEY = 'ultg_lks_data_v1';

// In-memory storage fallback for non-browser environment (Node / test runners)
const memoryStorage = {};

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : null),
    setItem: (key, value) => {
      memoryStorage[key] = String(value);
    },
    removeItem: (key) => {
      delete memoryStorage[key];
    }
  };
};

export const INITIAL_LKS_DATA = [
  {
    id: 'LKS-HARPRO-20260722-001',
    nomorLks: '001/LKS/HARPRO/2026',
    tanggal: '2026-07-22',
    tim: 'HARPRO',
    substation: 'GI 150kV Bekasi',
    bay: 'Trafo Daya 1 (60MVA)',
    peralatan: 'Relay Differential SIEMENS 7UT613',
    uraianPekerjaan: 'Pengujian Rutin 2 Tahunan & Kalibrasi Relay Differential Trafo 1',
    kategori: 'Pemeliharaan Rutin',
    pelaksana: 'Tim Harpro 1 (Budi Santoso, Eko Prasetyo)',
    supervisor: 'Spv Harpro ULTG Bekasi',
    status: 'On Progress',
    approvalInfo: null,
    catatan: 'Pemeriksaan sekunder selesai, persiapan pengujian trip ke PMT.',
    createdAt: '2026-07-22T08:00:00.000Z',
    updatedAt: '2026-07-22T14:30:00.000Z'
  },
  {
    id: 'LKS-HARGI-20260721-002',
    nomorLks: '002/LKS/HARGI/2026',
    tanggal: '2026-07-21',
    tim: 'HARGI',
    substation: 'GI 150kV Tambun',
    bay: 'Bay Penghantar Tambun - Bekasi #1',
    peralatan: 'PMT 150kV & Disconnecting Switch',
    uraianPekerjaan: 'Pemeliharaan Bay Penghantar & Pengukuran Tahanan Kontak PMT',
    kategori: 'Pemeliharaan Rutin',
    pelaksana: 'Tim Hargi 2 (Ahmad Rizal, Doni Setiawan)',
    supervisor: 'Spv Hargi ULTG Bekasi',
    status: 'Approved',
    approvalInfo: {
      approvedBy: 'Manager ULTG Bekasi',
      approvedAt: '2026-07-21T16:00:00.000Z',
      catatan: 'Dokumen dan hasil uji sesuai standar PLN. Disetujui.',
      ttdManager: true,
      ttdSpv: true
    },
    catatan: 'Hasil pengukuran tahanan kontak 42 micro-ohm (kondisi baik).',
    createdAt: '2026-07-21T07:30:00.000Z',
    updatedAt: '2026-07-21T16:00:00.000Z'
  }
];

function initializeStorage() {
  const store = getStorage();
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) {
      store.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LKS_DATA));
      return INITIAL_LKS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      store.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LKS_DATA));
      return INITIAL_LKS_DATA;
    }
    return parsed;
  } catch (e) {
    console.error('Error parsing LKS storage data, re-initializing:', e);
    store.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LKS_DATA));
    return INITIAL_LKS_DATA;
  }
}

export const lksService = {
  /**
   * Get all LKS records
   * @returns {Array} List of LKS objects
   */
  getAll() {
    return initializeStorage();
  },

  /**
   * Get a single LKS record by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getById(id) {
    const list = initializeStorage();
    return list.find((item) => String(item.id) === String(id)) || null;
  },

  /**
   * Create a new LKS record
   * Generates new ID, formats nomorLks, and sets status to 'On Progress'
   * @param {Object} formData
   * @returns {Object} Newly created LKS object
   */
  create(formData = {}) {
    const list = initializeStorage();
    const now = new Date();
    const timestamp = now.getTime();
    const year = now.getFullYear();

    const tim = (formData.tim || 'HARPRO').toUpperCase();
    const nextSeq = list.length + 1;
    const formattedSeq = String(nextSeq).padStart(3, '0');
    const autoNomorLks = `${formattedSeq}/LKS/${tim}/${year}`;

    const newId = `LKS-${tim}-${timestamp}`;

    const newRecord = {
      id: newId,
      nomorLks: formData.nomorLks && formData.nomorLks.trim() ? formData.nomorLks.trim() : autoNomorLks,
      tanggal: formData.tanggal || now.toISOString().split('T')[0],
      tim: tim,
      substation: formData.substation || 'GI 150kV Bekasi',
      bay: formData.bay || '',
      peralatan: formData.peralatan || '',
      uraianPekerjaan: formData.uraianPekerjaan || '',
      kategori: formData.kategori || 'Pemeliharaan Rutin',
      pelaksana: formData.pelaksana || '',
      supervisor: formData.supervisor || '',
      ...formData,
      status: 'On Progress',
      approvalInfo: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const updatedList = [newRecord, ...list];
    const store = getStorage();
    store.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    return newRecord;
  },

  /**
   * Update status and approval signatures of an LKS record
   * @param {string} id
   * @param {string} newStatus
   * @param {Object|null} approvalInfo
   * @returns {Object|null} Updated LKS object or null if not found
   */
  updateStatus(id, newStatus, approvalInfo = null) {
    const list = initializeStorage();
    const index = list.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return null;
    }

    const nowIso = new Date().toISOString();
    let finalApprovalInfo = approvalInfo;

    if (newStatus === 'Approved' && !finalApprovalInfo) {
      finalApprovalInfo = {
        approvedBy: 'Manager ULTG Bekasi',
        approvedAt: nowIso,
        catatan: 'Disetujui',
        ttdManager: true,
        ttdSpv: true
      };
    }

    const updatedItem = {
      ...list[index],
      status: newStatus,
      approvalInfo: finalApprovalInfo,
      updatedAt: nowIso
    };

    list[index] = updatedItem;
    const store = getStorage();
    store.setItem(STORAGE_KEY, JSON.stringify(list));

    return updatedItem;
  },

  /**
   * Delete an LKS record by ID
   * @param {string} id
   * @returns {boolean} True if deleted, false if not found
   */
  delete(id) {
    const list = initializeStorage();
    const initialLength = list.length;
    const updatedList = list.filter((item) => String(item.id) !== String(id));

    if (updatedList.length === initialLength) {
      return false;
    }

    const store = getStorage();
    store.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    return true;
  },

  /**
   * Reset storage back to initial mock data (Utility method)
   * @returns {Array} Initial mock data
   */
  resetToMockData() {
    const store = getStorage();
    store.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LKS_DATA));
    return INITIAL_LKS_DATA;
  }
};

export default lksService;
