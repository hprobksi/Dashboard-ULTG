import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const xml = origZip.file('word/document.xml').asText();

const pMatches = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];

pMatches.forEach((p, i) => {
  const wtText = [...p[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(m => m[1]).join('');
  if (wtText.trim()) {
    console.log(`P${i}: "${wtText}"`);
  }
});
