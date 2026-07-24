import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);

const xml = zip.file('word/document.xml').asText();

// Parse tables in document.xml
const tables = xml.match(/<w:tbl[\s\S]*?<\/w:tbl>/g) || [];
console.log(`Found ${tables.length} tables in document.xml`);

tables.forEach((tbl, tIdx) => {
  console.log(`\n=================== TABLE ${tIdx + 1} ===================`);
  const rows = tbl.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
  rows.forEach((row, rIdx) => {
    const cells = row.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
    const cellTexts = cells.map(cell => cell.replace(/<[^>]+>/g, '').trim());
    console.log(`Row ${rIdx + 1}: ${cellTexts.join('  |  ')}`);
  });
});

// Also print non-table paragraphs
const cleanText = xml.replace(/<w:tbl[\s\S]*?<\/w:tbl>/g, ' [TABLE_HERE] ');
const paragraphs = cleanText.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
console.log(`\n=================== PARAGRAPHS ===================`);
paragraphs.forEach((p, idx) => {
  const t = p.replace(/<[^>]+>/g, '').trim();
  if (t) console.log(`P${idx + 1}: ${t}`);
});
