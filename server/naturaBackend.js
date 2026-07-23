import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import zlib from 'zlib';

const monthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
const validStatuses = ["P", "L", "M", "S", "I", "A", "OFF", "SM", "DL", "C", "T"];
const validCategories = ["SUTT 70 KV", "SUTT 150 KV", "SUTET 500 KV", "TRAFO 70 KV", "TRAFO 150 KV", "TRAFO 500 KV", "SWITCHYARD 70 KV", "SWITCHYARD 150 KV", "SWITCHYARD 500 KV"];

const normalizeCategoryName = (category) => {
  const normalized = String(category || '').trim().toUpperCase();
  return normalized.replace(/SUTT 500 KV/g, 'SUTET 500 KV');
};

const matchPegawai = (textStr, pegawais, foundIds = new Set()) => {
  if (!textStr || !textStr.trim()) return null;
  const cleanText = String(textStr).toLowerCase().replace(/[^a-z0-9\s.]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanText) return null;

  // 1. Try exact substring match first
  for (const p of pegawais) {
    if (foundIds.has(p.id)) continue;
    const dbName = p.nama.toLowerCase().trim();
    if (cleanText.includes(dbName) || cleanText.includes(dbName.replace(/\s+/g, ''))) {
      return p;
    }
  }

  // 2. Try fuzzy scoring and abbreviations
  let bestMatch = null;
  let maxScore = 0;
  const textWords = cleanText.match(/[a-z0-9]+/g) || [];
  const validTextWords = textWords.filter(w => w.length >= 3 && !['dan', 'yang', 'atau', 'dari', 'untuk', 'shift', 'piket', 'ultg', 'bekasi', 'gardu', 'induk', 'natura'].includes(w));

  if (validTextWords.length === 0) return null;

  for (const p of pegawais) {
    if (foundIds.has(p.id)) continue;
    const dbName = p.nama.toLowerCase().trim();
    const dbWords = dbName.match(/[a-z0-9]+/g) || [];
    const validDbWords = dbWords.filter(w => w.length >= 3);

    let score = 0;
    for (const tw of validTextWords) {
      if (validDbWords.includes(tw)) {
        score += 2; // Exact word match
      } else {
        for (const dw of validDbWords) {
          if ((dw.length >= 4 && tw.length >= 4 && (dw.startsWith(tw) || tw.startsWith(dw))) ||
              (dw.length >= 5 && tw.length >= 5 && dw.slice(0, 4) === tw.slice(0, 4))) {
            score += 1.5;
          } else if (dw.length > 2 && tw.length === 1 && tw[0] === dw[0]) {
            score += 0.5;
          }
        }
      }
    }

    const minRequiredScore = validDbWords.length === 1 ? 2 : (validDbWords.length >= 3 ? 2.5 : 2);
    if (score >= minRequiredScore && score > maxScore) {
      maxScore = score;
      bestMatch = p;
    }
  }

  return bestMatch;
};

const sendJson = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

const readRequestBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(Buffer.from(chunk)));
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

const readJson = async (req) => {
  const body = await readRequestBody(req);
  if (!body.length) return {};
  return JSON.parse(body.toString('utf8'));
};

const loadEnvFile = (envPath) => {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
};

const getShiftCategory = (timeStr) => {
  if (!timeStr) return -1;
  const match = String(timeStr).match(/\d{1,2}/);
  if (!match) return -1;
  const hour = parseInt(match[0], 10);
  if (hour >= 0 && hour <= 7) return 1;
  if (hour >= 8 && hour <= 15) return 2;
  if (hour >= 16 && hour <= 23) return 3;
  return -1;
};

const serializeSpp = (spp, naturaRows = []) => ({
  ...spp,
  syncedAt: spp.syncedAt ? spp.syncedAt.toISOString() : null,
  createdAt: spp.createdAt ? spp.createdAt.toISOString() : null,
  pegawaiList: naturaRows
    .filter(row => row.sppId === spp.id)
    .sort((a, b) => a.id - b.id)
    .map(row => row.pegawai)
});

const parseMultipart = (buffer, contentType) => {
  const boundaryMatch = String(contentType || '').match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw new Error('Boundary multipart tidak ditemukan');
  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const fields = {};
  const files = {};
  let cursor = 0;

  while (cursor < buffer.length) {
    const start = buffer.indexOf(boundary, cursor);
    if (start === -1) break;
    const next = buffer.indexOf(boundary, start + boundary.length);
    if (next === -1) break;
    let part = buffer.subarray(start + boundary.length, next);
    if (part.subarray(0, 2).toString() === '\r\n') part = part.subarray(2);
    if (part.subarray(part.length - 2).toString() === '\r\n') part = part.subarray(0, part.length - 2);
    const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
    if (headerEnd !== -1) {
      const header = part.subarray(0, headerEnd).toString('utf8');
      const content = part.subarray(headerEnd + 4);
      const name = header.match(/name="([^"]+)"/)?.[1];
      const filename = header.match(/filename="([^"]*)"/)?.[1];
      const type = header.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || 'application/octet-stream';
      if (name && filename) files[name] = { filename, type, buffer: content, size: content.length };
      else if (name) fields[name] = content.toString('utf8');
    }
    cursor = next;
  }

  return { fields, files };
};

