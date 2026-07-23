# LKS Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the LKS (Lembar Kerja Selesai) menu framework with a top horizontal tab bar (`Pengajuan LKS` and `Monitoring LKS`), input form with HTML5 canvas digital signature & PDF generation/upload, and monitoring table with multi-stage approval workflow (`On Progress`, `Approved`, `Done`).

**Architecture:** A modular React component structure with local storage persistence (`lksService.js`) to decouple data management and prevent Git merge conflicts between team members.

**Tech Stack:** React 19, Lucide React icons, HTML5 Canvas API, LocalStorage, HTML-to-PDF / docx templating utilities (or built-in printable HTML/PDF generator), CSS Flexbox/Grid (Tailwind/Vanilla styling consistent with the existing codebase).

## Global Constraints

- **Design Aesthetics:** Follow PLN ULTG Bekasi corporate theme (`#00A2E9` primary blue, `#0F172A` slate dark, white cards, rounded badges).
- **Navigation:** Horizontal Tab Bar inside the LKS page.
- **Form Role Identification:** Manual inputs for User Name, NIP, Position, and Bidang dropdown (`JARGI`, `HARGI`, `HARJAR`, `HARPRO`).
- **Workflow Rules:**
  - `On Progress`: Default status on LKS submission.
  - `Approved`: TL (HARGI/HARJAR/HARPRO) and Manager ULTG Bekasi sign-off with digital signature.
  - `Done`: Set by TLs (`JARGI`, `HARGI`, `HARJAR`, `HARPRO`) after field fix completion.

---

### Task 1: Data Storage & Service Layer (`lksService.js`)

**Files:**
- Create: `src/services/lksService.js`
- Test: Manual / console test in browser or script verification

**Interfaces:**
- Produces:
  - `lksService.getAll()`: Returns array of LKS objects.
  - `lksService.getById(id)`: Returns single LKS object.
  - `lksService.create(lksData)`: Creates new LKS record with generated ID and status `On Progress`.
  - `lksService.updateStatus(id, newStatus, approvalData)`: Updates status (`Approved`, `Done`) and appends approval signatures.
  - `lksService.delete(id)`: Deletes LKS record.

- [ ] **Step 1: Create `src/services/lksService.js` with initial mock data & CRUD functions**

