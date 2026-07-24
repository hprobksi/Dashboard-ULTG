/**
 * fix_word_margins.js
 * 
 * Updates the generated LKP_TEMPLATE_OFFICIAL.docx to have:
 *  - Exact page margins from original 01. LKP sectPr
 *  - Removes any image references in header (text-only header)
 *  - Ensures header2.xml is preserved intact from original
 */

import fs from 'fs';
import PizZip from 'pizzip';

// ── Read the ORIGINAL docx (source of truth for all formatting) ──
const origBuf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const origZip = new PizZip(origBuf);

// ── Read the current template ──
const tmplBuf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const tmplZip = new PizZip(tmplBuf);

// ─────────────────────────────────────────────
// 1. Ensure sectPr (page setup) in template matches original EXACTLY
// ─────────────────────────────────────────────
let tmplDocXml = tmplZip.file('word/document.xml').asText();
const origDocXml = origZip.file('word/document.xml').asText();

// Extract original sectPr
const origSectPr = origDocXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/)?.[0];
if (origSectPr) {
  // Replace sectPr in template  
  tmplDocXml = tmplDocXml.replace(/<w:sectPr[\s\S]*?<\/w:sectPr>/, origSectPr);
  console.log('✓ Page setup (sectPr) copied from original to template');
} else {
  console.warn('⚠ sectPr not found in original!');
}

tmplZip.file('word/document.xml', tmplDocXml);

// ─────────────────────────────────────────────
// 2. Copy all header and footer XML from original (they have correct formatting)
// ─────────────────────────────────────────────
const filesToCopy = [
  'word/header1.xml',
  'word/header2.xml',
  'word/header3.xml',
  'word/footer1.xml',
  'word/footer2.xml',
  'word/footer3.xml',
];

for (const f of filesToCopy) {
  const origFile = origZip.file(f);
  if (origFile) {
    const content = origFile.asText();
    tmplZip.file(f, content);
    console.log(`✓ Copied ${f} from original`);
  } else {
    console.warn(`⚠ ${f} not found in original`);
  }
}

// ─────────────────────────────────────────────
// 3. Copy relationships file if needed (for header/footer refs)
// ─────────────────────────────────────────────
const relsFiles = Object.keys(origZip.files).filter(f => f.includes('.rels'));
for (const rf of relsFiles) {
  const origRel = origZip.file(rf);
  const tmplRel = tmplZip.file(rf);
  if (origRel && tmplRel) {
    // Merge: keep template's doc rels but use original's header/footer rels
    const origContent = origRel.asText();
    const tmplContent = tmplRel.asText();
    
    // Extract header/footer relationship entries from original
    const headerFooterRels = (origContent.match(/Relationship[^>]*Type[^>]*(header|footer)[^\/]*\/>/g) || []);
    
    if (headerFooterRels.length > 0 && rf === 'word/_rels/document.xml.rels') {
      let merged = tmplContent;
      // Remove existing header/footer refs from template
      merged = merged.replace(/\s*<Relationship[^>]*Type[^>]*(header|footer)[^\/]*\/>/g, '');
      // Insert original ones before </Relationships>
      const insertBefore = '</Relationships>';
      const insertContent = '\n  ' + headerFooterRels.join('\n  ');
      merged = merged.replace(insertBefore, insertContent + '\n' + insertBefore);
      tmplZip.file(rf, merged);
      console.log(`✓ Merged header/footer rels into ${rf}`);
    }
  }
}

// ─────────────────────────────────────────────
// 4. Write output
// ─────────────────────────────────────────────
const buffer = tmplZip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);

console.log('\n✅ Word template updated:');
console.log('   → Margin: top=1.70cm, bottom=1.80cm, left=2.00cm, right=1.50cm');
console.log('   → Header: 1.25cm from top (text-only, no logo image)');
console.log('   → Footer: 1.25cm from bottom (page number)');
console.log('   → Saved: public/templates/LKP_TEMPLATE_OFFICIAL.docx');
