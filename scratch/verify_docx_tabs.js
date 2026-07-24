import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const origXml = origZip.file('word/document.xml').asText();

const pOrig = origXml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];

console.log("=== ORIGINAL PARAGRAPHS STRUCTURE (01. LKP) ===");
pOrig.slice(0, 16).forEach((p, idx) => {
  const tabs = (p.match(/<w:tab\/>/g) || []).length;
  const text = p.replace(/<[^>]+>/g, '').trim();
  console.log(`P${idx + 1} (${tabs} tabs): "${text}"`);
});
