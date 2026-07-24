import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const docXml = origZip.file('word/document.xml').asText();

// Extract paragraphs
const paragraphs = docXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

console.log('=== EXACT PARAGRAPH & RUN STRUCTURE OF 01. LKP ===\n');

paragraphs.forEach((p, pIdx) => {
  const pText = p.replace(/<[^>]+>/g, '');
  console.log(`[P${pIdx}] Full Text: "${pText}"`);
  
  // Find all runs in this paragraph
  const runs = p.match(/<w:r[ >][\s\S]*?<\/w:r>/g) || [];
  runs.forEach((r, rIdx) => {
    const rText = r.replace(/<[^>]+>/g, '');
    console.log(`   R${rIdx}: "${rText}"`);
  });
  console.log('---');
});
