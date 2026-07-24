import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);

let docXml = zip.file('word/document.xml').asText();

// Inject Docxtemplater tags cleanly into paragraph texts
// Replace values after colons or labels
docXml = docXml
  .replace(/(Nama Peralatan\s*:\s*)([^<]*)/, '$1{namaPeralatan}')
  .replace(/(Merk\s*:\s*)([^<]*)/, '$1{merk}')
  .replace(/(Type\s*:\s*)([^<]*)/, '$1{type}')
  .replace(/(No Seri\s*:\s*)([^<]*)/, '$1{noSeri}')
  .replace(/(Harga\s*:\s*)([^<]*)/, '$1{harga}')
  .replace(/(Kode Asset\s*:\s*)([^<]*)/, '$1{kodeAsset}')
  .replace(/(Tahun Operasi\s*:\s*)([^<]*)/, '$1{tahunOperasi}')
  .replace(/(Tahun Buat\s*:\s*)([^<]*)/, '$1{tahunBuat}')
  .replace(/(PENEMPATAN PERALATAN\s*:\s*)([^<]*)/, '$1{penempatanPeralatan}')
  .replace(/(TANGGAL KEJADIAN\s*:\s*)([^<]*)/, '$1{tanggalKejadian}')
  .replace(/(JENIS KERUSAKAN\s*:\s*)([^<]*)/, '$1{jenisKerusakan}')
  .replace(/(PENYEBAB KERUSAKAN\s*:\s*)([^<]*)/, '$1{penyebabKerusakan}')
  .replace(/(AKIBAT KERUSAKAN\s*:\s*)([^<]*)/, '$1{akibatKerusakan}')
  .replace(/(USUL DAN SARAN\s*:\s*)([^<]*)/, '$1{usulDanSaran}')
  .replace(/(LAMPIRAN\s*:\s*)([^<]*)/, '$1{lampiranText}')
  .replace(/Bekasi,\s*8\s*Juli\s*2026/, '{tanggalLokasi}')
  .replace(/TRIAWAN AZHARY P\. N\./, '{managerNama}')
  .replace(/MANAGER ULTG BEKASI/, '{managerJabatan}')
  .replace(/FAJAR KURNIAWAN/, '{tlNama}')
  .replace(/TL JARGI CIKARANG/, '{tlJabatan}')
  .replace(/44767564135/, '{tlNip}');

zip.file('word/document.xml', docXml);

if (!fs.existsSync('public/templates')) {
  fs.mkdirSync('public/templates', { recursive: true });
}

const buffer = zip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE_OFFICIAL.docx', buffer);
console.log('Created public/templates/LKP_TEMPLATE_OFFICIAL.docx');
