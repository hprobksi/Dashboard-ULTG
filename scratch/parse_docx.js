import fs from 'fs';
import PizZip from 'pizzip';

try {
  const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
  const zip = new PizZip(content);
  const xml = zip.file('word/document.xml').asText();
  
  // Extract text line by line
  const text = xml.replace(/<w:tr>/g, '\n---ROW---\n')
                 .replace(/<w:tc>/g, '\t')
                 .replace(/<[^>]+>/g, '')
                 .split('\n')
                 .map(line => line.trim())
                 .filter(line => line.length > 0)
                 .join('\n');
  
  fs.writeFileSync('scratch/docx_content.txt', text);
  console.log('Successfully extracted docx content to scratch/docx_content.txt');
} catch (err) {
  console.error('Error reading docx:', err);
}
