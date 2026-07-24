import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

try {
  const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({
    namaPeralatan: 'TEST PERALATAN',
    merk: 'SIEMENS'
  });

  const buf = doc.getZip().generate({ type: 'nodebuffer' });
  fs.writeFileSync('scratch/test_output.docx', buf);
  console.log('Docxtemplater test successful! Generated scratch/test_output.docx');
} catch(err) {
  console.error('Docxtemplater test error:', err);
}
