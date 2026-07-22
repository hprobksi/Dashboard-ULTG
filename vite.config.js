import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'
import { createRequire } from 'module'
import { exec } from 'child_process'
import { promisify } from 'util'
import os from 'os'
import { createNaturaBackend } from './server/naturaBackend.js'
import { createLemburanBackend } from './server/lemburanBackend.js'
import { getFileMutex } from './server/fileMutex.js'

const xlsx = XLSX.default || XLSX;
const require = createRequire(import.meta.url);
const execAsync = promisify(exec);
const BRIDGE_FILE = path.resolve(__dirname, 'pln_bridge_data.json');
const TOKEN_FILE = path.resolve(__dirname, 'pln_token.txt');
const EXCEL_PATH = path.resolve(__dirname, 'Perkap_ULTG', 'Perkap_ULTG', 'Database_AppSheet_Lengkap.xlsx');
const INVENTARIS_BACKUP_FILE = path.resolve(__dirname, 'inventaris_backup.json');
const WEB_NATURA_DIR = path.resolve(__dirname, 'NATURA_ULTG_BEKASI', 'NATURA_ULTG_BEKASI', 'web-natura');
const NATURA_TEMPLATE_PATH = path.resolve(__dirname, 'NATURA_ULTG_BEKASI', 'NATURA_ULTG_BEKASI', '3. NATURA HARPRO JUNI.xlsx');
const ExcelJS = require(path.join(WEB_NATURA_DIR, 'node_modules', 'exceljs'));
const naturaBackend = createNaturaBackend({ rootDir: __dirname, webNaturaDir: WEB_NATURA_DIR });
const lemburanBackend = createLemburanBackend({ rootDir: __dirname, webNaturaDir: WEB_NATURA_DIR });

const readRequestJson = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch (e) {
      reject(e);
    }
  });
  req.on('error', reject);
});

const psQuote = (value) => `'${String(value).replace(/'/g, "''")}'`;

const normalizeNaturaSpp = (raw) => {
  const date = raw.tanggal instanceof Date ? raw.tanggal : new Date(raw.tanggal);
  const hasValidDate = !Number.isNaN(date.getTime());
  const tanggal = Number.isInteger(raw.tanggal) ? raw.tanggal : (hasValidDate ? date.getDate() : Number(raw.tanggal || 1));
  const bulan = Number(raw.bulan || (hasValidDate ? date.getMonth() + 1 : new Date().getMonth() + 1));
  const tahun = Number(raw.tahun || (hasValidDate ? date.getFullYear() : new Date().getFullYear()));

  return {
    id: raw.id || 0,
    tanggal,
    bulan,
    tahun,
    bidangInput: raw.bidangInput || raw.bidang || '',
    sppNomor: raw.sppNomor || `....../SPP/ULTGBKASI/NR/${tahun}`,
    noWo: raw.noWo || '',
    kategori: raw.kategori || 'SUTT 150 KV',
    jenisPekerjaan: raw.jenisPekerjaan || '',
    uraianPekerjaan: raw.uraianPekerjaan || '',
    lokasiKerja: raw.lokasiKerja || '',
    waktuPelaksana: raw.waktuPelaksana || '08:00 - 16:00 WIB',
    penerimaTugas: raw.penerimaTugas || '....................................',
    namaMultg: raw.namaMultg || '',
    pegawaiList: Array.isArray(raw.pegawaiList) ? raw.pegawaiList : []
  };
};

