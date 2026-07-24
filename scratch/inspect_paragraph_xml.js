import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const origXml = origZip.file('word/document.xml').asText();

// Extract all paragraph XML with full structure
const pOrig = origXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

console.log("=== FULL RAW XML OF FIRST 16 PARAGRAPHS ===");
pOrig.slice(0, 16).forEach((p, idx) => {
  const text = p.replace(/<[^>]+>/g, '').trim();
  console.log(`\n--- P${idx+1}: "${text}" ---`);
  // Show tab stops and indentation
  const pPr = p.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] || 'NO PPR';
  console.log('  pPr:', pPr.substring(0, 500));
});
