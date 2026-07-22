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
fs.writeFileSync('public/data/peralatan_ultg_bekasi.json', JSON.stringify(cleaned, null, 2), 'utf8');
console.log(`Successfully cleaned public/data/peralatan_ultg_bekasi.json: reduced from ${data.length} to ${cleaned.length} items.`);
