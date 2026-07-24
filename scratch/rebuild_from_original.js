/**
 * rebuild_from_original.js
 * Reads the ORIGINAL 01. LKP ( FORMAT DASAR ).docx,
 * replaces only VALUE text nodes with {placeholder} tags.
 * Keeps ALL paragraph formatting (numPr, indentation, spacing) IDENTICAL.
 */

import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

// ── Paragraph-level targeted replacement ──
// Each paragraph follows pattern:
// "LABEL <tab> : <tab> VALUE"
// Runs are: [numLabel][tab][label][tab][:][tab][value]
// We want to replace the VALUE run text only.

// Strategy: find each paragraph by its label text, then replace the last <w:t> value.

function replaceParagraphLastValue(xml, labelText, placeholder) {
  // Escape for regex
  const esc = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Find the whole <w:p>...</w:p> containing this label
  const pStart = xml.indexOf(`>${labelText}<`);
  if (pStart === -1) {
    console.warn(`  ⚠ Label not found: "${labelText}"`);
    return xml;
  }
  
  // Walk backwards to find <w:p > or <w:p>
  let pOpen = pStart;
  while (pOpen > 0 && !(xml[pOpen] === '<' && xml[pOpen+1] === 'w' && xml[pOpen+2] === ':' && xml[pOpen+3] === 'p' && (xml[pOpen+4] === '>' || xml[pOpen+4] === ' '))) {
    pOpen--;
  }
  
  // Walk forward to find </w:p>
  const pClose = xml.indexOf('</w:p>', pStart) + 6;
  
  const pChunk = xml.substring(pOpen, pClose);
  
  // In this paragraph, find ALL <w:t>...</w:t> occurrences
  const wtMatches = [...pChunk.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)];
  if (wtMatches.length === 0) {
    console.warn(`  ⚠ No w:t found in paragraph: "${labelText}"`);
    return xml;
  }
  
  // The last w:t is the VALUE
  const lastWt = wtMatches[wtMatches.length - 1];
  const oldText = lastWt[0]; // full match e.g. <w:t xml:space="preserve">8 Juli 2026</w:t>
  const newText = oldText.replace(lastWt[1], placeholder); // replace inner text
  
  if (oldText === newText) {
    // The label IS the last w:t (single-run paragraph - value is empty or same)
    // Try second-to-last
    if (wtMatches.length >= 2) {
      const secondLast = wtMatches[wtMatches.length - 2];
      const colon = secondLast[1].includes(':');
      // If second last contains colon, last is truly the value (even if empty)
      const newChunk = pChunk.replace(oldText, `<w:t xml:space="preserve">${placeholder}</w:t>`);
      return xml.substring(0, pOpen) + newChunk + xml.substring(pClose);
    }
  }
  
  const newChunk = pChunk.replace(oldText, newText);
  return xml.substring(0, pOpen) + newChunk + xml.substring(pClose);
}

// ── Apply all replacements ──

const replacements = [
  // DATA PERALATAN sub-items
  ['Nama Peralatan', '{namaPeralatan}'],
  ['Merk', '{merk}'],
  ['Type', '{type}'],
  ['No Seri', '{noSeri}'],
  ['Harga', '{harga}'],
  ['Kode Asset', '{kodeAsset}'],
  ['Tahun Operasi', '{tahunOperasi}'],
  ['Tahun Buat', '{tahunBuat}'],
  // Main numbered items
  ['PENEMPATAN PERALATAN', '{penempatanPeralatan}'],
  ['TANGGAL KEJADIAN', '{tanggalKejadian}'],
  ['JENIS KERUSAKAN', '{jenisKerusakan}'],
  ['PENYEBAB KERUSAKAN', '{penyebabKerusakan}'],
  ['AKIBAT KERUSAKAN', '{akibatKerusakan}'],
  ['USUL DAN SARAN', '{usulDanSaran}'],
  ['LAMPIRAN', '{lampiranText}'],
];

for (const [label, placeholder] of replacements) {
  xml = replaceParagraphLastValue(xml, label, placeholder);
  console.log(`  ✓ "${label}" → ${placeholder}`);
}

// ── Signature area replacements (simple text swap) ──

// Date line "Bekasi, 8 Juli 2026"
xml = xml.replace(
  /(<w:t[^>]*>)([^<]*Bekasi,\s*[^<]+?)(<\/w:t>)/g,
  '$1{tanggalLokasi}$3'
);
console.log('  ✓ Bekasi date → {tanggalLokasi}');

// Manager name
xml = xml.replace(
  /(<w:t[^>]*>)([^<]*TRIAWAN AZHARY[^<]*)(<\/w:t>)/g,
  '$1{managerNama}$3'
);
console.log('  ✓ Manager name → {managerNama}');

// TL name
xml = xml.replace(
  /(<w:t[^>]*>)([^<]*FAJAR KURNIAWAN[^<]*)(<\/w:t>)/g,
  '$1{tlNama}$3'
);
console.log('  ✓ TL name → {tlNama}');

// NIP of TL
xml = xml.replace(
  /(<w:t[^>]*>)(NIP[^<]*44767564135[^<]*)(<\/w:t>)/g,
  '$1{tlNip}$3'
);
xml = xml.replace(
  /(<w:t[^>]*>)(44767564135[^<]*)(<\/w:t>)/g,
  '$1{tlNip}$3'
);
console.log('  ✓ TL NIP → {tlNip}');

// Write output
origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);
console.log('\n✅ Template rebuilt from original 01. LKP ( FORMAT DASAR ).docx');
console.log('   → Saved to public/templates/LKP_TEMPLATE_OFFICIAL.docx');
console.log('   → All paragraph formatting PRESERVED (numPr, indentation, spacing)');
