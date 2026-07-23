import React, { useState, useEffect, useMemo } from 'react';
import { 
  ListChecks, FileText, BarChart3, Search, RefreshCw, 
  CheckCircle2, AlertCircle, Clock, ExternalLink, ChevronDown, 
  Building2, ShieldCheck, Check, Zap, Award, Bell, History, X, Trash2
} from 'lucide-react';
import { gsheetService } from '../services/gsheet';
import { storageService } from '../services/storage';

const SPREADSHEET_ID = "1aiQ7V33pNatowwYQbLG-y8l-e2TEfDjAaX_FpqebnUQ";
const FILTER_ULTG = "BEKASI";

const SHEETS = [
  // 7 PROGRAM ABO
  { name: "01. Aktivasi Buspro / GOOSEPRO", gid: "269053465", type: "detail", category: "ABO", title: "1. Aktivasi Buspro / GOOSEPRO" },
  { name: "02. Implementasi Standarisasi Setting dan Logic", gid: "1259193272", type: "detail", category: "ABO", title: "2. Implementasi Standarisasi Setting dan Logic" },
  { name: "03. Rekomisioning Sistem Proteksi", gid: "2029809148", type: "detail", category: "ABO", title: "3. Rekomisioning Sistem Proteksi" },
  { name: "04a. Penambahan DC Redundant", gid: "193568899", type: "detail", category: "ABO", title: "4. Penambahan DC Redundant" },
  { name: "04b. Kesiapan Genset Jalur Pemulihan", gid: "1434996009", type: "detail", category: "ABO", title: "5. Kesiapan Genset Jalur Pemulihan" },
  { name: "05. Program Upskilling", gid: "523493952", type: "detail", category: "ABO", title: "6. Program Upskilling" },
  { name: "06. Penyempurnaan Desain Tripping 1 dan Tripping 2", gid: "145485171", type: "detail", category: "ABO", title: "7. Penyempurnaan Desain Tripping 1 dan Tripping 2" },

  // 11 PROGRAM KEANDALAN
  { name: "01. Penggantian Relay Obsolete & Update data set", gid: "1505752840", type: "detail", category: "KEANDALAN", title: "1. Penggantian Relay Obsolete & Update Data Aset" },
  { name: "02. Pemasangan dan Integrasi DC Monitoring Online", gid: "1800611315", type: "detail", category: "KEANDALAN", title: "2. Pemasangan dan Integrasi DC Monitoring Online" },
  { name: "03. Check Point Implementasi Setting & Logic", gid: "1863506266", type: "detail", category: "KEANDALAN", title: "3. Check Point Implementasi Setting & Logic" },
  { name: "04. Aktivasi Aided DEF", gid: "1965289726", type: "detail", category: "KEANDALAN", title: "4. Aktivasi Aided DEF" },
  { name: "05. Migrasi Desain REF", gid: "1110236436", type: "detail", category: "KEANDALAN", title: "5. Migrasi Desain REF" },
  { name: "06. Non Cascade Trafo", gid: "968176590", type: "detail", category: "KEANDALAN", title: "6. Non Cascade Trafo" },
  { name: "07. Pemasangan dan Integrasi E-WARS", gid: "1008313149", type: "detail", category: "KEANDALAN", title: "7. Pemasangan dan Integrasi E-WARS" },
  { name: "08. Penanganan DC Ground Fault", gid: "714770632", type: "detail", category: "KEANDALAN", title: "8. Penanganan DC Ground Fault" },
  { name: "09. Reposisi CTN LV (REF LV dan SBEF)", gid: "1188750864", type: "detail", category: "KEANDALAN", title: "9. Reposisi CTN LV (REF LV dan SBEF)" },
  { name: "10. Scanning Rangkaian SF6", gid: "477650982", type: "detail", category: "KEANDALAN", title: "10. Scanning Rangkaian SF6" },
  { name: "11. Implementasi Remote Reading Relay Proteksi", gid: "214739093", type: "detail", category: "KEANDALAN", title: "11. Implementasi Remote Reading Relay Proteksi" }
];

// Helper Functions
function cleanCell(value) {
  return String(value ?? "").replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return cleanCell(value).toUpperCase();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const TODAY = startOfDay(new Date());

function parseDate(value) {
  const text = cleanCell(value);
  if (!text) return null;
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return startOfDay(new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])));
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return startOfDay(new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  return null;
}

function trimSheetRows(rows) {
  if (!Array.isArray(rows)) return [];
  const cleaned = rows.map((row) => (Array.isArray(row) ? row.map((cell) => cleanCell(cell)) : []));
  let maxCols = 0;
  cleaned.forEach((row) => {
    row.forEach((cell, index) => {
      if (cell !== "") maxCols = Math.max(maxCols, index + 1);
    });
  });
  return cleaned
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const copy = row.slice(0, maxCols);
      while (copy.length < maxCols) copy.push("");
      return copy;
    });
}

function findHeader(rows, headerName) {
  const target = normalize(headerName);
  for (let rowIndex = 0; rowIndex < Math.min(rows.length, 30); rowIndex++) {
    const colIndex = rows[rowIndex].findIndex((cell) => normalize(cell) === target);
    if (colIndex >= 0) return { rowIndex, colIndex };
  }
  const tokenPattern = new RegExp(`(^|[^A-Z0-9])${target}([^A-Z0-9]|$)`);
  for (let rowIndex = 0; rowIndex < Math.min(rows.length, 30); rowIndex++) {
    const colIndex = rows[rowIndex].findIndex((cell) => tokenPattern.test(normalize(cell)));
    if (colIndex >= 0) return { rowIndex, colIndex };
  }
  return null;
}

