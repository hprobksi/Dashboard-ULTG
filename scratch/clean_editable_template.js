/**
 * clean_editable_template.js
 * 
 * Makes the exported LKP Word file fully editable:
 * 1. Remove document protection (if any)
 * 2. Remove revision tracking marks (rsidR, rsidDel, w:del, w:ins)
 * 3. Remove content controls / SDT locks
 * 4. Ensure settings.xml has no protection
 * 5. Set document compatibility mode to allow editing
 */

import fs from 'fs';
import PizZip from 'pizzip';

const buf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const zip = new PizZip(buf);

// ── 1. Clean settings.xml — remove any protection, enable editing ──
let settingsXml = zip.file('word/settings.xml').asText();

// Remove documentProtection if present
settingsXml = settingsXml.replace(/<w:documentProtection[^\/]*\/>/g, '');
settingsXml = settingsXml.replace(/<w:documentProtection[\s\S]*?<\/w:documentProtection>/g, '');

// Remove write protection
settingsXml = settingsXml.replace(/<w:writeProtection[^\/]*\/>/g, '');
settingsXml = settingsXml.replace(/<w:writeProtection[\s\S]*?<\/w:writeProtection>/g, '');

// Remove tracking changes setting (so no auto track on open)
settingsXml = settingsXml.replace(/<w:trackChanges\/>/g, '');
settingsXml = settingsXml.replace(/<w:trackChanges\s[^\/]*\/>/g, '');

zip.file('word/settings.xml', settingsXml);
console.log('✓ settings.xml cleaned (no protection, no track changes)');

// ── 2. Clean document.xml — remove revision marks ──
let docXml = zip.file('word/document.xml').asText();

// Remove w:del runs (deleted text revisions)
docXml = docXml.replace(/<w:del[ >][\s\S]*?<\/w:del>/g, '');

// Remove w:ins wrappers (keep inner content)
docXml = docXml.replace(/<w:ins [^>]*>([\s\S]*?)<\/w:ins>/g, '$1');

// Remove revision IDs from attributes (rsidR, rsidDel, rsidRPr, etc.)
// These don't affect editing but clean up the file
docXml = docXml.replace(/ w:rsid[A-Za-z]*="[^"]*"/g, '');

// Remove content control locks (w:sdtPr with w:lock)
docXml = docXml.replace(/<w:lock[^\/]*\/>/g, '');
docXml = docXml.replace(/<w:lock[\s\S]*?<\/w:lock>/g, '');

zip.file('word/document.xml', docXml);
console.log('✓ document.xml cleaned (removed revision marks, content locks)');

// ── 3. Write final editable file ──
const buffer = zip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);
console.log('\n✅ File Word siap diedit oleh semua orang:');
console.log('   → Tidak ada document protection');
console.log('   → Tidak ada write protection');
console.log('   → Tidak ada track changes otomatis');
console.log('   → Tidak ada content control locks');
console.log('   → Saved: public/templates/LKP_TEMPLATE_OFFICIAL.docx');