async function generateNaturaPdfBuffer(payload) {
  const draft = payload.draftData || payload;
  const sppDataList = (Array.isArray(payload.sppDataList) && payload.sppDataList.length > 0)
    ? payload.sppDataList.map(normalizeNaturaSpp)
    : [normalizeNaturaSpp(draft)];

  if (!fs.existsSync(NATURA_TEMPLATE_PATH)) {
    throw new Error(`Template NATURA tidak ditemukan: ${NATURA_TEMPLATE_PATH}`);
  }

  const tmpId = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const tmpDir = os.tmpdir();
  const filePaths = [];
  const monthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

  for (const spp of sppDataList) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(NATURA_TEMPLATE_PATH);

    const sheetCount = wb.worksheets.length;
    for (let i = sheetCount - 1; i > 0; i--) {
      wb.removeWorksheet(wb.worksheets[i].id);
    }

    const sheet = wb.worksheets[0];
    sheet.name = `Tgl ${spp.tanggal}`;
    const pegawais = spp.pegawaiList || [];
    const extraRows = Math.max(0, pegawais.length - 30);
    const tanggalText = `${String(spp.tanggal).padStart(2, '0')} ${monthNames[spp.bulan - 1] || ''} ${spp.tahun}`.trim();

    if (spp.sppNomor) sheet.getCell("A6").value = `SPP Nomor : ${spp.sppNomor}`;
    sheet.getCell("A7").value = `WO Nomor : ${spp.noWo || ""}`;
    sheet.getCell("D8").value = spp.jenisPekerjaan || "";
    sheet.getCell("D9").value = spp.uraianPekerjaan || "";
    sheet.getCell("D11").value = spp.lokasiKerja || "";
    sheet.getCell("D12").value = tanggalText;
    sheet.getCell("G12").value = spp.waktuPelaksana || "08:00 - 16:00 WIB";
    sheet.getCell(`J${60 + extraRows}`).value = tanggalText;
    sheet.getCell(`A${66 + extraRows}`).value = spp.penerimaTugas || "....................................";
    sheet.getCell(`H${66 + extraRows}`).value = spp.namaMultg || "";

    sheet.pageSetup.paperSize = 9;
    sheet.pageSetup.fitToPage = true;
    sheet.pageSetup.fitToWidth = 1;

    if (extraRows > 0) {
      sheet.spliceRows(47, 0, ...new Array(extraRows).fill([]));
      for (let r = 47; r < 47 + extraRows; r++) {
        const sourceRow = sheet.getRow(46);
        const newRow = sheet.getRow(r);
        newRow.height = sourceRow.height;
        sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          newRow.getCell(colNumber).style = Object.assign({}, cell.style);
        });
        try { sheet.mergeCells(`C${r}:E${r}`); } catch (e) {}
        try { sheet.mergeCells(`F${r}:I${r}`); } catch (e) {}
      }
    }

    const maxSlots = Math.max(30, pegawais.length);
    for (let i = 0; i < maxSlots; i++) {
      const row = 17 + i;
      const pegawai = pegawais[i];
      sheet.getCell(`A${row}`).value = pegawai ? i + 1 : "";
      sheet.getCell(`B${row}`).value = pegawai ? pegawai.nama : "";
    }

    const filePath = path.join(tmpDir, `spp_${tmpId}_${spp.tanggal}.xlsx`);
    await wb.xlsx.writeFile(filePath);
    filePaths.push(filePath);
  }

  const masterXlsx = path.join(tmpDir, `master_${tmpId}.xlsx`);
  const finalPdf = path.join(tmpDir, `final_${tmpId}.pdf`);
  const psPath = path.join(tmpDir, `merge_${tmpId}.ps1`);

  let psScript = `
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    try {
      $master = $excel.Workbooks.Open(${psQuote(filePaths[0])})
  `;

  for (let i = 1; i < filePaths.length; i++) {
    psScript += `
      $wb = $excel.Workbooks.Open(${psQuote(filePaths[i])})
      $wb.Sheets.Item(1).Copy([System.Type]::Missing, $master.Sheets.Item($master.Sheets.Count))
      $wb.Close($false)
    `;
  }

  psScript += `
      $master.SaveAs(${psQuote(masterXlsx)})
      $master.ExportAsFixedFormat(0, ${psQuote(finalPdf)})
      $master.Close($false)
    } finally {
      $excel.Quit()
      [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
  `;

  await fs.promises.writeFile(psPath, psScript);
  await execAsync(`powershell -ExecutionPolicy Bypass -File "${psPath}"`);
  const pdfBuffer = await fs.promises.readFile(finalPdf);

  await Promise.all([
    ...filePaths.map(p => fs.promises.unlink(p).catch(() => {})),
    fs.promises.unlink(masterXlsx).catch(() => {}),
    fs.promises.unlink(finalPdf).catch(() => {}),
    fs.promises.unlink(psPath).catch(() => {})
  ]);

  return pdfBuffer;
}

