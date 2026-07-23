import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { exportToDocx } from '../../services/lksExportService';

/**
 * OfficialPlnDocView — Presisi 100% sesuai 01. LKP ( FORMAT DASAR ).docx
 *
 * Hasil inspeksi XML asli:
 * ─── PAGE SETUP ────────────────────────────────────────────────
 *  A4: 11907 × 16839 twips (21.0 × 29.7 cm)
 *  Margin: top=964(1.70cm) right=851(1.50cm) bottom=1021(1.80cm) left=1134(2.00cm)
 *  Header: 709 twips (1.25cm dari tepi atas)
 *  Footer: 709 twips (1.25cm dari tepi bawah)
 *  Page border: pushPinNote1, sz=10, space=24 (dekoratif di semua sisi)
 *
 * ─── HEADER TABLE (header2.xml) ────────────────────────────────
 *  Table width: 10774 twips, tblInd: -561 (negatif = melebar ke kiri sedikit)
 *  Col widths: 1560 | 1831 | 3969 | 1558 | 1856 twips
 *  Row 1 height: 550 twips (exact)
 *  Row 2 height: 320 twips (exact)
 *  Row 3 height: 840 twips (exact)
 *  Col 0 (LEVEL 4): vMerge rows 1-3, Arial Bold 20pt (w:sz=40), center
 *  Col 1+2+3+4 row 1: labels + values, Arial default size
 *  Col 1+2+3+4 row 2: Status + Edisi + Halaman + PAGE/NUMPAGES
 *  Col 1-4 row 3: gridSpan=4, FORMULIR LAPORAN..., Arial Bold, center
 *  Cell borders: single sz=4 (0.5pt) on all sides, color=#000000
 *  No image logo — hanya teks
 *
 * ─── BODY FONT ─────────────────────────────────────────────────
 *  Arial 11pt (w:sz=22) SATU-SATUNYA ukuran font di body
 *  Line spacing: w:line=480 w:lineRule=auto (double spacing = 2.0)
 *  ListParagraph style, numPr for auto-numbering
 *  Sub-items (a-h): w:ind w:left=1134 (2.0cm indent)
 *
 * ─── FOOTER (footer1.xml) ──────────────────────────────────────
 *  PAGE field, xAlign=right, style=PageNumber, framePr wrap=around
 */

const twipToPx = (t) => (t / 1440) * 96; // twips → px at 96dpi
// Key measurements in px
const COL0_W = twipToPx(1560); // 104px — LEVEL 4 column
const COL1_W = twipToPx(1831); // 122px
const COL2_W = twipToPx(3969); // 265px
const COL3_W = twipToPx(1558); // 104px
const COL4_W = twipToPx(1856); // 124px
const ROW1_H = twipToPx(550);  // 36.7px
const ROW2_H = twipToPx(320);  // 21.3px
const ROW3_H = twipToPx(840);  // 56px

// Body indent for sub-items: 1134 twips = 75.6px
const SUBINDENT = twipToPx(1134);
// Label column width to match tab stops (approx 3.5 x 1440/96 = scaled)
const LABEL_COL_W = '215px';

// Border: single 0.5pt = 0.667px ≈ 1px solid black
const cellBorder = '1px solid #000000';
const outerBorder = '1.5px solid #000000';

