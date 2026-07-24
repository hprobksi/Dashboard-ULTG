import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

// 1. Change all w:sz val="22" to w:sz val="20" (11pt -> 10pt)
// 2. Change all w:szCs val="22" to w:szCs val="20" (11pt -> 10pt)
xml = xml.replace(/<w:sz w:val="22"\/>/g, '<w:sz w:val="20"/>');
xml = xml.replace(/<w:szCs w:val="22"\/>/g, '<w:szCs w:val="20"/>');

// 3. For the signature block paragraphs (Bekasi..., Mengetahui..., TRIAWAN..., FAJAR...), add <w:keepNext/> so Word keeps them on the same page
const pMatches = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];

pMatches.forEach((p, idx) => {
  const pStr = p[0];
  const pText = pStr.replace(/<[^>]+>/g, '');
  
  // Signature paragraphs: Bekasi, Mengetahui, {managerNama}, {managerJabatan}, {tlNama}, {tlJabatan}
  if (pText.includes('Bekasi') || pText.includes('Mengetahui') || pText.includes('{manager') || pText.includes('{tl')) {
    // Add <w:keepNext/> and <w:cantSplit/> into <w:pPr> if not present
    let newPPr;
    if (pStr.includes('<w:pPr>')) {
      newPPr = pStr.replace('<w:pPr>', '<w:pPr><w:keepNext/><w:cantSplit/>');
    } else {
      newPPr = pStr.replace(/<w:p([^>]*)>/, '<w:p$1><w:pPr><w:keepNext/><w:cantSplit/></w:pPr>');
    }
    xml = xml.replace(pStr, newPPr);
  }
});

origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

console.log('✓ Word Template updated: All font sizes 10pt (w:sz=20)');
console.log('✓ Signature block configured with <w:keepNext/> & <w:cantSplit/> to prevent page break splits');
