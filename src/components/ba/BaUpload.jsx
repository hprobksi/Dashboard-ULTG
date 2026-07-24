import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, Calendar, Building2, Cpu, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { storageService } from '../../services/storage';

export default function BaUpload({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    noBA: '',
    judul: '',
    bidang: 'HARPRO',
    tanggal: new Date().toISOString().split('T')[0],
    garduInduk: 'GIS New Tambun',
    bay: '',
    deskripsi: '',
    penandatangan: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const garduIndukOptions = [
    'GIS New Tambun',
    'GI 150kV Bekasi',
    'GI 150kV Tambun',
    'GI 150kV Blimbing',
    'GI 150kV Poncol',
    'GI 150kV Babelan',
    'GI 150kV Pondok Kelapa',
    'GI 150kV Jatiwaringin',
    'Lainnya'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal 15 MB.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.noBA.trim() || !formData.judul.trim()) {
      setErrorMsg('Harap isi No. Berita Acara dan Judul BA.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const newItem = {
        id: `ba_${Date.now()}`,
        ...formData,
        fileName: selectedFile ? selectedFile.name : 'Dokumen_Berita_Acara.pdf',
        fileUrl: filePreview || '/BA/29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf',
        uploadedAt: new Date().toISOString()
      };

      await storageService.saveBaItem(newItem);

      setSuccessMsg('✅ Berita Acara berhasil diunggah dan disimpan ke sistem!');
      setFormData({
        noBA: '',
        judul: '',
        bidang: 'HARPRO',
        tanggal: new Date().toISOString().split('T')[0],
        garduInduk: 'GIS New Tambun',
        bay: '',
        deskripsi: '',
        penandatangan: ''
      });
      setSelectedFile(null);
      setFilePreview(null);

      if (onUploadSuccess) {
        setTimeout(() => onUploadSuccess(newItem), 1200);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menyimpan data Berita Acara.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Container Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #CBD5E1',
        padding: '28px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UploadCloud size={24} style={{ color: '#0284C7' }} />
              Form Input & Unggah Berita Acara (BA)
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '0.88rem', fontWeight: 600 }}>
              Silakan lengkapi metadata dokumen dan lampirkan berkas scan BA resmi (PDF / Word)
            </p>
          </div>
          <span style={{
            backgroundColor: '#E0F2FE',
            color: '#0369A1',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.02em'
          }}>
            ULTG BEKASI
          </span>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '14px 18px', color: '#166534', fontWeight: 700, fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#166534" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '14px 18px', color: '#991B1B', fontWeight: 700, fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#991B1B" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* SECTION 1: METADATA UTAMA */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#0284C7' }} />
              1. Identitas Dokumen & Bidang Pekerjaan
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Bidang Pekerjaan *
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'nowrap' }}>
                  {['GI', 'HARGI', 'HARPRO', 'HARJAR'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, bidang: b })}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: formData.bidang === b ? '2px solid #0284C7' : '1px solid #CBD5E1',
                        backgroundColor: formData.bidang === b ? '#E0F2FE' : '#FFFFFF',
                        color: formData.bidang === b ? '#0369A1' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  No. Berita Acara *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: 29042026/BA-HARPRO/ULTG-BKS"
                  value={formData.noBA}
                  onChange={e => setFormData({ ...formData, noBA: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Judul Berita Acara *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Aktivasi Tripping 1 dan 2 Bay Jatiwaringin #1 GIS New Tambun"
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: LOKASI & TANGGAL */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} style={{ color: '#0284C7' }} />
              2. Lokasi & Tanggal Pelaksanaan
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Gardu Induk / Lokasi *
                </label>
                <select
                  value={formData.garduInduk}
                  onChange={e => setFormData({ ...formData, garduInduk: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700, backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                >
                  {garduIndukOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Bay / Peralatan Terkait
                </label>
                <input
                  type="text"
                  placeholder="Misal: Bay Jatiwaringin #1 / Trafo #1"
                  value={formData.bay}
                  onChange={e => setFormData({ ...formData, bay: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Tanggal Berita Acara *
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                  style={{ width: '100%', padding: '9px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700, color: '#0369A1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Penandatangan / Tim Pelaksana
                </label>
                <input
                  type="text"
                  placeholder="Misal: Tim Harpro / Spv HARGI"
                  value={formData.penandatangan}
                  onChange={e => setFormData({ ...formData, penandatangan: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Deskripsi / Ringkasan Pekerjaan
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan uraian singkat hasil pekerjaan atau pengujian..."
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 600, boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* SECTION 3: UPLOAD FILE */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={18} style={{ color: '#0284C7' }} />
              3. Lampiran Berkas PDF / Scan BA
            </h4>

            <div style={{
              border: '2px dashed #94A3B8',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="ba-file-upload"
              />
              <label htmlFor="ba-file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={36} color="#0284C7" />
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                  {selectedFile ? selectedFile.name : 'Klik untuk memilih file scan PDF / Word Berita Acara'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  Format disukai: PDF (Maksimal 15MB)
                </span>
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Simpan & Unggah Berita Acara
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
