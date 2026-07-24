import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);

['header1.xml', 'header2.xml', 'header3.xml', 'footer1.xml', 'footer2.xml', 'footer3.xml'].forEach(file => {
  const f = zip.file(`word/${file}`);
  if (f) {
    const text = f.asText().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`=== ${file} ===\n${text}\n`);
  }
});
