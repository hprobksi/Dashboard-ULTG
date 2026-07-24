# Design Spec: Menu BA (Berita Acara) - ULTG Bekasi

**Date:** 2026-07-24  
**Status:** Approved  
**Author:** Antigravity AI & Engineering Team  

---

## 1. Overview & Objective

Menu **BA (Berita Acara)** dirancang sebagai modul mandiri untuk manajemen dokumen resmi Berita Acara di lingkungan ULTG Bekasi. Modul ini mengadopsi arsitektur dan pola UX dari modul **LKS (Lembar Ketidaksesuaian)** yang sudah berjalan, namun disesuaikan khusus untuk pencatatan dan monitoring dokumen Berita Acara tanpa status Open/Close.

Modul ini memfasilitasi 3 kelompok pemeliharaan utama:
- **HARGI** (Pemeliharaan Gardu Induk)
- **HARJAR** (Pemeliharaan Jaringan)
- **HARPRO** (Pemeliharaan Proteksi & Metering)

---

## 2. Navigasi & Routing

### 2.1 Navigation Tree Update
- **Parent Domain**: `ANOMALI` (`anomali-parent`)
- **Sub-domain**: `ba-dom`
  - `label`: "BA"
  - `desc`: "Berita Acara"
  - `defaultTab`: "ba-upload"

### 2.2 Sidebar Menu (`Sidebar.jsx`)
Daftar tab navigasi untuk `activeDomain === 'ba-dom'`:
1. `ba-upload`: **Upload BA** (Icon: `UploadCloud`) - Form Upload & Metadata Berita Acara
2. `ba-monitoring`: **Monitoring BA** (Icon: `Activity`) - Dashboard & Rekapitulasi Per Bidang (HARGI, HARJAR, HARPRO)
3. `ba-archive`: **Arsip BA** (Icon: `Archive`) - Tabel & Galeri Dokumen Scan BA dengan PDF Preview

---

## 3. Komponen & Struktur Kode

### 3.1 Main Wrapper: `src/pages/Ba.jsx`
- Komponen halaman utama yang memuat Header Banner "BERITA ACARA (BA) - ULTG BEKASI".
- Mengelola state `activeSubTab` (`upload`, `monitoring`, `archive`).
- Merender sub-komponen secara konsisten berdasarkan `activeSubTab`.

### 3.2 Sub-Komponen `src/components/ba/`
- `BaUpload.jsx`: Form unggah file PDF scan BA beserta input metadata (No. BA, Tanggal, Bidang, Gardu Induk, Bay/Peralatan, Judul/Uraian Pekerjaan, Penandatangan).
- `BaMonitoring.jsx`: 
  - Stat cards: Total BA, Jumlah BA HARGI, Jumlah BA HARJAR, Jumlah BA HARPRO, Total Gardu Induk Terdaftar.
  - Sub-tab filter bidang: `[Semua Bidang]` | `[HARGI]` | `[HARJAR]` | `[HARPRO]`.
  - Tabel rekapitulasi pekerjaan BA (tanpa indikator/status open-close).
- `BaArchive.jsx`:
  - Panel pencarian kata kunci multi-kolom (No BA, Judul, GI, Bay, Penandatangan).
  - Filter kustom per Gardu Induk & Bidang.
  - Modal PDF Viewer Inline untuk pratinjau dokumen scan langsung.
  - Fitur ekspor rekap data ke Excel & download file.

---

## 4. Skema Data (`storageService`)

Key LocalStorage / Storage Service: `ultg_ba_list`

```ts
interface BeritaAcaraItem {
  id: string; // e.g. "ba_1721800000000"
  noBA: string; // e.g. "001/BA-HARPRO/ULTG-BKS/2026"
  judul: string; // e.g. "Aktivasi Tripping 1 & 2 Bay Jatiwaringin #1 GIS New Tambun"
  bidang: 'HARGI' | 'HARJAR' | 'HARPRO';
  tanggal: string; // e.g. "2026-04-29"
  garduInduk: string; // e.g. "GIS New Tambun"
  bay?: string; // e.g. "Bay Jatiwaringin #1"
  deskripsi?: string;
  penandatangan?: string;
  fileName?: string;
  fileUrl?: string; // Data URL / Object URL / Path file
  uploadedAt: string;
}
```

---

## 5. Rencana Verifikasi

1. **Uji Navigasi**: Buka menu BA dari Header & Sidebar, pastikan 3 tab (`Upload BA`, `Monitoring BA`, `Arsip BA`) dapat berpindah dengan mulus.
2. **Uji Upload Form**: Input Berita Acara baru dengan attachment PDF, pastikan tersimpan ke `ultg_ba_list`.
3. **Uji Monitoring Bidang**: Pastikan filter HARGI, HARJAR, dan HARPRO menyaring data secara akurat dan tidak ada kolom status Open/Close.
4. **Uji Arsip & PDF Viewer**: Lakukan pencarian dokumen BA dan buka pratinjau PDF modal inline.
