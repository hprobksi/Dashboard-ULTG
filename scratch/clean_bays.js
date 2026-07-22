const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../public/data/peralatan_ultg_bekasi.json');

if (!fs.existsSync(filePath)) {
  console.error("File tidak ditemukan:", filePath);
  process.exit(1);
}

const rawData = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(rawData);

console.log(`Total item sebelum dihapus: ${data.length}`);

const IGNORED_BAYS = ['SPAN', 'TOWER', 'GEDUNG', 'GANTRY', 'SERANDANG', 'JOIN SKTT', 'JOINT SKTT'];

let removedCount = 0;
const cleanedData = data.filter(item => {
  if (!item || !item.bay || item.bay === '-') return true;
  const upper = String(item.bay).toUpperCase();
  const isIgnored = IGNORED_BAYS.some(kw => upper.includes(kw));
  if (isIgnored) {
    removedCount++;
    return false;
  }
  return true;
});

console.log(`Total item dihapus (SPAN, TOWER, GEDUNG, GANTRY, SERANDANG, JOIN SKTT): ${removedCount}`);
console.log(`Total item setelah dihapus: ${cleanedData.length}`);

fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2), 'utf8');
console.log("Berhasil memperbarui public/data/peralatan_ultg_bekasi.json!");
