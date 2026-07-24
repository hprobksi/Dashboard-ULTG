import fs from 'fs';
import PizZip from 'pizzip';

const content = fs.readFileSync('01. LKP ( FORMAT DASAR ).docx');
const zip = new PizZip(content);

let xml = zip.file('word/document.xml').asText();

// Replace exact strings with docxtemplater tags
xml = xml
  .replace(/Nama Peralatan:([^\n<]*)/, 'Nama Peralatan: {namaPeralatan}')
  .replace(/Merk:([^\n<]*)/, 'Merk: {merk}')
  .replace(/Type :([^\n<]*)/, 'Type: {type}')
  .replace(/No Seri:([^\n<]*)/, 'No Seri: {noSeri}')
  .replace(/Harga:([^\n<]*)/, 'Harga: {harga}')
  .replace(/Kode Asset:([^\n<]*)/, 'Kode Asset: {kodeAsset}')
  .replace(/Tahun Operasi:([^\n<]*)/, 'Tahun Operasi: {tahunOperasi}')
  .replace(/Tahun Buat:([^\n<]*)/, 'Tahun Buat: {tahunBuat}')
  .replace(/PENEMPATAN PERALATAN:([^\n<]*)/, 'PENEMPATAN PERALATAN: {penempatanPeralatan}')
  .replace(/TANGGAL KEJADIAN:([^\n<]*)/, 'TANGGAL KEJADIAN: {tanggalKejadian}')
  .replace(/JENIS KERUSAKAN:([^\n<]*)/, 'JENIS KERUSAKAN: {jenisKerusakan}')
  .replace(/PENYEBAB KERUSAKAN:([^\n<]*)/, 'PENYEBAB KERUSAKAN: {penyebabKerusakan}')
  .replace(/AKIBAT KERUSAKAN:([^\n<]*)/, 'AKIBAT KERUSAKAN: {akibatKerusakan}')
  .replace(/USUL DAN SARAN:([^\n<]*)/, 'USUL DAN SARAN: {usulDanSaran}')
  .replace(/LAMPIRAN:([^\n<]*)/, 'LAMPIRAN: {lampiranText}')
  .replace(/Bekasi, 8 Juli 2026/, '{tanggalLokasi}')
  .replace(/TRIAWAN AZHARY P\. N\./, '{managerNama}')
  .replace(/MANAGER ULTG BEKASI/, '{managerJabatan}')
  .replace(/44767564135/, '{tlNip}')
  .replace(/FAJAR KURNIAWAN/, '{tlNama}')
  .replace(/TL JARGI CIKARANG/, '{tlJabatan}');

zip.file('word/document.xml', xml);

if (!fs.existsSync('public/templates')) {
  fs.mkdirSync('public/templates', { recursive: true });
}

const buffer = zip.generate({ type: 'nodebuffer' });
fs.writeFileSync('public/templates/LKP_TEMPLATE.docx', buffer);
console.log('Saved template to public/templates/LKP_TEMPLATE.docx');
