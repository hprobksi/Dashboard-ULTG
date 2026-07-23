import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

/**
 * Removes all Word document protection from a PizZip instance.
 * Ensures the exported file is fully editable by anyone.
 */
function removeProtection(zip) {
  // Clean settings.xml
  const settingsFile = zip.file('word/settings.xml');
  if (settingsFile) {
    let xml = settingsFile.asText();
    xml = xml.replace(/<w:documentProtection[^\/]*\/>/g, '');
    xml = xml.replace(/<w:documentProtection[\s\S]*?<\/w:documentProtection>/g, '');
    xml = xml.replace(/<w:writeProtection[^\/]*\/>/g, '');
    xml = xml.replace(/<w:writeProtection[\s\S]*?<\/w:writeProtection>/g, '');
    xml = xml.replace(/<w:trackChanges\/>/g, '');
    xml = xml.replace(/<w:trackChanges\s[^\/]*\/>/g, '');
    zip.file('word/settings.xml', xml);
  }

  // Clean document.xml — remove locks and revision tracking
  const docFile = zip.file('word/document.xml');
  if (docFile) {
    let xml = docFile.asText();
    // Remove deleted-text revision marks
    xml = xml.replace(/<w:del[ >][\s\S]*?<\/w:del>/g, '');
    // Unwrap inserted-text revision marks (keep content)
    xml = xml.replace(/<w:ins [^>]*>([\s\S]*?)<\/w:ins>/g, '$1');
    // Remove content control locks
    xml = xml.replace(/<w:lock[^\/]*\/>/g, '');
    xml = xml.replace(/<w:lock[\s\S]*?<\/w:lock>/g, '');
    zip.file('word/document.xml', xml);
  }

  return zip;
}

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
    let zip = new PizZip(arrayBuffer);

    // ── Remove all protections before rendering ──
    zip = removeProtection(zip);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      // nullGetter: return empty string for any undefined tag (no leftover {tags})
      nullGetter: () => '',
    });

    const formatIndonesianDate = (dateVal) => {
      if (!dateVal) return '-';
      if (typeof dateVal === 'string') {
        const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
          const year = parseInt(match[1], 10);
          const month = parseInt(match[2], 10);
          const day = parseInt(match[3], 10);
          const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          if (month >= 1 && month <= 12) {
            return `${day} ${months[month - 1]} ${year}`;
          }
        }
      }
      try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        return String(dateVal);
      }
    };

    // Signature date (Tanggal Pengajuan / Surat / Hari ini)
    const sigDateRaw = lksData.tanggalSurat || lksData.tanggalPengajuan || lksData.createdAt || new Date();
    const dateFormatted = `Bekasi, ${formatIndonesianDate(sigDateRaw)}`;
    const tglKejadianFormatted = formatIndonesianDate(lksData.tanggalKejadian);

    // All fields — use empty string fallback so no {placeholder} remains in output
    doc.render({
      nomorLks:           lksData.nomorLks                         || '',
      namaPeralatan:      lksData.dataPeralatan?.namaPeralatan      || '',
      merk:               lksData.dataPeralatan?.merk               || '',
      type:               lksData.dataPeralatan?.type               || '',
      noSeri:             lksData.dataPeralatan?.noSeri             || '',
      harga:              lksData.dataPeralatan?.harga              || '',
      kodeAsset:          lksData.dataPeralatan?.kodeAsset          || '',
      tahunOperasi:       lksData.dataPeralatan?.tahunOperasi       || '',
      tahunBuat:          lksData.dataPeralatan?.tahunBuat          || '',
      penempatanPeralatan: lksData.penempatanPeralatan              || '',
      tanggalKejadian:    tglKejadianFormatted                      || '',
      jenisKerusakan:     lksData.jenisKerusakan                    || '',
      penyebabKerusakan:  lksData.penyebabKerusakan                 || '',
      akibatKerusakan:    lksData.akibatKerusakan                   || '',
      usulDanSaran:       lksData.usulDanSaran                      || '',
      lampiranText:       lksData.lampiranText                      || '- Foto Kerusakan (Terlampir)',
      tanggalLokasi:      dateFormatted,
      tlNama:             lksData.approval?.tlNama   || lksData.pengaju?.nama || 'FAJAR KURNIAWAN',
      tlNip:              lksData.approval?.tlNip    || lksData.pengaju?.nip  || '',
      tlJabatan:          lksData.approval?.tlJabatan                         || 'TL TERKAIT',
      managerNama:        lksData.approval?.managerNama                       || 'TRIAWAN AZHARY P. N.',
      managerNip:         lksData.approval?.managerNip                        || '',
      managerJabatan:     lksData.approval?.managerJabatan                    || 'MANAGER ULTG BEKASI',
    });

    // ── Generate output blob ──
    const outZip = doc.getZip();

    // Remove protection from rendered output as well
    removeProtection(outZip);

    const out = outZip.generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // ── Trigger download ──
    const safeName = (lksData.nomorLks || 'DRAF').replace(/[\/\\:*?"<>|]/g, '_');
    const fileName = `LKP_PLN_${safeName}.docx`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(out);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL
    setTimeout(() => URL.revokeObjectURL(link.href), 5000);

  } catch (error) {
    console.error('Gagal mengekspor dokumen Word:', error);
    alert('Gagal mengekspor dokumen Word: ' + (error.message || error));
  }
};
