import fs from 'fs';
import PizZip from 'pizzip';

try {
  const content = fs.readFileSync('02. LKP KAMERA THERMOVISI.docx');
  const zip = new PizZip(content);
  const xml = zip.file('word/document.xml').asText();
  
  const paragraphs = xml.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [];
  let output = [];
  paragraphs.forEach((p, idx) => {
    const text = p.replace(/<[^>]+>/g, '').trim();
    if (text) {
      output.push(`[P${idx + 1}] ${text}`);
    }
  });

  fs.writeFileSync('scratch/docx_thermo.txt', output.join('\n'));
  console.log(`Extracted thermovisi docx (${paragraphs.length} paragraphs)`);
} catch(e) {
  console.error(e);
}
