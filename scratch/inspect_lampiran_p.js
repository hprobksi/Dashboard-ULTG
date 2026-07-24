import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const origZip = new PizZip(origBuf);
const docXml = origZip.file('word/document.xml').asText();

const pMatches = [...docXml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];

console.log(`Total paragraphs found: ${pMatches.length}`);

pMatches.forEach((p, idx) => {
  const text = p[0].replace(/<[^>]+>/g, '');
  if (text.includes('LAMPIRAN') || idx >= 35) {
    console.log(`P${idx}: "${text}"`);
    console.log(`   XML: ${p[0]}`);
    console.log('---');
  }
});
