import React, { useState } from 'react';
import { FileText, Send, Printer, Download, CheckCircle2, PenTool, Eye, Image as ImageIcon, Trash2 } from 'lucide-react';
import DigitalSignatureModal from './DigitalSignatureModal';
import OfficialPlnDocView from './OfficialPlnDocView';
import { lksService } from '../../services/lksService';
import { exportToDocx } from '../../services/lksExportService';

export default function LksForm({ onSuccessSubmitted }) {
  const [formData, setFormData] = useState({
    nomorLks: '',
    tanggalKejadian: new Date().toISOString().split('T')[0],
    bidang: 'HARPRO',
    namaPeralatan: '',
    merk: '-',
    type: '-',
    noSeri: '-',
    harga: '-',
    kodeAsset: '-',
    tahunOperasi: '-',
    tahunBuat: '-',
    penempatanPeralatan: '',
    jenisKerusakan: '',
    penyebabKerusakan: '',
    akibatKerusakan: '',
    usulDanSaran: '',
    lampiranText: '- Foto Kerusakan (Terlampir)',
    lampiranImages: [],
    pengajuNama: '',
    pengajuNip: '',
    pengajuJabatan: 'Staff Pemeliharaan',
    pengajuSignature: '',
    tlNama: 'AHMAD Y. AL BASTOMY',
    tlJabatan: 'TL HARPRO ULTG BEKASI',
    filePdfName: ''
  });

  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPeralatan || !formData.penempatanPeralatan || !formData.jenisKerusakan) {
      alert('Mohon lengkapi Nama Peralatan, Penempatan Peralatan, dan Jenis Kerusakan!');
      return;
    }

    const created = lksService.create(formData);
    setSubmittedMessage(`Berhasil mengajukan LKS/LKP ${created.nomorLks} (Status: Open)`);
    setTimeout(() => {
      setSubmittedMessage('');
      if (onSuccessSubmitted) onSuccessSubmitted();
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText color="#00A2E9" /> Formulir Lembar Kerja Pemeliharaan / Selesai (LKP / LKS)
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>Format Standar Resmi Draf PLN ULTG Bekasi</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => exportToDocx({
              nomorLks: formData.nomorLks,
              tanggalKejadian: formData.tanggalKejadian,
              bidang: formData.bidang,
              dataPeralatan: {
                namaPeralatan: formData.namaPeralatan,
                merk: formData.merk,
                type: formData.type,
                noSeri: formData.noSeri,
                harga: formData.harga,
                kodeAsset: formData.kodeAsset,
                tahunOperasi: formData.tahunOperasi,
                tahunBuat: formData.tahunBuat
              },
              penempatanPeralatan: formData.penempatanPeralatan,
              jenisKerusakan: formData.jenisKerusakan,
              penyebabKerusakan: formData.penyebabKerusakan,
              akibatKerusakan: formData.akibatKerusakan,
              usulDanSaran: formData.usulDanSaran,
              lampiranText: formData.lampiranText,
              pengaju: { nama: formData.pengajuNama, nip: formData.pengajuNip, jabatan: formData.pengajuJabatan, signatureDataUrl: formData.pengajuSignature },
              approval: { tlNama: formData.tlNama, tlJabatan: formData.tlJabatan, managerNama: 'TRIAWAN AZHARY P. N.', managerJabatan: 'MANAGER ULTG BEKASI' }
            })}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', backgroundColor: '#00A2E9', border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <Download size={16} /> Export Word (.docx)
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', backgroundColor: '#EFF6FF', border: '1px solid #93C5FD', color: '#1D4ED8', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <Eye size={16} /> Pratinjau Draf Official
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <Printer size={16} /> Cetak / Save PDF
          </button>
        </div>
      </div>

      {submittedMessage && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
          <CheckCircle2 size={20} /> {submittedMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section 1: Data Pengajuan & Bidang */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>1. Data Pengajuan & Bidang</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Nomor LKS (Opsional)</label>
              <input
                type="text"
                name="nomorLks"
                placeholder="Otomatis jika dikosongkan"
                value={formData.nomorLks}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tanggal Kejadian *</label>
              <input
                type="date"
                name="tanggalKejadian"
                value={formData.tanggalKejadian}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tim / Bidang *</label>
              <select
                name="bidang"
                value={formData.bidang}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="HARPRO">HARPRO (Pemeliharaan Proteksi)</option>
                <option value="HARGI">HARGI (Pemeliharaan Gardu Induk)</option>
                <option value="HARJAR">HARJAR (Pemeliharaan Jaringan)</option>
                <option value="JARGI">JARGI (Jaringan & Gardu Induk)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: DATA PERALATAN (Matching Draft 1:1) */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00A2E9', margin: '0 0 12px 0' }}>2. DATA PERALATAN</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Nama Peralatan *</label>
              <input
                type="text"
                name="namaPeralatan"
                placeholder="Contoh: KLEM JUMPER Tower No. T.4..."
                value={formData.namaPeralatan}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Merk</label>
              <input
                type="text"
                name="merk"
                placeholder="-"
                value={formData.merk}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Type</label>
              <input
                type="text"
                name="type"
                placeholder="-"
                value={formData.type}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>No Seri</label>
              <input type="text" name="noSeri" value={formData.noSeri} onChange={handleChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Harga</label>
              <input type="text" name="harga" value={formData.harga} onChange={handleChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Kode Asset</label>
              <input type="text" name="kodeAsset" value={formData.kodeAsset} onChange={handleChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Tahun Operasi</label>
              <input type="text" name="tahunOperasi" value={formData.tahunOperasi} onChange={handleChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Tahun Buat</label>
              <input type="text" name="tahunBuat" value={formData.tahunBuat} onChange={handleChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }} />
            </div>
          </div>
        </div>

        {/* Section 3: RINCIAN KEJADIAN & ANOMALI */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>3. Rincian Penempatan, Kerusakan & Saran</h4>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Penempatan Peralatan *</label>
            <input
              type="text"
              name="penempatanPeralatan"
              placeholder="Contoh: SUTT CKRNG-JBBKA T.4 ARAH T.5 Penghantar 1 Fasa S"
              value={formData.penempatanPeralatan}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Jenis Kerusakan *</label>
              <textarea
                name="jenisKerusakan"
                rows={2}
                placeholder="Contoh: Temuan Thermovisi ( Hotspot )"
                value={formData.jenisKerusakan}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Penyebab Kerusakan</label>
              <textarea
                name="penyebabKerusakan"
                rows={2}
                placeholder="Contoh: Kemungkinan klem kendor atau kotor"
                value={formData.penyebabKerusakan}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Akibat Kerusakan</label>
              <textarea
                name="akibatKerusakan"
                rows={2}
                placeholder="Contoh: Dapat menyebabkan kerusakan pada klem"
                value={formData.akibatKerusakan}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Usul Dan Saran / Tindakan</label>
              <textarea
                name="usulDanSaran"
                rows={2}
                placeholder="Contoh: Segera dilakukan perbaikan"
                value={formData.usulDanSaran}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Lampiran Text</label>
            <input
              type="text"
              name="lampiranText"
              placeholder="- Foto Kerusakan (Terlampir)"
              value={formData.lampiranText}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Upload Foto Kerusakan & Dokumentasi (Halaman 2 Lampiran — Bisa Banyak Foto)
              </label>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284C7' }}>
                {(formData.lampiranImages || []).length} Foto Terlampir
              </span>
            </div>

            {/* Render Uploaded Image Thumbnails Grid */}
            {(formData.lampiranImages || []).length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                {formData.lampiranImages.map((imgItem, imgIdx) => (
                  <div key={imgItem.id || imgIdx} style={{ position: 'relative', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={imgItem.dataUrl} alt={`Foto ${imgIdx + 1}`} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      Foto {imgIdx + 1}: {imgItem.name || 'Foto.jpg'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        lampiranImages: prev.lampiranImages.filter((_, idx) => idx !== imgIdx)
                      }))}
                      style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(239,68,68,0.9)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Hapus foto ini"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop / Select Input Box */}
            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '10px',
                padding: '14px 16px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => document.getElementById('lampiran-multi-image-input').click()}
            >
              <input
                id="lampiran-multi-image-input"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        setFormData(prev => ({
                          ...prev,
                          lampiranImages: [
                            ...(prev.lampiranImages || []),
                            { id: Date.now() + Math.random().toString(36).substr(2, 4), dataUrl: evt.target.result, name: file.name }
                          ]
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#00A2E9', fontWeight: 700, fontSize: '0.84rem' }}>
                <ImageIcon size={18} /> + Tambah Foto Kerusakan / Hasil Pengujian (Bisa Pilih Banyak Foto Sekaligus)
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Data Pengaju & TTD Digital */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Data Personil Pengaju (Staff / Pelaksana)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" name="pengajuNama" placeholder="Nama Pengaju (contoh: FAJAR KURNIAWAN)" value={formData.pengajuNama} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }} />
              <input type="text" name="pengajuJabatan" placeholder="Jabatan (contoh: TL JARGI CIKARANG)" value={formData.pengajuJabatan} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }} />
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Tanda Tangan Digital Pengaju</h4>
            {formData.pengajuSignature ? (
              <div style={{ border: '1px solid #10B981', borderRadius: '8px', padding: '8px', backgroundColor: '#F0FDF4', textAlign: 'center' }}>
                <img src={formData.pengajuSignature} alt="TTD" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                <button type="button" onClick={() => setIsSigModalOpen(true)} style={{ display: 'block', margin: '4px auto 0 auto', border: 'none', background: 'none', color: '#0284C7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Ubah TTD</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSigModalOpen(true)}
                style={{ width: '100%', height: '80px', border: '2px dashed #CBD5E1', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#0284C7', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <PenTool size={18} /> Goreskan Tanda Tangan Digital
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          style={{ marginTop: '8px', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,162,233,0.3)' }}
        >
          <Send size={18} /> Simpan & Ajukan LKS (Format Draf PLN)
        </button>
      </form>

      {/* Modal Signature */}
      <DigitalSignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(dataUrl) => setFormData(prev => ({ ...prev, pengajuSignature: dataUrl }))}
        title="Tanda Tangan Digital Pengaju"
      />

      {/* Official PLN Document Modal View */}
      {showPreviewModal && (
        <OfficialPlnDocView
          onClose={() => setShowPreviewModal(false)}
          lksData={{
            nomorLks: formData.nomorLks || 'DRAF',
            tanggalKejadian: formData.tanggalKejadian,
            bidang: formData.bidang,
            dataPeralatan: {
              namaPeralatan: formData.namaPeralatan,
              merk: formData.merk,
              type: formData.type,
              noSeri: formData.noSeri,
              harga: formData.harga,
              kodeAsset: formData.kodeAsset,
              tahunOperasi: formData.tahunOperasi,
              tahunBuat: formData.tahunBuat
            },
            penempatanPeralatan: formData.penempatanPeralatan,
            jenisKerusakan: formData.jenisKerusakan,
            penyebabKerusakan: formData.penyebabKerusakan,
            akibatKerusakan: formData.akibatKerusakan,
            usulDanSaran: formData.usulDanSaran,
            lampiranText: formData.lampiranText,
            lampiranImages: formData.lampiranImages || [],
            pengaju: {
              nama: formData.pengajuNama,
              jabatan: formData.pengajuJabatan,
              signatureDataUrl: formData.pengajuSignature
            },
            approval: {
              tlNama: formData.pengajuNama,
              tlJabatan: formData.pengajuJabatan,
              tlSignature: formData.pengajuSignature,
              managerNama: 'TRIAWAN AZHARY P. N.',
              managerJabatan: 'MANAGER ULTG BEKASI'
            }
          }}
        />
      )}
    </div>
  );
}
