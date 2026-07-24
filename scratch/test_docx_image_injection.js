import fs from 'fs';
import PizZip from 'pizzip';

// Create a test 1x1 base64 png
const samplePngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const origBuf = fs.readFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx');
const zip = new PizZip(origBuf);

// Helper function to embed base64 image into Word zip
function embedImagesIntoZip(zip, base64Images) {
  let relsXml = zip.file('word/_rels/document.xml.rels').asText();
  let docXml = zip.file('word/document.xml').asText();

  base64Images.forEach((img, idx) => {
    if (!img || !img.includes('base64,')) return;
    const parts = img.split('base64,');
    const mimeMatch = img.match(/data:image\/([a-zA-Z]+);/);
    const ext = mimeMatch ? (mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1]) : 'png';
    const base64Data = parts[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const mediaPath = `word/media/lampiran_img_${idx + 1}.${ext}`;
    zip.file(mediaPath, buffer);

    const relId = `rIdLampiran${idx + 1}`;
    const relTag = `<Relationship Id="${relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/lampiran_img_${idx + 1}.${ext}"/>`;
    
    if (!relsXml.includes(relId)) {
      relsXml = relsXml.replace('</Relationships>', `${relTag}</Relationships>`);
    }

    const drawingXml = `
<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="240"/></w:pPr>
<w:r>
  <w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0">
      <wp:extent cx="4500000" cy="3375000"/>
      <wp:docPr id="${1000 + idx}" name="Foto Lampiran ${idx + 1}"/>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/main">
          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:nvPicPr>
              <pic:cNvPr id="${1000 + idx}" name="Foto Lampiran ${idx + 1}"/>
              <pic:cNvPicPr/>
            </pic:nvPicPr>
            <pic:blipFill>
              <a:blip r:embed="${relId}"/>
              <a:stretch><a:fillRect/></a:stretch>
            </pic:blipFill>
            <pic:spPr>
              <a:xfrm>
                <a:off x="0" y="0"/>
                <a:ext cx="4500000" cy="3375000"/>
              </a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing>
</w:r>
</w:p>`;

    // Insert drawings before </w:body>
    docXml = docXml.replace('</w:body>', `${drawingXml}</w:body>`);
  });

  zip.file('word/_rels/document.xml.rels', relsXml);
  zip.file('word/document.xml', docXml);
}

embedImagesIntoZip(zip, [samplePngBase64]);

const outBuf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('scratch/test_out_images.docx', outBuf);

console.log('✓ Successfully embedded image into docx zip!');
