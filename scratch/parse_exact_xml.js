import fs from 'fs';

const raw = fs.readFileSync('scratch/xml_dump.txt', 'utf8');

// Parse paragraphs and tables
const lines = raw.split('\n');

console.log(`Read ${lines.length} lines of raw XML dump`);

// Let's print all <w:p> elements cleanly
const pRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g;
let match;
let count = 0;
while ((match = pRegex.exec(raw)) !== null) {
  count++;
  const inner = match[1];
  const text = inner.replace(/<w:tab\/>/g, '\t').replace(/<[^>]+>/g, '').trim();
  if (text) {
    console.log(`[Paragraph ${count}]: "${text}"`);
  }
}
