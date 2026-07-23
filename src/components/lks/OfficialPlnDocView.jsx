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
      
      {/* Print CSS styles injection for 100% pixel-perfect A4 printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .pln-modal-overlay, .pln-modal-overlay * {
            visibility: visible;
          }
          .pln-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-pln-document {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '920px', maxWidth: '95vw', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Modal Action Controls Bar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', fontFamily: 'sans-serif' }}>Dokumen LKP / LKS Resmi Presisi 100% (Standard PLN)</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748B', fontFamily: 'sans-serif' }}>Format: {lksData.nomorLks}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'sans-serif' }}>
            <button
              type="button"
              onClick={handleDownloadDocx}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,162,233,0.3)' }}
            >
              <Download size={16} /> Export File Word (.docx)
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#334155', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
            >
              <Printer size={16} /> Save / Cetak PDF
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

        {/* Printable Official PLN Document Box (100% Matching 01. LKP ( FORMAT DASAR ).docx) */}
        <div className="printable-pln-document" style={{
          backgroundColor: '#FFFFFF',
          padding: '40px 50px',
          color: '#000000',
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '11pt',
          lineHeight: '1.4'
        }}>
          
          {/* HEADER BOX TABLE (Exact 1:1 matching header2.xml) */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5pt solid #000000', marginBottom: '24px' }}>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: '80px', border: '1pt solid #000000', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt', verticalAlign: 'middle' }}>
                  LEVEL 4
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt', width: '160px', fontWeight: 'bold' }}>
                  No. Informasi Terdokumentasi
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt', fontWeight: 'bold' }}>
                  0004.FML/SMT/HAR/UITJBT/2022
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt', width: '100px', fontWeight: 'bold' }}>
                  Berlaku Efektif
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt', width: '80px' }}>
                  Juni 2024
                </td>
              </tr>
              <tr>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt', fontWeight: 'bold' }}>
                  Status
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt' }}>
                  Edisi : 01 / Revisi : 00
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt', fontWeight: 'bold' }}>
                  Halaman
                </td>
                <td style={{ border: '1pt solid #000000', padding: '4px 8px', fontSize: '8pt' }}>
                  1 dari 1
                </td>
              </tr>
              <tr>
                <td style={{ border: '1pt solid #000000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <img src="/ULTG.png" alt="PLN" style={{ height: '38px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                </td>
                <td colSpan={4} style={{ border: '1pt solid #000000', padding: '8px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                    FORMULIR LAPORAN KETIDAKSESUAIAN / KERUSAKAN PERALATAN (LKP)
                  </div>
                  <div style={{ fontSize: '9pt', fontWeight: 'bold', marginTop: '2px' }}>
                    PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH - ULTG BEKASI
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* BODY DOCUMENT PARAGRAPHS & COLON ALIGNED TAB STOPS */}
          <div style={{ fontSize: '11pt' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px', marginTop: 0 }}>
              DATA PERALATAN
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '11pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '220px', padding: '2px 0', verticalAlign: 'top' }}>Nama Peralatan</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.namaPeralatan || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>Merk</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.merk || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>Type</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.type || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>No Seri</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.noSeri || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>Harga</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.harga || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>Kode Asset</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.kodeAsset || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>Tahun Operasi</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.tahunOperasi || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>Tahun Buat</td>
                  <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {lksData.dataPeralatan?.tahunBuat || '-'}</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '220px', padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>PENEMPATAN PERALATAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {lksData.penempatanPeralatan || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>TANGGAL KEJADIAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {formattedDate}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>JENIS KERUSAKAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {lksData.jenisKerusakan || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>PENYEBAB KERUSAKAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {lksData.penyebabKerusakan || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>AKIBAT KERUSAKAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {lksData.akibatKerusakan || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>USUL DAN SARAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {lksData.usulDanSaran || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', verticalAlign: 'top', fontWeight: 'bold' }}>LAMPIRAN</td>
                  <td style={{ padding: '4px 0', verticalAlign: 'top' }}>: {lksData.lampiranText || '- Foto Kerusakan (Terlampir)'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SIGNATORIES BLOCK (EXACT POSITIONS MATED WITH WORD DOCUMENT TABLE 1) */}
          <div style={{ marginTop: '45px', display: 'flex', justifyContent: 'space-between', fontSize: '10.5pt', textAlign: 'center' }}>
            
            {/* Left Column: Manager ULTG Bekasi */}
            <div style={{ width: '280px' }}>
              <p style={{ margin: '0 0 4px 0' }}>&nbsp;</p>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                Mengetahui,<br />
                MANAGER ULTG BEKASI
              </p>
              
              <div style={{ height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}>
                {lksData.approval?.managerSignature ? (
                  <img src={lksData.approval.managerSignature} alt="TTD Manager" style={{ maxHeight: '70px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ height: '70px' }} />
                )}
              </div>

              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.managerNama || 'TRIAWAN AZHARY P. N.'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>
                MANAGER ULTG BEKASI
              </p>
            </div>

            {/* Right Column: TL Terkait */}
            <div style={{ width: '280px' }}>
              <p style={{ margin: '0 0 4px 0' }}>Bekasi, {formattedDate}</p>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                Mengetahui,<br />
                {lksData.approval?.tlJabatan || `TL ${lksData.bidang || 'JARGI CIKARANG'}`}
              </p>

              <div style={{ height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}>
                {lksData.approval?.tlSignature ? (
                  <img src={lksData.approval.tlSignature} alt="TTD TL" style={{ maxHeight: '70px', objectFit: 'contain' }} />
                ) : lksData.pengaju?.signatureDataUrl ? (
                  <img src={lksData.pengaju.signatureDataUrl} alt="TTD Staff" style={{ maxHeight: '70px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ height: '70px' }} />
                )}
              </div>

              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.tlNama || lksData.pengaju?.nama || 'FAJAR KURNIAWAN'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>
                {lksData.approval?.tlNip || lksData.pengaju?.nip || '44767564135'}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
