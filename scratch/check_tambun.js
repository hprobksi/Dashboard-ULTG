const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/peralatan_ultg_bekasi.json', 'utf8'));

const sheets = new Set();
const gis = new Set();
const tambunItems = [];

data.forEach(item => {
  sheets.add(item.sheet);
  gis.add(item.gi);
  if ((item.sheet && item.sheet.toUpperCase().includes('TAMBUN')) || (item.gi && item.gi.toUpperCase().includes('TAMBUN'))) {
    tambunItems.push({ sheet: item.sheet, gi: item.gi, bay: item.bay });
  }
});

console.log('Unique Sheets:', Array.from(sheets));
console.log('Unique GIs:', Array.from(gis));
console.log('\nSample Tambun items:', tambunItems.slice(0, 20));
console.log('\nTambun summary by sheet -> gi:');
const summary = {};
tambunItems.forEach(i => {
  const key = `${i.sheet} -> ${i.gi}`;
  summary[key] = (summary[key] || 0) + 1;
});
console.log(summary);
