import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);

// Check page margins in document.xml
const docXml = origZip.file('word/document.xml').asText();
const sectPr = docXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/)?.[0] || 'NOT FOUND';
console.log('=== sectPr (page setup) ===');
console.log(sectPr.substring(0, 2000));

// Check header file
const files = Object.keys(origZip.files);
const headerFiles = files.filter(f => f.includes('header'));
const footerFiles = files.filter(f => f.includes('footer'));
console.log('\n=== Header files ===', headerFiles);
console.log('=== Footer files ===', footerFiles);

headerFiles.forEach(hf => {
  const txt = origZip.file(hf)?.asText() || '';
  const textOnly = txt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`\n[${hf}] text: "${textOnly.substring(0, 300)}"`);
});

footerFiles.forEach(ff => {
  const txt = origZip.file(ff)?.asText() || '';
  const textOnly = txt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`\n[${ff}] text: "${textOnly.substring(0, 300)}"`);
});
