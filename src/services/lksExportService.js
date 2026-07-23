import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export const exportToDocx = async (lksData) => {
  try {
    let response = await fetch('/templates/LKP_TEMPLATE_OFFICIAL.docx');
    if (!response.ok) {
      response = await fetch('/templates/LKP_TEMPLATE.docx');
    }
    if (!response.ok) {
      throw new Error('Template dokumen Word LKP tidak ditemukan.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const dateFormatted = lksData.tanggalKejadian 
      ? `Bekasi, ${new Date(lksData.tanggalKejadian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
      : 'Bekasi';

    doc.render({
      nomorLks: lksData.nomorLks || '-',
      namaPeralatan: lksData.dataPeralatan?.namaPeralatan || '-',
      merk: lksData.dataPeralatan?.merk || '-',
      type: lksData.dataPeralatan?.type || '-',
      noSeri: lksData.dataPeralatan?.noSeri || '-',
      harga: lksData.dataPeralatan?.harga || '-',
      kodeAsset: lksData.dataPeralatan?.kodeAsset || '-',
      tahunOperasi: lksData.dataPeralatan?.tahunOperasi || '-',
      tahunBuat: lksData.dataPeralatan?.tahunBuat || '-',
      penempatanPeralatan: lksData.penempatanPeralatan || '-',
      tanggalKejadian: lksData.tanggalKejadian || '-',
      jenisKerusakan: lksData.jenisKerusakan || '-',
      penyebabKerusakan: lksData.penyebabKerusakan || '-',
      akibatKerusakan: lksData.akibatKerusakan || '-',
      usulDanSaran: lksData.usulDanSaran || '-',
      lampiranText: lksData.lampiranText || '- Foto Kerusakan (Terlampir)',
      tanggalLokasi: dateFormatted,
      tlNama: lksData.approval?.tlNama || lksData.pengaju?.nama || 'FAJAR KURNIAWAN',
      tlNip: lksData.approval?.tlNip || lksData.pengaju?.nip || '-',
      tlJabatan: lksData.approval?.tlJabatan || 'TL TERKAIT',
      managerNama: lksData.approval?.managerNama || 'TRIAWAN AZHARY P. N.',
      managerNip: lksData.approval?.managerNip || '-',
      managerJabatan: lksData.approval?.managerJabatan || 'MANAGER ULTG BEKASI'
    });

    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const fileName = `LKP_RESMI_${(lksData.nomorLks || 'DRAF').replace(/[\/\\]/g, '_')}.docx`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(out);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Gagal mengekspor dokumen Word:', error);
    alert('Gagal mengekspor dokumen Word: ' + error.message);
  }
};
