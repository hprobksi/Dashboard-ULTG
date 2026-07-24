import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const origZip = new PizZip(origBuf);
const docXml = origZip.file('word/document.xml').asText();

const pMatches = [...docXml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];

console.log(`Total paragraphs: ${pMatches.length}\n`);

pMatches.forEach((p, idx) => {
  if (idx >= 30) {
    const text = p[0].replace(/<[^>]+>/g, '');
    console.log(`P${idx}: "${text}"`);
  }
});
