const xlsx = require('xlsx');

const filePath = 'C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\K3\\Peralatan K3 dan CCTV Bulan Juli 2026.xlsx';

console.log("Reading file:", filePath);
try {
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  console.log("Sheet names:");
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    // Convert the first 5 rows to JSON just to see structure
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    for (let i = 0; i < Math.min(10, data.length); i++) {
      console.log(`Row ${i + 1}:`, data[i]);
    }
  });
} catch (e) {
  console.error("Failed to read excel:", e);
}
