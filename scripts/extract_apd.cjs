const xlsx = require('xlsx');

const filePath = 'C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\K3\\Peralatan K3 dan CCTV Bulan Juli 2026.xlsx';
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['KEBUTUHAN APD'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// data starts around row 9 (index 8)
// 0: ITEM / PERALATAN (Category)
// 1: APD (Item Name)
// 2: SATUAN
// 3: STANDAR KEBUTUHAN
// 4: JUMLAH REAL DI LAPANGAN
// 5: Kondisi Peralatan
// 6: Keterangan

let currentCategory = '';
const result = [];

for (let i = 7; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length === 0) continue;
  
  const col0 = String(row[0] || '').trim();
  const col1 = String(row[1] || '').trim();
  const col2 = String(row[2] || '').trim();
  const col3 = row[3];
  
  if (col0 && !col1 && !col2 && !col3) {
    // probably a category, but wait, category has col0 and col1 might be empty or not
  }
  
  if (col0 && col0 !== currentCategory && col0 !== 'ITEM / PERALATAN') {
    currentCategory = col0;
  }
  
  if (col1 && col1 !== 'APD') {
    result.push({
      category: currentCategory || col0,
      item: col1,
      satuan: col2,
      standar: col3,
      rowNumber: i + 1
    });
  }
}

console.log(JSON.stringify(result, null, 2));
require(fs).writeFileSync(src/data/apdItems.json, JSON.stringify(result, null, 2), utf8);
