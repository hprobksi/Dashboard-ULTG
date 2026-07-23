import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { exportToDocx } from '../../services/lksExportService';

export default function OfficialPlnDocView({ lksData, onClose }) {
  if (!lksData) return null;

  const handleDownloadDocx = () => {
    exportToDocx(lksData);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const formattedDate = lksData.tanggalKejadian
    ? new Date(lksData.tanggalKejadian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

  return (
    <div className="pln-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '900px', maxWidth: '95vw', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Modal Controls Header */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>Dokumen Resmi LKP / LKS Standard PLN</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748B' }}>No: {lksData.nomorLks}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleDownloadDocx}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              <Download size={16} /> Export ke Word (.docx)
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#334155', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              <Printer size={16} /> Cetak / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Document Box (A4 Standard 1:1 format PLN) */}
        <div className="printable-pln-document" style={{
          backgroundColor: '#FFFFFF',
          padding: '30px 40px',
          border: '1px solid #CBD5E1',
          color: '#000000',
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '11pt',
          lineHeight: '1.5'
        }}>
          {/* OFFICIAL PLN HEADER TABLE (Exact Header Box from header2.xml) */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', marginBottom: '24px' }}>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: '90px', border: '1px solid #000000', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>
                  LEVEL 4
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt', width: '180px', fontWeight: 'bold' }}>
                  No. Informasi Terdokumentasi
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt', fontWeight: 'bold' }}>
                  0004.FML/SMT/HAR/UITJBT/2022
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt', width: '110px', fontWeight: 'bold' }}>
                  Berlaku Efektif
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt', width: '90px' }}>
                  Juni 2024
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt', fontWeight: 'bold' }}>
                  Status
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt' }}>
                  Edisi : 01 / Revisi : 00
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt', fontWeight: 'bold' }}>
                  Halaman
                </td>
                <td style={{ border: '1px solid #000000', padding: '4px 8px', fontSize: '8pt' }}>
                  1 dari 1
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000000', padding: '8px', textAlign: 'center' }}>
                  <img src="/ULTG.png" alt="PLN" style={{ height: '36px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                </td>
                <td colSpan={4} style={{ border: '1px solid #000000', padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    FORMULIR LAPORAN KETIDAKSESUAIAN / KERUSAKAN PERALATAN (LKP)
                  </div>
                  <div style={{ fontSize: '9pt', fontWeight: 'bold', color: '#1E293B', marginTop: '2px' }}>
                    PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH - ULTG BEKASI
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* DOCUMENT BODY */}
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '11pt', marginBottom: '8px', textDecoration: 'underline' }}>
              DATA PERALATAN
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '10.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '180px', padding: '3px 0' }}>Nama Peralatan</td>
                  <td style={{ padding: '3px 0' }}>: <b>{lksData.dataPeralatan?.namaPeralatan || '-'}</b></td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Merk</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.merk || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Type</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.type || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>No Seri</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.noSeri || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Harga</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.harga || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Kode Asset</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.kodeAsset || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Tahun Operasi</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.tahunOperasi || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0' }}>Tahun Buat</td>
                  <td style={{ padding: '3px 0' }}>: {lksData.dataPeralatan?.tahunBuat || '-'}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10.5pt' }}>
              <div><b>PENEMPATAN PERALATAN:</b> {lksData.penempatanPeralatan || '-'}</div>
              <div><b>TANGGAL KEJADIAN:</b> {formattedDate}</div>
              <div><b>JENIS KERUSAKAN:</b> {lksData.jenisKerusakan || '-'}</div>
              <div><b>PENYEBAB KERUSAKAN:</b> {lksData.penyebabKerusakan || '-'}</div>
              <div><b>AKIBAT KERUSAKAN:</b> {lksData.akibatKerusakan || '-'}</div>
              <div><b>USUL DAN SARAN:</b> {lksData.usulDanSaran || '-'}</div>
              <div><b>LAMPIRAN:</b> {lksData.lampiranText || '- Foto Kerusakan (Terlampir)'}</div>
            </div>
          </div>

          {/* SIGNATURES BLOCK (EXACT POSITIONS FROM DOCX) */}
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', fontSize: '10pt', textAlign: 'center' }}>
            {/* Left Signatory: TL Terkait */}
            <div style={{ width: '260px' }}>
              <p style={{ margin: '0 0 4px 0' }}>&nbsp;</p>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                Mengetahui,<br />
                {lksData.approval?.tlJabatan || `TL ${lksData.bidang || 'TERKAIT'}`}
              </p>
              
              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
                {lksData.approval?.tlSignature ? (
                  <img src={lksData.approval.tlSignature} alt="TTD TL" style={{ maxHeight: '65px', objectFit: 'contain' }} />
                ) : lksData.pengaju?.signatureDataUrl ? (
                  <img src={lksData.pengaju.signatureDataUrl} alt="TTD Pengaju" style={{ maxHeight: '65px', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#CBD5E1', fontSize: '8pt', fontStyle: 'italic' }}>(Tanda Tangan Digital)</span>
                )}
              </div>

              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.tlNama || lksData.pengaju?.nama || 'FAJAR KURNIAWAN'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>
                NIP. {lksData.approval?.tlNip || lksData.pengaju?.nip || '941823901'}
              </p>
            </div>

            {/* Right Signatory: Manager ULTG Bekasi */}
            <div style={{ width: '260px' }}>
              <p style={{ margin: '0 0 4px 0' }}>Bekasi, {formattedDate}</p>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                Mengetahui,<br />
                MANAGER ULTG BEKASI
              </p>

              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
                {lksData.approval?.managerSignature ? (
                  <img src={lksData.approval.managerSignature} alt="TTD Manager" style={{ maxHeight: '65px', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#CBD5E1', fontSize: '8pt', fontStyle: 'italic' }}>(Tanda Tangan Digital)</span>
                )}
              </div>

              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.managerNama || 'TRIAWAN AZHARY P. N.'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>
                MANAGER ULTG BEKASI
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
