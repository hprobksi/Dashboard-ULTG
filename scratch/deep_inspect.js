import fs from 'fs';
import PizZip from 'pizzip';

const buf = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(buf);

// ── 1. Dump header2.xml (the main header with the table) ──
const h2 = zip.file('word/header2.xml').asText();
fs.writeFileSync('scratch/dump_header2.xml', h2);
console.log('✓ Saved scratch/dump_header2.xml');

// ── 2. Dump footer1.xml ──
const f1 = zip.file('word/footer1.xml').asText();
fs.writeFileSync('scratch/dump_footer1.xml', f1);
console.log('✓ Saved scratch/dump_footer1.xml');

// ── 3. Dump full document.xml ──
const doc = zip.file('word/document.xml').asText();
fs.writeFileSync('scratch/dump_document.xml', doc);
console.log('✓ Saved scratch/dump_document.xml');

// ── 4. Dump styles.xml ──
const styles = zip.file('word/styles.xml').asText();
fs.writeFileSync('scratch/dump_styles.xml', styles);
console.log('✓ Saved scratch/dump_styles.xml');

// ── 5. Dump numbering.xml ──
const numbering = zip.file('word/numbering.xml').asText();
fs.writeFileSync('scratch/dump_numbering.xml', numbering);
console.log('✓ Saved scratch/dump_numbering.xml');

// ── 6. Summary: extract key measurements ──
console.log('\n=== PAGE SETUP ===');
const sectPr = doc.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/)?.[0] || '';
const pgSz  = sectPr.match(/<w:pgSz[^\/]*\/>/)?.[0];
const pgMar = sectPr.match(/<w:pgMar[^\/]*\/>/)?.[0];
const pgBorders = sectPr.match(/<w:pgBorders[\s\S]*?<\/w:pgBorders>/)?.[0];
console.log('pgSz  :', pgSz);
console.log('pgMar :', pgMar);
console.log('pgBorders:', pgBorders);

// ── 7. Extract all unique font sizes in document ──
const fontSizes = [...new Set([...doc.matchAll(/<w:sz w:val="(\d+)"/g)].map(m => m[1]))].sort((a,b)=>+a-+b);
console.log('\n=== FONT SIZES (w:sz val, half-points) ===');
fontSizes.forEach(s => console.log(`  ${s} half-pt = ${+s/2} pt`));

// ── 8. Extract header2 table structure ──
console.log('\n=== HEADER2 TABLE STRUCTURE ===');
const h2Tables = h2.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) || [];
h2Tables.forEach((tbl, ti) => {
  const rows = tbl.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g) || [];
  rows.forEach((row, ri) => {
    const cells = row.match(/<w:tc>[\s\S]*?<\/w:tc>/g) || [];
    cells.forEach((cell, ci) => {
      const text = cell.replace(/<[^>]+>/g, '').trim();
      const w = cell.match(/w:w="(\d+)"/)?.[1];
      const span = cell.match(/w:gridSpan w:val="(\d+)"/)?.[1];
      const rowSpan = cell.match(/w:vMerge/)?.[0];
      console.log(`  T${ti} R${ri} C${ci}: w=${w||'?'} span=${span||1} rowspan=${rowSpan?'yes':'no'} text="${text.substring(0,60)}"`);
    });
  });
});

// ── 9. Extract border style of header table ──
console.log('\n=== HEADER TABLE BORDERS ===');
const tblBorders = h2.match(/<w:tblBorders>[\s\S]*?<\/w:tblBorders>/)?.[0] || 'not found';
console.log(tblBorders);

// ── 10. List all images in document ──
console.log('\n=== IMAGES IN DOCUMENT ===');
const imgRels = (zip.file('word/_rels/document.xml.rels')?.asText() || '');
const imageRels = [...imgRels.matchAll(/Relationship[^>]*Type[^>]*image[^>]*Target="([^"]+)"/g)];
imageRels.forEach(m => console.log('  Image:', m[1]));
const headerRels = (zip.file('word/_rels/header2.xml.rels')?.asText() || '');
const hImgRels = [...headerRels.matchAll(/Relationship[^>]*Type[^>]*image[^>]*Target="([^"]+)"/g)];
hImgRels.forEach(m => console.log('  Header2 Image:', m[1]));
