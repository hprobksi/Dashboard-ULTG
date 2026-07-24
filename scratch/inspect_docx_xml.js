import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

fs.writeFileSync('scratch/document_full.xml', xml);
console.log('Full document.xml saved to scratch/document_full.xml');

// Also list all files inside docx zip
console.log('Zip entries:');
Object.keys(zip.files).forEach(f => console.log(' - ' + f));
