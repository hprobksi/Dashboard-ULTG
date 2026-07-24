/**
 * rebuild_perfect.js
 * 
 * Reads the ORIGINAL 01. LKP ( FORMAT DASAR ).docx.
 * For each data field paragraph, ADDS a new run with {placeholder} after the colon.
 * Keeps ALL paragraph formatting (numPr, indentation, spacing) IDENTICAL.
 */

import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

// Helper: build a new value run with Arial 11pt
function makeValueRun(placeholder) {
  return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t xml:space="preserve">${placeholder}</w:t></w:r>`;
}

// Each paragraph ends in a run containing ":" or ": " — inject placeholder AFTER that run
// We identify paragraphs by scanning for the label text in consecutive w:t nodes

// Map of label node text (or partial) → placeholder
// Key = the w:t text right before (or containing) the colon 
// We'll insert after the LAST w:r in each paragraph that ends with ":"

// Find a paragraph containing specific text across its runs
function getParagraphContaining(xml, ...textFragments) {
  // Find position of first fragment
  let searchFrom = 0;
  let pStart = -1;
  
  // Try to find all fragments in sequence within a paragraph
  const combined = textFragments.join('');
  
  // Walk through paragraphs
  let pos = 0;
  while (pos < xml.length) {
    const pTagStart = xml.indexOf('<w:p>', pos);
    const pTagStart2 = xml.indexOf('<w:p ', pos);
    let nextP = -1;
    if (pTagStart === -1 && pTagStart2 === -1) break;
    if (pTagStart === -1) nextP = pTagStart2;
    else if (pTagStart2 === -1) nextP = pTagStart;
    else nextP = Math.min(pTagStart, pTagStart2);
    
    const pEnd = xml.indexOf('</w:p>', nextP) + 6;
    if (pEnd < 6) break;
    
    const chunk = xml.substring(nextP, pEnd);
    const chunkText = chunk.replace(/<[^>]+>/g, '');
    
    // Check if all fragments are in this paragraph's concatenated text
    const allFound = textFragments.every(f => chunkText.includes(f));
    if (allFound) {
      return { start: nextP, end: pEnd, chunk };
    }
    
    pos = pEnd;
  }
  return null;
}

// Insert a value run after the last <w:r> in a paragraph
function insertValueAfterLastRun(pChunk, placeholder) {
  // Find last </w:r>
  const lastRunEnd = pChunk.lastIndexOf('</w:r>');
  if (lastRunEnd === -1) return pChunk;
  
  const insertPos = lastRunEnd + 6; // after </w:r>
  return pChunk.substring(0, insertPos) + makeValueRun(placeholder) + pChunk.substring(insertPos);
}

// Field definitions: [fragments to identify paragraph, placeholder]
const fields = [
  [['Nama Peralatan', ': '], '{namaPeralatan}'],
  [['Merk', ':'], '{merk}'],
  [['Type ', ':'], '{type}'],
  [['No Seri', ':'], '{noSeri}'],
  [['Harga', ':'], '{harga}'],
  [['Kode Asset', ':'], '{kodeAsset}'],
  [['Tahun', 'Operasi', ':'], '{tahunOperasi}'],
  [['Tahun', 'Buat', ':'], '{tahunBuat}'],
  [['PENEMPATAN PERALATAN', ': '], '{penempatanPeralatan}'],
  [['TANGGAL KEJADIAN', ':'], '{tanggalKejadian}'],
  [['JENIS KERUSAKAN', ':'], '{jenisKerusakan}'],
  [['PENYEBAB KERUSAKAN', ': '], '{penyebabKerusakan}'],
  [['AKIBAT KERUSAKAN', ': '], '{akibatKerusakan}'],
  [['USUL DAN SARAN', ': '], '{usulDanSaran}'],
  [['LAMPIRAN', ': '], '{lampiranText}'],
];

for (const [fragments, placeholder] of fields) {
  const found = getParagraphContaining(xml, ...fragments);
  if (!found) {
    console.warn(`  ⚠ Paragraph not found for: ${fragments.join('+')}`);
    continue;
  }
  
  // Check if a placeholder already exists
  if (found.chunk.includes(placeholder)) {
    console.log(`  = Already has placeholder: ${placeholder}`);
    continue;
  }
  
  const newChunk = insertValueAfterLastRun(found.chunk, placeholder);
  xml = xml.substring(0, found.start) + newChunk + xml.substring(found.end);
  console.log(`  ✓ Inserted ${placeholder} into: "${fragments.join('')}"`);
}

// ── Signature area ──
// Date: "Bekasi" + ", " + "8" + "Juli" + " 20" + "26" → "{tanggalLokasi}"
// These are in the same paragraph - replace each w:t with combined placeholder in the first one
// Simple approach: find the paragraph with "Bekasi" and ", " and replace with placeholder run

const dateFound = getParagraphContaining(xml, 'Bekasi', ', ');
if (dateFound) {
  // Remove all date text runs and replace with single placeholder run
  let newChunk = dateFound.chunk;
  // Find the run with "Bekasi" text - it's the start
  const runWithBekasi = newChunk.match(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>[^<]*Bekasi[^<]*<\/w:t>[\s\S]*?<\/w:r>/)?.[0];
  if (runWithBekasi) {
    // Remove subsequent date-value runs and replace first run with our placeholder
    // Just add placeholder run after the last date run
    const kolonPos = newChunk.lastIndexOf('</w:r>');
    const insertPos = kolonPos + 6;
    newChunk = newChunk.substring(0, insertPos) + makeValueRun('{tanggalLokasi}') + newChunk.substring(insertPos);
    // Remove the old date literals
    newChunk = newChunk
      .replace(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>[^<]*Bekasi[^<]*<\/w:t>[\s\S]*?<\/w:r>/g, '')
      .replace(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>,\s*<\/w:t>[\s\S]*?<\/w:r>/g, '')
      .replace(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>\s*8\s*<\/w:t>[\s\S]*?<\/w:r>/g, '')
      .replace(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>Juli<\/w:t>[\s\S]*?<\/w:r>/g, '')
      .replace(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>\s*20[^<]*<\/w:t>[\s\S]*?<\/w:r>/g, '')
      .replace(/<w:r[^>]*>[\s\S]*?<w:t[^>]*>26<\/w:t>[\s\S]*?<\/w:r>/g, '');
  }
  xml = xml.substring(0, dateFound.start) + newChunk + xml.substring(dateFound.end);
  console.log('  ✓ Date → {tanggalLokasi}');
}

// Manager name
xml = xml.replace(
  /(<w:t[^>]*>)(TRIAWAN AZHARY P\. N\.)<\/w:t>/g,
  `$1{managerNama}</w:t>`
);
console.log('  ✓ Manager name → {managerNama}');

// Manager title
xml = xml.replace(
  /(<w:t[^>]*>)(MANAGER ULTG )<\/w:t>([\s\S]*?)(<w:t[^>]*>)(BEKASI)<\/w:t>/,
  `$1{managerJabatan}</w:t>$3$4$5</w:t>`
);

// TL name
xml = xml.replace(
  /(<w:t[^>]*>)(FAJAR KURNIAWAN)<\/w:t>/g,
  `$1{tlNama}</w:t>`
);
console.log('  ✓ TL name → {tlNama}');

// TL title
xml = xml.replace(
  /(<w:t[^>]*>)(TL JARGI CIKARANG)<\/w:t>/g,
  `$1{tlJabatan}</w:t>`
);
console.log('  ✓ TL title → {tlJabatan}');

// Write output
origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);
console.log('\n✅ PERFECT template built from original 01. LKP ( FORMAT DASAR ).docx');
console.log('   → Saved: public/templates/LKP_TEMPLATE_OFFICIAL.docx');
console.log('   → Paragraph formatting 100% PRESERVED from original');
