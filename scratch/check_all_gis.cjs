const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/peralatan_ultg_bekasi.json', 'utf8'));

const summary = {};
data.forEach(i => {
  const key = `Sheet: [${i.sheet}] -> GI: [${i.gi}]`;
  summary[key] = (summary[key] || 0) + 1;
});

console.log('All Sheet -> GI breakdown:');
console.log(summary);
