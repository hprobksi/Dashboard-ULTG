import React, { useState, useRef } from 'react';
import { 
  FileText, Send, Printer, Upload, X, PenTool, 
  CheckCircle2, AlertCircle, Calendar, User, MapPin, 
  Building2, Wrench, FileUp, FileCheck, Layers, HelpCircle
} from 'lucide-react';
import lksService from '../../services/lksService';
import DigitalSignatureModal from './DigitalSignatureModal';

export default function LksForm({ onSuccessSubmitted, onCancel, initialData = {} }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [nomorLks, setNomorLks] = useState(initialData.nomorLks || '');
  const [tanggal, setTanggal] = useState(initialData.tanggal || todayStr);
  const [tim, setTim] = useState(initialData.tim || 'HARPRO');
  
  const [namaStaff, setNamaStaff] = useState(initialData.namaStaff || initialData.pelaksana || '');
  const [nip, setNip] = useState(initialData.nip || '');
  const [jabatan, setJabatan] = useState(initialData.jabatan || 'Teknisi Pemeliharaan');
  
  const [substation, setSubstation] = useState(initialData.substation || 'GI 150kV Bekasi');
  const [customSubstation, setCustomSubstation] = useState('');
  const [bay, setBay] = useState(initialData.bay || '');
  const [peralatan, setPeralatan] = useState(initialData.peralatan || '');

  const [uraianTemuan, setUraianTemuan] = useState(initialData.uraianTemuan || initialData.catatan || '');
  const [uraianTindakan, setUraianTindakan] = useState(initialData.uraianTindakan || initialData.uraianPekerjaan || '');

  const [signatureData, setSignatureData] = useState(initialData.signature || null);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listSubstations = [
    'GI 150kV Bekasi',
    'GI 150kV Tambun',
    'GI 150kV Cikarang',
    'GI 150kV Cibatu',
    'GI 150kV Poncol',
    'GI 150kV Bayuning',
    'Lainnya (Input manual)'
  ];

  const validateForm = () => {
    const errs = {};
    if (!namaStaff.trim()) errs.namaStaff = 'Nama Staff Pengaju wajib diisi.';
    
    const finalSubstation = substation === 'Lainnya (Input manual)' ? customSubstation : substation;
    if (!finalSubstation || !finalSubstation.trim()) errs.substation = 'Lokasi Gardu Induk wajib dipilih/diisi.';
    
    if (!uraianTemuan.trim()) errs.uraianTemuan = 'Uraian Temuan / Anomali wajib diisi.';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalSubstation = substation === 'Lainnya (Input manual)' ? customSubstation : substation;
      
      const payload = {
        nomorLks: nomorLks.trim() || undefined,
        tanggal,
        tim,
        namaStaff,
        nip,
        jabatan,
        pelaksana: `${namaStaff}${nip ? ` (${nip})` : ''}`,
        substation: finalSubstation,
        bay,
        peralatan: peralatan || bay,
        uraianTemuan,
        uraianTindakan,
        uraianPekerjaan: uraianTindakan || uraianTemuan,
        catatan: uraianTemuan,
        signature: signatureData,
        scanFileName: pdfFile ? pdfFile.name : null,
        scanFileSize: pdfFile ? (pdfFile.size / 1024).toFixed(1) + ' KB' : null
      };

      const createdRecord = lksService.create(payload);
      setSubmittedResult(createdRecord);

      if (onSuccessSubmitted) {
        onSuccessSubmitted(createdRecord);
      }
    } catch (err) {
      console.error('Failed to save LKS:', err);
      setErrors({ submit: 'Gagal menyimpan LKS. Terjadi kesalahan pada penyimpanan data.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetForm = () => {
    setNomorLks('');
    setTanggal(todayStr);
    setTim('HARPRO');
    setNamaStaff('');
    setNip('');
    setJabatan('Teknisi Pemeliharaan');
    setSubstation('GI 150kV Bekasi');
    setCustomSubstation('');
    setBay('');
    setPeralatan('');
    setUraianTemuan('');
    setUraianTindakan('');
    setSignatureData(null);
    setPdfFile(null);
    setSubmittedResult(null);
    setErrors({});
  };

  return (
    <div className="lks-form-wrapper" style={{ maxWidth: '920px', margin: '0 auto', padding: '16px' }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-lks-document, .printable-lks-document * {
            visibility: visible;
          }
          .printable-lks-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Success Feedback Alert */}
      {submittedResult && (
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#DCFCE7', color: '#16A34A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#15803D', fontSize: '1.15rem', fontWeight: 700 }}>
                LKS Berhasil Disimpan & Diajukan!
              </h3>
              <p style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '0.9rem' }}>
                Dokumen Lembar Kerja Selesai telah tersimpan dengan nomor <strong>{submittedResult.nomorLks}</strong> dan ID <code>{submittedResult.id}</code>.
              </p>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px',
                    backgroundColor: '#166534', color: '#FFFFFF',
                    border: 'none', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={16} /> Cetak / Export PDF
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px',
                    backgroundColor: '#FFFFFF', color: '#166534',
                    border: '1px solid #BBF7D0', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={16} /> Buat LKS Baru
                </button>

                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    style={{
                      padding: '8px 16px', borderRadius: '8px',
                      backgroundColor: 'transparent', color: '#4B5563',
                      border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Kembali ke Daftar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Printable LKS Form Container */}
      <div className="printable-lks-document" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          backgroundColor: '#005F8A',
          backgroundImage: 'linear-gradient(135deg, #007BB0 0%, #005F8A 100%)',
          color: '#FFFFFF',
          padding: '24px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 10px', borderRadius: '20px',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px'
              }}>
                PLN ULTG BEKASI
              </span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Pemeliharaan & Gangguan</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
              Form Pengajuan Lembar Kerja Selesai (LKS)
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }} className="no-print">
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '9px 16px', borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
            >
              <Printer size={16} /> Print / Export PDF
            </button>
          </div>
        </div>

        {/* Global Submit Error Banner */}
        {errors.submit && (
          <div style={{
            margin: '20px 30px 0 30px', padding: '12px 16px',
            backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5',
            borderRadius: '8px', color: '#DC2626', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          
          {/* Section 1: Informasi Dasar LKS */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: '2px solid #F1F5F9', paddingBottom: '8px'
            }}>
              <FileText size={18} color="#005F8A" /> Informasi Pengajuan LKS
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              {/* Nomor LKS */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Nomor LKS <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Otomatis jika dikosongkan"
                  value={nomorLks}
                  onChange={(e) => setNomorLks(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC',
                    fontSize: '0.9rem', color: '#0F172A', outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  Kosongkan untuk penomoran otomatis format (e.g., 003/LKS/HARPRO/2026).
                </span>
              </div>

              {/* Tanggal Pengajuan */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tanggal Pengajuan <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                      fontSize: '0.9rem', color: '#0F172A', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Tim / Bidang Pemohon */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tim / Bidang Pemohon <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={tim}
                  onChange={(e) => setTim(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem', color: '#0F172A', outline: 'none',
                    fontWeight: 600
                  }}
                >
                  <option value="HARPRO">HARPRO (Pemeliharaan Proteksi)</option>
                  <option value="HARGI">HARGI (Pemeliharaan Gardu Induk)</option>
                  <option value="HARJAR">HARJAR (Pemeliharaan Jaringan)</option>
                  <option value="JARGI">JARGI (Jaringan & Gardu Induk)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Data Staff Pengaju */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: '2px solid #F1F5F9', paddingBottom: '8px'
            }}>
              <User size={18} color="#005F8A" /> Data Staff Pengaju
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              {/* Nama Staff */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Nama Staff <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={namaStaff}
                  onChange={(e) => {
                    setNamaStaff(e.target.value);
                    if (errors.namaStaff) setErrors({ ...errors, namaStaff: null });
                  }}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: errors.namaStaff ? '1px solid #EF4444' : '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF', fontSize: '0.9rem', color: '#0F172A'
                  }}
                />
                {errors.namaStaff && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.namaStaff}
                  </span>
                )}
              </div>

              {/* NIP */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  NIP / No. Pegawai
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 9216102Z"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem', color: '#0F172A'
                  }}
                />
              </div>

              {/* Jabatan */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Jabatan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Junior Engineer HARPRO"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem', color: '#0F172A'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Lokasi Gardu Induk & Peralatan */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: '2px solid #F1F5F9', paddingBottom: '8px'
            }}>
              <Building2 size={18} color="#005F8A" /> Lokasi & Peralatan
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              {/* Lokasi Gardu Induk */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Lokasi Gardu Induk (GI) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={substation}
                  onChange={(e) => {
                    setSubstation(e.target.value);
                    if (errors.substation) setErrors({ ...errors, substation: null });
                  }}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: errors.substation ? '1px solid #EF4444' : '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF', fontSize: '0.9rem', color: '#0F172A',
                    fontWeight: 600
                  }}
                >
                  {listSubstations.map((gi) => (
                    <option key={gi} value={gi}>{gi}</option>
                  ))}
                </select>
                {substation === 'Lainnya (Input manual)' && (
                  <input
                    type="text"
                    placeholder="Ketik Nama GI..."
                    value={customSubstation}
                    onChange={(e) => setCustomSubstation(e.target.value)}
                    style={{
                      marginTop: '8px', width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.9rem'
                    }}
                  />
                )}
                {errors.substation && (
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.substation}
                  </span>
                )}
              </div>

              {/* Bay / Peralatan */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Bay / Switchgear
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bay Trafo 1 60MVA / Line Tambun 1"
                  value={bay}
                  onChange={(e) => setBay(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem', color: '#0F172A'
                  }}
                />
              </div>

              {/* Detail Peralatan */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Detail Komponen / Relay
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Relay Differential SIEMENS 7UT613"
                  value={peralatan}
                  onChange={(e) => setPeralatan(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem', color: '#0F172A'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Uraian Temuan & Tindakan */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#0F172A',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: '2px solid #F1F5F9', paddingBottom: '8px'
            }}>
              <Wrench size={18} color="#005F8A" /> Uraian Temuan & Tindakan
            </h2>

            {/* Uraian Temuan / Anomali */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Uraian Temuan / Anomali <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Jelaskan secara rinci temuan kondisi, indikasi alarm, atau anomali pada peralatan..."
                value={uraianTemuan}
                onChange={(e) => {
                  setUraianTemuan(e.target.value);
                  if (errors.uraianTemuan) setErrors({ ...errors, uraianTemuan: null });
                }}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '8px',
                  border: errors.uraianTemuan ? '1px solid #EF4444' : '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF', fontSize: '0.9rem', color: '#0F172A',
                  resize: 'vertical'
                }}
              />
              {errors.uraianTemuan && (
                <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                  {errors.uraianTemuan}
                </span>
              )}
            </div>

            {/* Uraian Tindakan Perbaikan */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Uraian Tindakan Perbaikan
              </label>
              <textarea
                rows={4}
                placeholder="Jelaskan langkah perbaikan, pengujian rutin/susulan, atau kalibrasi yang telah dilaksanakan..."
                value={uraianTindakan}
                onChange={(e) => setUraianTindakan(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '8px',
                  border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                  fontSize: '0.9rem', color: '#0F172A', resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Section 5: Signature & File Upload */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
          }}>
            {/* Digital Signature Trigger Box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Tanda Tangan Digital Pengaju
              </label>
              
              <div
                onClick={() => setIsSigModalOpen(true)}
                style={{
                  border: signatureData ? '2px solid #0284C7' : '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  backgroundColor: signatureData ? '#F0F9FF' : '#F8FAFC',
                  padding: '16px',
                  minHeight: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!signatureData) e.currentTarget.style.borderColor = '#005F8A';
                }}
                onMouseLeave={(e) => {
                  if (!signatureData) e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                {signatureData ? (
                  <>
                    <img
                      src={signatureData}
                      alt="Tanda tangan staff"
                      style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 600, marginTop: '8px' }}>
                      Klik untuk mengubah TTD
                    </span>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: '#E0F2FE', color: '#0284C7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      <PenTool size={20} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      Klik untuk Tanda Tangan Digital
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                      Canvas Drawing / Upload File TTD
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Upload File Preview Manual Scan LKS */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Upload Scan Berkas LKS Manual <span style={{ color: '#94A3B8', fontWeight: 400 }}>(PDF / Gambar)</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,image/*"
                style={{ display: 'none' }}
              />

              {!pdfFile ? (
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    padding: '16px',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#005F8A'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#CBD5E1'}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: '#F1F5F9', color: '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <FileUp size={20} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    Pilih File PDF / Scan Gambar LKS
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                    Maksimal file 10MB (.pdf, .png, .jpg)
                  </span>
                </div>
              ) : (
                <div style={{
                  border: '1px solid #BAE6FD',
                  borderRadius: '12px',
                  backgroundColor: '#F0F9FF',
                  padding: '16px',
                  minHeight: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px',
                      backgroundColor: '#0284C7', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FileCheck size={22} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', wordBreak: 'break-all' }}>
                        {pdfFile.name}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {(pdfFile.size / 1024).toFixed(1)} KB • Siap Diunggah
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#EF4444', padding: '6px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Hapus Lampiran"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '20px',
            flexWrap: 'wrap'
          }} className="no-print">
            <div>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    padding: '10px 20px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    color: '#475569', fontSize: '0.9rem', fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '8px',
                  border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC',
                  color: '#0F172A', fontSize: '0.9rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              >
                <Printer size={18} /> Print / Export PDF
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 24px', borderRadius: '8px',
                  border: 'none', backgroundColor: '#005F8A',
                  color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 95, 138, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#004A6B';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#005F8A';
                }}
              >
                <Send size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan & Ajukan LKS'}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* Signature Modal */}
      <DigitalSignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(dataUrl) => setSignatureData(dataUrl)}
        title="Tanda Tangan Staff Pengaju"
      />
    </div>
  );
}