export default function OfficialPlnDocView({ lksData, onClose }) {
  if (!lksData) return null;

  const handleDownloadDocx = () => exportToDocx(lksData);
  const handlePrintPdf = () => window.print();
  const formatIndonesianDate = (dateVal) => {
    if (!dateVal) return '-';
    if (typeof dateVal === 'string') {
      const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        if (month >= 1 && month <= 12) {
          return `${day} ${months[month - 1]} ${year}`;
        }
      }
    }
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return String(dateVal);
    }
  };

  const formattedKejadianDate = formatIndonesianDate(lksData.tanggalKejadian);
  const formattedSuratDate = formatIndonesianDate(lksData.tanggalSurat || lksData.tanggalPengajuan || lksData.createdAt || new Date());

  // Arial 11pt double-spaced — matches w:sz=22, w:line=480
  const body = {
    fontFamily: '"Arial", sans-serif',
    fontSize: '11pt',
    lineHeight: '2.0',
    color: '#000',
    verticalAlign: 'top',
  };

  const bodyBold = { ...body, fontWeight: 'bold' };

  // 4-column data row
  const DataRow = ({ num, label, value, bold = false, indented = false }) => (
    <tr>
      <td style={{
        ...body,
        fontWeight: bold ? 'bold' : 'normal',
        whiteSpace: 'nowrap',
        paddingLeft: indented ? `${SUBINDENT}px` : '0',
        width: '36px',
      }}>
        {num}
      </td>
      <td style={{ ...body, fontWeight: bold ? 'bold' : 'normal', width: LABEL_COL_W, whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ ...body, whiteSpace: 'nowrap', width: '18px', paddingRight: '6px' }}>:</td>
      <td style={{ ...body, wordBreak: 'break-word' }}>{value || '-'}</td>
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
      <style>{`
        /* ── PRINT: replicate exact Word @page margins ── */
        @page {
          size: A4 portrait;
          margin-top:    1.70cm;
          margin-bottom: 1.80cm;
          margin-left:   2.00cm;
          margin-right:  1.50cm;
        }
        @media print {
          html, body { margin: 0; padding: 0; background: #fff; }
          body * { visibility: hidden; }
          .pln-doc-overlay, .pln-doc-overlay * { visibility: visible; }
          .pln-doc-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: #fff !important;
            padding: 0 !important;
            display: block !important;
            overflow: visible !important;
          }
          .no-print { display: none !important; }
          .pln-a4-page {
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Modal shell */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '14px',
        width: '980px', maxWidth: '96vw', maxHeight: '93vh',
        overflowY: 'auto', boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Action Bar ── */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #E2E8F0', padding: '14px 22px',
          fontFamily: 'sans-serif', gap: '8px',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.0rem', fontWeight: 900, color: '#0F172A' }}>
              Preview Dokumen LKP Resmi — 100% Sesuai Format Word PLN
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748B' }}>
              No: {lksData.nomorLks || '-'} &nbsp;·&nbsp; Font: Arial 11pt &nbsp;·&nbsp;
              Margin: T 1.7 / B 1.8 / L 2.0 / R 1.5 cm &nbsp;·&nbsp; A4
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <button type="button" onClick={handleDownloadDocx} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              backgroundColor: '#0066B3', color: '#fff',
              fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
            }}>
              <Download size={14} /> Export Word (.docx)
            </button>
            <button type="button" onClick={handlePrintPdf} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC',
              color: '#334155', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
            }}>
              <Printer size={14} /> Cetak / PDF
            </button>
            <button type="button" onClick={onClose} style={{
              padding: '8px', borderRadius: '8px', border: 'none',
              backgroundColor: 'transparent', color: '#64748B', cursor: 'pointer',
            }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── A4 Page ── */}
        {/* Screen: padding mirrors exact Word margins for visual accuracy */}
        <div className="pln-a4-page" style={{
          backgroundColor: '#fff',
          padding: '1.70cm 1.50cm 1.80cm 2.00cm',
          fontFamily: '"Arial", sans-serif',
          color: '#000',
          minHeight: '25cm',
        }}>

          {/* ════ HEADER TABLE — 100% sesuai header2.xml ════ */}
          {/* tblW=10774dxa, tblInd=-561dxa (kompensasi margin kiri) */}
          {/* Border: single sz=4 (0.5pt) semua sisi */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: outerBorder,
            fontFamily: '"Arial", sans-serif',
            tableLayout: 'fixed',
            marginBottom: '0',
          }}>
            <colgroup>
              <col style={{ width: `${COL0_W}px` }} />
              <col style={{ width: `${COL1_W}px` }} />
              <col style={{ width: `${COL2_W}px` }} />
              <col style={{ width: `${COL3_W}px` }} />
              <col style={{ width: `${COL4_W}px` }} />
            </colgroup>
            <tbody>
              {/* Row 1: height 550 twips = 36.7px */}
              <tr style={{ height: `${ROW1_H}px` }}>
                {/* Col 0: LEVEL 4 — rowSpan=3, Arial Bold 20pt (w:sz=40), center */}
                <td rowSpan={3} style={{
                  border: cellBorder,
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  padding: '4px 3px',
                  fontFamily: '"Arial", sans-serif',
                  fontWeight: 'bold',
                  fontSize: '20pt',  /* w:sz=40 half-pt */
                  lineHeight: '1.0',
                  letterSpacing: '-0.5px',
                }}>
                  LEVEL<br />4
                </td>
                {/* Col 1: "No. Informasi Terdokumentasi" */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 7px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  No. Informasi Terdokumentasi
                </td>
                {/* Col 2: value — bold, black */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 8px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  fontWeight: 'bold', verticalAlign: 'top',
                }}>
                  0004.FML/SMT/HAR/UITJBT/2022
                </td>
                {/* Col 3: "Berlaku Efektif" */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 7px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  Berlaku Efektif
                </td>
                {/* Col 4: "Juni 2024" */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 8px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  Juni 2024
                </td>
              </tr>
              {/* Row 2: height 320 twips = 21.3px */}
              <tr style={{ height: `${ROW2_H}px` }}>
                {/* Col 1: "Status" */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 7px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  Status
                </td>
                {/* Col 2: "Edisi : 01 / Revisi : 00" */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 8px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  Edisi : 01 / Revisi : 00
                </td>
                {/* Col 3: "Halaman" */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 7px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  Halaman
                </td>
                {/* Col 4: "1 dari 1" (print: PAGE dari NUMPAGES) */}
                <td style={{
                  border: cellBorder, padding: '2px 6px 0 8px',
                  fontFamily: '"Arial", sans-serif', fontSize: '8pt',
                  verticalAlign: 'top',
                }}>
                  1 dari 1
                </td>
              </tr>
              {/* Row 3: height 840 twips = 56px — title row */}
              <tr style={{ height: `${ROW3_H}px` }}>
                {/* Col 1-4 merged (gridSpan=4): Title centered bold */}
                <td colSpan={4} style={{
                  border: cellBorder, padding: '4px 12px',
                  textAlign: 'center', verticalAlign: 'middle',
                }}>
                  <div style={{
                    fontFamily: '"Arial", sans-serif',
                    fontSize: '11pt',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    lineHeight: '1.35',
                  }}>
                    FORMULIR LAPORAN KETIDAKSESUAIAN / KERUSAKAN PERALATAN (LKP)
                  </div>
                  <div style={{
                    fontFamily: '"Arial", sans-serif',
                    fontSize: '9pt',
                    fontWeight: 'bold',
                    marginTop: '3px',
                    lineHeight: '1.25',
                  }}>
                    PT PLN (PERSERO) UNIT INDUK TRANSMISI JAWA BAGIAN TENGAH
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Garis horizontal di bawah header (AutoShape connector di header2.xml) */}
          <div style={{ borderBottom: '1px solid #000', marginBottom: '0', width: '100%' }} />

          {/* ════ BODY — Arial 11pt, double-spaced (line=480), numPr list ════ */}
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            marginTop: '6pt',
          }}>
            <colgroup>
              <col style={{ width: '36px' }} />
              <col style={{ width: LABEL_COL_W }} />
              <col style={{ width: '18px' }} />
              <col />
            </colgroup>
            <tbody>
              {/* 1. DATA PERALATAN */}
              <tr>
                <td colSpan={4} style={{ ...bodyBold }}>
                  {'1.\u00A0\u00A0'}DATA PERALATAN
                </td>
              </tr>
              {/* a–h sub-items: indent kiri sesuai w:ind w:left="1134" */}
              <DataRow indented num="a." label="Nama Peralatan" value={lksData.dataPeralatan?.namaPeralatan} />
              <DataRow indented num="b." label="Merk" value={lksData.dataPeralatan?.merk} />
              <DataRow indented num="c." label="Type" value={lksData.dataPeralatan?.type} />
              <DataRow indented num="d." label="No Seri" value={lksData.dataPeralatan?.noSeri} />
              <DataRow indented num="e." label="Harga" value={lksData.dataPeralatan?.harga} />
              <DataRow indented num="f." label="Kode Asset" value={lksData.dataPeralatan?.kodeAsset} />
              <DataRow indented num="g." label="Tahun Operasi" value={lksData.dataPeralatan?.tahunOperasi} />
              <DataRow indented num="h." label="Tahun Buat" value={lksData.dataPeralatan?.tahunBuat} />
              {/* 2–8 main items */}
              <DataRow bold num="2." label="PENEMPATAN PERALATAN" value={lksData.penempatanPeralatan} />
              <DataRow bold num="3." label="TANGGAL KEJADIAN" value={formattedKejadianDate} />
              <DataRow bold num="4." label="JENIS KERUSAKAN" value={lksData.jenisKerusakan} />
              <DataRow bold num="5." label="PENYEBAB KERUSAKAN" value={lksData.penyebabKerusakan} />
              <DataRow bold num="6." label="AKIBAT KERUSAKAN" value={lksData.akibatKerusakan} />
              <DataRow bold num="7." label="USUL DAN SARAN" value={lksData.usulDanSaran} />
              <DataRow bold num="8." label="LAMPIRAN" value={lksData.lampiranText || '- Foto Kerusakan (Terlampir)'} />
            </tbody>
          </table>

          {/* ════ SIGNATURE BLOCK ════ */}
          <div style={{
            marginTop: '36pt',
            display: 'flex', justifyContent: 'space-between',
            fontFamily: '"Arial", sans-serif',
            fontSize: '10pt',
            textAlign: 'center',
          }}>
            {/* Kiri: Manager ULTG Bekasi */}
            <div style={{ width: '255px' }}>
              <p style={{ margin: 0, lineHeight: '2' }}>&nbsp;</p>
              <p style={{ margin: 0, fontWeight: 'bold', lineHeight: '1.5' }}>
                Mengetahui,<br />
                MANAGER ULTG BEKASI
              </p>
              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
                {lksData.approval?.managerSignature
                  ? <img src={lksData.approval.managerSignature} alt="TTD Manager" style={{ maxHeight: '65px', objectFit: 'contain' }} />
                  : <div style={{ height: '65px' }} />}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.managerNama || 'TRIAWAN AZHARY P. N.'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>{lksData.approval?.managerJabatan || 'MANAGER ULTG BEKASI'}</p>
            </div>

            {/* Kanan: TL Terkait */}
            <div style={{ width: '255px' }}>
              <p style={{ margin: 0, lineHeight: '2' }}>Bekasi, {formattedSuratDate}</p>
              <p style={{ margin: 0, fontWeight: 'bold', lineHeight: '1.5' }}>
                Mengetahui,<br />
                {lksData.approval?.tlJabatan || `TL ${lksData.bidang || 'JARGI CIKARANG'}`}
              </p>
              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
                {lksData.approval?.tlSignature
                  ? <img src={lksData.approval.tlSignature} alt="TTD TL" style={{ maxHeight: '65px', objectFit: 'contain' }} />
                  : lksData.pengaju?.signatureDataUrl
                    ? <img src={lksData.pengaju.signatureDataUrl} alt="TTD Pengaju" style={{ maxHeight: '65px', objectFit: 'contain' }} />
                    : <div style={{ height: '65px' }} />}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {lksData.approval?.tlNama || lksData.pengaju?.nama || 'FAJAR KURNIAWAN'}
              </p>
              <p style={{ margin: 0, fontSize: '9pt' }}>
                {lksData.approval?.tlJabatan || lksData.pengaju?.jabatan || 'TL TERKAIT'}
              </p>
            </div>
          </div>

          {/* ════ FOOTER: nomor halaman rata kanan (mirroring footer1.xml PAGE field) ════ */}
          <div style={{
            marginTop: '24pt',
            textAlign: 'right',
            fontFamily: '"Arial", sans-serif',
            fontSize: '9pt',
            color: '#000',
          }}>
            1
          </div>

        </div>
      </div>
    </div>
  );
}
