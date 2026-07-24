import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);

let docXml = zip.file('word/document.xml').asText();

// Update docXml text to include 1. DATA PERALATAN, a. b. c... and 2. 3. 4. 5. 6. 7. 8.
docXml = docXml
  .replace(/DATA PERALATAN/, '1. DATA PERALATAN')
  .replace(/(Nama Peralatan\s*:\s*)([^<]*)/, 'a. Nama Peralatan: {namaPeralatan}')
  .replace(/(Merk\s*:\s*)([^<]*)/, 'b. Merk: {merk}')
  .replace(/(Type\s*:\s*)([^<]*)/, 'c. Type: {type}')
  .replace(/(No Seri\s*:\s*)([^<]*)/, 'd. No Seri: {noSeri}')
  .replace(/(Harga\s*:\s*)([^<]*)/, 'e. Harga: {harga}')
  .replace(/(Kode Asset\s*:\s*)([^<]*)/, 'f. Kode Asset: {kodeAsset}')
  .replace(/(Tahun Operasi\s*:\s*)([^<]*)/, 'g. Tahun Operasi: {tahunOperasi}')
  .replace(/(Tahun Buat\s*:\s*)([^<]*)/, 'h. Tahun Buat: {tahunBuat}')
  .replace(/(PENEMPATAN PERALATAN\s*:\s*)([^<]*)/, '2. PENEMPATAN PERALATAN: {penempatanPeralatan}')
  .replace(/(TANGGAL KEJADIAN\s*:\s*)([^<]*)/, '3. TANGGAL KEJADIAN: {tanggalKejadian}')
  .replace(/(JENIS KERUSAKAN\s*:\s*)([^<]*)/, '4. JENIS KERUSAKAN: {jenisKerusakan}')
  .replace(/(PENYEBAB KERUSAKAN\s*:\s*)([^<]*)/, '5. PENYEBAB KERUSAKAN: {penyebabKerusakan}')
  .replace(/(AKIBAT KERUSAKAN\s*:\s*)([^<]*)/, '6. AKIBAT KERUSAKAN: {akibatKerusakan}')
  .replace(/(USUL DAN SARAN\s*:\s*)([^<]*)/, '7. USUL DAN SARAN: {usulDanSaran}')
  .replace(/(LAMPIRAN\s*:\s*)([^<]*)/, '8. LAMPIRAN: {lampiranText}')
  .replace(/Bekasi,\s*8\s*Juli\s*2026/, '{tanggalLokasi}')
  .replace(/TRIAWAN AZHARY P\. N\./, '{managerNama}')
  .replace(/MANAGER ULTG BEKASI/, '{managerJabatan}')
  .replace(/FAJAR KURNIAWAN/, '{tlNama}')
  .replace(/TL JARGI CIKARANG/, '{tlJabatan}')
  .replace(/44767564135/, '{tlNip}');

zip.file('word/document.xml', docXml);

const buffer = zip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);
console.log('Successfully updated public/templates/LKP_TEMPLATE_OFFICIAL.docx with 1. a. b. c... 2. 3. 4... numbering');
