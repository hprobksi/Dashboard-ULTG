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

// Remove P40 (old LAMPIRAN text under signature)
const p40 = pMatches[40] ? pMatches[40][0] : '';
if (p40) {
  xml = xml.replace(p40, '');
}

// Append Page Break + Standalone Page 2 with "LAMPIRAN" Centered at Top
const standaloneLampiranPageXml = `
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="240"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t xml:space="preserve">LAMPIRAN</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="240"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t xml:space="preserve">{lampiranText}</w:t></w:r></w:p>
`;

// Insert standalone page XML right before </w:body>
xml = xml.replace('</w:body>', `${standaloneLampiranPageXml}</w:body>`);

// Set all font sizes to 10pt (w:sz=20)
xml = xml.replace(/<w:sz w:val="22"\/>/g, '<w:sz w:val="20"/>');
xml = xml.replace(/<w:szCs w:val="22"\/>/g, '<w:szCs w:val="20"/>');

origZip.file('word/document.xml', xml);
const buffer = origZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

console.log('✅ Standalone Page 2 for LAMPIRAN with centered top title created!');
