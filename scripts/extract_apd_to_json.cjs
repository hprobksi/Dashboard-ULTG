const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\K3\\Peralatan K3 dan CCTV Bulan Juli 2026.xlsx';
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['KEBUTUHAN APD'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

let currentCategory = '';
const result = [];

for (let i = 7; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length === 0) continue;
  
  // Clean up columns, sometimes there are empty elements before the actual value
  let col0, col1, col2, col3;
  
  // Find the first non-empty string in the row
  let firstNonEmptyIndex = row.findIndex(c => c !== undefined && c !== null && String(c).trim() !== '');
  
  if (firstNonEmptyIndex === -1) continue;
  
  if (firstNonEmptyIndex === 0) {
    col0 = String(row[0]).trim();
    if (col0 === 'ITEM / PERALATAN') continue;
    
    // It's a Category header or a Category + Item
    if (row[1] && String(row[1]).trim() !== '') {
      currentCategory = col0;
      col1 = String(row[1]).trim().replace(/\r?\n|\r/g, ' ');
      col2 = String(row[2] || '').trim().replace(/\r?\n|\r/g, ' ');
      col3 = row[3];
    } else {
      currentCategory = col0;
      continue;
    }
  } else {
    // It's just an item under the current category
    col1 = String(row[firstNonEmptyIndex]).trim().replace(/\r?\n|\r/g, ' ');
    col2 = String(row[firstNonEmptyIndex + 1] || '').trim().replace(/\r?\n|\r/g, ' ');
    col3 = row[firstNonEmptyIndex + 2];
  }
  
  if (col1 && col1 !== 'APD' && col1 !== 'GIS/GI/GITET') {
    result.push({
      category: currentCategory,
      item: col1,
      satuan: col2,
      standar: col3 !== undefined ? col3 : '-',
      rowNumber: i + 1
    });
  }
}

fs.writeFileSync('C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\src\\data\\apdItems.json', JSON.stringify(result, null, 2), 'utf-8');
console.log('Total items extracted:', result.length);