export function createNaturaBackend({ rootDir, webNaturaDir }) {
  loadEnvFile(path.join(webNaturaDir, '.env'));
  const rootDbPath = path.join(rootDir, 'prisma', 'dev.db');
  const dbPath = fs.existsSync(rootDbPath) ? rootDbPath : path.join(webNaturaDir, 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath.replace(/\\/g, '/')}`;

  const naturaRequire = createRequire(import.meta.url);
  let PrismaClient, prisma;
  try {
    const prismaModule = naturaRequire('@prisma/client');
    PrismaClient = prismaModule.PrismaClient;
    if (PrismaClient) prisma = new PrismaClient();
  } catch (e) {
    console.warn('[naturaBackend] @prisma/client not available:', e.message);
  }
  const ExcelJS = naturaRequire('exceljs');
  let GoogleSpreadsheet, JWT, PDFParser;
  try {
    const gs = naturaRequire('google-spreadsheet');
    GoogleSpreadsheet = gs.GoogleSpreadsheet;
    const auth = naturaRequire('google-auth-library');
    JWT = auth.JWT;
  } catch (e) {}
  try {
    PDFParser = naturaRequire('pdf2json');
  } catch (e) {}

  const getNaturaArchive = async (query) => {
    const where = {};
    if (query.get('id')) where.id = parseInt(query.get('id'), 10);
    if (query.get('tanggal')) where.tanggal = parseInt(query.get('tanggal'), 10);
    if (query.get('bulan')) where.bulan = parseInt(query.get('bulan'), 10);
    if (query.get('tahun')) where.tahun = parseInt(query.get('tahun'), 10);
    if (query.get('bidangInput')) where.bidangInput = query.get('bidangInput');

    const sppData = await prisma.sppData.findMany({ where, orderBy: { id: 'asc' } });
    const naturaWhere = {};
    if (query.get('id')) {
      naturaWhere.sppId = parseInt(query.get('id'), 10);
    } else {
      if (query.get('tanggal')) naturaWhere.tanggal = parseInt(query.get('tanggal'), 10);
      if (query.get('bulan')) naturaWhere.bulan = parseInt(query.get('bulan'), 10);
      if (query.get('tahun')) naturaWhere.tahun = parseInt(query.get('tahun'), 10);
      if (query.get('bidangInput')) naturaWhere.bidangInput = query.get('bidangInput');
    }
    const natura = await prisma.natura.findMany({
      where: naturaWhere,
      include: { pegawai: true },
      orderBy: { id: 'asc' }
    });
    return { natura, sppData: sppData.map(spp => serializeSpp(spp, natura)) };
  };

  const getEligiblePegawai = async (query) => {
    const tanggal = query.get('tanggal');
    const bulan = query.get('bulan');
    const tahun = query.get('tahun');
    const id = query.get('id');
    const shift = query.get('shift');
    if (!tanggal || !bulan || !tahun) {
      return { status: 400, data: { error: 'Missing parameters' } };
    }

    const t = parseInt(tanggal, 10);
    const b = parseInt(bulan, 10);
    const y = parseInt(tahun, 10);
    const allJadwalToday = await prisma.jadwal.findMany({ where: { tanggal: t, bulan: b, tahun: y } });
    let allPegawai = await prisma.pegawai.findMany();

    if (id) {
      const myNatura = await prisma.natura.findMany({ where: { sppId: parseInt(id, 10) } });
      const myIds = new Set(myNatura.map(n => n.pegawaiId));
      allPegawai = allPegawai.filter(p => p.jabatan !== 'TEMPORARY' || myIds.has(p.id));
    } else {
      allPegawai = allPegawai.filter(p => p.jabatan !== 'TEMPORARY');
    }

    const shiftCat = getShiftCategory(shift);
    const allowedStatuses = shiftCat === 1 ? ['M', 'L', 'OFF'] : (shiftCat === 3 ? ['S', 'SM', 'L', 'OFF'] : ['P', 'L', 'OFF']);
    const pegawaiShiftPLIds = new Set(allJadwalToday.filter(j => allowedStatuses.includes((j.status || '').toUpperCase())).map(j => j.pegawaiId));
    const semuaYangPunyaJadwalIds = new Set(allJadwalToday.map(j => j.pegawaiId));
    const combined = allPegawai.filter(p => pegawaiShiftPLIds.has(p.id) || !semuaYangPunyaJadwalIds.has(p.id));

    const whereClaimed = { tanggal: t, bulan: b, tahun: y };
    if (id) whereClaimed.sppId = { not: parseInt(id, 10) };
    const claimedNatura = await prisma.natura.findMany({ where: whereClaimed, include: { sppData: true } });

    let claimedIds;
    if (shift) {
      const currentCategory = getShiftCategory(shift);
      claimedIds = new Set(claimedNatura
        .filter(n => {
          const nCategory = getShiftCategory(n.sppData?.waktuPelaksana);
          if (currentCategory !== -1 && nCategory !== -1) return currentCategory === nCategory;
          return shift === n.sppData?.waktuPelaksana;
        })
        .map(n => n.pegawaiId));
    } else {
      claimedIds = new Set(claimedNatura.map(n => n.pegawaiId));
    }

    return { status: 200, data: combined.filter(p => !claimedIds.has(p.id)).sort((a, b) => a.nama.localeCompare(b.nama)) };
  };

  const saveNatura = async (body) => {
    const {
      id, tanggal, bulan, tahun, bidangInput, pegawaiIds = [],
      sppNomor, noWo, kategori, jenisPekerjaan, uraianPekerjaan, lokasiKerja, waktuPelaksana, penerimaTugas, namaMultg
    } = body;

    if (pegawaiIds.length > 0) {
      const existing = await prisma.natura.findMany({
        where: {
          tanggal, bulan, tahun,
          pegawaiId: { in: pegawaiIds },
          sppId: id ? { not: Number(id) } : undefined
        },
        include: { sppData: true }
      });
      const currentCategory = getShiftCategory(waktuPelaksana);
      const clashing = existing.filter(n => {
        const nCategory = getShiftCategory(n.sppData?.waktuPelaksana);
        if (currentCategory !== -1 && nCategory !== -1) return currentCategory === nCategory;
        return waktuPelaksana === n.sppData?.waktuPelaksana;
      });
      if (clashing.length > 0) {
        return { status: 400, data: { error: 'Beberapa pegawai sudah diinput di SPP lain pada shift/waktu yang sama di hari ini.' } };
      }
    }

    let sppIdToUse = id ? Number(id) : null;
    if (sppIdToUse) {
      await prisma.sppData.update({
        where: { id: sppIdToUse },
        data: {
          tanggal, bulan, tahun, bidangInput,
          sppNomor, noWo, kategori, jenisPekerjaan, uraianPekerjaan, lokasiKerja, waktuPelaksana, penerimaTugas, namaMultg,
          syncStatus: 'PENDING',
          syncedAt: null,
          syncError: null
        }
      });
      await prisma.natura.deleteMany({ where: { sppId: sppIdToUse } });
    } else {
      const newSpp = await prisma.sppData.create({
        data: {
          tanggal, bulan, tahun, bidangInput,
          sppNomor, noWo, kategori, jenisPekerjaan, uraianPekerjaan, lokasiKerja, waktuPelaksana, penerimaTugas, namaMultg,
          syncStatus: 'PENDING',
          syncedAt: null,
          syncError: null
        }
      });
      sppIdToUse = newSpp.id;
    }

    if (pegawaiIds.length > 0) {
      await prisma.natura.createMany({
        data: pegawaiIds.map(pid => ({ pegawaiId: Number(pid), sppId: sppIdToUse, tanggal, bulan, tahun, bidangInput }))
      });
    }

    scheduleSyncToGoogleSheets(bulan, tahun);
    return { status: 201, data: { success: true, id: sppIdToUse, syncQueued: true } };
  };

  const deleteNatura = async (query) => {
    const id = query.get('id');
    if (!id) return { status: 400, data: { error: 'Missing SPP ID' } };
    const sppId = parseInt(id, 10);
    const spp = await prisma.sppData.findUnique({ where: { id: sppId }, select: { bulan: true, tahun: true } });
    await prisma.natura.deleteMany({ where: { sppId } });
    await prisma.sppData.delete({ where: { id: sppId } });
    if (spp) scheduleSyncToGoogleSheets(spp.bulan, spp.tahun);
    return { status: 200, data: { success: true, syncQueued: Boolean(spp) } };
  };

  const getJadwal = async (query) => {
    const where = {};
    if (query.get('bulan')) where.bulan = parseInt(query.get('bulan'), 10);
    if (query.get('tahun')) where.tahun = parseInt(query.get('tahun'), 10);
    const garduIndukId = query.get('garduIndukId');
    if (garduIndukId && garduIndukId !== 'global') where.garduIndukId = parseInt(garduIndukId, 10);
    else if (garduIndukId === 'global') where.garduIndukId = null;
    return prisma.jadwal.findMany({ where, include: { pegawai: true, garduInduk: true } });
  };

  const saveJadwal = async (body) => {
    const { garduIndukId, bulan, tahun, entries = [] } = body;
    const isGlobal = garduIndukId === 'global' || !garduIndukId;
    const parsedGarduId = isGlobal ? null : parseInt(garduIndukId, 10);
    await prisma.jadwal.deleteMany({ where: { garduIndukId: parsedGarduId, bulan, tahun } });
    if (entries.length > 0) {
      await prisma.jadwal.createMany({
        data: entries.map(e => ({
          garduIndukId: parsedGarduId,
          bulan,
          tahun,
          pegawaiId: Number(e.pegawaiId),
          tanggal: Number(e.tanggal),
          status: String(e.status || '').trim().toUpperCase()
        })).filter(e => e.status)
      });
    }
    return { success: true };
  };

  const parseXlsxSchedule = async (buffer) => {
    const pegawais = await prisma.pegawai.findMany({ where: { isPiketPenuh: false } });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const parsedJadwal = [];

    for (const sheet of workbook.worksheets) {
      let dateColumns = {};
      let headerRowIndex = -1;
      sheet.eachRow((row, rowNumber) => {
        if (headerRowIndex !== -1) return;
        const temp = {};
        let consecutiveCount = 0;
        row.eachCell((cell, colNumber) => {
          const val = Number(cell.value);
          if (!Number.isNaN(val) && val >= 1 && val <= 31) {
            temp[val] = colNumber;
            consecutiveCount++;
          }
        });
        if (consecutiveCount >= 28) {
          dateColumns = temp;
          headerRowIndex = rowNumber;
        }
      });
      if (headerRowIndex === -1) continue;

      const firstDateCol = Math.min(...Object.values(dateColumns));
      const foundPegawaiIds = new Set();
      for (let rowNumber = headerRowIndex + 1; rowNumber <= sheet.rowCount; rowNumber++) {
        const row = sheet.getRow(rowNumber);
        let rowLeftText = '';
        for (let c = 1; c < firstDateCol; c++) {
          const cell = row.getCell(c);
          if (cell.value) {
            let txt = cell.value.toString();
            if (cell.value?.richText) txt = cell.value.richText.map(t => t.text).join('');
            rowLeftText += txt.toLowerCase() + ' ';
          }
        }
        const matchedPegawai = matchPegawai(rowLeftText, pegawais, foundPegawaiIds);
        if (!matchedPegawai) continue;
        foundPegawaiIds.add(matchedPegawai.id);
        for (let d = 1; d <= 31; d++) {
          const colNumber = dateColumns[d];
          if (!colNumber) continue;
          const cell = row.getCell(colNumber);
          let status = cell.value ? cell.value.toString().trim().toUpperCase() : '';
          if (cell.value?.richText) status = cell.value.richText.map(t => t.text).join('').trim().toUpperCase();
          if (status === 'PSM') status = 'SM';
          if (status && validStatuses.includes(status)) {
            parsedJadwal.push({ pegawaiId: matchedPegawai.id, tanggal: d, status });
          }
        }
      }
      if (parsedJadwal.length > 0) break;
    }
    return parsedJadwal;
  };

  const parsePdfSchedule = async (buffer) => {
    const pegawais = await prisma.pegawai.findMany({ where: { isPiketPenuh: false } });
    const parsedJadwal = [];
    const foundPegawaiIds = new Set();

    // Engine 1: PDFParser (pdf2json) - Coordinate based across all pages
    try {
      const pdfData = await new Promise((resolve, reject) => {
        const parser = new PDFParser(null, 1);
        parser.on('pdfParser_dataError', err => reject(new Error(err.parserError || 'Gagal memparsing PDF')));
        parser.on('pdfParser_dataReady', data => resolve(data));
        parser.parseBuffer(buffer);
      });
      if (pdfData?.Pages) {
        for (const page of pdfData.Pages) {
          const rowsMap = {};
          for (const t of page.Texts || []) {
            if (!t.R?.[0]?.T) continue;
            const y = t.y;
            const foundKey = Object.keys(rowsMap).find(key => Math.abs(parseFloat(key) - y) < 0.85);
            if (foundKey) rowsMap[foundKey].push(t);
            else rowsMap[y.toString()] = [t];
          }
          const sortedYKeys = Object.keys(rowsMap).sort((a, b) => parseFloat(a) - parseFloat(b));
          let dateColumns = {};
          let firstDateColX = 999;
          let headerFound = false;
          for (const yKey of sortedYKeys) {
            const rowElements = rowsMap[yKey].sort((a, b) => a.x - b.x);
            if (!headerFound) {
              const temp = {};
              let consecutiveCount = 0;
              for (const t of rowElements) {
                const txt = decodeURIComponent(t.R[0].T).trim();
                const val = Number(txt);
                if (!Number.isNaN(val) && val >= 1 && val <= 31) {
                  temp[val] = t.x;
                  consecutiveCount++;
                }
              }
              if (consecutiveCount >= 12) {
                dateColumns = temp;
                firstDateColX = Math.min(...Object.values(dateColumns));
                headerFound = true;
                continue;
              }
            }
            if (!headerFound) continue;
            let rowLeftText = '';
            const statusCandidates = [];
            for (const t of rowElements) {
              const txt = decodeURIComponent(t.R[0].T).trim();
              if (t.x < firstDateColX - 0.6) {
                if (!/^[0-9]+$/.test(txt)) rowLeftText += txt.toLowerCase() + ' ';
              } else {
                let status = txt.toUpperCase();
                if (status === 'PSM') status = 'SM';
                if (validStatuses.includes(status)) statusCandidates.push({ x: t.x, status });
              }
            }
            const matchedPegawai = matchPegawai(rowLeftText, pegawais, foundPegawaiIds);
            if (!matchedPegawai || statusCandidates.length === 0) continue;
            foundPegawaiIds.add(matchedPegawai.id);
            for (let d = 1; d <= 31; d++) {
              const dateX = dateColumns[d];
              if (dateX === undefined) continue;
              const candidate = statusCandidates.find(sc => Math.abs(sc.x - dateX) < 1.05);
              if (candidate) parsedJadwal.push({ pegawaiId: matchedPegawai.id, tanggal: d, status: candidate.status });
            }
          }
        }
      }
    } catch (err) {
      console.warn("Engine 1 (pdf2json) error/XRef stream issue:", err.message);
    }

    // Engine 2: pdf-parse (runs for any remaining pegawais not yet found by Engine 1)
    if (foundPegawaiIds.size < pegawais.length) {
      try {
        const pdfParseMod = naturaRequire('pdf-parse');
        let data = null;
        if (typeof pdfParseMod === 'function') {
          data = await pdfParseMod(buffer);
        } else if (pdfParseMod.PDFParse || pdfParseMod.default?.PDFParse || pdfParseMod.default) {
          const Cls = pdfParseMod.PDFParse || pdfParseMod.default?.PDFParse || pdfParseMod.default;
          const parser = new Cls({ data: buffer });
          data = await parser.getText();
          if (parser.destroy) try { await parser.destroy(); } catch (e) {}
        }
        if (data && data.text) {
          const lines = data.text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const matchedPegawai = matchPegawai(line, pegawais, foundPegawaiIds);
            if (!matchedPegawai) continue;
            foundPegawaiIds.add(matchedPegawai.id);
            const lineTokens = line.split(/\s+/).map(t => { let st = t.toUpperCase().trim(); if (st === 'PSM') st = 'SM'; return st; }).filter(t => validStatuses.includes(t));
            let shiftTokens = [];
            if (lineTokens.length >= 28) {
              shiftTokens = lineTokens.slice(0, 31);
            } else {
              const combinedText = [line, lines[i+1] || '', lines[i+2] || '', lines[i+3] || '', lines[i+4] || '', lines[i+5] || ''].join(' ');
              const tokens = combinedText.split(/\s+/).map(t => t.toUpperCase().trim());
              for (const token of tokens) {
                let st = token;
                if (st === 'PSM') st = 'SM';
                if (validStatuses.includes(st)) shiftTokens.push(st);
                if (shiftTokens.length >= 31) break;
              }
            }
            for (let d = 1; d <= shiftTokens.length; d++) {
              parsedJadwal.push({ pegawaiId: matchedPegawai.id, tanggal: d, status: shiftTokens[d - 1] });
            }
          }
        }
      } catch (err) {
        console.warn("Engine 2 (pdf-parse) error:", err.message);
      }
    }

    // Engine 3: parsePdfRawStreams (runs for any remaining pegawais not yet found by Engine 1 & 2)
    if (foundPegawaiIds.size < pegawais.length) {
      try {
        const strBuffer = buffer.toString('binary');
        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        let match;
        let textTokens = [];
        while ((match = streamRegex.exec(strBuffer)) !== null) {
          let streamData = Buffer.from(match[1], 'binary');
          let decompressed = streamData;
          try { decompressed = zlib.inflateSync(streamData); } catch (e) {}
          const content = decompressed.toString('utf8', 0, decompressed.length);
          const tjRegex = /\(([^\)\\]*(?:\\.[^\)\\]*)*)\)\s*T[jJ]/g;
          let tjMatch;
          while ((tjMatch = tjRegex.exec(content)) !== null) {
            const cleaned = tjMatch[1].replace(/\\([()\\])/g, '$1').trim();
            if (cleaned) textTokens.push(cleaned);
          }
          const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/gi;
          let arrayMatch;
          while ((arrayMatch = tjArrayRegex.exec(content)) !== null) {
            const inner = arrayMatch[1];
            const innerRegex = /\(([^\)\\]*(?:\\.[^\)\\]*)*)\)/g;
            let im;
            let combined = '';
            while ((im = innerRegex.exec(inner)) !== null) combined += im[1].replace(/\\([()\\])/g, '$1');
            if (combined.trim()) textTokens.push(combined.trim());
          }
        }
        const fullText = textTokens.join(' ');
        for (const p of pegawais) {
          if (foundPegawaiIds.has(p.id)) continue;
          const matchedPegawai = matchPegawai(fullText, [p], new Set());
          if (matchedPegawai) {
            foundPegawaiIds.add(p.id);
            const dbName = p.nama.toLowerCase().trim();
            const idx = fullText.toLowerCase().indexOf(dbName.split(' ')[0]);
            const afterText = idx !== -1 ? fullText.substring(idx) : fullText;
            const tokens = afterText.split(/\s+/).map(t => t.toUpperCase().trim());
            const shiftTokens = [];
            for (const token of tokens) {
              let st = token;
              if (st === 'PSM') st = 'SM';
              if (validStatuses.includes(st)) {
                shiftTokens.push(st);
                if (shiftTokens.length >= 31) break;
              }
            }
            for (let d = 1; d <= shiftTokens.length; d++) {
              parsedJadwal.push({ pegawaiId: p.id, tanggal: d, status: shiftTokens[d - 1] });
            }
          }
        }
      } catch (err) {
        console.error("Engine 3 (parsePdfRawStreams) error:", err.message);
      }
    }

    return parsedJadwal;
  };

  const importJadwal = async (req) => {
    const buffer = await readRequestBody(req);
    const { fields, files } = parseMultipart(buffer, req.headers['content-type']);
    const file = files.file;
    if (!file) return { status: 400, data: { error: 'File tidak ditemukan' } };
    if (file.size > 10 * 1024 * 1024) return { status: 400, data: { error: 'Ukuran file maksimal 10 MB' } };
    const lower = file.filename.toLowerCase();
    let data = [];
    try {
      if (lower.endsWith('.xlsx')) data = await parseXlsxSchedule(file.buffer);
      else if (lower.endsWith('.pdf')) data = await parsePdfSchedule(file.buffer);
      else return { status: 400, data: { error: 'File harus berformat .xlsx atau .pdf' } };
    } catch (parseErr) {
      console.error("Import error:", parseErr);
      return { status: 400, data: { error: `Gagal memproses file ${lower.endsWith('.pdf') ? 'PDF' : 'Excel'}: ${parseErr.message}` } };
    }
    if (data.length === 0) {
      return { status: 400, data: { error: `Tidak dapat menemukan data jadwal yang valid di dalam file ${lower.endsWith('.pdf') ? 'PDF' : 'Excel'}. Pastikan format kolom hari (1-31) dan nama pegawai jelas sesuai template.` } };
    }
    return { status: 200, data: { success: true, data, bulan: Number(fields.bulan), tahun: Number(fields.tahun) } };
  };

  const syncToGoogleSheets = async (bulan, tahun) => {
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      await prisma.sppData.updateMany({ where: { bulan, tahun }, data: { syncStatus: 'ERROR', syncError: 'Credentials not set' } }).catch(() => {});
      return { success: false, error: 'Credentials not set' };
    }

    try {
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
      await doc.loadInfo();
      const monthName = monthNames[bulan - 1];
      let sheet = doc.sheetsByTitle[monthName];
      if (!sheet) {
        let templateSheet = null;
        for (let i = bulan - 2; i >= 0; i--) {
          if (doc.sheetsByTitle[monthNames[i]]) {
            templateSheet = doc.sheetsByTitle[monthNames[i]];
            break;
          }
        }
        if (!templateSheet) templateSheet = doc.sheetsByIndex[0];
        sheet = await templateSheet.duplicate({ title: monthName });
      }

      const sppList = await prisma.sppData.findMany({ where: { bulan, tahun }, orderBy: { tanggal: 'asc' } });
      const naturaList = await prisma.natura.findMany({ where: { bulan, tahun }, include: { pegawai: true } });
      const pelaksanaMap = {};
      for (const n of naturaList) {
        if (!n.sppId) continue;
        if (!pelaksanaMap[n.sppId]) pelaksanaMap[n.sppId] = [];
        pelaksanaMap[n.sppId].push(n.pegawai);
      }

      const byKategori = {};
      for (const spp of sppList) {
        const kat = normalizeCategoryName(spp.kategori) || 'SUTT 150 KV';
        if (!byKategori[kat]) byKategori[kat] = [];
        byKategori[kat].push(spp);
      }

      await sheet.loadCells('A1:J200');
      const cats = [];
      for (let r = 8; r < 180; r++) {
        const cellB = sheet.getCell(r, 1);
        if (!cellB || typeof cellB.value !== 'string') continue;
        const val = normalizeCategoryName(cellB.value);
        if (!validCategories.includes(val)) continue;
        for (let jr = r + 1; jr < 200; jr++) {
          const jCell = sheet.getCell(jr, 0);
          if (jCell && typeof jCell.value === 'string' && jCell.value.toUpperCase().includes('JUMLAH')) {
            cats.push({ name: val, headerRow: r, jumlahRow: jr });
            r = jr;
            break;
          }
        }
      }

      for (let i = cats.length - 1; i >= 0; i--) {
        const cat = cats[i];
        const items = byKategori[cat.name] || [];
        const neededCount = Math.max(1, items.length);
        const existingCount = cat.jumlahRow - cat.headerRow - 1;
        const diff = neededCount - existingCount;
        if (diff > 0) await sheet.insertDimension('ROWS', { startIndex: cat.jumlahRow, endIndex: cat.jumlahRow + diff });
        else if (diff < 0) await sheet.deleteDimension('ROWS', { startIndex: cat.headerRow + 1 + neededCount, endIndex: cat.jumlahRow });
        cat.jumlahRow += diff;
        for (let j = i + 1; j < cats.length; j++) {
          cats[j].headerRow += diff;
          cats[j].jumlahRow += diff;
        }
      }

      sheet.resetLocalCache(true);
      await sheet.loadCells('A1:J200');
      let signatureRow = 200;
      for (let r = 0; r < 200; r++) {
        for (let c = 0; c < 10; c++) {
          const cell = sheet.getCell(r, c);
          if (!cell.value || typeof cell.value !== 'string') continue;
          if (cell.value.includes('Bekasi,')) signatureRow = r;
          let strVal = cell.value.toString().toUpperCase();
          let replaced = false;
          for (const m of monthNames) {
            if (strVal.includes(m) && m !== monthName) {
              strVal = strVal.replace(new RegExp(m, 'g'), monthName);
              replaced = true;
            }
          }
          if (replaced) cell.value = strVal.includes('BEKASI,') ? strVal.replace('BEKASI,', 'Bekasi,') : strVal;
        }
      }

      const freshCats = [];
      for (let r = 8; r < signatureRow; r++) {
        const cellB = sheet.getCell(r, 1);
        if (cellB && typeof cellB.value === 'string') {
          const val = normalizeCategoryName(cellB.value);
          if (validCategories.includes(val)) freshCats.push({ name: val, row: r });
        }
      }

      const categorySums = {};
      for (const cat of freshCats) {
        const items = byKategori[cat.name] || [];
        let r = cat.row + 1;
        let totalPersonil = 0;
        if (items.length === 0) {
          for (let c = 0; c < 10; c++) sheet.getCell(r, c).value = '';
          sheet.getCell(r, 0).value = 1;
          r++;
        } else {
          for (let idx = 0; idx < items.length; idx++) {
            const spp = items[idx];
            const pegs = pelaksanaMap[spp.id] || [];
            sheet.getCell(r, 0).value = idx + 1;
            sheet.getCell(r, 1).value = spp.sppNomor || '';
            sheet.getCell(r, 2).value = '';
            sheet.getCell(r, 3).value = spp.noWo || '';
            sheet.getCell(r, 4).value = spp.uraianPekerjaan || '';
            sheet.getCell(r, 5).value = spp.lokasiKerja || '';
            sheet.getCell(r, 6).value = `${spp.tanggal} ${monthName} ${tahun}`;
            sheet.getCell(r, 7).value = spp.waktuPelaksana || '08:00 - 16:00 WIB';
            sheet.getCell(r, 8).value = pegs.length > 0 ? pegs.length : '';
            sheet.getCell(r, 9).value = pegs.map((p, pi) => `${pi + 1}. ${p.nama}`).join('\n');
            totalPersonil += pegs.length;
            r++;
          }
        }
        categorySums[cat.name] = totalPersonil;
        const jCell = sheet.getCell(r, 0);
        if (jCell && typeof jCell.value === 'string' && jCell.value.toUpperCase().includes('JUMLAH')) {
          sheet.getCell(r, 8).value = totalPersonil > 0 ? totalPersonil : '';
        }
      }
      await sheet.saveUpdatedCells();
      await prisma.sppData.updateMany({
        where: { id: { in: sppList.map(s => s.id) } },
        data: { syncStatus: 'SYNCED', syncedAt: new Date(), syncError: null }
      });
      return { success: true };
    } catch (error) {
      await prisma.sppData.updateMany({
        where: { bulan, tahun },
        data: { syncStatus: 'ERROR', syncError: error.message || 'Sync failed' }
      }).catch(() => {});
      return { success: false, error: error.message };
    }
  };

  const runningSyncs = new Map();
  const scheduleSyncToGoogleSheets = (bulan, tahun) => {
    const key = `${tahun}-${bulan}`;
    if (runningSyncs.has(key)) return;
    const job = syncToGoogleSheets(bulan, tahun).finally(() => runningSyncs.delete(key));
    runningSyncs.set(key, job);
  };

  const buildExportPayloadFromIds = async (sppIds) => {
    const sppData = await prisma.sppData.findMany({ where: { id: { in: sppIds.map(Number) } }, orderBy: { id: 'asc' } });
    const naturaRows = await prisma.natura.findMany({
      where: { sppId: { in: sppIds.map(Number) } },
      include: { pegawai: true },
      orderBy: { id: 'asc' }
    });
    return { sppDataList: sppData.map(spp => serializeSpp(spp, naturaRows)) };
  };

  const handle = async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/api/natura' && req.method === 'GET') {
        sendJson(res, 200, await getNaturaArchive(url.searchParams));
        return true;
      }
      if (url.pathname === '/api/natura' && req.method === 'POST') {
        const result = await saveNatura(await readJson(req));
        sendJson(res, result.status, result.data);
        return true;
      }
      if (url.pathname === '/api/natura' && req.method === 'DELETE') {
        const result = await deleteNatura(url.searchParams);
        sendJson(res, result.status, result.data);
        return true;
      }
      if (url.pathname === '/api/natura/eligible' && req.method === 'GET') {
        const result = await getEligiblePegawai(url.searchParams);
        sendJson(res, result.status, result.data);
        return true;
      }
      if (url.pathname === '/api/natura/sync' && req.method === 'POST') {
        const { bulan, tahun } = await readJson(req);
        if (!bulan || !tahun) {
          sendJson(res, 400, { error: 'Bulan dan Tahun diperlukan' });
          return true;
        }
        const result = await syncToGoogleSheets(Number(bulan), Number(tahun));
        sendJson(res, result.success ? 200 : 500, result.success ? { success: true, message: 'Berhasil sinkronisasi ke Google Sheets' } : { error: result.error });
        return true;
      }
      if (url.pathname === '/api/jadwal' && req.method === 'GET') {
        sendJson(res, 200, await getJadwal(url.searchParams));
        return true;
      }
      if (url.pathname === '/api/jadwal' && req.method === 'POST') {
        sendJson(res, 201, await saveJadwal(await readJson(req)));
        return true;
      }
      if (url.pathname === '/api/jadwal/import' && req.method === 'POST') {
        const result = await importJadwal(req);
        sendJson(res, result.status, result.data);
        return true;
      }
      if (url.pathname === '/api/pegawai' && req.method === 'GET') {
        const pegawai = await prisma.pegawai.findMany({ where: { NOT: { jabatan: 'TEMPORARY' } }, orderBy: { nama: 'asc' } });
        sendJson(res, 200, pegawai);
        return true;
      }
      if (url.pathname === '/api/pegawai' && req.method === 'POST') {
        const { nama, bidang, jabatan } = await readJson(req);
        if (!nama || !bidang) {
          sendJson(res, 400, { error: 'Nama dan Bidang wajib diisi' });
          return true;
        }
        const pegawai = await prisma.pegawai.create({ data: { nama, bidang, jabatan: jabatan || null } });
        sendJson(res, 201, pegawai);
        return true;
      }
      if (url.pathname === '/api/pegawai' && req.method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) {
          sendJson(res, 400, { error: 'ID is required' });
          return true;
        }
        await prisma.pegawai.delete({ where: { id: parseInt(id, 10) } });
        sendJson(res, 200, { success: true });
        return true;
      }
      if (url.pathname === '/api/gardu' && req.method === 'GET') {
        sendJson(res, 200, await prisma.garduInduk.findMany({ orderBy: { nama: 'asc' } }));
        return true;
      }
      if (url.pathname === '/api/gardu' && req.method === 'POST') {
        const { nama } = await readJson(req);
        if (!nama) {
          sendJson(res, 400, { error: 'Nama wajib diisi' });
          return true;
        }
        sendJson(res, 201, await prisma.garduInduk.create({ data: { nama } }));
        return true;
      }
      if (url.pathname === '/api/gardu' && req.method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) {
          sendJson(res, 400, { error: 'ID required' });
          return true;
        }
        await prisma.garduInduk.delete({ where: { id: parseInt(id, 10) } });
        sendJson(res, 200, { success: true });
        return true;
      }
      if (url.pathname.startsWith('/api/natura') || url.pathname.startsWith('/api/jadwal') || url.pathname.startsWith('/api/pegawai') || url.pathname.startsWith('/api/gardu')) {
        sendJson(res, 405, { error: `Endpoint ${req.method} ${url.pathname} tidak diizinkan atau tidak ditemukan` });
        return true;
      }
      return false;
    } catch (error) {
      sendJson(res, 500, { error: error.message || 'NATURA backend error' });
      return true;
    }
  };

  return { handle, buildExportPayloadFromIds };
}

