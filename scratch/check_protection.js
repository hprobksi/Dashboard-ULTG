import fs from 'fs';
import PizZip from 'pizzip';

const buf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const zip = new PizZip(buf);

// Check settings.xml for document protection
const settingsXml = zip.file('word/settings.xml')?.asText() || '';
console.log('=== settings.xml ===');
console.log(settingsXml.substring(0, 3000));

// Check if there's document protection
if (settingsXml.includes('documentProtection')) {
  console.log('\n⚠ DOCUMENT PROTECTION FOUND!');
} else {
  console.log('\n✓ No documentProtection tag found');
}

// Check content types
const contentTypes = zip.file('[Content_Types].xml')?.asText() || '';
console.log('\n=== Content_Types.xml ===');
console.log(contentTypes.substring(0, 1000));
