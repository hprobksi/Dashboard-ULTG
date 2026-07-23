import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Download, Trash2, File, AlertCircle, Eye } from 'lucide-react';
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
    if (!selectedFile) {
      setErrorMsg('Silakan pilih file LKS (PDF, DOCX, atau Gambar) yang ingin diunggah!');
      return;
    }
    if (!formData.namaPeralatan) {
      setErrorMsg('Mohon isi Nama Peralatan!');
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

  // Get uploaded files from lksService
  const allRecords = lksService.getAll();
  const uploadedList = allRecords.filter(item => item.filePdfName || item.isUploadedScan);

  const handleDeleteUpload = (id) => {
    if (window.confirm('Hapus arsip file LKS ini?')) {
      lksService.delete(id);
      window.location.reload();
    }
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>No. LKS (Opsional)</label>
              <input
                type="text"
                name="nomorLks"
                placeholder="Auto-generate jika kosong"
                value={formData.nomorLks}
                onChange={handleChange}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Nama Peralatan *</label>
              <input
                type="text"
                name="namaPeralatan"
                placeholder="Contoh: PMT 150kV Bay Trafo 2 GI Bekasi"
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
                placeholder="Contoh: GI 150kV Bekasi Tambun"
                value={formData.penempatanPeralatan}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Jabatan</label>
              <input
                type="text"
                name="pengajuJabatan"
                placeholder="Jabatan Staff"
                value={formData.pengajuJabatan}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
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
              justify: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,162,233,0.3)'
            }}
          >
            <UploadCloud size={18} /> Simpan & Unggah Dokumen LKS
          </button>
        </form>
      </div>

      {/* Uploaded Files Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#00A2E9" /> Arsip File Upload LKS ({uploadedList.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '10px 12px' }}>No. LKS & Tanggal</th>
                <th style={{ padding: '10px 12px' }}>Nama Peralatan</th>
                <th style={{ padding: '10px 12px' }}>Nama File Scan</th>
                <th style={{ padding: '10px 12px' }}>Pengunggah</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {uploadedList.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                    Belum ada file scan LKS yang diunggah.
                  </td>
                </tr>
              ) : (
                uploadedList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.nomorLks}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{item.tanggalKejadian}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{item.dataPeralatan?.namaPeralatan || '-'}</div>
                      <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 800 }}>{item.bidang}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0284C7' }}>
                        <File size={14} /> {item.filePdfName || 'Dokumen_LKS_Scan.pdf'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.fileSize || 'Dokumen Terlampir'}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>
                      {item.pengaju?.nama || 'Staff ULTG'}<br />
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.pengaju?.jabatan}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => alert(`Mengunduh file: ${item.filePdfName || 'Dokumen_LKS.pdf'}`)}
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#334155', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Download size={13} /> Unduh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUpload(item.id)}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
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
    </div>
  );
}
