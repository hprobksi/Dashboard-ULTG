import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { exportToDocx } from '../../services/lksExportService';

// Tab stop widths (mirroring original Word document tab structure)
// Original uses ListParagraph style with numPr (auto-numbering) + ind w:left="1134"
// In HTML/CSS we replicate with table columns matching tab positions:
// numLabel (auto) | label-col (~3.6cm) | colon | value
const TAB_LABEL_W = '220px'; // approx 3.6cm at 96dpi (matches ind left=1134 twips ≈ 2cm label col)

export default function OfficialPlnDocView({ lksData, onClose }) {
  if (!lksData) return null;

  const handleDownloadDocx = () => exportToDocx(lksData);
  const handlePrintPdf = () => window.print();

  const formattedDate = lksData.tanggalKejadian
    ? new Date(lksData.tanggalKejadian).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '-';

  // Shared run style matching original: Arial 11pt, line-height double (480/240 = 2x)
  const bodyStyle = {
    fontFamily: "'Arial', sans-serif",
    fontSize: '11pt',
    lineHeight: '2',        // double-spaced matching w:spacing w:line="480"
    color: '#000000',
  };

  // Numbered label cell (bold for main items, normal for sub-items)
  const numCell = (text, bold = false) => (
    <td style={{ whiteSpace: 'nowrap', paddingRight: '4px', fontWeight: bold ? 'bold' : 'normal', verticalAlign: 'top', ...bodyStyle }}>
      {text}
    </td>
  );

  const labelCell = (text, bold = false) => (
    <td style={{ width: TAB_LABEL_W, whiteSpace: 'nowrap', fontWeight: bold ? 'bold' : 'normal', verticalAlign: 'top', ...bodyStyle }}>
      {text}
    </td>
  );

  const colonCell = () => (
    <td style={{ whiteSpace: 'nowrap', paddingLeft: '4px', paddingRight: '8px', verticalAlign: 'top', ...bodyStyle }}>
      :
    </td>
  );

  const valueCell = (text) => (
    <td style={{ verticalAlign: 'top', wordBreak: 'break-word', ...bodyStyle }}>
      {text || '-'}
    </td>
  );

  return (
    <div
      className="pln-modal-overlay"
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .pln-modal-overlay, .pln-modal-overlay * { visibility: visible; }
          .pln-modal-overlay {
            position: absolute !important;
            left: 0 !important; top: 0 !important;
            width: 100% !important; height: auto !important;
            background: #fff !important; padding: 0 !important;
          }
          .no-print { display: none !important; }
          .printable-pln-document { border: none !important; box-shadow: none !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '24px', width: '960px', maxWidth: '96vw', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column' }}>

        {/* Action Bar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', fontFamily: 'sans-serif' }}>
              Dokumen LKP Resmi PLN — Format Sesuai Draf Word Asli
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748B', fontFamily: 'sans-serif' }}>
              No: {lksData.nomorLks || '-'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="button" onClick={handleDownloadDocx}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFF', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', fontFamily: 'sans-serif' }}>
              <Download size={15} /> Export Word (.docx)
            </button>
            <button type="button" onClick={handlePrintPdf}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#334155', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', fontFamily: 'sans-serif' }}>
              <Printer size={15} /> Cetak / PDF
            </button>
            <button type="button" onClick={onClose}
              style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#64748B', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── PRINTABLE DOCUMENT ─── */}
        <div className="printable-pln-document" style={{ backgroundColor: '#FFF', padding: '40px 50px', color: '#000' }}>

          {/* HEADER BOX — identical to header2.xml */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5pt solid #000', marginBottom: '18pt', fontFamily: 'Arial, sans-serif', fontSize: '9pt' }}>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ width: '70px', border: '1pt solid #000', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
                  LEVEL 4
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontWeight: 'bold', width: '165px' }}>
                  No. Informasi Terdokumentasi
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px' }}>
                  0004.FML/SMT/HAR/UITJBT/2022
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontWeight: 'bold', width: '95px' }}>
                  Berlaku Efektif
                </td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', width: '72px' }}>
                  Juni 2024
                </td>
              </tr>
              <tr>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontWeight: 'bold' }}>Status</td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px' }}>Edisi : 01 / Revisi : 00</td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px', fontWeight: 'bold' }}>Halaman</td>
                <td style={{ border: '1pt solid #000', padding: '3px 7px' }}>1 dari 1</td>
              </tr>
              <tr>
                <td style={{ border: '1pt solid #000', padding: '6px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <img src="/ULTG.png" alt="PLN" style={{ height: '36px', objectFit: 'contain' }} onError={e => (e.target.style.display = 'none')} />
                </td>
                <td colSpan={4} style={{ border: '1pt solid #000', padding: '7px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    FORMULIR LAPORAN KETIDAKSESUAIAN / KERUSAKAN PERALATAN (LKP)
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', fontWeight: 'bold', marginTop: '1px' }}>
                    PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH - ULTG BEKASI
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ─── BODY: Exact paragraph structure matching original Word numPr layout ─── */}
          {/* Original uses ListParagraph style with double line spacing (480 = 2x) */}
          {/* numId 2 = main numbered list (1. 2. 3. ...) */}
          {/* numId 3 = sub-item list (a. b. c. ...) with indent left=1134 twips */}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: '28px' }} />   {/* number col */}
              <col style={{ width: TAB_LABEL_W }} /> {/* label col */}
              <col style={{ width: '16px' }} />   {/* colon col */}
              <col />                               {/* value col */}
            </colgroup>
            <tbody>

              {/* ── 1. DATA PERALATAN ── */}
              <tr>
                <td colSpan={4} style={{ ...bodyStyle, fontWeight: 'bold', paddingBottom: 0 }}>
                  1.{'  '}DATA PERALATAN
                </td>
              </tr>

              {/* Sub-items a–h: indented (matching w:ind w:left="1134") */}
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>a.</td>
                {labelCell('Nama Peralatan')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.namaPeralatan)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>b.</td>
                {labelCell('Merk')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.merk)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>c.</td>
                {labelCell('Type')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.type)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>d.</td>
                {labelCell('No Seri')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.noSeri)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>e.</td>
                {labelCell('Harga')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.harga)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>f.</td>
                {labelCell('Kode Asset')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.kodeAsset)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>g.</td>
                {labelCell('Tahun Operasi')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.tahunOperasi)}
              </tr>
              <tr>
                <td style={{ ...bodyStyle, paddingLeft: '28px' }}>h.</td>
                {labelCell('Tahun Buat')}
                {colonCell()}
                {valueCell(lksData.dataPeralatan?.tahunBuat)}
              </tr>

              {/* ── 2–8 Main numbered items ── */}
              <tr>
                {numCell('2.', true)}
                {labelCell('PENEMPATAN PERALATAN', true)}
                {colonCell()}
                {valueCell(lksData.penempatanPeralatan)}
              </tr>
              <tr>
                {numCell('3.', true)}
                {labelCell('TANGGAL KEJADIAN', true)}
                {colonCell()}
                {valueCell(formattedDate)}
              </tr>
              <tr>
                {numCell('4.', true)}
                {labelCell('JENIS KERUSAKAN', true)}
                {colonCell()}
                {valueCell(lksData.jenisKerusakan)}
              </tr>
              <tr>
                {numCell('5.', true)}
                {labelCell('PENYEBAB KERUSAKAN', true)}
                {colonCell()}
                {valueCell(lksData.penyebabKerusakan)}
              </tr>
              <tr>
                {numCell('6.', true)}
                {labelCell('AKIBAT KERUSAKAN', true)}
                {colonCell()}
                {valueCell(lksData.akibatKerusakan)}
              </tr>
              <tr>
                {numCell('7.', true)}
                {labelCell('USUL DAN SARAN', true)}
                {colonCell()}
                {valueCell(lksData.usulDanSaran)}
              </tr>
              <tr>
                {numCell('8.', true)}
                {labelCell('LAMPIRAN', true)}
                {colonCell()}
                {valueCell(lksData.lampiranText || '- Foto Kerusakan (Terlampir)')}
              </tr>

            </tbody>
          </table>

          {/* ─── SIGNATURE BLOCK ─── */}
          <div style={{ marginTop: '48pt', display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif', fontSize: '10.5pt', textAlign: 'center' }}>

            {/* Left: Manager ULTG Bekasi */}
            <div style={{ width: '270px' }}>
              <p style={{ margin: 0, lineHeight: '2' }}>&nbsp;</p>
              <p style={{ margin: 0, fontWeight: 'bold', lineHeight: '1.6' }}>
                Mengetahui,<br />
                MANAGER ULTG BEKASI
              </p>
              <div style={{ height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
                {lksData.approval?.managerSignature
                  ? <img src={lksData.approval.managerSignature} alt="TTD Manager" style={{ maxHeight: '70px', objectFit: 'contain' }} />
                  : <div style={{ height: '70px' }} />}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.managerNama || 'TRIAWAN AZHARY P. N.'}
              </p>
              <p style={{ margin: 0 }}>MANAGER ULTG BEKASI</p>
            </div>

            {/* Right: TL Terkait */}
            <div style={{ width: '270px' }}>
              <p style={{ margin: 0, lineHeight: '2' }}>Bekasi, {formattedDate}</p>
              <p style={{ margin: 0, fontWeight: 'bold', lineHeight: '1.6' }}>
                Mengetahui,<br />
                {lksData.approval?.tlJabatan || `TL ${lksData.bidang || 'JARGI CIKARANG'}`}
              </p>
              <div style={{ height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
                {lksData.approval?.tlSignature
                  ? <img src={lksData.approval.tlSignature} alt="TTD TL" style={{ maxHeight: '70px', objectFit: 'contain' }} />
                  : lksData.pengaju?.signatureDataUrl
                    ? <img src={lksData.pengaju.signatureDataUrl} alt="TTD Staff" style={{ maxHeight: '70px', objectFit: 'contain' }} />
                    : <div style={{ height: '70px' }} />}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.tlNama || lksData.pengaju?.nama || 'FAJAR KURNIAWAN'}
              </p>
              <p style={{ margin: 0 }}>
                NIP. {lksData.approval?.tlNip || lksData.pengaju?.nip || '44767564135'}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
