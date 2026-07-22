import { GoogleGenAI } from '@google/genai';
import { storageService } from './storage';

export const geminiService = {
  async getAiClient() {
    const settings = await storageService.getSettings();
    if (!settings?.apiKey) {
      throw new Error('API Key Gemini belum disetel. Silakan masukkan API Key Anda di menu Pengaturan.');
    }
    return {
      ai: new GoogleGenAI({ apiKey: settings.apiKey }),
      model: settings.engineModel || 'gemini-2.5-pro'
    };
  },

  async generateWaReport({ category = 'SUTT', substation, bay, tripType = 'Trip 3 Phasa', time, weather = 'Cerah', impact = 'Tidak ada pemadaman beban', assetArea = 'UPT Bekasi - ULTG Cikarang', indications = '', cause = '', action = '', rawPoints = '' }) {
    const { ai, model } = await this.getAiClient();

    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const systemInstruction = `Anda adalah Engineer Senior Proteksi & Relay PLN (Persero) UIT JBT.
Tugas Anda menyusun kalimat teknis yang sangat rapi, baku, dan profesional untuk Laporan Gangguan Harian format resmi WhatsApp Manajemen UIT JBT.
Aturan Mutlak:
1. GANTIKAN KOSAKATA KASAR DARI PETUGAS MENJADI KOSAKATA TEKNIK KETENAGALISTRIKAN RESMI PLN (Contoh: "lawan lagi tes OCR ga info" -> "kegiatan pengujian relay OCR di sisi GIS tanpa koordinasi sebelumnya").
2. Gunakan struktur baku 4 Kategori Laporan Gangguan Harian UIT JBT secara persis tanpa mengubah kop dan penutup.
3. Masukkan penjabaran gangguan HANYA pada kategori yang sesuai dengan pilihan lapangan (${category}), sedangkan 3 kategori lainnya WAJIB diisi tepat dengan teks: ========== NIHIL ==========
4. Jangan tambahkan kalimat pengantar/komentar AI apa pun di luar laporan. Langsung keluarkan format teks laporan yang siap disalin.`;

    const prompt = `Buatkan Laporan Gangguan Harian resmi berdasarkan formulir terstruktur lapangan berikut:

Kategori Klasifikasi Gangguan: ${category}
Gardu Induk / Lokasi: ${substation}
Nama Bay / Peralatan: ${bay}
Waktu Kejadian: ${time}
Jenis Trip: ${tripType}
Kondisi Cuaca: ${weather}
Dampak Beban: ${impact}
Wilayah Aset Terganggu: ${assetArea}
Indikasi Relay & Annunciator: ${indications}
Penyebab / Analisa Kejadian: ${cause}
Tindak Lanjut & Kesimpulan: ${action}
Catatan Tambahan Petugas: ${rawPoints}

--- STRUKTUR OUTPUT YANG WAJIB DIPATUHI ---
LAPORAN GANGGUAN HARIAN HARTRANS#1 UIT JBT
${dateStr}

I. GANGGUAN SUTT/SUTET/SKTT
${category === 'SUTT' ? `Pukul ${time} ${bay} di ${substation} ${tripType}\n\n Penyebab Gangguan :\n- [Sempurnakan kalimat penyebab dengan bahasa teknis resmi]\n\n Dampak Gangguan :\n- ${impact}\n\n Wilayah Aset Terganggu :\n- ${assetArea}\n\nAnalisa Gangguan :\n1. Kondisi cuaca saat gangguan di ${substation} yaitu ${weather}\n2. Indikasi di ${substation} bay ${bay}:\n[Jabarkan indikasi relay/annunciator secara rapi]\n3. [Sempurnakan analisa kronologi teknis bernomor yang sangat rapi dan logis berdasarkan data input lapangan]\n\nTindak Lanjut:\n1. [Sempurnakan langkah koordinasi/tindak lanjut]\n\nKesimpulan\n1. [Sempurnakan kesimpulan kinerja proteksi]` : '========== NIHIL =========='}

II. GANGGUAN TRAFO
${category === 'TRAFO' ? `Pukul ${time} ${bay} di ${substation} ${tripType}\n\n Penyebab Gangguan :\n- [Sempurnakan kalimat penyebab dengan bahasa teknis resmi]\n\n Dampak Gangguan :\n- ${impact}\n\n Wilayah Aset Terganggu :\n- ${assetArea}\n\nAnalisa Gangguan :\n1. Kondisi cuaca saat gangguan di ${substation} yaitu ${weather}\n2. Indikasi di ${substation} bay ${bay}:\n[Jabarkan indikasi relay/annunciator]\n3. [Sempurnakan analisa kronologi teknis bernomor]\n\nTindak Lanjut:\n1. [Sempurnakan langkah koordinasi/tindak lanjut]\n\nKesimpulan\n1. [Sempurnakan kesimpulan kinerja proteksi]` : '========== NIHIL =========='}

III. GANGGUAN BAY LAINNYA
${category === 'LAINNYA' ? `Pukul ${time} ${bay} di ${substation} ${tripType}\n\n Penyebab Gangguan :\n- [Sempurnakan kalimat penyebab dengan bahasa teknis resmi]\n\n Dampak Gangguan :\n- ${impact}\n\n Wilayah Aset Terganggu :\n- ${assetArea}\n\nAnalisa Gangguan :\n1. Kondisi cuaca saat gangguan di ${substation} yaitu ${weather}\n2. Indikasi di ${substation} bay ${bay}:\n[Jabarkan indikasi relay/annunciator]\n3. [Sempurnakan analisa kronologi teknis bernomor]\n\nTindak Lanjut:\n1. [Sempurnakan langkah koordinasi/tindak lanjut]\n\nKesimpulan\n1. [Sempurnakan kesimpulan kinerja proteksi]` : '========== NIHIL =========='}

IV. GANGGUAN LAIN-LAIN
${category === 'AUX' ? `Pukul ${time} ${bay} di ${substation} ${tripType}\n\n Penyebab Gangguan :\n- [Sempurnakan kalimat penyebab dengan bahasa teknis resmi]\n\n Dampak Gangguan :\n- ${impact}\n\n Wilayah Aset Terganggu :\n- ${assetArea}\n\nAnalisa Gangguan :\n1. Kondisi cuaca saat gangguan di ${substation} yaitu ${weather}\n2. Indikasi di ${substation} bay ${bay}:\n[Jabarkan indikasi relay/annunciator]\n3. [Sempurnakan analisa kronologi teknis bernomor]\n\nTindak Lanjut:\n1. [Sempurnakan langkah koordinasi/tindak lanjut]\n\nKesimpulan\n1. [Sempurnakan kesimpulan kinerja proteksi]` : '========== NIHIL =========='}


Demikian kami laporkan, semoga instalasi senantiasa beroperasi dengan aman dan andal,
Aamiin Yaa Rabbal'Alamin 🤲`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Rendah agar tata bahasa sangat stabil & akurat
      }
    });

    return response.text;
  },

  async generateBaDocument({ templateContent, rawPoints, substation, bay, anomaliesHistory }) {
    const { ai, model } = await this.getAiClient();

    let historyText = 'Tidak ada catatan gangguan serupa dalam 3 bulan terakhir.';
    if (anomaliesHistory && anomaliesHistory.length > 0) {
      historyText = anomaliesHistory.map(a => `- Tanggal ${a.date}: ${a.indication} (Tindakan: ${a.temporaryAction})`).join('\n');
    }

    const systemInstruction = `Anda adalah Spesialis Proteksi & Analis Sistem Tenaga Listrik PLN ULTG Bekasi.
Tugas Anda adalah melengkapi template Berita Acara (BA) resmi PLN berdasarkan poin kasar pengujian/gangguan yang diinput petugas lapangan.
Aturan Mutlak:
1. Pertahankan seluruh teks baku, pasal, kop surat, dan susunan kalimat dari template yang diberikan.
2. Gantikan penanda dalam kurung siku seperti [HASIL_PENGUJIAN], [KESIMPULAN_TEKNIS], [KRONOLOGI_TRIP], [ANALISA_SEBAB_AKIBAT] dengan narasi teknis formal bahasa Indonesia EYD baku.
3. Gunakan kosa kata teknik ketenagalistrikan yang tepat (misal: arus injeksi sekunder, karakteristik waktu invers/definite, burden CT, diskriminasi proteksi, pembebasan tegangan).
4. Jika ada data riwayat historis gardu induk terkait, analisis keterkaitannya secara objektif.`;

    const prompt = `Bantu isi dan sempurnakan dokumen Berita Acara berikut:

--- TEMPLATE RESMI PLN ---
${templateContent}

--- DATA INPUT HARPRO LAPANGAN ---
Gardu Induk: ${substation}
Bay/Peralatan: ${bay}
Catatan Kasar Petugas: "${rawPoints}"
Riwayat Historis Anomali GI Terkait di Memory Lokal:
${historyText}

Keluarkan dokumen Berita Acara secara utuh dan siap cetak tanpa teks komentar tambahan.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.25,
      }
    });

    return response.text;
  },

  async analyzeAnomalyRecommendation({ equipment, indication }) {
    const { ai, model } = await this.getAiClient();

    const systemInstruction = `Anda adalah Konsultan Expert Proteksi Relay & Gardu Induk PLN.
Tugas Anda memberikan rekomendasi investigasi dan tindakan teknis atas anomali peralatan yang dilaporkan.
Berikan jawaban singkat, padat (maksimal 4 poin bernomor), objektif, mengacu pada standar IEEE / IEC 61850 / SOP PLN.`;

    const prompt = `Peralatan: ${equipment}
Gejala/Indikasi Anomali: "${indication}"

Berikan 4 poin rekomendasi langkah investigasi & penanganan yang harus dilakukan tim Harpro:`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    return response.text;
  }
};
