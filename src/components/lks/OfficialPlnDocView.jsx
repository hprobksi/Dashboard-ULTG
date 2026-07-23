import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { exportToDocx } from '../../services/lksExportService';

/**
 * OfficialPlnDocView — Presisi 100% sesuai 01. LKP ( FORMAT DASAR ).docx
 * 
 * Margin asli (dari sectPr twips → cm):
 *   top    : 964  twips = 1.70 cm
 *   bottom : 1021 twips = 1.80 cm
 *   left   : 1134 twips = 2.00 cm
 *   right  : 851  twips = 1.50 cm
 *   header : 709  twips = 1.25 cm
 *   footer : 709  twips = 1.25 cm
 * 
 * Header asli ada di header2.xml (bukan di body document).
 * Footer asli berisi nomor halaman (PAGE dari NUMPAGES).
 * Tidak ada logo gambar — asli hanya teks.
 */

export default function OfficialPlnDocView({ lksData, onClose }) {
  if (!lksData) return null;

  const handleDownloadDocx = () => exportToDocx(lksData);
  const handlePrintPdf = () => window.print();

  const formattedDate = lksData.tanggalKejadian
    ? new Date(lksData.tanggalKejadian).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '-';

  // Shared text style: Arial 11pt, double line-spacing (matching w:spacing w:line="480")
  const bodyText = {
    fontFamily: '"Arial", sans-serif',
    fontSize: '11pt',
    lineHeight: '2.0',
    color: '#000',
    verticalAlign: 'top',
  };

  const boldText = { ...bodyText, fontWeight: 'bold' };

  // 4-column structure: number | label (2cm) | colon | value
  // "1134 twips" indent for sub-items = 2.0 cm
  const LABEL_W = '200px'; // ~3.5cm — matches original tab stops

  const Row = ({ num, label, value, bold = false, subIndent = false }) => (
    <tr>
      <td style={{ ...bodyText, fontWeight: bold ? 'bold' : 'normal', whiteSpace: 'nowrap', paddingLeft: subIndent ? '28px' : '0', width: '32px' }}>
        {num}
      </td>
      <td style={{ ...bodyText, fontWeight: bold ? 'bold' : 'normal', width: LABEL_W, whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ ...bodyText, whiteSpace: 'nowrap', width: '20px', paddingLeft: '2px', paddingRight: '6px' }}>
        :
      </td>
      <td style={{ ...bodyText, wordBreak: 'break-word' }}>
        {value || '-'}
      </td>
    </tr>
  );

  return (
    <div
      className="pln-doc-overlay"
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15,23,42,0.78)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1100, padding: '20px',
      }}
    >
      {/* ── PRINT CSS: replicate exact Word page setup ── */}
      <style>{`
        @page {
          size: A4 portrait;
          /* Exact margins from w:pgMar */
          margin-top:    1.70cm;
          margin-bottom: 1.80cm;
          margin-left:   2.00cm;
          margin-right:  1.50cm;
        }
        @media print {
          html, body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          .pln-doc-overlay,
          .pln-doc-overlay * { visibility: visible; }
          .pln-doc-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: #fff !important;
            padding: 0 !important;
            display: block !important;
            overflow: visible !important;
          }
          .no-print { display: none !important; }
          /* Show only the A4 page */
          .pln-a4-page {
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          /* Running header on every page */
          .pln-running-header { display: table-header-group !important; }
          /* Running footer */
          .pln-running-footer { display: table-footer-group !important; }
        }
        /* Screen: show action bar modal */
        @media screen {
          .pln-running-header { display: none; }
          .pln-running-footer { display: none; }
        }
      `}</style>

      {/* Modal wrapper */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '14px',
        width: '960px', maxWidth: '96vw', maxHeight: '93vh',
        overflowY: 'auto', boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Action Bar (no-print) ── */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #E2E8F0', padding: '16px 24px',
          fontFamily: 'sans-serif',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
              Preview Dokumen LKP Resmi — Sesuai Format PLN Asli
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.77rem', color: '#64748B' }}>
              No: {lksData.nomorLks || '-'} &nbsp;|&nbsp;
              Margin: Atas 1.7cm · Bawah 1.8cm · Kiri 2.0cm · Kanan 1.5cm (A4)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="button" onClick={handleDownloadDocx} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              backgroundColor: '#0066B3', color: '#fff',
              fontWeight: 800, fontSize: '0.83rem', cursor: 'pointer',
            }}>
              <Download size={15} /> Export Word (.docx)
            </button>
            <button type="button" onClick={handlePrintPdf} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC',
              color: '#334155', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer',
            }}>
              <Printer size={15} /> Cetak / PDF
            </button>
            <button type="button" onClick={onClose} style={{
              padding: '8px', borderRadius: '8px', border: 'none',
              backgroundColor: 'transparent', color: '#64748B', cursor: 'pointer',
            }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── A4 Page Content ── */}
        {/* Screen: padded white card; Print: full page via @page */}
        <div className="pln-a4-page" style={{
          backgroundColor: '#fff',
          padding: '1.70cm 1.50cm 1.80cm 2.00cm',  /* mirrors Word margin exactly */
          fontFamily: '"Arial", sans-serif',
          color: '#000',
        }}>

          {/* ════ HEADER TABLE (header2.xml replication) ════ */}
          {/* NO LOGO IMAGE — original Word header is text-only */}
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            border: '1.5pt solid #000',
            marginBottom: '12pt',
            fontFamily: '"Arial", sans-serif',
          }}>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td rowSpan={3} style={{
                  width: '68px', border: '1pt solid #000',
                  padding: '4px 6px', textAlign: 'center',
                  fontWeight: 'bold', fontSize: '8pt', verticalAlign: 'middle',
                  lineHeight: '1.3',
                }}>
                  LEVEL<br />4
                </td>
                <td style={{
                  border: '1pt solid #000', padding: '3px 7px',
                  fontSize: '8pt', fontWeight: 'bold', width: '165px',
                }}>
                  No. Informasi Terdokumentasi
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontSize: '8pt' }}>
                  0004.FML/SMT/HAR/UITJBT/2022
                </td>
                <td style={{
                  border: '1pt solid #000', padding: '3px 7px',
                  fontSize: '8pt', fontWeight: 'bold', width: '90px',
                }}>
                  Berlaku Efektif
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontSize: '8pt', width: '68px' }}>
                  Juni 2024
                </td>
              </tr>
              {/* Row 2 */}
              <tr>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontSize: '8pt', fontWeight: 'bold' }}>
                  Status
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontSize: '8pt' }}>
                  Edisi : 01 / Revisi : 00
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontSize: '8pt', fontWeight: 'bold' }}>
                  Halaman
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontSize: '8pt' }}>
                  1 dari 1
                </td>
              </tr>
              {/* Row 3: Title (no logo) */}
              <tr>
                <td colSpan={4} style={{
                  border: '1pt solid #000', padding: '7px 12px',
                  textAlign: 'center', verticalAlign: 'middle',
                }}>
                  <div style={{ fontFamily: '"Arial", sans-serif', fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '1.4' }}>
                    FORMULIR LAPORAN KETIDAKSESUAIAN / KERUSAKAN PERALATAN (LKP)
                  </div>
                  <div style={{ fontFamily: '"Arial", sans-serif', fontSize: '9pt', fontWeight: 'bold', marginTop: '2px', lineHeight: '1.3' }}>
                    PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ════ BODY — 4-column table (num | label | : | value) ════ */}
          {/* Double line-spacing = w:spacing w:line="480" w:lineRule="auto" */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: '32px' }} />
              <col style={{ width: LABEL_W }} />
              <col style={{ width: '20px' }} />
              <col />
            </colgroup>
            <tbody>

              {/* 1. DATA PERALATAN */}
              <tr>
                <td colSpan={4} style={{ ...boldText, paddingTop: '4pt' }}>
                  1.{'  '}DATA PERALATAN
                </td>
              </tr>

              {/* a–h sub-items (indent kiri 2cm = 28px dalam tabel) */}
              <Row subIndent num="a." label="Nama Peralatan" value={lksData.dataPeralatan?.namaPeralatan} />
              <Row subIndent num="b." label="Merk" value={lksData.dataPeralatan?.merk} />
              <Row subIndent num="c." label="Type" value={lksData.dataPeralatan?.type} />
              <Row subIndent num="d." label="No Seri" value={lksData.dataPeralatan?.noSeri} />
              <Row subIndent num="e." label="Harga" value={lksData.dataPeralatan?.harga} />
              <Row subIndent num="f." label="Kode Asset" value={lksData.dataPeralatan?.kodeAsset} />
              <Row subIndent num="g." label="Tahun Operasi" value={lksData.dataPeralatan?.tahunOperasi} />
              <Row subIndent num="h." label="Tahun Buat" value={lksData.dataPeralatan?.tahunBuat} />

              {/* 2–8 main items */}
              <Row bold num="2." label="PENEMPATAN PERALATAN" value={lksData.penempatanPeralatan} />
              <Row bold num="3." label="TANGGAL KEJADIAN" value={formattedDate} />
              <Row bold num="4." label="JENIS KERUSAKAN" value={lksData.jenisKerusakan} />
              <Row bold num="5." label="PENYEBAB KERUSAKAN" value={lksData.penyebabKerusakan} />
              <Row bold num="6." label="AKIBAT KERUSAKAN" value={lksData.akibatKerusakan} />
              <Row bold num="7." label="USUL DAN SARAN" value={lksData.usulDanSaran} />
              <Row bold num="8." label="LAMPIRAN" value={lksData.lampiranText || '- Foto Kerusakan (Terlampir)'} />

            </tbody>
          </table>

          {/* ════ FOOTER / SIGNATURE BLOCK ════ */}
          {/* footer2.xml has empty text; footer1.xml has PAGE number — handled by @page */}
          <div style={{
            marginTop: '40pt',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: '"Arial", sans-serif',
            fontSize: '10pt',
            textAlign: 'center',
          }}>

            {/* Left: Manager ULTG Bekasi */}
            <div style={{ width: '260px' }}>
              <p style={{ margin: '0', lineHeight: '2' }}>&nbsp;</p>
              <p style={{ margin: '0', fontWeight: 'bold', lineHeight: '1.6' }}>
                Mengetahui,<br />
                MANAGER ULTG BEKASI
              </p>
              <div style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
                {lksData.approval?.managerSignature
                  ? <img src={lksData.approval.managerSignature} alt="TTD Manager" style={{ maxHeight: '68px', objectFit: 'contain' }} />
                  : <div style={{ height: '68px' }} />}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.managerNama || 'TRIAWAN AZHARY P. N.'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>MANAGER ULTG BEKASI</p>
            </div>

            {/* Right: TL Terkait */}
            <div style={{ width: '260px' }}>
              <p style={{ margin: 0, lineHeight: '2' }}>Bekasi, {formattedDate}</p>
              <p style={{ margin: '0', fontWeight: 'bold', lineHeight: '1.6' }}>
                Mengetahui,<br />
                {lksData.approval?.tlJabatan || `TL ${lksData.bidang || 'JARGI CIKARANG'}`}
              </p>
              <div style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
                {lksData.approval?.tlSignature
                  ? <img src={lksData.approval.tlSignature} alt="TTD TL" style={{ maxHeight: '68px', objectFit: 'contain' }} />
                  : lksData.pengaju?.signatureDataUrl
                    ? <img src={lksData.pengaju.signatureDataUrl} alt="TTD Pengaju" style={{ maxHeight: '68px', objectFit: 'contain' }} />
                    : <div style={{ height: '68px' }} />}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.tlNama || lksData.pengaju?.nama || 'FAJAR KURNIAWAN'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>
                NIP. {lksData.approval?.tlNip || lksData.pengaju?.nip || '44767564135'}
              </p>
            </div>

          </div>

          {/* Page number footer (mimics footer1.xml — "PAGE") */}
          <div style={{
            marginTop: '24pt',
            textAlign: 'center',
            fontFamily: '"Arial", sans-serif',
            fontSize: '9pt',
            color: '#555',
          }} className="no-print">
            — Halaman 1 dari 1 —
          </div>

        </div>
      </div>
    </div>
  );
}
