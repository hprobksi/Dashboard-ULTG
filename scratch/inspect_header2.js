import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const headerXml = origZip.file('word/header2.xml').asText();

console.log('=== HEADER2.XML CONTENT ===\n');
const paragraphs = headerXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
paragraphs.forEach((p, idx) => {
  const text = p.replace(/<[^>]+>/g, '');
  console.log(`[H${idx}] "${text}"`);
});
