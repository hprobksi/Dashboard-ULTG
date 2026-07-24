import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

// Extract all <w:p> paragraphs
const pMatches = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];

console.log(`Total paragraphs found: ${pMatches.length}`);

// Helper to replace text inside specific run of a paragraph
function modifyParagraph(pXml, replacements) {
  const runs = [...pXml.matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)];
  let modifiedP = pXml;
  
  for (const [rIdx, newContent] of replacements) {
    if (rIdx < runs.length) {
      const origRun = runs[rIdx][0];
      let newRun;
      if (newContent === '') {
        // Empty out text in this run completely
        newRun = origRun.replace(/(<w:t[^>]*>)[^<]*(<\/w:t>)/g, '');
      } else {
        // Replace text in this run, preserving w:t attributes like xml:space="preserve"
        if (origRun.includes('<w:t')) {
          newRun = origRun.replace(/(<w:t[^>]*>)[^<]*(<\/w:t>)/g, `$1${newContent}$2`);
        } else {
          newRun = origRun.replace('</w:r>', `<w:t xml:space="preserve">${newContent}</w:t></w:r>`);
        }
      }
      modifiedP = modifiedP.replace(origRun, newRun);
    }
  }
  return modifiedP;
}

// Map paragraph indices to their exact run modifications based on inspect_exact_runs.js output
const pModifications = {
  1:  [[3, ': {namaPeralatan}']],
  2:  [[5, ' {merk}']],
  3:  [[5, ' {type}']],
  4:  [[5, ' {noSeri}']],
  5:  [[5, ' {harga}']],
  6:  [[4, ' {kodeAsset}']],
  7:  [[6, ' {tahunOperasi}']],
  8:  [[6, ' {tahunBuat}']],
  9:  [[1, ': {penempatanPeralatan}']],
  10: [[3, ' {tanggalKejadian}']],
  11: [[4, ' {jenisKerusakan}']],
  12: [[2, ': {penyebabKerusakan}']],
  13: [[2, ': {akibatKerusakan}']],
  14: [[3, ': {usulDanSaran}']],
  15: [[4, ': {lampiranText}'], [12, '']],
  17: [[0, '{tanggalLokasi}'], [1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, '']],
  27: [[0, '{managerNama}']],
  28: [[0, '{managerJabatan}'], [1, '']],
  37: [[0, '{tlNama}']],
  38: [[0, '{tlJabatan}']]
};

for (const [pIdxStr, mods] of Object.entries(pModifications)) {
  const pIdx = parseInt(pIdxStr, 10);
  if (pIdx < pMatches.length) {
    const origP = pMatches[pIdx][0];
    const modifiedP = modifyParagraph(origP, mods);
    xml = xml.replace(origP, modifiedP);
  }
}

origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

console.log('=== VERIFYING PROCESSED PURE TEXT PARAGRAPHS ===\n');
const verifyZip = new PizZip(buffer);
const vXml = verifyZip.file('word/document.xml').asText();
const vParagraphs = vXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

vParagraphs.forEach((p, idx) => {
  const wtText = [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(m => m[1]).join('');
  if (wtText.trim()) {
    console.log(`P${idx}: "${wtText}"`);
  }
});
