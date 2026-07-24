import fs from 'fs';
import PizZip from 'pizzip';

function inspectDoc(filename) {
  console.log(`\n======================================================`);
  console.log(`INSPECTING: ${filename}`);
  console.log(`======================================================`);
  
  const content = fs.readFileSync(filename);
  const zip = new PizZip(content);

  // Inspect all files in zip
  const files = ['word/header2.xml', 'word/document.xml'];
  files.forEach(fPath => {
    const f = zip.file(fPath);
    if (!f) return;
    const xml = f.asText();
    console.log(`\n--- ${fPath} ---`);

    // Parse tables
    const tableMatches = xml.match(/<w:tbl[\s\S]*?<\/w:tbl>/g) || [];
    tableMatches.forEach((tblXml, tIdx) => {
      console.log(`\n[Table ${tIdx + 1}]`);
      const rowMatches = tblXml.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
      rowMatches.forEach((rowXml, rIdx) => {
        const cellMatches = rowXml.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
        const cellTexts = cellMatches.map(tc => {
          return tc.replace(/<w:tab\/>/g, ' [TAB] ')
                    .replace(/<[^>]+>/g, '')
                    .trim();
        });
        console.log(`  Row ${rIdx + 1}: ${cellTexts.join('  ||  ')}`);
      });
    });

    // Parse paragraphs outside tables
    const docWithoutTables = xml.replace(/<w:tbl[\s\S]*?<\/w:tbl>/g, ' [TABLE_HERE] ');
    const pMatches = docWithoutTables.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
    console.log(`\n[Paragraphs]`);
    pMatches.forEach((pXml, pIdx) => {
      const pText = pXml.replace(/<w:tab\/>/g, ' [TAB] ')
                        .replace(/<[^>]+>/g, '')
                        .trim();
      if (pText) {
        console.log(`  P${pIdx + 1}: ${pText}`);
      }
    });
  });
}

inspectDoc('01. LKP ( FORMAT DASAR ).docx');
inspectDoc('02. LKP KAMERA THERMOVISI.docx');