const plnBridgePlugin = () => ({
  name: 'pln-bridge-server',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
      }

      if (req.url === '/api/natura/export' && req.method === 'POST') {
        try {
          let data = await readRequestJson(req);
          if (Array.isArray(data.sppIds) && data.sppIds.length > 0) {
            data = await naturaBackend.buildExportPayloadFromIds(data.sppIds);
          }
          const pdfBuffer = await generateNaturaPdfBuffer(data);
          const now = new Date();
          const filename = `Surat_Penugasan_Natura_${now.toISOString().slice(0, 10)}.pdf`;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.end(pdfBuffer);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
      }

      if (await naturaBackend.handle(req, res)) {
        return;
      }

      if (await lemburanBackend.handle(req, res)) {
        return;
      }

      if (req.url === '/api/inventaris/stok' && req.method === 'GET') {
        try {
          let masterList = [];
          let trxList = [];
          
          if (fs.existsSync(EXCEL_PATH)) {
            const wb = xlsx.readFile(EXCEL_PATH);
            if (wb.Sheets['Master App']) {
              masterList = xlsx.utils.sheet_to_json(wb.Sheets['Master App']);
            }
            if (wb.Sheets['Transaksi App']) {
              trxList = xlsx.utils.sheet_to_json(wb.Sheets['Transaksi App']);
            }
          } else if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
            const backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8'));
            masterList = backup.masterList || [];
            trxList = backup.trxList || [];
          }

          // Jika ada transaksi lokal baru yang tersimpan di backup, gabungkan
          if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
            const backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8'));
            if (Array.isArray(backup.additionalTrx)) {
              trxList = [...trxList, ...backup.additionalTrx];
            }
          }

          const trxGroup = {};
          trxList.forEach(t => {
            const nama = t['Nama Barang'] || t.nama_barang || '';
            const jml = Number(t['Jumlah'] || t.jumlah || 0);
            if (nama) {
              trxGroup[nama] = (trxGroup[nama] || 0) + jml;
            }
          });

          const stokData = masterList.map(item => {
            const nama = item['Nama Barang'] || item.nama_barang || '';
            let stokAwal = Number(item['Stok Awal'] || item.stok_awal || 0);
            if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
              try {
                const b = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8'));
                if (b.masterOverrides && b.masterOverrides[nama] !== undefined) {
                  stokAwal = Number(b.masterOverrides[nama]);
                }
              } catch(e){}
            }
            const keluar = trxGroup[nama] || 0;
            const sisa = stokAwal - keluar;
            return {
              id: item['ID Barang'] || item.id || nama,
              namaBarang: nama,
              satuan: item['Satuan'] || item.satuan || 'Pcs',
              kategori: item['Kategori'] || item.kategori || 'Umum',
              lokasi: item['Lokasi Rak'] || item.lokasi || 'Gudang Utama',
              stokAwal: stokAwal,
              totalKeluar: keluar,
              sisaStok: sisa
            };
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, count: stokData.length, data: stokData }));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
      }

      if (req.url === '/api/inventaris/transaksi' && req.method === 'GET') {
        try {
          let trxList = [];
          if (fs.existsSync(EXCEL_PATH)) {
            const wb = xlsx.readFile(EXCEL_PATH);
            if (wb.Sheets['Transaksi App']) {
              trxList = xlsx.utils.sheet_to_json(wb.Sheets['Transaksi App']);
            }
          }
          if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
            const backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8'));
            if (Array.isArray(backup.additionalTrx)) {
              trxList = [...trxList, ...backup.additionalTrx];
            }
          }

          const formattedTrx = trxList.map((t, idx) => ({
            id: t['ID Transaksi'] || t.id_transaksi || `TRX-${idx + 100}`,
            waktu: t['Waktu'] || t.waktu || new Date().toISOString(),
            namaGi: t['Nama GI'] || t.nama_gi || 'GI Bekasi',
            namaBarang: t['Nama Barang'] || t.nama_barang || '',
            jumlah: Number(t['Jumlah'] || t.jumlah || 0),
            namaPengambil: t['Nama Pengambil'] || t.nama_pengambil || '-',
            keterangan: t['Keterangan'] || t.keterangan || ''
          })).reverse();

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, count: formattedTrx.length, data: formattedTrx }));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
      }

      if (req.url === '/api/inventaris/add-transaksi' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const items = Array.isArray(data.items) ? data.items : [data];
            const addedTrxList = [];

            let backup = { additionalTrx: [], masterList: [] };
            if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
              try { backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8')); } catch(e){}
            }
            if (!Array.isArray(backup.additionalTrx)) backup.additionalTrx = [];

            let wb = null;
            let excelRows = [];
            if (fs.existsSync(EXCEL_PATH)) {
              try {
                wb = xlsx.readFile(EXCEL_PATH);
                if (wb.Sheets['Transaksi App']) {
                  excelRows = xlsx.utils.sheet_to_json(wb.Sheets['Transaksi App']);
                }
              } catch (e) {
                console.log('Excel lock check:', e.message);
              }
            }

            items.forEach((item, index) => {
              const newTrx = {
                'ID Transaksi': `TRX-${Date.now()}-${index + 1}`,
                'Waktu': item.waktu || new Date().toLocaleString('id-ID'),
                'Nama GI': item.namaGi || item.nama_gi || 'GI Bekasi',
                'Nama Barang': item.namaBarang || item.nama_barang,
                'Jumlah': Number(item.jumlah || 1),
                'Nama Pengambil': item.namaPengambil || item.nama_pengambil || 'Petugas ULTG',
                'Keterangan': item.keterangan || ''
              };
              addedTrxList.push(newTrx);
              backup.additionalTrx.push(newTrx);
              if (wb && wb.Sheets['Transaksi App']) {
                excelRows.push(newTrx);
              }
            });

            const mutex = getFileMutex(INVENTARIS_BACKUP_FILE);
            await mutex.runExclusive(async () => {
              fs.writeFileSync(INVENTARIS_BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');
            });

            if (wb && wb.Sheets['Transaksi App']) {
              try {
                wb.Sheets['Transaksi App'] = xlsx.utils.json_to_sheet(excelRows);
                xlsx.writeFile(wb, EXCEL_PATH);
              } catch(e) {
                console.log('Could not write directly to excel due to file lock, stored safely in backup.');
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: `${addedTrxList.length} transaksi berhasil dicatat!`, data: addedTrxList }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if (req.url === '/api/inventaris/update-master' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { namaBarang, stokFinal } = JSON.parse(body);
            let updated = false;

            if (fs.existsSync(EXCEL_PATH)) {
              try {
                const wb = xlsx.readFile(EXCEL_PATH);
                if (wb.Sheets['Master App']) {
                  const masterRows = xlsx.utils.sheet_to_json(wb.Sheets['Master App']);
                  masterRows.forEach(row => {
                    const nm = row['Nama Barang'] || row.nama_barang || '';
                    if (nm === namaBarang) {
                      row['Stok Awal'] = Number(stokFinal);
                      updated = true;
                    }
                  });
                  if (updated) {
                    wb.Sheets['Master App'] = xlsx.utils.json_to_sheet(masterRows);
                    xlsx.writeFile(wb, EXCEL_PATH);
                  }
                }
              } catch (e) {
                console.log('Excel write error:', e.message);
              }
            }

            // Simpan juga ke backup lokal agar persist
            let backup = { additionalTrx: [], masterOverrides: {} };
            if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
              try { backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8')); } catch(e){}
            }
            if (!backup.masterOverrides) backup.masterOverrides = {};
            backup.masterOverrides[namaBarang] = Number(stokFinal);
            fs.writeFileSync(INVENTARIS_BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: `Stok awal untuk ${namaBarang} berhasil diubah menjadi ${stokFinal}` }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if (req.url === '/api/inventaris/delete-transaksi' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { id } = JSON.parse(body);
            let backup = { additionalTrx: [] };
            if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
              try { backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8')); } catch(e){}
            }
            if (Array.isArray(backup.additionalTrx)) {
              backup.additionalTrx = backup.additionalTrx.filter(t => (t['ID Transaksi'] || t.id_transaksi) !== id);
              const mutex = getFileMutex(INVENTARIS_BACKUP_FILE);
              await mutex.runExclusive(async () => {
                fs.writeFileSync(INVENTARIS_BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');
              });
            }

            if (fs.existsSync(EXCEL_PATH)) {
              try {
                const wb = xlsx.readFile(EXCEL_PATH);
                if (wb.Sheets['Transaksi App']) {
                  let rows = xlsx.utils.sheet_to_json(wb.Sheets['Transaksi App']);
                  rows = rows.filter(r => (r['ID Transaksi'] || r.id_transaksi) !== id);
                  wb.Sheets['Transaksi App'] = xlsx.utils.json_to_sheet(rows);
                  xlsx.writeFile(wb, EXCEL_PATH);
                }
              } catch (e) {
                console.log('Could not delete from excel:', e.message);
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Transaksi berhasil dihapus.' }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if (req.url === '/api/inventaris/update-transaksi' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { id, waktu, namaGi, namaBarang, jumlah, satuan, namaPengambil, keterangan } = JSON.parse(body);
            let backup = { additionalTrx: [] };
            if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
              try { backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8')); } catch(e){}
            }
            if (Array.isArray(backup.additionalTrx)) {
              backup.additionalTrx = backup.additionalTrx.map(t => {
                if ((t['ID Transaksi'] || t.id_transaksi || t.id) === id) {
                  return {
                    ...t,
                    'Waktu': waktu || t['Waktu'],
                    'Nama GI': namaGi || t['Nama GI'],
                    'Nama Barang': namaBarang || t['Nama Barang'],
                    'Jumlah': Number(jumlah || t['Jumlah'] || 0),
                    'Satuan': satuan || t['Satuan'] || 'Pcs',
                    'Nama Pengambil': namaPengambil || t['Nama Pengambil'],
                    'Keterangan': keterangan !== undefined ? keterangan : (t['Keterangan'] || '')
                  };
                }
                return t;
              });
              const mutex = getFileMutex(INVENTARIS_BACKUP_FILE);
              await mutex.runExclusive(async () => {
                fs.writeFileSync(INVENTARIS_BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');
              });
            }

            if (fs.existsSync(EXCEL_PATH)) {
              try {
                const wb = xlsx.readFile(EXCEL_PATH);
                if (wb.Sheets['Transaksi App']) {
                  let rows = xlsx.utils.sheet_to_json(wb.Sheets['Transaksi App']);
                  rows = rows.map(r => {
                    if ((r['ID Transaksi'] || r.id_transaksi || r.id) === id) {
                      return {
                        ...r,
                        'Waktu': waktu || r['Waktu'],
                        'Nama GI': namaGi || r['Nama GI'],
                        'Nama Barang': namaBarang || r['Nama Barang'],
                        'Jumlah': Number(jumlah || r['Jumlah'] || 0),
                        'Satuan': satuan || r['Satuan'] || 'Pcs',
                        'Nama Pengambil': namaPengambil || r['Nama Pengambil'],
                        'Keterangan': keterangan !== undefined ? keterangan : (r['Keterangan'] || '')
                      };
                    }
                    return r;
                  });
                  wb.Sheets['Transaksi App'] = xlsx.utils.json_to_sheet(rows);
                  xlsx.writeFile(wb, EXCEL_PATH);
                }
              } catch (e) {
                console.log('Could not update excel:', e.message);
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Transaksi berhasil dikoreksi.' }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if ((req.url === '/api/inventaris/export' || req.url === '/api/export') && req.method === 'GET') {
        try {
          let masterList = [];
          let trxList = [];
          if (fs.existsSync(EXCEL_PATH)) {
            const wb = xlsx.readFile(EXCEL_PATH);
            if (wb.Sheets['Master App']) masterList = xlsx.utils.sheet_to_json(wb.Sheets['Master App']);
            else if (wb.Sheets['Master Barang']) masterList = xlsx.utils.sheet_to_json(wb.Sheets['Master Barang']);
            if (wb.Sheets['Transaksi App']) trxList = xlsx.utils.sheet_to_json(wb.Sheets['Transaksi App']);
          } else if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
            const backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8'));
            masterList = backup.masterList || [];
            trxList = backup.trxList || [];
          }

          if (fs.existsSync(INVENTARIS_BACKUP_FILE)) {
            try {
              const backup = JSON.parse(fs.readFileSync(INVENTARIS_BACKUP_FILE, 'utf-8'));
              if (Array.isArray(backup.additionalTrx)) {
                trxList = [...trxList, ...backup.additionalTrx];
              }
              if (backup.masterOverrides) {
                masterList = masterList.map(item => {
                  const nm = item['Nama Barang'] || item.nama_barang || '';
                  if (backup.masterOverrides[nm] !== undefined) {
                    item['Stok Awal'] = Number(backup.masterOverrides[nm]);
                  }
                  return item;
                });
              }
            } catch(e){}
          }

          const newWb = xlsx.utils.book_new();

          // 1. Master Barang Sheet
          const masterExportRows = masterList.map((item, idx) => ({
            'NO': idx + 1,
            'ID Barang': item['ID Barang'] || item.id || `BRG${String(idx + 1).padStart(3, '0')}`,
            'Nama Barang': item['Nama Barang'] || item.nama_barang || '',
            'Satuan': item['Satuan'] || item.satuan || 'Pcs',
            'Stok Awal': Number(item['Stok Awal'] !== undefined ? item['Stok Awal'] : (item.stok_awal || 0))
          }));
          const wsMaster = masterExportRows.length > 0
            ? xlsx.utils.json_to_sheet(masterExportRows)
            : xlsx.utils.json_to_sheet([], { header: ['NO', 'ID Barang', 'Nama Barang', 'Satuan', 'Stok Awal'] });
          xlsx.utils.book_append_sheet(newWb, wsMaster, 'Master Barang');

          // 2. 14 GI Sheets
          const daftarGi = ['HARPRO', 'HARGI', 'HARJAR', 'GITET MUARATAWAR', 'GIGISTET NEW TAMBUN', 'GI FAJAR SW', 'GI CIKARANG', 'GI GANDAMEKAR', 'GI JABABEKA', 'GI MUARATAWAR', 'GIS MARGAHAYU', 'GI PONCOL BARU', 'GI RAJAPAKSI', 'GI TAMBUN'];
          daftarGi.forEach(gi => {
            const giTrx = trxList.filter(t => (t['Nama GI'] || t.namaGi || t.nama_gi || '').trim().toUpperCase() === gi.toUpperCase());
            const giRows = giTrx.map((t, idx) => ({
              'NO': idx + 1,
              'HARI/TANGGAL': t['Waktu'] || t.waktu || t['HARI/TANGGAL'] || new Date().toISOString().slice(0, 10),
              'NAMA BARANG': t['Nama Barang'] || t.namaBarang || t.nama_barang || t['NAMA BARANG'] || '',
              'JUMLAH': Number(t['Jumlah'] || t.jumlah || t['JUMLAH'] || 0),
              'SATUAN': t['Satuan'] || t.satuan || t['SATUAN'] || 'Pcs',
              'UNIT PEMAKAI': t['Nama Pengambil'] || t.namaPengambil || t.nama_pengambil || t['UNIT PEMAKAI'] || '-',
              'KETERANGAN': t['Keterangan'] || t.keterangan || t['KETERANGAN'] || ''
            }));
            const wsGi = giRows.length > 0
              ? xlsx.utils.json_to_sheet(giRows)
              : xlsx.utils.json_to_sheet([], { header: ['NO', 'HARI/TANGGAL', 'NAMA BARANG', 'JUMLAH', 'SATUAN', 'UNIT PEMAKAI', 'KETERANGAN'] });
            xlsx.utils.book_append_sheet(newWb, wsGi, gi);
          });

          const buf = xlsx.write(newWb, { type: 'buffer', bookType: 'xlsx' });
          const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const filename = `Rekap_Material_ULTG_${dateStr}.xlsx`;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.end(buf);
        } catch (e) {
          res.statusCode = 500;
          res.end('Gagal generate Excel: ' + e.message);
        }
        return;
      }

      if (req.url === '/api/pln-bridge/save-token' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            let token = data.token || '';
            if (token && !token.startsWith('Bearer ')) {
              token = 'Bearer ' + token;
            }
            fs.writeFileSync(TOKEN_FILE, token, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Token berhasil disimpan di server Node.js!' }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if (req.url.startsWith('/api/pln-bridge/image') && req.method === 'GET') {
        try {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          const pathFile = urlObj.searchParams.get('pathFile');
          if (!pathFile) {
            res.statusCode = 400;
            res.end('Missing pathFile parameter');
            return;
          }

          let token = '';
          if (fs.existsSync(TOKEN_FILE)) {
            token = fs.readFileSync(TOKEN_FILE, 'utf-8').trim();
          }
          if (req.headers.authorization) token = req.headers.authorization;

          const imgRes = await fetch(`https://apipowerinspect.pln.co.id/minio/view?pathFile=${encodeURIComponent(pathFile)}`, {
            headers: {
              'authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
          });

          if (!imgRes.ok) {
            res.statusCode = imgRes.status;
            res.end('Error fetching image from minio');
            return;
          }

          const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
          res.setHeader('Content-Type', contentType);
          const buffer = await imgRes.arrayBuffer();
          res.end(Buffer.from(buffer));
        } catch (e) {
          res.statusCode = 500;
          res.end(e.message);
        }
        return;
      }

      if (req.url.startsWith('/api/pln-bridge/detail/') && req.method === 'GET') {
        try {
          const parts = req.url.split('/api/pln-bridge/detail/')[1].split('?')[0];
          const assetId = parts.trim();

          let token = '';
          if (fs.existsSync(TOKEN_FILE)) {
            token = fs.readFileSync(TOKEN_FILE, 'utf-8').trim();
          }
          if (req.headers.authorization) token = req.headers.authorization;

          const headers = {
            'authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'content-type': 'application/json'
          };

          // 1. Ambil Detail Asset Info via POST /detail/{id}
          let assetInfo = null;
          try {
            const r1 = await fetch(`https://apipowerinspect.pln.co.id/monitoring-anomali/detail/${assetId}?page=0&size=10`, {
              method: 'POST',
              headers: headers,
              body: '{}'
            });
            if (r1.ok) {
              const d1 = await r1.json();
              assetInfo = d1.data || null;
            }
          } catch (err) {}

          // 2. Ambil Foto Inspeksi Terakhir (Cek ID utama & seluruh sub-parameter)
          let photos = [];
          const addedPaths = new Set();
          const addPhotos = (list) => {
            if (!Array.isArray(list)) return;
            for (const item of list) {
              const pStr = typeof item === 'string' ? item : (item.path || item.url || item.pathFile);
              if (pStr && !addedPaths.has(pStr)) {
                addedPaths.add(pStr);
                photos.push(typeof item === 'string' ? { path: item } : item);
              }
            }
          };

          try {
            const r2 = await fetch(`https://apipowerinspect.pln.co.id/monitoring-ahi/detail-foto-inspeksi-terakhir/${assetId}`, {
              method: 'GET',
              headers: { 'authorization': headers.authorization }
            });
            if (r2.ok) {
              const d2 = await r2.json();
              addPhotos(d2.data?.listPathFoto || d2.data?.listFoto || d2.data?.foto || []);
            }
          } catch (err) {}

          if (assetInfo && Array.isArray(assetInfo.listData?.content)) {
            for (const item of assetInfo.listData.content) {
              if (!item.id) continue;
              try {
                const rp = await fetch(`https://apipowerinspect.pln.co.id/monitoring-anomali/detail-parameter/${item.id}?page=0&size=10`, {
                  headers: { 'authorization': headers.authorization }
                });
                if (rp.ok) {
                  const dp = await rp.json();
                  addPhotos(dp.data?.listFoto || dp.data?.listPathFoto || []);
                }
              } catch (err) {}

              try {
                const rf = await fetch(`https://apipowerinspect.pln.co.id/monitoring-ahi/detail-foto-inspeksi-terakhir/${item.id}`, {
                  headers: { 'authorization': headers.authorization }
                });
                if (rf.ok) {
                  const df = await rf.json();
                  addPhotos(df.data?.listPathFoto || df.data?.listFoto || []);
                }
              } catch (err) {}
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, assetInfo, photos }));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
      }

      if (req.url === '/api/pln-bridge/auto-pull' && (req.method === 'GET' || req.method === 'POST')) {
        try {
          let token = '';
          if (fs.existsSync(TOKEN_FILE)) {
            token = fs.readFileSync(TOKEN_FILE, 'utf-8').trim();
          }
          if (req.headers.authorization) {
            token = req.headers.authorization;
          }

          if (!token) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Token belum tersedia di server. Silakan masukkan token di Pengaturan Sync.' }));
            return;
          }

          const payload = {
            "idRegional": "be5dd2ac-ca4a-496c-9356-77777d81787c",
            "idUnitInduk": "d6e3f011-2505-49f0-9cca-5c0e71432142",
            "idUnitPelaksana": "4a584074-05b4-4637-b540-8d59d19f4381",
            "idUltg": "41257f45-aa77-4407-8633-bd0d45a179db",
            "idGarduInduk": null,
            "idBay": null,
            "idJenisAsset": null,
            "keyword": null
          };

          const plnRes = await fetch("https://apipowerinspect.pln.co.id/monitoring-anomali/find-all?page=0&size=1000", {
            method: "POST",
            headers: {
              "accept": "application/json, text/plain, */*",
              "authorization": token.startsWith('Bearer ') ? token : `Bearer ${token}`,
              "content-type": "application/json",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36"
            },
            body: JSON.stringify(payload)
          });

          if (!plnRes.ok) {
            const errTxt = await plnRes.text();
            res.statusCode = plnRes.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: `PLN API Error ${plnRes.status}: ${errTxt.substring(0, 200)}` }));
            return;
          }

          const data = await plnRes.json();
          const mutex = getFileMutex(BRIDGE_FILE);
          await mutex.runExclusive(async () => {
            fs.writeFileSync(BRIDGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
          });
          res.setHeader('Content-Type', 'application/json');
          const list = data.data?.content || data.content || [];
          res.end(JSON.stringify({ success: true, count: list.length, timestamp: new Date().toISOString() }));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
      }

      if (req.url === '/api/pln-bridge/receive' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const mutex = getFileMutex(BRIDGE_FILE);
            await mutex.runExclusive(async () => {
              fs.writeFileSync(BRIDGE_FILE, JSON.stringify({
                timestamp: new Date().toISOString(),
                data: data
              }, null, 2));
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Data PLN berhasil disimpan di local bridge!' }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if (req.url === '/api/pln-bridge/latest' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (fs.existsSync(BRIDGE_FILE)) {
          const content = fs.readFileSync(BRIDGE_FILE, 'utf-8');
          res.end(content);
        } else {
          res.end(JSON.stringify({ timestamp: null, data: null }));
        }
        return;
      }

      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), plnBridgePlugin()],
  server: {
    proxy: {
      '/api-pln': {
        target: 'https://apipowerinspect.pln.co.id',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-pln/, '')
      },
      '/api-gsheet': {
        target: 'https://docs.google.com/spreadsheets/d',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-gsheet/, '')
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