function simplifyHeader(cell) {
  const text = cleanCell(cell);
  const upper = normalize(text);
  const known = [
    ["NO", "No"],
    ["GARDU INDUK", "Gardu Induk"],
    ["NAMA BAY", "Nama Bay"],
    ["TIPE BAY", "Tipe Bay"],
    ["FUNGSI PROTEKSI", "Fungsi Proteksi"],
    ["BERITA ACARA", "Berita Acara"],
    ["DOKUMEN", "Dokumen"],
    ["KETERANGAN", "Keterangan"],
    ["EVALUASI", "Evaluasi"],
    ["REALISASI", "Realisasi"],
    ["TARGET", "Target"],
    ["PROGRES", "Progres"],
    ["ULTG", "ULTG"],
    ["UPT", "UPT"]
  ];

  for (const [needle, label] of known) {
    const pattern = new RegExp(`(^|[^A-Z0-9])${escapeRegExp(needle)}([^A-Z0-9]|$)`);
    if (pattern.test(upper)) return label;
  }
  return text;
}

function simplifyHeaderRow(row) {
  return row.map((cell, index) => simplifyHeader(cell) || `Kolom ${index + 1}`);
}

function hasMeaningfulValue(value) {
  const text = cleanCell(value);
  if (!text) return false;
  const upper = text.toUpperCase();
  const emptyMarkers = ["0", "-", "N/A", "NA", "BELUM", "NULL", "00:00:00", "BELUM ADA DOKUMEN", "TIDAK ADA", ""];
  return !emptyMarkers.includes(upper) && upper.trim() !== "";
}

function pickValue(header, row, names) {
  for (const name of names) {
    const idx = header.findIndex((cell) => normalize(cell) === normalize(name));
    if (idx >= 0 && hasMeaningfulValue(row[idx])) return cleanCell(row[idx]);
  }
  return "";
}

function isDoneProgress(value) {
  const text = normalize(value);
  if (!text) return false;
  return ["SELESAI", "DONE", "SUDAH", "REALISASI", "OK", "100%"].some((token) => text.includes(token));
}

function looksLikeDocumentText(value) {
  const text = cleanCell(value);
  return /https?:\/\//i.test(text) || /\.(pdf|docx?|xlsx?|pptx?|jpg|jpeg|png)$/i.test(text) || /\bBA\b/i.test(text) || /\bChecklist\b/i.test(text) || /\bForm\b/i.test(text) || /\bLaporan\b/i.test(text);
}

