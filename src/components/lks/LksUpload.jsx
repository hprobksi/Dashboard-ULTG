import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, File, AlertCircle } from 'lucide-react';
import lksService from '../../services/lksService';

export default function LksUpload({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    nomorLks: '',
    tanggalKejadian: new Date().toISOString().split('T')[0],
    bidang: 'HARPRO',
    namaPeralatan: '',
    penempatanPeralatan: '',
    pengajuNama: '',
    pengajuJabatan: 'Staff Pemeliharaan',
    keterangan: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nomorLks.trim()) {
      setErrorMsg('Mohon isi No. LKS sesuai penomoran dokumen yang diunggah!');
      return;
    }
    if (!formData.namaPeralatan.trim()) {
      setErrorMsg('Mohon isi Judul LKS!');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Silakan pilih file LKS (PDF, DOCX, atau Gambar) yang ingin diunggah!');
      return;
    }

    // Save record via lksService
    const created = lksService.create({
      ...formData,
      jenisKerusakan: formData.keterangan || 'Dokumen Scan / Upload Manual LKS',
      filePdfName: selectedFile.name,
      fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
      fileType: selectedFile.type,
      isUploadedScan: true
    });

    setSuccessMsg(`Berhasil mengunggah dokumen LKS ${created.nomorLks} (${selectedFile.name})`);
    setSelectedFile(null);
    setFormData({
      nomorLks: '',
      tanggalKejadian: new Date().toISOString().split('T')[0],
      bidang: 'HARPRO',
      namaPeralatan: '',
      penempatanPeralatan: '',
      pengajuNama: '',
      pengajuJabatan: 'Staff Pemeliharaan',
      keterangan: '',
    });

    setTimeout(() => {
      setSuccessMsg('');
      if (onUploadSuccess) onUploadSuccess();
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Upload Form Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        <div style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UploadCloud color="#00A2E9" size={26} /> Form Upload Dokumen / Scan LKS (PDF & Word)
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Unggah arsip dokumen LKS / LKP yang telah ditandatangani atau di-scan manual
          </p>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '12px 16px', color: '#166534', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '12px 16px', color: '#991B1B', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Metadata Rows */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>No. LKS (Wajib Diisi) *</label>
              <input
                type="text"
                name="nomorLks"
                placeholder="Nomor LKS sesuai dokumen (contoh: 001/LKS/ULTG-BKS/2026)"
                value={formData.nomorLks}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Tanggal LKS *</label>
              <input
                type="date"
                name="tanggalKejadian"
                value={formData.tanggalKejadian}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Judul LKS *</label>
              <input
                type="text"
                name="namaPeralatan"
                placeholder="Contoh: Temuan Thermovisi Klem Jumper T.4 SUTT Cikarang - Jababeka"
                value={formData.namaPeralatan}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Penempatan / Lokasi GI</label>
              <input
                type="text"
                name="penempatanPeralatan"
                placeholder="Contoh: SUTT CKRNG-JBBKA T.4 ARAH T.5"
                value={formData.penempatanPeralatan}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Nama Pengunggah / Staff</label>
              <input
                type="text"
                name="pengajuNama"
                placeholder="Nama Staff / Petugas Pengunggah"
                value={formData.pengajuNama}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Team Pemeliharaan Terkait *</label>
              <select
                name="bidang"
                value={formData.bidang || 'HARPRO'}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#FFFFFF' }}
              >
                <option value="HARGI">HARGI (Pemeliharaan Gardu Induk)</option>
                <option value="HARPRO">HARPRO (Pemeliharaan Proteksi)</option>
                <option value="HARJAR">HARJAR (Pemeliharaan Jaringan)</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop File Upload Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>File Dokumen LKS (PDF / DOCX / Image) *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: dragActive ? '2px dashed #00A2E9' : '2px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: dragActive ? '#F0F9FF' : '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {selectedFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <File size={32} color="#00A2E9" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{selectedFile.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{(selectedFile.size / 1024).toFixed(1)} KB — Siap Diunggah</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    style={{ marginLeft: '12px', padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#FEF2F2', color: '#EF4444', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <UploadCloud size={38} color="#00A2E9" />
                  <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.92rem' }}>Klik atau Tarik File Ke Sini Untuk Upload</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Mendukung format PDF, Word (.docx), atau Gambar Scan (PNG/JPG) max 25MB</div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#00A2E9',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,162,233,0.3)'
            }}
          >
            <UploadCloud size={18} /> Simpan & Unggah Dokumen LKS
          </button>
        </form>
      </div>

    </div>
  );
}
