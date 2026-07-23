import React, { useState } from 'react';
import { FileText, Send, Printer, Upload, CheckCircle2, PenTool, Eye } from 'lucide-react';
import DigitalSignatureModal from './DigitalSignatureModal';
import { lksService } from '../../services/lksService';

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
    setSubmittedMessage(`Berhasil mengajukan LKS/LKP ${created.nomorLks} (Status: On Progress)`);
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
            onClick={() => setShowPreviewModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', backgroundColor: '#EFF6FF', border: '1px solid #93C5FD', color: '#1D4ED8', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <Eye size={16} /> Pratinjau Draf
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <Printer size={16} /> Print / Cetak PDF
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
        </div>

        {/* Section 4: Data Pengaju & TTD Digital */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Data Personil Pengaju (Staff / Pelaksana)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" name="pengajuNama" placeholder="Nama Pengaju (contoh: FAJAR KURNIAWAN)" value={formData.pengajuNama} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }} />
              <input type="text" name="pengajuNip" placeholder="NIP Pengaju" value={formData.pengajuNip} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }} />
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

      {/* Modal Draft Preview 1:1 format PLN */}
      {showPreviewModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', width: '800px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontFamily: 'serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/ULTG.png" alt="PLN" style={{ height: '40px' }} onError={(e) => e.target.style.display = 'none'} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>PT PLN (PERSERO) ULTG BEKASI</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>LEMBAR KERJA PEMELIHARAAN (LKP)</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowPreviewModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', fontFamily: 'sans-serif' }}>✕</button>
            </div>

            {/* Content Preview 1:1 like docx */}
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#000' }}>
              <h3 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px' }}>LEMBAR KERJA PEMELIHARAAN (LKP)</h3>
              
              <p style={{ fontWeight: 'bold', margin: '12px 0 4px 0' }}>DATA PERALATAN</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                <tbody>
                  <tr><td style={{ width: '160px' }}>Nama Peralatan</td><td>: {formData.namaPeralatan || '-'}</td></tr>
                  <tr><td>Merk</td><td>: {formData.merk || '-'}</td></tr>
                  <tr><td>Type</td><td>: {formData.type || '-'}</td></tr>
                  <tr><td>No Seri</td><td>: {formData.noSeri || '-'}</td></tr>
                  <tr><td>Harga</td><td>: {formData.harga || '-'}</td></tr>
                  <tr><td>Kode Asset</td><td>: {formData.kodeAsset || '-'}</td></tr>
                  <tr><td>Tahun Operasi</td><td>: {formData.tahunOperasi || '-'}</td></tr>
                  <tr><td>Tahun Buat</td><td>: {formData.tahunBuat || '-'}</td></tr>
                </tbody>
              </table>

              <p style={{ margin: '8px 0' }}><b>PENEMPATAN PERALATAN:</b> {formData.penempatanPeralatan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>TANGGAL KEJADIAN:</b> {formData.tanggalKejadian || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>JENIS KERUSAKAN:</b> {formData.jenisKerusakan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>PENYEBAB KERUSAKAN:</b> {formData.penyebabKerusakan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>AKIBAT KERUSAKAN:</b> {formData.akibatKerusakan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>USUL DAN SARAN:</b> {formData.usulDanSaran || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>LAMPIRAN:</b> {formData.lampiranText || '-'}</p>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 60px 0' }}><b>Mengetahui,<br />{formData.tlJabatan || 'TL TERKAIT'}</b></p>
                  <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>{formData.pengajuNama || 'FAJAR KURNIAWAN'}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>NIP. {formData.pengajuNip || '-'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 60px 0' }}>Bekasi, {formData.tanggalKejadian}<br /><b>Mengetahui,<br />MANAGER ULTG BEKASI</b></p>
                  <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>TRIAWAN AZHARY P. N.</p>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>MANAGER ULTG BEKASI</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'right', fontFamily: 'sans-serif' }}>
              <button type="button" onClick={handlePrint} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#00A2E9', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Print Draf Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
