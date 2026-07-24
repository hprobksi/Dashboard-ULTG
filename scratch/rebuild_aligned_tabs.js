import fs from 'fs';
import PizZip from 'pizzip';

const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);
let xml = origZip.file('word/document.xml').asText();

const pMatches = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];
console.log(`Total paragraphs found: ${pMatches.length}`);

// Set tab stop at 4350 dxa (7.68 cm from left margin)
const TAB_POS = 4350;

// Data paragraphs configuration: [label, placeholder]
const dataFields = {
  1:  ['Nama Peralatan', '{namaPeralatan}'],
  2:  ['Merk', '{merk}'],
  3:  ['Type', '{type}'],
  4:  ['No Seri', '{noSeri}'],
  5:  ['Harga', '{harga}'],
  6:  ['Kode Asset', '{kodeAsset}'],
  7:  ['Tahun Operasi', '{tahunOperasi}'],
  8:  ['Tahun Buat', '{tahunBuat}'],
  9:  ['PENEMPATAN PERALATAN', '{penempatanPeralatan}'],
  10: ['TANGGAL KEJADIAN', '{tanggalKejadian}'],
  11: ['JENIS KERUSAKAN', '{jenisKerusakan}'],
  12: ['PENYEBAB KERUSAKAN', '{penyebabKerusakan}'],
  13: ['AKIBAT KERUSAKAN', '{akibatKerusakan}'],
  14: ['USUL DAN SARAN', '{usulDanSaran}'],
  15: ['LAMPIRAN', '{lampiranText}'],
};

// Signature/other paragraphs
const otherFields = {
  17: '{tanggalLokasi}',
  27: '{managerNama}',
  28: '{managerJabatan}',
  37: '{tlNama}',
  38: '{tlJabatan}'
};

pMatches.forEach((pMatch, pIdx) => {
  const origP = pMatch[0];
  
  if (dataFields[pIdx]) {
    const [label, placeholder] = dataFields[pIdx];
    
    // Extract pPr
    const pPrMatch = origP.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
    let pPrXml = pPrMatch ? pPrMatch[0] : '<w:pPr></w:pPr>';
    
    // Add tab stop into pPrXml
    const tabXml = `<w:tabs><w:tab w:val="left" w:pos="${TAB_POS}"/></w:tabs>`;
    if (pPrXml.includes('<w:tabs>')) {
      pPrXml = pPrXml.replace(/<w:tabs>[\s\S]*?<\/w:tabs>/, tabXml);
    } else {
      pPrXml = pPrXml.replace('<w:pPr>', `<w:pPr>${tabXml}`);
    }
    
    // Extract rPr from first run if available to preserve font styling
    const rPrMatch = origP.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
    const rPrXml = rPrMatch ? rPrMatch[0] : '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>';
    
    // Construct clean paragraph XML
    const newP = `<w:p>${pPrXml}<w:r>${rPrXml}<w:t xml:space="preserve">${label}</w:t></w:r><w:r>${rPrXml}<w:tab/><w:t xml:space="preserve">: ${placeholder}</w:t></w:r></w:p>`;
    xml = xml.replace(origP, newP);
  } else if (otherFields[pIdx]) {
    const placeholder = otherFields[pIdx];
    const pPrMatch = origP.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
    const pPrXml = pPrMatch ? pPrMatch[0] : '<w:pPr></w:pPr>';
    const rPrMatch = origP.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
    const rPrXml = rPrMatch ? rPrMatch[0] : '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>';
    
    const newP = `<w:p>${pPrXml}<w:r>${rPrXml}<w:t xml:space="preserve">${placeholder}</w:t></w:r></w:p>`;
    xml = xml.replace(origP, newP);
  }
});

// Set all font sizes to 10pt (w:sz=20)
xml = xml.replace(/<w:sz w:val="22"\/>/g, '<w:sz w:val="20"/>');
xml = xml.replace(/<w:szCs w:val="22"\/>/g, '<w:szCs w:val="20"/>');

origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

console.log('=== VERIFYING CLEAN REBUILT PARAGRAPHS ===\n');
const verifyZip = new PizZip(buffer);
const vXml = verifyZip.file('word/document.xml').asText();
const vParagraphs = vXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

vParagraphs.forEach((p, idx) => {
  const wtText = [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(m => m[1]).join('');
  if (wtText.trim()) {
    console.log(`P${idx}: "${wtText}"`);
  }
});
