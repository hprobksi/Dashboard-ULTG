/**
 * fix_tahun_fields.js — Fix "Tahun Operasi" and "Tahun Buat" placeholders
 * These are split across multiple runs in the original XML.
 * The paragraph text (concatenated) is "TahunOperasi:" and "TahunBuat:"
 * We look for the paragraph where concatenated text includes these, 
 * then replace the last w:t with ": {placeholder}"
 */

import fs from 'fs';
import PizZip from 'pizzip';

const buf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const zip = new PizZip(buf);
let xml = zip.file('word/document.xml').asText();

function replaceLastWtInParagraphConcat(xml, concatFragment, placeholder) {
  let searchPos = 0;
  
  while (searchPos < xml.length) {
    let pStart = xml.indexOf('<w:p>', searchPos);
    const pStart2 = xml.indexOf('<w:p ', searchPos);
    
    if (pStart === -1 && pStart2 === -1) break;
    if (pStart === -1) pStart = pStart2;
    else if (pStart2 !== -1 && pStart2 < pStart) pStart = pStart2;
    
    const pEnd = xml.indexOf('</w:p>', pStart);
    if (pEnd === -1) break;
    const pEndFull = pEnd + 6;
    
    const pChunk = xml.substring(pStart, pEndFull);
    // Concatenate all w:t content (remove spaces to compare)
    const pText = pChunk.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    
    if (pText.includes(concatFragment.replace(/\s+/g, ''))) {
      // Find the last w:t
      const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let lastMatch = null;
      let m;
      while ((m = regex.exec(pChunk)) !== null) {
        lastMatch = m;
      }
      
      if (!lastMatch) { searchPos = pEndFull; continue; }
      
      const newWt = `<w:t xml:space="preserve">: ${placeholder}</w:t>`;
      const newChunk = pChunk.replace(lastMatch[0], newWt);
      xml = xml.substring(0, pStart) + newChunk + xml.substring(pEndFull);
      
      console.log(`  ✓ "${concatFragment}" → ": ${placeholder}"`);
      return xml;
    }
    
    searchPos = pEndFull;
  }
  
  console.warn(`  ⚠ Not found: "${concatFragment}"`);
  return xml;
}

xml = replaceLastWtInParagraphConcat(xml, 'TahunOperasi', '{tahunOperasi}');
xml = replaceLastWtInParagraphConcat(xml, 'TahunBuat', '{tahunBuat}');

// Save
zip.file('word/document.xml', xml);
const buffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

// Verify
const verify = new PizZip(fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx'));
const docXml = verify.file('word/document.xml').asText();
const fields = ['{namaPeralatan}','{merk}','{type}','{noSeri}','{harga}','{kodeAsset}',
  '{tahunOperasi}','{tahunBuat}','{penempatanPeralatan}','{tanggalKejadian}',
  '{jenisKerusakan}','{penyebabKerusakan}','{akibatKerusakan}','{usulDanSaran}',
  '{lampiranText}','{tanggalLokasi}','{managerNama}','{tlNama}','{tlJabatan}'];

console.log('\n=== Placeholder Verification ===');
let allOk = true;
fields.forEach(f => {
  const found = docXml.includes(f);
  console.log(`  ${found ? '✓' : '✗'} ${f}`);
  if (!found) allOk = false;
});

if (allOk) {
  console.log('\n✅ ALL PLACEHOLDERS FOUND — Template siap digunakan!');
} else {
  console.warn('\n⚠ Beberapa placeholder belum ada!');
}
console.log('   → File size:', buffer.length, 'bytes');
