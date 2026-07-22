export const HARGI_SPREADSHEET_ID = '15YqJid8tL_AAOROFDJ-D2H4ozQUlJUJxACrgOu2NUnQ';

export const HARGI_PROGRAM_SHEETS = [
  { id: 'anomaliDs', title: 'Anomali DS', gid: '0', category: 'Anomali' },
  { id: 'wapCorbuzier', title: 'Pemasangan WAP/Corbuzier', gid: '1158313206', category: 'Program Trafo' },
  { id: 'pemasanganJaring', title: 'Pemasangan Jaring', gid: '220192563', category: 'Program Trafo' },
  { id: 'mediaIsolasiRelay', title: 'Penambahan Media Isolasi pada Relay Mekanik Trafo', gid: '427933333', category: 'Program Trafo' }
];

export function cleanCell(value) {
  return String(value ?? '').replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeText(value) {
  return cleanCell(value).toUpperCase();
}

export function parseCSV(str) {
  const rows = [];
  let quote = false;
  let col = 0;
  let row = 0;

  for (let index = 0; index < str.length; index++) {
    const current = str[index];
    const next = str[index + 1];

    rows[row] = rows[row] || [];
    rows[row][col] = rows[row][col] || '';

    if (current === '"' && quote && next === '"') {
      rows[row][col] += current;
      index++;
      continue;
    }

    if (current === '"') {
      quote = !quote;
      continue;
    }

    if (current === ',' && !quote) {
      col++;
      continue;
    }

    if (current === '\r' && next === '\n' && !quote) {
      row++;
      col = 0;
      index++;
      continue;
    }

    if ((current === '\n' || current === '\r') && !quote) {
      row++;
      col = 0;
      continue;
    }

    rows[row][col] += current;
  }

  return rows
    .map(item => item.map(cleanCell))
    .filter(item => item.some(cell => cell !== ''));
}

function findHeaderRow(rows) {
  return rows.findIndex(row => {
    const normalized = row.map(normalizeText);
    return normalized.includes('NO') && normalized.includes('GARDU INDUK') && normalized.includes('BAY');
  });
}

function getByHeader(headers, row, aliases) {
  for (const alias of aliases) {
    const index = headers.findIndex(header => normalizeText(header) === normalizeText(alias));
    if (index >= 0) return cleanCell(row[index]);
  }
  return '';
}

function detectStatusType(status, realisasi) {
  const text = `${normalizeText(status)} ${normalizeText(realisasi)}`;
  if (/(TERLAKSANA|SELESAI|DONE|REALISASI|SUDAH|100%|OK)/.test(text)) return 'done';
  if (/(PRIORITAS|URGENT|DARURAT|CRITICAL|KRITIS)/.test(text)) return 'priority';
  if (/(ON TARGET|PROGRESS|PROGRES|DALAM|RENCANA)/.test(text)) return 'progress';
  if (/(BELUM|OPEN|PENDING)/.test(text)) return 'open';
  return text.trim() ? 'open' : 'empty';
}

function extractUrl(values) {
  for (const value of values) {
    const text = cleanCell(value);
    const http = text.match(/https?:\/\/[^\s"',)\]]+/i);
    if (http) return http[0];
    const drive = text.match(/(?:drive|docs)\.google\.com\/[^\s"',)\]]+/i);
    if (drive) return `https://${drive[0]}`;
  }
  return '';
}

export function parseHargiProgramCsv(csvText, sheet) {
  const rows = parseCSV(csvText);
  const headerIndex = findHeaderRow(rows);
  const title = sheet.title || rows.find(row => row.some(Boolean))?.find(Boolean) || 'Program Kerja HARGI';

  if (headerIndex < 0) {
    return { ...sheet, title, headers: [], rows: [] };
  }

  const headers = rows[headerIndex].map((header, index) => cleanCell(header) || `Kolom ${index + 1}`);
  const dataRows = rows.slice(headerIndex + 1)
    .filter(row => cleanCell(row[0]) && !Number.isNaN(Number(cleanCell(row[0]))))
    .map((row, index) => {
      const status = getByHeader(headers, row, ['STATUS', 'KONDISI/STATUS']);
      const realisasi = getByHeader(headers, row, ['REALISASI', 'REALISASI ']);
      const linkBa = getByHeader(headers, row, ['LINK BA', 'Link BA', 'DOKUMENTASI']);
      const keterangan = getByHeader(headers, row, ['KETERANGAN']);
      const documentUrl = extractUrl([linkBa, keterangan, ...row]);

      return {
        id: `${sheet.id}-${index + 1}`,
        sheetId: sheet.id,
        gid: sheet.gid,
        programTitle: title,
        category: sheet.category,
        rowNumber: Number(cleanCell(row[0])),
        values: headers.map((header, colIndex) => ({ key: header, value: cleanCell(row[colIndex]) })),
        garduInduk: getByHeader(headers, row, ['GARDU INDUK']),
        bay: getByHeader(headers, row, ['BAY']),
        status,
        realisasi,
        keterangan,
        documentUrl,
        statusType: detectStatusType(status, realisasi)
      };
    });

  return { ...sheet, title, headers, rows: dataRows };
}

export function summarizeHargiPrograms(sheets) {
  const allRows = sheets.flatMap(sheet => sheet.rows || []);
  const done = allRows.filter(row => row.statusType === 'done').length;
  const priority = allRows.filter(row => row.statusType === 'priority').length;

  return {
    total: allRows.length,
    done,
    open: allRows.length - done,
    priority,
    sheetCount: sheets.length
  };
}
