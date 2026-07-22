const xlsx = require('xlsx');

const filePath = 'C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\K3\\Peralatan K3 dan CCTV Bulan Juli 2026.xlsx';
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['KEBUTUHAN APD'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

for (let i = 5; i < Math.min(30, data.length); i++) {
  console.log(`Row ${i + 1}:`, data[i].slice(0, 5));
}
