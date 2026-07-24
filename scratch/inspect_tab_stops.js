import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
const docXml = origZip.file('word/document.xml').asText();

const pMatches = [...docXml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];

console.log('=== TAB STOPS & PARAGRAPH XML IN ORIGINAL 01. LKP ===\n');

pMatches.forEach((p, idx) => {
  const pStr = p[0];
  const text = pStr.replace(/<[^>]+>/g, '');
  if (text.trim() && idx <= 16) {
    console.log(`[P${idx}] Text: "${text}"`);
    // Extract tab definitions in pPr
    const tabsMatch = pStr.match(/<w:tabs>[\s\S]*?<\/w:tabs>/);
    if (tabsMatch) {
      console.log(`     Tabs: ${tabsMatch[0]}`);
    } else {
      console.log(`     Tabs: NONE`);
    }
    // Extract w:ind
    const indMatch = pStr.match(/<w:ind[^>]*\/>/);
    if (indMatch) {
      console.log(`     Ind: ${indMatch[0]}`);
    }
    console.log('---');
  }
});
