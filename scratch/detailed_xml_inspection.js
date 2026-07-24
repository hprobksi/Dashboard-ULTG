import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);

console.log("=== DOCUMENT.XML UNTRUNCATED TEXT & TAGS ===");
const docXml = zip.file('word/document.xml').asText();
console.log(docXml);

console.log("\n=== HEADER2.XML UNTRUNCATED TEXT & TAGS ===");
const h2Xml = zip.file('word/header2.xml').asText();
console.log(h2Xml);
