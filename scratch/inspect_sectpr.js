import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const docXml = origZip.file('word/document.xml').asText();

// Search for sectPr or pgBorders
const sectPrMatch = docXml.match(/<w:sectPr[ >][\s\S]*?<\/w:sectPr>/g);
console.log('=== SECTPR IN 01. LKP ===\n');
if (sectPrMatch) {
  console.log(sectPrMatch[0]);
} else {
  console.log('No sectPr found');
}
