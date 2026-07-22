const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/peralatan_ultg_bekasi.json', 'utf8'));

const cleanSubstationSheets = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => {
    if (!item) return false;
    const s = String(item.sheet || '').toUpperCase();
    const g = String(item.gi || '').toUpperCase();

    if (s === 'GI TAMBUN') {
      if (g.includes('GIS') || g.includes('GISTET') || g.includes('NEW TAMBUN') || g.includes('500KV')) {
        return false;
      }
    }
    if (s === 'GIS NEW TAMBUN') {
      if (!g.includes('GIS') || g.includes('GISTET') || g.includes('500KV')) {
        return false;
      }
    }
    if (s === 'GISTET NEW TAMBUN') {
      if (!g.includes('GISTET') && !g.includes('500KV')) {
        return false;
      }
    }
    return true;
  });
};

const cleaned = cleanSubstationSheets(data);
console.log('Original total items:', data.length);
console.log('Cleaned total items:', cleaned.length);

const summary = {};
cleaned.forEach(i => {
  if (i.sheet.toUpperCase().includes('TAMBUN')) {
    const key = `Sheet: [${i.sheet}] -> GI: [${i.gi}]`;
    summary[key] = (summary[key] || 0) + 1;
  }
});
console.log('\nAfter cleaning Tambun breakdown:');
console.log(summary);