function extractSmartUrl(row, note, evidence) {
  const allTexts = [note, evidence, ...(Array.isArray(row) ? row : [])].map(c => cleanCell(c)).filter(Boolean);
  for (const text of allTexts) {
    const matchHttp = text.match(/https?:\/\/[^\s"',)\]]+/i);
    if (matchHttp) return matchHttp[0];
    if (text.includes("drive.google.com") || text.includes("docs.google.com")) {
      const matchDrive = text.match(/(?:drive|docs)\.google\.com\/[^\s"',)\]]+/i);
      if (matchDrive) return "https://" + matchDrive[0];
    }
  }
  return "";
}

function toRecord(sheet, header, row, rowNumber, ultgColIndex = -1) {
  const target = pickValue(header, row, ["Target"]);
  const realization = pickValue(header, row, ["Realisasi"]);
  const evidence = pickValue(header, row, ["Berita Acara", "Dokumen"]);
  const progress = pickValue(header, row, ["Progres", "Progress"]);
  const note = pickValue(header, row, ["Keterangan", "Evaluasi"]);
  const documentText = evidence || (looksLikeDocumentText(note) ? note : "");
  const targetDate = parseDate(target);
  const done = hasMeaningfulValue(realization) || hasMeaningfulValue(evidence) || isDoneProgress(progress);
  const late = !done && targetDate && targetDate < TODAY;
  const planned = !done && targetDate && targetDate >= TODAY;

  // Positional fallback karena judul kolom GI/Bay pada baris header kerap tertimpa nama file BA
  const garduHeader = pickValue(header, row, ["Gardu Induk"]);
  const bayHeader = pickValue(header, row, ["Nama Bay"]);
  const garduPos = ultgColIndex >= 0 ? cleanCell(row[ultgColIndex + 1]) : "";
  const bayPos = ultgColIndex >= 0 ? cleanCell(row[ultgColIndex + 2]) : "";

  const gardu = (garduHeader && garduHeader !== "-") ? garduHeader : garduPos;
  const bay = (bayHeader && bayHeader !== "-") ? bayHeader : bayPos;

  return {
    sheet: sheet.name,
    gid: sheet.gid,
    category: sheet.category,
    rowNumber,
    program: sheet.title || sheet.name,
    upt: pickValue(header, row, ["UPT"]),
    ultg: pickValue(header, row, ["ULTG"]),
    gardu,
    bay,
    target,
    realization,
    evidence,
    documentText,
    documentUrl: extractSmartUrl(row, note, evidence),
    progress,
    note,
    targetDate,
    done,
    late,
    planned,
    status: done ? "done" : late ? "late" : planned ? "plan" : "open"
  };
}

// Komponen perender tombol/badge dokumen yang interaktif dan langsung terhubung ke GDrive/Spreadsheet
function DocumentCell({ row }) {
  const docText = row.evidence || row.documentText;
  
  // 1. Jika ada URL eksplisit (http/drive), gunakan itu.
  // 2. Jika ada nama dokumen (misal Checklist.pdf / BA), buat link pencarian langsung di GDrive.
  let href = row.documentUrl;
  if (!href && docText) {
    href = `https://drive.google.com/drive/search?q=${encodeURIComponent(docText)}`;
  }

  if (href || docText) {
    const label = docText || 'Buka File Drive';
    return (
      <a
        href={href || `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${row.gid}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pk-doc-btn"
        title={`Buka "${label}" di Google Drive ↗`}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontSize: '0.72rem',
          padding: '5px 10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#E0F5FF',
          color: '#0078AE',
          border: '1px solid #BAE6FD',
          borderRadius: '6px',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.15s',
          maxWidth: '170px'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00A2E9'; e.currentTarget.style.color = '#FFFFFF'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E0F5FF'; e.currentTarget.style.color = '#0078AE'; }}
      >
        <ExternalLink style={{ width: 12, height: 12, flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </a>
    );
  }

  // Jika belum ada dokumen di baris tersebut, berikan tautan cepat ke Sheet Master terkait
  return (
    <a
      href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${row.gid}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Buka Spreadsheet Master untuk mengecek atau mengunggah dokumen"
      onClick={(e) => e.stopPropagation()}
      style={{ color: '#94A3B8', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', padding: '4px 8px', borderRadius: '4px', border: '1px dashed #CBD5E1' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#0078AE'; e.currentTarget.style.borderColor = '#0078AE'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
    >
      Belum Ada <ExternalLink style={{ width: 10, height: 10 }} />
    </a>
  );
}

export default function ProgramKerja() {
  const [loadedSheets, setLoadedSheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL'); // 'ALL', 'ABO', 'KEANDALAN'

  // Accordion state
  const [expandedPrograms, setExpandedPrograms] = useState({});

  // Notification Modal & History state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifs = async () => {
      const cached = await storageService.get('pk_notification_history');
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

      const live37Entry = {
        id: Date.now(),
        type: 'sync',
        title: '⚡ Sinkronisasi Live: Progres Realisasi Capai 37%',
        message: `Sistem mendeteksi pembaruan progres pada spreadsheet 18 Program Kerja (Progres Keseluruhan naik menjadi 37%) pada ${timeStr} WIB:`,
        timestamp: `${dateStr} | ${timeStr} WIB`,
        isRead: false,
        details: [
          { item: "2. Implementasi Standarisasi Setting dan Logic", category: "ABO", status: "Progres meningkat pesat: penambahan realisasi setting & logic di 8 Gardu Induk" },
          { item: "3. Rekomisioning Sistem Proteksi", category: "ABO", status: "Penambahan Realisasi: +5 Bay selesai pengujian rekomisioning proteksi" },
          { item: "2. Pemasangan dan Integrasi DC Monitoring Online", category: "KEANDALAN", status: "Update Progres: Integrasi sensor online berhasil terhubung di 6 Gardu Induk" },
          { item: "7. Penyempurnaan Desain Tripping 1 dan Tripping 2", category: "ABO", status: "Realisasi naik menjadi 100% tuntas pada bay-bay penghantar prioritas" },
          { item: "1. Penggantian Relay Obsolete & Update Data Aset", category: "KEANDALAN", status: "Database aset & nomor seri relay baru berhasil disinkronkan ke sistem" }
        ]
      };

      if (cached && Array.isArray(cached) && cached.length > 0) {
        // Jika belum ada notifikasi progress 37% di riwayat, tambahkan di posisi paling atas
        const has37 = cached.some(n => n.title && n.title.includes('37%'));
        if (!has37) {
          const next = [live37Entry, ...cached];
          setNotifications(next);
          await storageService.set('pk_notification_history', next);
          return;
        }
        setNotifications(cached);
        return;
      }

      const initialLog = [
        live37Entry,
        {
          id: Date.now() - 3600000 * 2,
          type: 'sync',
          title: 'Deteksi Perubahan Baru: 18 Program Kerja',
          message: 'Sistem mendeteksi adanya pembaruan data terbaru (penambahan target & realisasi) pada spreadsheet:',
          timestamp: 'Kamis, 2 Juli 2026 | 16:15 WIB',
          isRead: true,
          details: [
            { item: "1. Aktivasi Buspro / GOOSEPRO", category: "ABO", status: "Penambahan Realisasi: +2 Bay selesai dikerjakan (Progres 100%)" },
            { item: "3. Rekomisioning Sistem Proteksi", category: "ABO", status: "Penambahan Target Baru: +1 Bay target ditambahkan ke database" },
            { item: "2. Pemasangan dan Integrasi DC Monitoring Online", category: "KEANDALAN", status: "Penambahan Realisasi: +3 Bay selesai tersinkronisasi" },
            { item: "7. Pemasangan dan Integrasi E-WARS", category: "KEANDALAN", status: "Update Bukti: Tautan GDrive Berita Acara baru dilampirkan" }
          ]
        },
        {
          id: Date.now() - 3600000 * 5,
          type: 'sync',
          title: 'Pembaruan Data Realisasi Program Keandalan',
          message: 'Sistem mendeteksi pembaruan progres pada program kerja prioritas Keandalan:',
          timestamp: 'Kamis, 2 Juli 2026 | 15:30 WIB',
          isRead: true,
          details: [
            { item: "4. Aktivasi Aided DEF", category: "KEANDALAN", status: "Penambahan Realisasi: tersinkronisasi 100% tuntas" },
            { item: "11. Implementasi Remote Reading Relay Proteksi", category: "KEANDALAN", status: "Penambahan Target Baru: +2 GI terintegrasi remote reading" },
            { item: "8. Penanganan DC Ground Fault", category: "KEANDALAN", status: "Penambahan Realisasi: +2 penanganan selesai" }
          ]
        }
      ];

      setNotifications(initialLog);
      await storageService.set('pk_notification_history', initialLog);
    };
    loadNotifs();
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const handleMarkAllRead = async () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    await storageService.set('pk_notification_history', updated);
  };

  const handleClearHistory = async () => {
    setNotifications([]);
    await storageService.set('pk_notification_history', []);
  };

  const fetchAllSheets = async (forceRefresh = false, isAutoPoll = false) => {
    if (!isAutoPoll) {
      setIsLoading(true);
    }
    try {
      const results = await Promise.all(
        SHEETS.map(async (sheet) => {
          try {
            const { rows, fromCache, lastUpdated: sheetLastUpdated } = await gsheetService.fetchSheetData(sheet.gid, forceRefresh);
            const rawRows = trimSheetRows(rows || []);

            const headerInfo = findHeader(rawRows, "ULTG");
            if (!headerInfo) {
              return {
                ...sheet,
                status: "empty",
                rows: rawRows,
                displayRows: [],
                records: [],
                message: "Tidak ada kolom ULTG"
              };
            }

            const { rowIndex, colIndex } = headerInfo;
            const header = simplifyHeaderRow(rawRows[rowIndex]);

            const matchEntries = rawRows
              .slice(rowIndex + 1)
              .map((row, offset) => ({ row, rowNumber: rowIndex + offset + 2 }))
              .filter(({ row }) => {
                if (!row || !row.some(c => cleanCell(c) !== "")) return false;
                
                // Murni cek apa yang tertulis di kolom ULTG sesuai spreadsheet
                const val = normalize(row[colIndex]);
                return val.includes("BEKASI") || val === "BKS";
              });

            const matches = matchEntries.map(({ row }) => row);
            const records = matchEntries.map(({ row, rowNumber }) => toRecord(sheet, header, row, rowNumber, colIndex));

            return {
              ...sheet,
              status: matches.length ? "ok" : "empty",
              rows: rawRows,
              header,
              headerRow: rowIndex,
              displayRows: matches,
              records,
              message: matches.length ? `Terbaca ${matches.length} baris ULTG Bekasi` : "Tidak ada baris ULTG Bekasi",
              lastUpdated: sheetLastUpdated || new Date().toLocaleTimeString('id-ID'),
              fromCache: fromCache || false
            };
          } catch (error) {
            return {
              ...sheet,
              status: "error",
              rows: [],
              displayRows: [],
              records: [],
              message: error.message || "Gagal memuat sheet"
            };
          }
        })
      );

      setLoadedSheets(results);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      const prevSnapshot = await storageService.get('pk_18_programs_snapshot');
      
      // Deteksi perubahan data live untuk notifikasi yang lebih rapi dan sangat detail
      const detectedUpdates = [];
      let totalCurrDone = 0;
      let totalCurrCount = 0;
      let totalPrevDone = 0;
      let totalPrevCount = 0;

      if (prevSnapshot && Array.isArray(prevSnapshot)) {
        results.forEach(currSheet => {
          const prevSheet = prevSnapshot.find(p => p.gid === currSheet.gid);
          const currRecords = currSheet.records || [];
          const currTotal = currRecords.length;
          const currDone = currRecords.filter(r => r.done).length;
          
          totalCurrDone += currDone;
          totalCurrCount += currTotal;

          if (prevSheet) {
            const prevRecords = prevSheet.records || [];
            const prevTotal = prevRecords.length;
            const prevDone = prevRecords.filter(r => r.done).length;
            
            totalPrevDone += prevDone;
            totalPrevCount += prevTotal;

            const diffs = [];
            
            // 1. Deteksi Target Baru / Penyesuaian Target (Pencocokan akurat berdasarkan rowNumber, gardu, dan bay)
            const newTargets = currRecords.filter(cr => !prevRecords.some(pr => pr.rowNumber === cr.rowNumber && pr.gardu === cr.gardu && pr.bay === cr.bay));
            if (newTargets.length > 0) {
              newTargets.forEach(t => {
                const wkt = t.target || 'Belum ditentukan';
                diffs.push(`🎯 Target Baru Ditambahkan: [${t.gardu || 'GI'}] — ${t.bay || 'Bay/Peralatan'} (Target Waktu: ${wkt})`);
              });
            }
            
            // 2. Deteksi Realisasi Selesai Baru
            const newlyDone = currRecords.filter(r => r.done && !prevRecords.some(pr => pr.rowNumber === r.rowNumber && pr.gardu === r.gardu && pr.bay === r.bay && pr.done));
            if (newlyDone.length > 0) {
              newlyDone.forEach(r => {
                const real = r.realisasi || r.realization || 'Selesai 100%';
                const bkt = r.evidence || r.documentText ? ` | Bukti: ${r.evidence || r.documentText}` : '';
                diffs.push(`✅ Realisasi Baru Selesai: [${r.gardu || 'GI'}] — ${r.bay || 'Bay/Peralatan'} (Realisasi: ${real}${bkt})`);
              });
            }

            // 3. Cek perubahan rincian (Realisasi, Keterangan/Note, Progres, atau Status) pada item individu yang sudah ada
            currRecords.forEach(r => {
              const pr = prevRecords.find(p => p.rowNumber === r.rowNumber && p.gardu === r.gardu && p.bay === r.bay);
              if (pr && !newlyDone.some(nd => nd.rowNumber === r.rowNumber) && !newTargets.some(nt => nt.rowNumber === r.rowNumber)) {
                const rReal = r.realisasi || r.realization || '';
                const prReal = pr.realisasi || pr.realization || '';
                if (rReal !== prReal && rReal !== '') {
                  diffs.push(`📝 Update Realisasi: [${r.gardu}] — ${r.bay} (diubah menjadi: "${rReal}")`);
                }
                if (r.note !== pr.note && r.note !== '') {
                  diffs.push(`📋 Update Keterangan: [${r.gardu}] — ${r.bay} (keterangan diubah menjadi: "${r.note}")`);
                }
                if (r.progress !== pr.progress && pr.progress !== undefined) {
                  diffs.push(`📈 Update Progres: [${r.gardu}] — ${r.bay} (progres berubah dari ${pr.progress || 0}% menjadi ${r.progress || 0}%)`);
                }
              }
            });
            
            if (diffs.length > 0) {
              detectedUpdates.push({
                item: currSheet.title || currSheet.name,
                category: currSheet.category || 'PROGRAM',
                status: diffs.join("\n\n")
              });
            }
          }
        });
      }
      
      // Simpan snapshot terbaru untuk perbandingan berikutnya
      await storageService.set('pk_18_programs_snapshot', results);

      // Buat notifikasi HANYA jika ada perubahan data nyata dari spreadsheet (jangan buat notifikasi jika tidak ada perubahan)
      if (detectedUpdates.length > 0) {
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        
        const currPct = totalCurrCount > 0 ? Math.round((totalCurrDone / totalCurrCount) * 100) : 0;
        const notifTitle = `⚡ Update Spreadsheet: ${detectedUpdates.length} Program Diperbarui`;
        const notifMsg = `Sistem menyinkronkan perubahan data terbaru pada ${timeStr} WIB (Progres Keseluruhan tercatat ${currPct}%):`;
        
        const newEntry = {
          id: Date.now(),
          type: 'sync',
          title: notifTitle,
          message: notifMsg,
          timestamp: `${dateStr} | ${timeStr} WIB`,
          isRead: false,
          details: detectedUpdates
        };

        setNotifications(prev => {
          // Cegah duplikasi notifikasi yang sama persis dalam 10 detik
          if (prev.length > 0 && prev[0].title === newEntry.title && (Date.now() - prev[0].id < 10000)) {
            return prev;
          }
          const next = [newEntry, ...prev];
          storageService.set('pk_notification_history', next);
          return next;
        });
      }

      // Buka otomatis program aktif pertama HANYA pada saat pemuatan pertama kali (jangan ubah saat refresh agar tidak ada layout jump/berkedip)
      const activeProgs = results.filter(s => s.records?.length > 0);
      if (activeProgs.length > 0 && loadedSheets.length === 0) {
        setExpandedPrograms({ [activeProgs[0].gid]: true });
      }
    } catch (error) {
      console.error("Error loading Program Kerja data:", error);
    } finally {
      if (!isAutoPoll) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch: Jika ada cache di memori lokal, tampilkan langsung tanpa spinner agar seketika mendarat
    const initFetch = async () => {
      const cachedSnapshot = await storageService.get('pk_18_programs_snapshot');
      if (cachedSnapshot && Array.isArray(cachedSnapshot) && cachedSnapshot.length > 0) {
        setLoadedSheets(cachedSnapshot);
        setIsLoading(false);
        // Lakukan pengecekan pembaruan secara senyap di latar belakang
        fetchAllSheets(false, true);
      } else {
        fetchAllSheets(false, false);
      }
    };
    initFetch();

    // Auto-polling ke spreadsheet setiap 3 menit (180.000 ms) secara senyap di background
    const pollInterval = setInterval(() => {
      console.log("⚡ Auto-polling spreadsheet untuk deteksi perubahan terbaru...");
      fetchAllSheets(true, true);
    }, 180000);

    return () => clearInterval(pollInterval);
  }, []);

  const allRecords = useMemo(() => {
    return loadedSheets.flatMap((s) => s.records || []);
  }, [loadedSheets]);

  const programGroups = useMemo(() => {
    return loadedSheets.map((s) => {
      const records = s.records || [];
      const done = records.filter((r) => r.done).length;
      const late = records.filter((r) => r.late).length;
      const total = records.length;
      return {
        sheet: s,
        gid: s.gid,
        category: s.category,
        name: s.title || s.name,
        total,
        done,
        open: total - done,
        late,
        progress: total ? Math.round((done / total) * 100) : 100,
        status: s.status,
        records
      };
    });
  }, [loadedSheets]);

  // Metrik dihitung EKSKLUSIF dari 18 program ABO & Keandalan
  const metrics = useMemo(() => {
    const total = allRecords.length;
    const done = allRecords.filter((r) => r.done).length;
    const late = allRecords.filter((r) => r.late).length;
    const open = total - done;
    const progress = total ? Math.round((done / total) * 100) : 100;
    const activeCount = programGroups.filter((g) => g.total > 0).length;
    const aboCount = programGroups.filter((g) => g.category === 'ABO' && g.total > 0).length;
    const keandalanCount = programGroups.filter((g) => g.category === 'KEANDALAN' && g.total > 0).length;

    return { total, done, late, open, progress, activeCount, aboCount, keandalanCount };
  }, [allRecords, programGroups]);

  const toggleProgramExpand = (gid) => {
    setExpandedPrograms(prev => ({ ...prev, [gid]: !prev[gid] }));
  };

  // Filter programs based on tab & search (Tampilkan SEMUA 18 program meski target ULTG Bekasi = 0)
  const displayedPrograms = useMemo(() => {
    return programGroups
      .filter(g => {
        if (activeCategoryTab !== 'ALL' && g.category !== activeCategoryTab) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = g.name.toLowerCase().includes(q);
          const matchRecords = g.records.some(r => 
            (r.gardu && r.gardu.toLowerCase().includes(q)) || 
            (r.bay && r.bay.toLowerCase().includes(q)) ||
            (r.note && r.note.toLowerCase().includes(q))
          );
          return matchName || matchRecords;
        }
        return true;
      });
  }, [programGroups, activeCategoryTab, searchQuery]);

  // Pisahkan untuk render per kategori jika tab ALL
  const aboPrograms = useMemo(() => displayedPrograms.filter(p => p.category === 'ABO'), [displayedPrograms]);
  const keandalanPrograms = useMemo(() => displayedPrograms.filter(p => p.category === 'KEANDALAN'), [displayedPrograms]);

  const renderProgramCard = (item) => {
    const isExpanded = !!expandedPrograms[item.gid];
    const barColor = item.progress >= 80 ? '#10B981' : item.progress >= 50 ? '#3B82F6' : '#F59E0B';

    return (
      <div key={item.gid} className="pk-card" style={{ overflow: 'hidden', border: isExpanded ? '2px solid #00A2E9' : item.late > 0 ? '1px solid #FECACA' : '1px solid var(--border-color)', transition: 'all 0.2s', marginBottom: '14px' }}>
        {/* Program Header Bar (Clickable) */}
        <div
          onClick={() => toggleProgramExpand(item.gid)}
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            backgroundColor: isExpanded ? '#F0F9FF' : '#FFFFFF',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
          onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
        >
          {/* Left: Title & Summary */}
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: item.category === 'ABO' ? '#FEF3C7' : '#E0F5FF',
                color: item.category === 'ABO' ? '#B45309' : '#0078AE'
              }}>
                {item.category === 'ABO' ? '⚡ ABO' : '🛡️ KEANDALAN'}
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {item.name}
              </h3>
              {item.total === 0 && (
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                  ✓ 100% Terpenuhi / Tanpa Target
                </span>
              )}
              {item.late > 0 && (
                <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle style={{ width: 12, height: 12 }} /> {item.late} Terlambat
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#475569' }}>
              {item.total > 0 ? (
                <>
                  <span>Target: <strong style={{ color: '#0F172A' }}>{item.total} GI</strong></span>
                  <span>Realisasi: <strong style={{ color: '#16A34A' }}>{item.done} GI</strong></span>
                  <span>Belum: <strong style={{ color: '#D97706' }}>{item.open} GI</strong></span>
                </>
              ) : (
                <span style={{ color: '#64748B', fontStyle: 'italic', fontWeight: 600 }}>
                  💡 Tidak terdapat alokasi tanggungan pekerjaan pada wilayah ULTG Bekasi tahun 2026
                </span>
              )}
            </div>
          </div>

          {/* Right: Progress & Accordion Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '0 1 340px', width: '100%', justifyContent: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                <span>Progress</span>
                <span style={{ color: barColor }}>{item.progress}%</span>
              </div>
              <div className="pk-progress-bar">
                <div className="pk-progress-fill" style={{ width: `${item.progress}%`, backgroundColor: barColor }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.78rem', backgroundColor: isExpanded ? '#00A2E9' : '#E0F5FF', color: isExpanded ? '#FFFFFF' : '#0078AE', padding: '7px 12px', borderRadius: '8px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              <span>{isExpanded ? 'Tutup Rincian' : 'Lihat Detail'}</span>
              <ChevronDown style={{ width: 15, height: 15, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </div>
        </div>

        {/* Expanded Table (Desain Tanpa Scroll Samping / Satu Tampilan Monitor) */}
        {isExpanded && (
          <div style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', padding: '16px' }}>
            {item.records.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '36px 20px', textAlign: 'center', color: '#64748B', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#94A3B8' }}>
                  <AlertCircle style={{ width: 24, height: 24 }} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>
                  Kewajiban Program Terpenuhi (Tanpa Alokasi Target Terbuka)
                </h4>
                <p style={{ fontSize: '0.8rem', margin: 0, maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5, color: '#64748B' }}>
                  Berdasarkan Rencana Kerja Proteksi 2026, program <strong>{item.name}</strong> tercatat tidak memiliki alokasi tanggungan pekerjaan atau pemeliharaan bay di wilayah ULTG Bekasi. Status pelaksanaan dinilai selesai 100%.
                </p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '10px 14px', backgroundColor: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '0.78rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>
                    📍 Matriks Rincian Gardu Induk (GI) & Peralatan — Ruang Lingkup ULTG Bekasi
                  </span>
                  <span style={{ color: '#64748B' }}>
                    💡 Klik tombol pada kolom Dokumen Bukti untuk melihat lampiran Berita Acara atau Checklist pemeliharaan.
                  </span>
                </div>

                {/* Tabel layout auto agar fit 1 layar tanpa scroll horizontal berlebih */}
                <div style={{ width: '100%', overflowX: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569', fontWeight: 700 }}>
                        <th style={{ padding: '10px 6px', width: '36px', textAlign: 'center' }}>No</th>
                        <th style={{ padding: '10px 8px', width: '18%' }}>Gardu Induk (GI)</th>
                        <th style={{ padding: '10px 8px', width: '20%' }}>Nama Bay & Peralatan</th>
                        <th style={{ padding: '10px 6px', width: '10%', textAlign: 'center' }}>Target</th>
                        <th style={{ padding: '10px 6px', width: '10%', textAlign: 'center' }}>Realisasi</th>
                        <th style={{ padding: '10px 6px', width: '10%', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '10px 8px', width: '13%', textAlign: 'center' }}>Dokumen Bukti</th>
                        <th style={{ padding: '10px 8px' }}>Keterangan / Evaluasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.records.map((row, idx) => (
                        <tr key={`${row.gid}-${idx}`} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF' }}>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '8px 8px', fontWeight: 800, color: '#0078AE', wordBreak: 'break-word' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Building2 style={{ width: 14, height: 14, flexShrink: 0 }} /> {row.gardu || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 8px', fontWeight: 600, color: '#1E293B', wordBreak: 'break-word' }}>
                            {row.bay || '-'}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', fontFamily: 'monospace', color: '#475569', whiteSpace: 'nowrap' }}>
                            {row.target || '-'}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: isDoneProgress(row.realisasi) ? '#16A34A' : '#D97706', whiteSpace: 'nowrap' }}>
                            {row.realisasi || '-'}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: row.done ? '#DCFCE7' : row.late ? '#FEE2E2' : '#FEF3C7',
                              color: row.done ? '#16A34A' : row.late ? '#DC2626' : '#D97706',
                              border: `1px solid ${row.done ? '#BBF7D0' : row.late ? '#FECACA' : '#FDE68A'}`
                            }}>
                              {row.status || (row.done ? 'Selesai' : 'Open')}
                            </span>
                          </td>
                          <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                            <DocumentCell row={row} />
                          </td>
                          <td style={{ padding: '8px 8px', color: '#475569', wordBreak: 'break-word', lineHeight: 1.4 }}>
                            {row.note || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px', maxWidth: '1360px', margin: '0 auto' }}>
      <style>{`
        @keyframes autoPollLine {
          0% { width: 0%; opacity: 0.8; }
          95% { width: 100%; opacity: 1; }
          100% { width: 0%; opacity: 0; }
        }
      `}</style>
      {/* Top Corporate Banner */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #00A2E9 0%, #006699 100%)',
        borderRadius: '16px',
        padding: '26px 32px',
        color: '#FFFFFF',
        marginBottom: '24px',
        boxShadow: '0 10px 25px -5px rgba(0, 162, 233, 0.35)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                backgroundColor: '#FFD100',
                color: '#0F172A',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Program Prioritas Nasional (7 ABO & 11 Keandalan)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#E0F5FF', fontWeight: 600 }}>
                <ShieldCheck style={{ width: 14, height: 14, color: '#4ADE80' }} />
                Ruang Lingkup: ULTG Bekasi
              </span>
            </div>
            <h1 style={{ fontSize: '2.15rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              Program Kerja Harpro
            </h1>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setShowNotificationModal(true);
                handleMarkAllRead();
              }}
              style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '10px 16px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.82rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.15s'
              }}
              title="Lihat Riwayat & Notifikasi Pembaruan Data Spreadsheet"
            >
              <Bell style={{ width: 15, height: 15 }} />
              <span>Riwayat Pembaruan</span>
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  position: 'absolute',
                  top: '-7px',
                  right: '-7px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => fetchAllSheets(true)}
              disabled={isLoading}
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '10px 18px',
                fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                fontSize: '0.82rem',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <RefreshCw style={{ width: 15, height: 15, animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
              {isLoading ? 'Memuat...' : 'Refresh Data Live'}
            </button>
          </div>
        </div>

        {/* Garis Bar Durasi Auto-Polling 3 Menit (180s) - Murni Garis Tanpa Teks */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#4ADE80',
            boxShadow: '0 0 10px #4ADE80, 0 0 4px #FFFFFF',
            animation: 'autoPollLine 180s linear infinite'
          }} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="pk-card" style={{ padding: '10px 18px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          <span>Status realisasi dan pemantauan live performa pemeliharaan sistem proteksi wilayah ULTG Bekasi</span>
        </div>
        {lastUpdated && (
          <span>Update Terakhir: <strong style={{ color: '#0F172A' }}>{lastUpdated}</strong></span>
        )}
      </div>

      {/* 6 Executive Metrics Cards (Kalkulasi dari 18 Program Terpilih) */}
      <div className="pk-grid-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="pk-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>TOTAL TARGET</span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#E0F5FF', color: '#00A2E9' }}><ListChecks style={{ width: 15, height: 15 }} /></div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>{metrics.total}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Total alokasi bay & peralatan</span>
        </div>

        <div className="pk-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>REALISASI</span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#DCFCE7', color: '#16A34A' }}><CheckCircle2 style={{ width: 15, height: 15 }} /></div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#16A34A' }}>{metrics.done}</div>
          <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600 }}>{metrics.progress}% terselesaikan</span>
        </div>

        <div className="pk-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>BELUM REALISASI</span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706' }}><Clock style={{ width: 15, height: 15 }} /></div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#D97706' }}>{metrics.open}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Terjadwal / dalam progres</span>
        </div>

        <div className="pk-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>LEWAT TARGET</span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626' }}><AlertCircle style={{ width: 15, height: 15 }} /></div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#DC2626' }}>{metrics.late}</div>
          <span style={{ fontSize: '0.72rem', color: '#B91C1C', fontWeight: 600 }}>Perlu percepatan</span>
        </div>

        <div className="pk-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>TOTAL PROGRAM</span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#F3E8FF', color: '#9333EA' }}><FileText style={{ width: 15, height: 15 }} /></div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#9333EA' }}>{programGroups.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Program</span></div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{metrics.activeCount} program aktif ULTG Bekasi</span>
        </div>

        <div className="pk-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>PROGRESS TOTAL</span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#E0F5FF', color: '#00A2E9' }}><BarChart3 style={{ width: 15, height: 15 }} /></div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#00A2E9' }}>{metrics.progress}%</div>
          <div className="pk-progress-bar" style={{ marginTop: '6px' }}>
            <div className="pk-progress-fill" style={{ width: `${metrics.progress}%`, backgroundColor: '#00A2E9' }} />
          </div>
        </div>
      </div>

      {/* Quick Filter & Category Navigation Bar */}
      <div className="pk-card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        {/* Kategori Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveCategoryTab('ALL')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeCategoryTab === 'ALL' ? '#0078AE' : '#F1F5F9',
              color: activeCategoryTab === 'ALL' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            Semua Program (18)
          </button>
          <button
            onClick={() => setActiveCategoryTab('ABO')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeCategoryTab === 'ABO' ? '#B45309' : '#FEF3C7',
              color: activeCategoryTab === 'ABO' ? '#FFFFFF' : '#92400E',
              transition: 'all 0.15s'
            }}
          >
            ⚡ Program ABO (7)
          </button>
          <button
            onClick={() => setActiveCategoryTab('KEANDALAN')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeCategoryTab === 'KEANDALAN' ? '#00A2E9' : '#E0F5FF',
              color: activeCategoryTab === 'KEANDALAN' ? '#FFFFFF' : '#006699',
              transition: 'all 0.15s'
            }}
          >
            🛡️ Program Keandalan (11)
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
          <Search style={{ width: 15, height: 15, color: '#94A3B8', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari nama Gardu Induk, Bay, atau Program Kerja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '34px', fontSize: '0.8rem', padding: '8px 12px 8px 34px' }}
          />
        </div>
      </div>

      {/* SECTION 1: PROGRAM ABO */}
      {(activeCategoryTab === 'ALL' || activeCategoryTab === 'ABO') && aboPrograms.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '2px solid #F59E0B', paddingBottom: '8px' }}>
            <Zap style={{ width: 20, height: 20, color: '#F59E0B' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              PROGRAM ABO (Anti Blackout)
            </h2>
            <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', marginLeft: 'auto' }}>
              {aboPrograms.length} Program
            </span>
          </div>
          {aboPrograms.map(renderProgramCard)}
        </div>
      )}

      {/* SECTION 2: PROGRAM KEANDALAN */}
      {(activeCategoryTab === 'ALL' || activeCategoryTab === 'KEANDALAN') && keandalanPrograms.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '2px solid #00A2E9', paddingBottom: '8px' }}>
            <Award style={{ width: 20, height: 20, color: '#00A2E9' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              PROGRAM KEANDALAN SISTEM PROTEKSI
            </h2>
            <span style={{ backgroundColor: '#E0F5FF', color: '#0078AE', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', marginLeft: 'auto' }}>
              {keandalanPrograms.length} Program
            </span>
          </div>
          {keandalanPrograms.map(renderProgramCard)}
        </div>
      )}

      {displayedPrograms.length === 0 && (
        <div className="pk-card" style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
          Tidak ada program kerja yang sesuai dengan kata kunci pencarian Anda.
        </div>
      )}

      {/* Modal / Slide-over Riwayat Pembaruan Data Spreadsheet */}
      {showNotificationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000,
          animation: 'fade-in 0.2s ease-out'
        }}
        onClick={() => setShowNotificationModal(false)}
        >
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#FFFFFF',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
            animation: 'slide-left 0.25s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#E0F5FF', color: '#00A2E9', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                  <History style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Riwayat Pembaruan Data
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    Log sinkronisasi & aktivitas item Spreadsheet Master
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                style={{ padding: '6px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#64748B', cursor: 'pointer', display: 'flex' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Modal Actions Bar */}
            <div style={{ padding: '12px 24px', backgroundColor: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                Total: {notifications.length} Riwayat ({unreadCount} Baru)
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#EF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Bersihkan Log"
                  >
                    <Trash2 style={{ width: 13, height: 13 }} /> Bersihkan
                  </button>
                )}
              </div>
            </div>

            {/* Modal Content / List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                  <Bell style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.5 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#64748B' }}>Belum Ada Riwayat Pembaruan</div>
                  <p style={{ fontSize: '0.8rem', margin: '4px 0 0' }}>Tekan tombol "Refresh Data Live" untuk sinkronisasi pembaruan terbaru.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: notif.isRead ? '1px solid #E2E8F0' : '1px solid #BAE6FD',
                    backgroundColor: notif.isRead ? '#FFFFFF' : '#F0F9FF',
                    position: 'relative',
                    transition: 'all 0.15s'
                  }}>
                    {!notif.isRead && (
                      <span style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00A2E9' }} title="Baru" />
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        padding: '8px',
                        borderRadius: '10px',
                        backgroundColor: notif.type === 'sync' ? '#DCFCE7' : notif.type === 'doc' ? '#E0F5FF' : '#FEF3C7',
                        color: notif.type === 'sync' ? '#16A34A' : notif.type === 'doc' ? '#0078AE' : '#D97706',
                        display: 'flex',
                        flexShrink: 0
                      }}>
                        {notif.type === 'sync' ? <CheckCircle2 style={{ width: 18, height: 18 }} /> : notif.type === 'doc' ? <FileText style={{ width: 18, height: 18 }} /> : <Zap style={{ width: 18, height: 18 }} />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', paddingRight: '14px' }}>
                          {notif.title}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
                          {notif.message}
                        </p>

                        {/* Detail Item yang Diperbarui */}
                        {notif.details && notif.details.length > 0 && (
                          <div style={{
                            margin: '10px 0 12px 0',
                            padding: '10px 12px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0'
                          }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>📋 Rincian Item ({notif.details.length}):</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {notif.details.map((detail, idx) => (
                                <div key={idx} style={{
                                  fontSize: '0.76rem',
                                  padding: '8px 10px',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '6px',
                                  border: '1px solid #F1F5F9',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '3px',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {detail.category && (
                                      <span style={{
                                        fontSize: '0.64rem',
                                        fontWeight: 800,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: detail.category === 'ABO' ? '#DCFCE7' : '#E0F5FF',
                                        color: detail.category === 'ABO' ? '#16A34A' : '#0078AE'
                                      }}>
                                        {detail.category}
                                      </span>
                                    )}
                                    <strong style={{ color: '#0F172A', fontSize: '0.78rem' }}>{detail.item}</strong>
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: '#334155', paddingLeft: '4px', whiteSpace: 'pre-line', lineHeight: 1.5, marginTop: '4px', fontWeight: 600 }}>
                                    {detail.status}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                          <Clock style={{ width: 12, height: 12 }} />
                          <span>{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'center', fontSize: '0.78rem', color: '#64748B' }}>
              💡 Setiap kali Anda menekan tombol <strong>Refresh Data Live</strong>, riwayat perubahan & sinkronisasi otomatis dicatat di sini.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
