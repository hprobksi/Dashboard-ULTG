/**
 * rebuild_safe.js
 * 
 * SAFE template builder: hanya replace TEXT CONTENT di w:t nodes.
 * TIDAK menyisipkan node/run baru — tidak merusak struktur XML.
 * 
 * Strategi: tiap label diikuti w:t berisi ": " atau ":"
 * Kita ganti isi w:t colon tersebut menjadi ": {placeholder}"
 */

import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

// Validate XML is readable
console.log(`Original XML length: ${xml.length} chars`);

/**
 * For each paragraph identified by its label text,
 * find the LAST <w:t>...</w:t> in that paragraph and replace its content.
 * This is safe because we never add/remove XML nodes.
 */
function replaceLastWtInParagraph(xml, labelFragment, newContent) {
  // Find the paragraph containing this label
  // Walk through the XML character by character to find paragraph boundaries
  let searchPos = 0;
  
  while (searchPos < xml.length) {
    // Find next paragraph start
    let pStart = xml.indexOf('<w:p>', searchPos);
    const pStart2 = xml.indexOf('<w:p ', searchPos);
    
    if (pStart === -1 && pStart2 === -1) break;
    if (pStart === -1) pStart = pStart2;
    else if (pStart2 !== -1 && pStart2 < pStart) pStart = pStart2;
    
    // Find paragraph end
    const pEnd = xml.indexOf('</w:p>', pStart);
    if (pEnd === -1) break;
    const pEndFull = pEnd + 6;
    
    const pChunk = xml.substring(pStart, pEndFull);
    const pText = pChunk.replace(/<[^>]+>/g, '');
    
    // Check if this paragraph contains our label
    if (pText.includes(labelFragment)) {
      // Find all w:t occurrences
      const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let match;
      let lastMatch = null;
      let tempXml = pChunk;
      
      // Reset regex
      let m;
      const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      while ((m = regex.exec(pChunk)) !== null) {
        lastMatch = m;
      }
      
      if (!lastMatch) {
        searchPos = pEndFull;
        continue;
      }
      
      // The last w:t is either ": " or ":" — replace with ": {placeholder}"
      const lastWtFull = lastMatch[0];
      const lastWtContent = lastMatch[1];
      
      // Build replacement — preserve xml:space="preserve" if present
      const hasPreserve = lastWtFull.includes('xml:space="preserve"');
      let newWt;
      if (hasPreserve) {
        newWt = `<w:t xml:space="preserve">: ${newContent}</w:t>`;
      } else {
        newWt = `<w:t xml:space="preserve">: ${newContent}</w:t>`;
      }
      
      // Replace only the LAST occurrence of this specific w:t in this paragraph
      const newChunk = pChunk.replace(lastWtFull, newWt);
      xml = xml.substring(0, pStart) + newChunk + xml.substring(pEndFull);
      
      console.log(`  ✓ "${labelFragment}" → last w:t "${lastWtContent}" → ": ${newContent}"`);
      return xml;
    }
    
    searchPos = pEndFull;
  }
  
  console.warn(`  ⚠ Paragraph not found for label: "${labelFragment}"`);
  return xml;
}

// ── Apply all field replacements ──

// DATA PERALATAN sub-items (identified by their label text)
xml = replaceLastWtInParagraph(xml, 'Nama Peralatan', '{namaPeralatan}');
xml = replaceLastWtInParagraph(xml, 'Merk', '{merk}');
xml = replaceLastWtInParagraph(xml, 'Type ', '{type}');
xml = replaceLastWtInParagraph(xml, 'No Seri', '{noSeri}');
xml = replaceLastWtInParagraph(xml, 'Harga', '{harga}');
xml = replaceLastWtInParagraph(xml, 'Kode Asset', '{kodeAsset}');
// "Tahun Operasi" and "Tahun Buat" are split across runs — identify by combined text
xml = replaceLastWtInParagraph(xml, 'TahunOperasi', '{tahunOperasi}');
xml = replaceLastWtInParagraph(xml, 'TahunBuat', '{tahunBuat}');

// Main numbered fields
xml = replaceLastWtInParagraph(xml, 'PENEMPATAN PERALATAN', '{penempatanPeralatan}');
xml = replaceLastWtInParagraph(xml, 'TANGGAL KEJADIAN', '{tanggalKejadian}');
xml = replaceLastWtInParagraph(xml, 'JENIS KERUSAKAN', '{jenisKerusakan}');
xml = replaceLastWtInParagraph(xml, 'PENYEBAB KERUSAKAN', '{penyebabKerusakan}');
xml = replaceLastWtInParagraph(xml, 'AKIBAT KERUSAKAN', '{akibatKerusakan}');
xml = replaceLastWtInParagraph(xml, 'USUL DAN SARAN', '{usulDanSaran}');
xml = replaceLastWtInParagraph(xml, 'LAMPIRAN', '{lampiranText}');

// ── Signature area: simple direct text replacement ──
// Date: Bekasi + separate runs with date parts
// Replace the "8" run (day number) with {tanggalLokasi} and remove other date runs
// Safer: just replace the known text in the paragraph containing "Bekasi"
xml = replaceLastWtInParagraph(xml, 'Bekasi', '{tanggalLokasi}');

// Names: simple w:t content replacement
xml = xml.replace(
  /(<w:t[^>]*>)(TRIAWAN AZHARY P\. N\.)(<\/w:t>)/g,
  '$1{managerNama}$3'
);
console.log('  ✓ Manager name → {managerNama}');

xml = xml.replace(
  /(<w:t[^>]*>)(FAJAR KURNIAWAN)(<\/w:t>)/g,
  '$1{tlNama}$3'
);
console.log('  ✓ TL name → {tlNama}');

xml = xml.replace(
  /(<w:t[^>]*>)(TL JARGI CIKARANG)(<\/w:t>)/g,
  '$1{tlJabatan}$3'
);
console.log('  ✓ TL jabatan → {tlJabatan}');

// ── Write output ──
origZip.file('word/document.xml', xml);

// IMPORTANT: use the original zip, only document.xml is modified
// This preserves all other files (rels, numbering, styles, media) intact
const buffer = origZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

// Verify the output is valid zip
try {
  const verify = new PizZip(fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx'));
  const docXml = verify.file('word/document.xml').asText();
  if (docXml.includes('{namaPeralatan}')) {
    console.log('\n✅ Template valid dan berisi placeholder!');
  } else {
    console.warn('\n⚠ Template tidak mengandung placeholder!');
  }
  console.log('   → Saved: public/templates/LKP_TEMPLATE_OFFICIAL.docx');
  console.log('   → Size:', buffer.length, 'bytes');
} catch(e) {
  console.error('\n❌ Output tidak valid:', e.message);
}
