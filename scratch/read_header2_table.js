import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);
const xml = zip.file('word/header2.xml').asText();

const tables = xml.match(/<w:tbl[\s\S]*?<\/w:tbl>/g) || [];
console.log(`Found ${tables.length} tables in header2.xml`);

tables.forEach((tbl, tIdx) => {
  console.log(`\n=================== HEADER TABLE ${tIdx + 1} ===================`);
  const rows = tbl.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
  rows.forEach((row, rIdx) => {
    const cells = row.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
    const cellTexts = cells.map(cell => cell.replace(/<[^>]+>/g, '').trim());
    console.log(`Row ${rIdx + 1}: ${cellTexts.join('  |  ')}`);
  });
});