```javascript
const STORAGE_KEY = 'ultg_lks_data_v1';

const INITIAL_MOCK_DATA = [
  {
    id: 'lks-101',
    nomorLks: 'LKS/ULTG-BKS/2026/07/001',
    tanggal: '2026-07-20',
    bidang: 'HARPRO',
    pengaju: {
      nama: 'Ahmad Fauzi',
      nip: '941823901',
      jabatan: 'Staff Proteksi',
      signatureDataUrl: ''
    },
    lokasiGi: 'GI Bekasi Tambun',
    bayPeralatan: 'Bay Trafo 2 (Relay 7UT63)',
    uraianTemuan: 'Indikasi alarm SF6 pressure stage 1 pada CB 150kV',
    tindakanPerbaikan: 'Refill gas SF6 dan kalibrasi densiti switch',
    status: 'On Progress',
    approval: {
      tlApproved: false,
      tlNama: '',
      tlSignature: '',
      managerApproved: false,
      managerNama: '',
      managerSignature: ''
    },
    filePdfUrl: null,
    createdAt: new Date('2026-07-20T08:30:00Z').toISOString()
  },
  {
    id: 'lks-102',
    nomorLks: 'LKS/ULTG-BKS/2026/07/002',
    tanggal: '2026-07-18',
    bidang: 'HARGI',
    pengaju: {
      nama: 'Budi Kurniawan',
      nip: '921738192',
      jabatan: 'Staff Gardu Induk',
      signatureDataUrl: ''
    },
    lokasiGi: 'GI Cibatu',
    bayPeralatan: 'Bay Line Cikarang 1',
    uraianTemuan: 'Hotspot pada Klem PMT R Phase (Suhu 95°C)',
    tindakanPerbaikan: 'Pembersihan kontak dan pengencangan baut Klem PMT',
    status: 'Approved',
    approval: {
      tlApproved: true,
      tlNama: 'Eko Prasetyo (TL HARGI)',
      tlSignature: '',
      managerApproved: true,
      managerNama: 'Irwan Setiawan (Manager ULTG)',
      managerSignature: ''
    },
    filePdfUrl: null,
    createdAt: new Date('2026-07-18T10:15:00Z').toISOString()
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
    const newLks = {
      id: `lks-${Date.now()}`,
      nomorLks: formData.nomorLks || `LKS/ULTG-BKS/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(list.length + 1).padStart(3, '0')}`,
      tanggal: formData.tanggal || new Date().toISOString().split('T')[0],
      bidang: formData.bidang || 'HARPRO',
      pengaju: {
        nama: formData.pengajuNama || '',
        nip: formData.pengajuNip || '',
        jabatan: formData.pengajuJabatan || '',
        signatureDataUrl: formData.pengajuSignature || ''
      },
      lokasiGi: formData.lokasiGi || '',
      bayPeralatan: formData.bayPeralatan || '',
      uraianTemuan: formData.uraianTemuan || '',
      tindakanPerbaikan: formData.tindakanPerbaikan || '',
      status: 'On Progress',
      approval: {
        tlApproved: false,
        tlNama: '',
        tlSignature: '',
        managerApproved: false,
        managerNama: '',
        managerSignature: ''
      },
      filePdfUrl: formData.filePdfUrl || null,
      createdAt: new Date().toISOString()
    };
    list.unshift(newLks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newLks;
  },

  updateStatus: (id, newStatus, approvalInfo = {}) => {
    const list = lksService.getAll();
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx].status = newStatus;
      if (approvalInfo && Object.keys(approvalInfo).length > 0) {
        list[idx].approval = {
          ...list[idx].approval,
          ...approvalInfo
        };
      }
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
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/services/lksService.js
git commit -m "feat: add lksService for managing LKS storage and state"
```

---

### Task 2: Digital Signature Component & Form Pengajuan LKS (`LksForm.jsx`)

**Files:**
- Create: `src/components/lks/DigitalSignatureModal.jsx`
- Create: `src/components/lks/LksForm.jsx`

**Interfaces:**
- Consumes: `lksService.create()`
- Produces: Form UI component for submit & printable PDF preview generation.

- [ ] **Step 1: Create `DigitalSignatureModal.jsx` with HTML5 Canvas**

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, X, Upload } from 'lucide-react';

