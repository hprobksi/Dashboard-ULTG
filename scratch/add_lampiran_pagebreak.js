import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

// Locate P40 (LAMPIRAN) and prepend explicit page break
// <w:p><w:r><w:br w:type="page"/></w:r></w:p>

const pageBreakXml = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

// Replace P40 LAMPIRAN with page break + LAMPIRAN title
xml = xml.replace(/(<w:p [^>]*><w:pPr>[\s\S]*?<w:t>LAMPIRAN<\/w:t><\/w:r><\/w:p>)/, `${pageBreakXml}$1`);

origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

console.log('✓ Page Break successfully added before LAMPIRAN in Word template!');
