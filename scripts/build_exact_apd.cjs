const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\K3\\Peralatan K3 dan CCTV Bulan Juli 2026.xlsx';
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['KEBUTUHAN APD'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const ranges = [
  { cat: "ALAT PELINDUNG KEPALA", start: 9, end: 14 },
  { cat: "ALAT PELINDUNG MATA DAN MUKA", start: 15, end: 18 },
  { cat: "ALAT PELINDUNG TANGAN", start: 19, end: 23 },
  { cat: "ALAT PELINDUNG TELINGA", start: 24, end: 25 },
  { cat: "ALAT PELINDUNG KAKI", start: 26, end: 30 },
  { cat: "PAKAIAN PELINDUNG", start: 31, end: 37 },
  { cat: "ROMPI PENGAWAS *", start: 38, end: 41 },
  { cat: "ALAT PELINDUNG PERNAPASAN", start: 42, end: 47 },
  { cat: "ALAT PELINDUNG JATUH", start: 48, end: 51 },
  { cat: "PELAMPUNG", start: 52, end: 55 },
  { cat: "RAMBU-RAMBU **", start: 56, end: 73 },
  { cat: "ALAT KERJA *", start: 74, end: 79 }
];

const result = [];

for (const range of ranges) {
  for (let r = range.start; r <= range.end; r++) {
    // data is 0-indexed, so row 9 is data[8]
    const row = data[r - 1];
    if (!row) continue;
    
    // Find item name
    let itemStr = '';
    let satuan = '';
    let standar = '-';
    
    // Search from right to left or just manually grab based on visual structure
    // Typically col 0 is Category, col 1 is Item (sometimes col 0 is empty)
    // Let's just find the first non-empty string that is NOT the category name
    let firstStrIdx = row.findIndex(c => c && String(c).trim() !== '');
    
    if (firstStrIdx !== -1) {
      let val1 = String(row[firstStrIdx]).trim().replace(/\r?\n|\r/g, ' ');
      if (val1 === range.cat) {
        if (row[firstStrIdx + 1] && String(row[firstStrIdx + 1]).trim() !== '') {
          itemStr = String(row[firstStrIdx + 1]).trim().replace(/\r?\n|\r/g, ' ');
          satuan = String(row[firstStrIdx + 2] || '').trim().replace(/\r?\n|\r/g, ' ');
          standar = row[firstStrIdx + 3] !== undefined ? row[firstStrIdx + 3] : '-';
        }
      } else {
        itemStr = val1;
        satuan = String(row[firstStrIdx + 1] || '').trim().replace(/\r?\n|\r/g, ' ');
        standar = row[firstStrIdx + 2] !== undefined ? row[firstStrIdx + 2] : '-';
      }
    }
    
    if (itemStr) {
      result.push({
        category: range.cat,
        item: itemStr,
        satuan: satuan,
        standar: standar,
        rowNumber: r
      });
    }
  }
}

fs.writeFileSync('C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\src\\data\\apdItems.json', JSON.stringify(result, null, 2), 'utf-8');
console.log('Total exactly mapped items:', result.length);