export default function DigitalSignatureModal({ isOpen, onClose, onSave, title = "Tanda Tangan Digital" }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0F172A';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSave(event.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '500px', maxWidth: '90vw', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
        </div>

        <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', backgroundColor: '#F8FAFC', padding: '8px', textAlign: 'center', marginBottom: '16px' }}>
          <canvas
            ref={canvasRef}
            width={440}
            height={200}
            style={{ width: '100%', height: '200px', touchAction: 'none', cursor: 'crosshair' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Goreskan tanda tangan di area atas</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#0284C7', cursor: 'pointer', fontWeight: 600 }}>
            <Upload size={16} /> Upload File TTD
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              <Eraser size={16} /> Reset
            </button>
            <button type="button" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              <Check size={16} /> Simpan TTD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `LksForm.jsx`**

Create form with fields, canvas signature trigger, PDF export modal/print preview, and submit integration.

```jsx
import React, { useState } from 'react';
import { FileText, Send, Printer, Upload, CheckCircle2, PenTool } from 'lucide-react';
import DigitalSignatureModal from './DigitalSignatureModal';
import { lksService } from '../../services/lksService';

export default function LksForm({ onSuccessSubmitted }) {
  const [formData, setFormData] = useState({
    nomorLks: '',
    tanggal: new Date().toISOString().split('T')[0],
    bidang: 'HARPRO',
    pengajuNama: '',
    pengajuNip: '',
    pengajuJabatan: 'Staff',
    lokasiGi: '',
    bayPeralatan: '',
    uraianTemuan: '',
    tindakanPerbaikan: '',
    pengajuSignature: '',
    filePdfName: ''
  });

  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pengajuNama || !formData.lokasiGi || !formData.uraianTemuan) {
      alert('Mohon lengkapi Nama Pengaju, Lokasi GI, dan Uraian Temuan!');
      return;
    }

    const created = lksService.create(formData);
    setSubmittedMessage(`Berhasil mengajukan LKS ${created.nomorLks} (Status: On Progress)`);
    setTimeout(() => {
      setSubmittedMessage('');
      if (onSuccessSubmitted) onSuccessSubmitted();
    }, 1500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText color="#00A2E9" /> Form Pengajuan LKS (Lembar Kerja Selesai)
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>Input data pekerjaan perbaikan & temuan peralatan ULTG Bekasi</p>
        </div>
        <button
          type="button"
          onClick={handlePrintPdf}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <Printer size={16} /> Print / Export PDF
        </button>
      </div>

      {submittedMessage && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
          <CheckCircle2 size={20} /> {submittedMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Row 1: Nomor LKS & Tanggal & Tim/Bidang */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nomor LKS (Opsional)</label>
            <input
              type="text"
              name="nomorLks"
              placeholder="Otomatis jika dikosongkan"
              value={formData.nomorLks}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Tanggal Pengajuan</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Tim / Bidang Pemohon *</label>
            <select
              name="bidang"
              value={formData.bidang}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <option value="HARPRO">HARPRO (Pemeliharaan Proteksi)</option>
              <option value="HARGI">HARGI (Pemeliharaan Gardu Induk)</option>
              <option value="HARJAR">HARJAR (Pemeliharaan Jaringan)</option>
              <option value="JARGI">JARGI (Jaringan & Gardu Induk)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Identitas Pengaju (Staff Manual Input) */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>Data Staff Pengaju</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Nama Lengkap *</label>
              <input
                type="text"
                name="pengajuNama"
                placeholder="Contoh: Budi Santoso"
                value={formData.pengajuNama}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>NIP Staff</label>
              <input
                type="text"
                name="pengajuNip"
                placeholder="Contoh: 921839182"
                value={formData.pengajuNip}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Jabatan</label>
              <input
                type="text"
                name="pengajuJabatan"
                placeholder="Staff Pemeliharaan"
                value={formData.pengajuJabatan}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Lokasi & Equipment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Lokasi Gardu Induk (GI) *</label>
            <input
              type="text"
              name="lokasiGi"
              placeholder="Contoh: GI Bekasi Tambun"
              value={formData.lokasiGi}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Bay / Peralatan</label>
            <input
              type="text"
              name="bayPeralatan"
              placeholder="Contoh: Bay Trafo 1 / PMT 150kV"
              value={formData.bayPeralatan}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* Row 4: Temuan & Perbaikan */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Uraian Temuan / Anomali *</label>
          <textarea
            name="uraianTemuan"
            rows={3}
            placeholder="Jelaskan kondisi temuan gangguan atau kerusakan..."
            value={formData.uraianTemuan}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Uraian Tindakan Perbaikan</label>
          <textarea
            name="tindakanPerbaikan"
            rows={3}
            placeholder="Jelaskan langkah penanganan atau perbaikan yang dilakukan..."
            value={formData.tindakanPerbaikan}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
          />
        </div>

        {/* Row 5: Digital Signature & Manual File Attach */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Tanda Tangan Digital Pengaju</label>
            {formData.pengajuSignature ? (
              <div style={{ border: '1px solid #10B981', borderRadius: '10px', padding: '8px', backgroundColor: '#F0FDF4', textAlign: 'center' }}>
                <img src={formData.pengajuSignature} alt="TTD Pengaju" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                <button
                  type="button"
                  onClick={() => setIsSigModalOpen(true)}
                  style={{ display: 'block', margin: '4px auto 0 auto', border: 'none', background: 'none', color: '#0284C7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Ubah Tanda Tangan
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSigModalOpen(true)}
                style={{ width: '100%', height: '80px', border: '2px dashed #CBD5E1', borderRadius: '10px', backgroundColor: '#F8FAFC', color: '#0284C7', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <PenTool size={18} /> Buat Tanda Tangan Digital
              </button>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Upload Dokumen LKS (PDF / Scan)</label>
            <div style={{ border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '16px', backgroundColor: '#F8FAFC', textAlign: 'center' }}>
              <Upload size={22} color="#64748B" style={{ marginBottom: '6px' }} />
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 6px 0' }}>{formData.filePdfName || 'Opsi upload file LKS manual'}</p>
              <label style={{ fontSize: '0.8rem', color: '#00A2E9', fontWeight: 700, cursor: 'pointer' }}>
                Pilih File PDF
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setFormData(prev => ({ ...prev, filePdfName: e.target.files[0].name }));
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{ marginTop: '12px', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,162,233,0.3)' }}
        >
          <Send size={18} /> Simpan & Ajukan LKS
        </button>
      </form>

      <DigitalSignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(dataUrl) => setFormData(prev => ({ ...prev, pengajuSignature: dataUrl }))}
        title="Tanda Tangan Digital Pengaju"
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit Task 2**

```bash
git add src/components/lks/DigitalSignatureModal.jsx src/components/lks/LksForm.jsx
git commit -m "feat: add DigitalSignatureModal and LksForm components"
```

---

### Task 3: Monitoring Table & Approval Workflow (`LksMonitoring.jsx`)

**Files:**
- Create: `src/components/lks/LksMonitoring.jsx`

**Interfaces:**
- Consumes: `lksService.getAll()`, `lksService.updateStatus()`, `lksService.delete()`
- Produces: Monitoring UI table with badges (`On Progress`, `Approved`, `Done`) & Approval dialog.

- [ ] **Step 1: Create `LksMonitoring.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, ShieldCheck, Check, Trash2, Eye, FileText } from 'lucide-react';
import { lksService } from '../../services/lksService';
import DigitalSignatureModal from './DigitalSignatureModal';

export default function LksMonitoring() {
  const [lksList, setLksList] = useState([]);
  const [filterBidang, setFilterBidang] = useState('SEMUA');
  const [filterStatus, setFilterStatus] = useState('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Approval State
  const [selectedLks, setSelectedLks] = useState(null);
  const [approvalType, setApprovalType] = useState(null); // 'TL' | 'MANAGER'
  const [approverName, setApproverName] = useState('');
  const [approverSig, setApproverSig] = useState('');
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  const loadData = () => {
    setLksList(lksService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = lksList.filter(item => {
    const matchBidang = filterBidang === 'SEMUA' || item.bidang === filterBidang;
    const matchStatus = filterStatus === 'SEMUA' || item.status === filterStatus;
    const matchQuery = !searchQuery || 
      item.nomorLks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasiGi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pengaju.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBidang && matchStatus && matchQuery;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Progress':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.78rem', fontWeight: 800 }}>
            <Clock size={14} /> On Progress
          </span>
        );
      case 'Approved':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#E0F2FE', color: '#0284C7', fontSize: '0.78rem', fontWeight: 800 }}>
            <ShieldCheck size={14} /> Approved
          </span>
        );
      case 'Done':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#D1FAE5', color: '#059669', fontSize: '0.78rem', fontWeight: 800 }}>
            <CheckCircle size={14} /> Done
          </span>
        );
      default:
        return status;
    }
  };

  const handleOpenApproveModal = (lks, type) => {
    setSelectedLks(lks);
    setApprovalType(type);
    setApproverName(type === 'TL' ? `TL ${lks.bidang}` : 'Manager ULTG Bekasi');
    setApproverSig('');
  };

  const handleSaveApproval = () => {
    if (!selectedLks) return;
    
    let approvalPayload = {};
    if (approvalType === 'TL') {
      approvalPayload = {
        tlApproved: true,
        tlNama: approverName,
        tlSignature: approverSig
      };
    } else {
      approvalPayload = {
        managerApproved: true,
        managerNama: approverName,
        managerSignature: approverSig
      };
    }

    // Cek jika TL & Manager sudah menyetujui, ubah status ke Approved
    const willBeFullApproved = (selectedLks.approval.tlApproved || approvalType === 'TL') &&
      (selectedLks.approval.managerApproved || approvalType === 'MANAGER');

    const nextStatus = willBeFullApproved ? 'Approved' : selectedLks.status;

    lksService.updateStatus(selectedLks.id, nextStatus, approvalPayload);
    setSelectedLks(null);
    loadData();
  };

  const handleSetDone = (id) => {
    if (window.confirm('Ubah status perbaikan LKS ini menjadi Done (Selesai 100%)?')) {
      lksService.updateStatus(id, 'Done');
      loadData();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus data pengajuan LKS ini?')) {
      lksService.delete(id);
      loadData();
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Dashboard Monitoring LKS</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>Pantau alur persetujuan & status penyelesaian LKS ULTG Bekasi</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari LKS / GI / Pengaju..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '20px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Bidang:</span>
          {['SEMUA', 'HARPRO', 'HARGI', 'HARJAR', 'JARGI'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setFilterBidang(b)}
              style={{ padding: '5px 12px', borderRadius: '16px', border: 'none', backgroundColor: filterBidang === b ? '#00A2E9' : '#F1F5F9', color: filterBidang === b ? '#FFFFFF' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {b}
            </button>
          ))}
        </div>

        <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
          {['SEMUA', 'On Progress', 'Approved', 'Done'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              style={{ padding: '5px 12px', borderRadius: '16px', border: 'none', backgroundColor: filterStatus === s ? '#0F172A' : '#F1F5F9', color: filterStatus === s ? '#FFFFFF' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '12px' }}>No. LKS & Tanggal</th>
              <th style={{ padding: '12px' }}>Bidang</th>
              <th style={{ padding: '12px' }}>Pengaju</th>
              <th style={{ padding: '12px' }}>Lokasi GI & Peralatan</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Approval TL & Manager</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>Tidak ada data LKS yang sesuai filter.</td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.nomorLks}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.tanggal}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 800, fontSize: '0.75rem' }}>
                      {item.bidang}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#334155' }}>{item.pengaju.nama}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.pengaju.jabatan}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.lokasiGi}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.bayPeralatan}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                      <span style={{ color: item.approval.tlApproved ? '#059669' : '#D97706', fontWeight: 600 }}>
                        TL: {item.approval.tlApproved ? `✓ ${item.approval.tlNama}` : '⏳ Belum ACC'}
                      </span>
                      <span style={{ color: item.approval.managerApproved ? '#059669' : '#D97706', fontWeight: 600 }}>
                        MGR: {item.approval.managerApproved ? `✓ ${item.approval.managerNama}` : '⏳ Belum ACC'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {/* Button Approve TL */}
                      {!item.approval.tlApproved && (
                        <button
                          type="button"
                          onClick={() => handleOpenApproveModal(item, 'TL')}
                          title="Approve sebagai TL"
                          style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#0284C7', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ACC TL
                        </button>
                      )}

                      {/* Button Approve Manager */}
                      {!item.approval.managerApproved && (
                        <button
                          type="button"
                          onClick={() => handleOpenApproveModal(item, 'MANAGER')}
                          title="Approve sebagai Manager"
                          style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#4F46E5', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ACC MGR
                        </button>
                      )}

                      {/* Set Status to Done */}
                      {item.status !== 'Done' && (
                        <button
                          type="button"
                          onClick={() => handleSetDone(item.id)}
                          title="Ubah ke Status Done"
                          style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Set Done
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog Approval */}
      {selectedLks && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '450px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
              Persetujuan (Approval) {approvalType === 'TL' ? 'Team Leader' : 'Manager ULTG'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>No LKS: <b>{selectedLks.nomorLks}</b> ({selectedLks.lokasiGi})</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Nama Pejabat / Approver</label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Tanda Tangan Digital</label>
              {approverSig ? (
                <div style={{ border: '1px solid #10B981', borderRadius: '8px', padding: '6px', backgroundColor: '#F0FDF4', textAlign: 'center' }}>
                  <img src={approverSig} alt="TTD Approver" style={{ maxHeight: '60px' }} />
                  <button type="button" onClick={() => setIsSigModalOpen(true)} style={{ display: 'block', margin: '2px auto 0 auto', border: 'none', background: 'none', color: '#0284C7', fontSize: '0.75rem', fontWeight: 700 }}>Ubah TTD</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSigModalOpen(true)}
                  style={{ width: '100%', padding: '12px', border: '1px dashed #CBD5E1', borderRadius: '8px', backgroundColor: '#F8FAFC', color: '#0284C7', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  + Tambah Tanda Tangan Digital
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedLks(null)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveApproval}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Simpan Persetujuan
              </button>
            </div>
          </div>
        </div>
      )}

      <DigitalSignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(dataUrl) => setApproverSig(dataUrl)}
        title={`Tanda Tangan Digital ${approvalType === 'TL' ? 'TL' : 'Manager'}`}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit Task 3**

```bash
git add src/components/lks/LksMonitoring.jsx
git commit -m "feat: add LksMonitoring component with approval workflow and filter controls"
```

---

### Task 4: Main Page Entry (`Lks.jsx`), Sidebar Integration & Routing

**Files:**
- Create: `src/pages/Lks.jsx`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `LksForm.jsx`, `LksMonitoring.jsx`
- Produces: Main LKS Module page with top horizontal tab bar.

- [ ] **Step 1: Create `src/pages/Lks.jsx` with top horizontal tab bar**

```jsx
import React, { useState } from 'react';
import { FilePlus, LayoutDashboard } from 'lucide-react';
import LksForm from '../components/lks/LksForm';
import LksMonitoring from '../components/lks/LksMonitoring';

export default function Lks() {
  const [activeSubTab, setActiveSubTab] = useState('pengajuan'); // 'pengajuan' | 'monitoring'

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      {/* Top Header Banner */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            Modul LKS (Lembar Kerja Selesai)
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Unit Layanan Transmisi dan Gardu Induk (ULTG) Bekasi
          </p>
        </div>

        {/* Top Horizontal Bar Tabs */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F8FAFC', padding: '6px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('pengajuan')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'pengajuan' ? '#00A2E9' : 'transparent',
              color: activeSubTab === 'pengajuan' ? '#FFFFFF' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            <FilePlus size={18} /> 1. Pengajuan LKS
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('monitoring')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'monitoring' ? '#00A2E9' : 'transparent',
              color: activeSubTab === 'monitoring' ? '#FFFFFF' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            <LayoutDashboard size={18} /> 2. Monitoring LKS
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'pengajuan' && (
        <LksForm onSuccessSubmitted={() => setActiveSubTab('monitoring')} />
      )}

      {activeSubTab === 'monitoring' && (
        <LksMonitoring />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `Sidebar.jsx` to include `lks-dom` case**

In `Sidebar.jsx`, add case for `lks-dom`:
```jsx
      case 'lks-dom':
        return [
          { id: 'lks-overview', label: 'Modul LKS Utama', icon: FileText, desc: 'Pengajuan & Monitoring LKS' },
        ];
```

- [ ] **Step 3: Update `App.jsx` to render `<Lks />` component for `lks-overview`**

Import `Lks` in `App.jsx`:
`import Lks from './pages/Lks';`

Replace the placeholder `lks-overview` div in `App.jsx` with `<Lks />`.

- [ ] **Step 4: Commit Task 4**

```bash
git add src/pages/Lks.jsx src/components/Sidebar.jsx src/App.jsx
git commit -m "feat: integrate Lks page, sidebar menu items, and App router"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-23-lks-menu-implementation.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
