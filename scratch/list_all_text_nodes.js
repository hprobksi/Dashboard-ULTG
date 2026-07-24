import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const xml = origZip.file('word/document.xml').asText();

// Find all w:t text nodes and print them
const allWt = [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)];
const texts = allWt.map(m => m[1]).filter(t => t.trim());

console.log('=== ALL TEXT NODES (non-empty) ===');
texts.forEach((t, i) => {
  console.log(`${i}: "${t}"`);
});
