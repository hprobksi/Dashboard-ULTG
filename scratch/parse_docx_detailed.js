import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

// Regex match all text elements with tags
const paragraphs = xml.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [];

console.log(`Found ${paragraphs.length} paragraphs`);

let output = [];
paragraphs.forEach((p, idx) => {
  const text = p.replace(/<[^>]+>/g, '').trim();
  if (text) {
    output.push(`[P${idx + 1}] ${text}`);
  }
});

fs.writeFileSync('scratch/docx_detailed.txt', output.join('\n'));
console.log('Saved to scratch/docx_detailed.txt');
