# Design Document: Modul LKS (Lembar Kerja Selesai) ULTG Bekasi

**Date**: 2026-07-23  
**Status**: Approved by User  
**Author**: Antigravity Assistant & User  

---

## 1. Overview & Objectives

Modul LKS (Lembar Kerja Selesai) dirancang untuk memfasilitasi pencatatan, pengajuan, pengesahan (approval), dan pemantauan perbaikan peralatan di lingkungan PT PLN (Persero) ULTG Bekasi. 

Modul ini dikembangkan secara kolaboratif oleh 2 engineer menggunakan repository Git, sehingga arsitekturnya dibuat terisolasi dan modular untuk mencegah *merge conflict*.

---

## 2. Navigasi & Tata Letak UI

- **Modul**: `ANOMALI` -> `LKS` (Lembar Kerja Selesai)
- **Top Navigation Bar**: Horizontal Tab Bar di bagian atas halaman LKS:
  1. `Pengajuan LKS`: Berisi Form Pengajuan LKS lengkap, Tanda Tangan Digital pengaju, Generate PDF, dan Upload File LKS.
  2. `Monitoring LKS`: Berisi Dashboard Monitoring Alur Status, Filter Bidang & Status, Modal Approval TL/Manager, serta pengubahan status perbaikan.

---

## 3. Komponen & Alur Fitur

### A. Sub-Komponen 1: Form Pengajuan LKS (`LksForm.jsx`)
1. **Identitas Pengajuan**:
   - Nomor LKS (Auto-generated / Format: `LKS/ULTG-BKS/YYYY/MM/xxx`).
   - Tanggal Pengajuan.
   - Tim / Bidang (`JARGI`, `HARGI`, `HARJAR`, `HARPRO`).
   - Data Pengaju (Nama Staff, NIP, Jabatan).
   - Lokasi GI & Bay / Equipment.
2. **Rincian Pekerjaan**:
   - Uraian Temuan / Anomali.
   - Uraian Tindakan Perbaikan.
3. **Fitur Tanda Tangan Digital Pengaju**:
   - Interaktif HTML5 Canvas untuk menggambar TTD menggunakan mouse/touch screen.
   - Opsi Upload Gambar TTD (.png / .jpg).
   - Action: Reset TTD & Simpan TTD.
4. **Generate PDF & Submit**:
   - Generate Form LKS menjadi dokumen PDF dengan format standar PLN ULTG Bekasi.
   - Opsi Upload File PDF LKS manual yang sudah discan.
   - Tombol **Simpan & Ajukan LKS** menyimpan data ke state/storage dengan status awal `On Progress`.

### B. Sub-Komponen 2: Monitoring LKS (`LksMonitoring.jsx`)
1. **Filter & Pencarian**:
   - Filter Bidang: `Semua`, `JARGI`, `HARGI`, `HARJAR`, `HARPRO`.
   - Filter Status: `Semua`, `On Progress`, `Approved`, `Done`.
   - Search Bar (Mencari No. LKS, Lokasi GI, Nama Pengaju).
2. **Tabel Monitoring & Alur Status**:
   - **`On Progress`** (Kuning/Amber): Status awal setelah diajukan oleh Staff.
   - **`Approved`** (Biru/Sky Blue): Disetujui oleh Team Leader (TL) terkait dan Manager ULTG Bekasi. Membuka Modal Approval untuk membubuhkan TTD Digital TL & Manager ke dokumen LKS.
   - **`Done`** (Hijau/Emerald): Diubah setelah pekerjaan perbaikan di lapangan selesai 100%. Hanya dapat diubah oleh para TL (`JARGI`, `HARJAR`, `HARGI`, `HARPRO`).
3. **Menu Aksi Tabel**:
   - View / Download PDF LKS.
   - Approve LKS (TL & Manager).
   - Update Status ke Done (Khusus TL).

---

## 4. Arsitektur Data & Persistence Service (`lksService.js`)

Semua data LKS dikelola melalui `lksService.js` yang memanfaatkan `localStorage` browser dengan mock data awal agar pengembangan frontend dapat langsung diuji dan diintegrasikan tanpa ketergantungan API backend backend tambahan.

### Schema Data Object `LKS`:
```json
{
  "id": "lks-1721712000000",
  "nomorLks": "LKS/ULTG-BKS/2026/07/001",
  "tanggal": "2026-07-23",
  "bidang": "HARPRO",
  "pengaju": {
    "nama": "Budi Santoso",
    "nip": "921839182",
    "jabatan": "Staff Proteksi",
    "signatureDataUrl": "data:image/png;base64,..."
  },
  "lokasiGi": "GI Bekasi",
  "bayPeralatan": "Bay Trafo 1",
  "uraianTemuan": "Indikasi alarm SF6 pressure low",
  "tindakanPerbaikan": "Pengecekan kerapatan gas SF6 & penambahan gas",
  "status": "On Progress",
  "approval": {
    "tlApproved": false,
    "tlNama": "",
    "tlSignature": "",
    "managerApproved": false,
    "managerNama": "",
    "managerSignature": ""
  },
  "filePdfUrl": null,
  "createdAt": "2026-07-23T13:55:00.000Z"
}
```

---

## 5. Struktur File Baru

```
src/
├── services/
│   └── lksService.js         # Managing LKS data & CRUD in LocalStorage
├── components/
│   └── lks/
│       ├── LksForm.jsx       # Form Pengajuan LKS + Digital Signature Canvas
│       ├── LksMonitoring.jsx # Tabel Monitoring + Modal Approval & Action Triggers
│       └── DigitalSignatureModal.jsx # Modal Canvas TTD Digital reusable
└── pages/
    └── Lks.jsx               # Main LKS Page with Horizontal Tab Bar
```

---

## 6. Self-Review Check

1. **Placeholder Scan**: Tidak ada TBD/TODO yang tertinggal.
2. **Internal Consistency**: Alur status (On Progress -> Approved -> Done) konsisten dengan peran pengaju (Staff), approver (TL & Manager), dan finisher (TL).
3. **Scope Check**: Terfokus khusus pada modul LKS sesuai pembagian kerja tim.
4. **Ambiguity Check**: Semua kebutuhan role & input telah difinalisasi secara eksplisit.
