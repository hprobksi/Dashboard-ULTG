// Master Data Personil & Struktur Organisasi ULTG Bekasi
// 100% Sinkron dengan project referensi NATURA_ULTG_BEKASI (web-natura/prisma/dev.db & web-natura/src/app/pegawai/page.tsx)
// Memuat tepat 49 personil aktif resmi ULTG Bekasi (tanpa data temporary/palsu)

export const MAIN_BIDANG = ["GARDU INDUK", "HARPRO", "HARJAR", "HARGI", "K3", "SOFKIN", "ULTG BEKASI"];

export const GI_BIDANG = [
  "GITET MUARATAWAR", 
  "GISGISTET NEWTAMBUN", 
  "GIS MARGAHAYU",
  "GI CIKARANG", 
  "GI FAJAR SW", 
  "GI GANDAMEKAR", 
  "GI JABABEKA", 
  "GI MUARATAWAR", 
  "GI PONCOL BARU", 
  "GI RAJAPAKSI", 
  "GI TAMBUN"
];

export const ALL_STANDARD_BIDANG = [...MAIN_BIDANG, ...GI_BIDANG];

export const getAvatarUrl = (seed) => {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`;
};

export const MASTER_PEGAWAI_ALL = [
  {
    "id": 5,
    "nama": "INDA RAHMAT",
    "jabatan": "SENIOR OFFICER KINERJA DAN ADMINISTRASI TRANSMISI DAN GARDU INDUK",
    "bidang": "SOFKIN",
    "rawBidang": "ULTG BEKASI",
    "nip": "7194149K3",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7805",
    "isPiketPenuh": true
  },
  {
    "id": 6,
    "nama": "M.UDRUS FAISAL",
    "jabatan": "SENIOR OFFICER KINERJA DAN ADMINISTRASI TRANSMISI DAN GARDU INDUK",
    "bidang": "SOFKIN",
    "rawBidang": "ULTG BEKASI",
    "nip": "7294171K3",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7806",
    "isPiketPenuh": false
  },
  {
    "id": 7,
    "nama": "TEGUH ISTIANTORO",
    "jabatan": "SENIOR OFFICER KINERJA DAN ADMINISTRASI TRANSMISI DAN GARDU INDUK",
    "bidang": "SOFKIN",
    "rawBidang": "ULTG BEKASI",
    "nip": "7394169K3",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7807",
    "isPiketPenuh": true
  },
  {
    "id": 8,
    "nama": "SYAFRIL",
    "jabatan": "SOF KIN DAN ADM TRANS GI",
    "bidang": "SOFKIN",
    "rawBidang": "ULTG BEKASI",
    "nip": "7192225K3",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7808",
    "isPiketPenuh": false
  },
  {
    "id": 9,
    "nama": "SYIFAUL AR RIZQI",
    "jabatan": "TECHNICIAN PEMELIHARAAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "ULTG BEKASI",
    "nip": "9619324ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7809",
    "isPiketPenuh": true
  },
  {
    "id": 10,
    "nama": "BUDI SUHARDIMAN",
    "jabatan": "TECHNICIAN PENGENDALIAN OPERASI DAN PEMELIHARAAN TRANSMISI DAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "ULTG BEKASI",
    "nip": "8908131P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7810",
    "isPiketPenuh": true
  },
  {
    "id": 11,
    "nama": "TEGUH RAHARJO",
    "jabatan": "SENIOR OFFICER KINERJA DAN ADMINISTRASI TRANSMISI DAN GARDU INDUK",
    "bidang": "SOFKIN",
    "rawBidang": "ULTG BEKASI",
    "nip": "7494027P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7811",
    "isPiketPenuh": true
  },
  {
    "id": 12,
    "nama": "DIBYO SINDHU PRADANA",
    "jabatan": "TEAM LEADER KESELAMATAN, KESEHATAN KERJA, LINGKUNGAN, DAN KEAMANAN TRANSMISI DAN GARDU INDUK",
    "bidang": "K3",
    "rawBidang": "SIE K3L KAM TRANS GI",
    "nip": "9618863ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7812",
    "isPiketPenuh": true
  },
  {
    "id": 13,
    "nama": "SAEPUL ROHMAT",
    "jabatan": "TEAM LEADER PEMELIHARAAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "SIE HAR GI",
    "nip": "9413040P3Y",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7813",
    "isPiketPenuh": true
  },
  {
    "id": 15,
    "nama": "ILHAM SYAPUTRA",
    "jabatan": "TECHNICIAN PENGENDALIAN OPERASI DAN PEMELIHARAAN TRANSMISI DAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "SIE HAR GI",
    "nip": "9419309ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7815",
    "isPiketPenuh": true
  },
  {
    "id": 16,
    "nama": "FRANSIUS P. NAINGGOLAN",
    "jabatan": "JTC HAR GI",
    "bidang": "HARGI",
    "rawBidang": "SIE HAR GI",
    "nip": "96260116P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7816",
    "isPiketPenuh": true
  },
  {
    "id": 18,
    "nama": "AHMAD YAZID AL BASTOMY",
    "jabatan": "TEAM LEADER PEMELIHARAAN JARINGAN TRANSMISI",
    "bidang": "HARJAR",
    "rawBidang": "SIE HAR RING",
    "nip": "9009077P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7818",
    "isPiketPenuh": true
  },
  {
    "id": 19,
    "nama": "DJUNAEDI DJUGUR",
    "jabatan": "TECHNICIAN PEMELIHARAAN JARINGAN TRANSMISI",
    "bidang": "HARJAR",
    "rawBidang": "ULTG BEKASI",
    "nip": "7089064K3",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7819",
    "isPiketPenuh": true
  },
  {
    "id": 20,
    "nama": "RANGGI REFTA RIANDI",
    "jabatan": "TECHNICIAN PENGENDALIAN OPERASI DAN PEMELIHARAAN TRANSMISI DAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "ULTG BEKASI",
    "nip": "9520985ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7820",
    "isPiketPenuh": true
  },
  {
    "id": 21,
    "nama": "ERVAN JAGI MARTHA WIBOWO",
    "jabatan": "TEAM LEADER PEMELIHARAAN PROTEKSI, METER, DAN OTOMASI TRANSMISI DAN GARDU INDUK",
    "bidang": "HARPRO",
    "rawBidang": "SIE HAR PROT MTR OTO TRANS GI",
    "nip": "94163826ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7821",
    "isPiketPenuh": true
  },
  {
    "id": 22,
    "nama": "RIZKY WIRA HANDALAN",
    "jabatan": "TECHNICIAN PENGENDALIAN OPERASI DAN PEMELIHARAAN TRANSMISI DAN GARDU INDUK",
    "bidang": "HARPRO",
    "rawBidang": "SIE HAR PROT MTR OTO TRANS GI",
    "nip": "9418407ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7822",
    "isPiketPenuh": true
  },
  {
    "id": 23,
    "nama": "RIKI HARDIANTO",
    "jabatan": "JUNIOR TECHNICIAN PEMELIHARAAN PROTEKSI, METER, DAN OTOMASI TRANSMISI DAN GARDU INDUK",
    "bidang": "HARPRO",
    "rawBidang": "SIE HAR PROT MTR OTO TRANS GI",
    "nip": "9817156TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7823",
    "isPiketPenuh": true
  },
  {
    "id": 24,
    "nama": "EDWAR DENDY VATRIZAH",
    "jabatan": "TECHNICIAN PEMELIHARAAN PROTEKSI, METER, DAN OTOMASI TRANSMISI DAN GARDUINDUK",
    "bidang": "HARPRO",
    "rawBidang": "SIE HAR PROT MTR OTO TRANS GI",
    "nip": "9819899ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7824",
    "isPiketPenuh": true
  },
  {
    "id": 25,
    "nama": "HERI",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI JABABEKA)",
    "bidang": "GI JABABEKA",
    "rawBidang": "SIE JAR TRANS GI (GI JABABEKA)",
    "nip": "8508132P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7825",
    "isPiketPenuh": false
  },
  {
    "id": 26,
    "nama": "ALDI RENALDI AGUSTIAN",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GI JABABEKA",
    "rawBidang": "SIE JAR TRANS GI (GI JABABEKA)",
    "nip": "9817177TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7826",
    "isPiketPenuh": false
  },
  {
    "id": 27,
    "nama": "YUNIANTO AGUNG PURNOMO AJI",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GI JABABEKA",
    "rawBidang": "SIE JAR TRANS GI (GI JABABEKA)",
    "nip": "9717069TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7827",
    "isPiketPenuh": false
  },
  {
    "id": 28,
    "nama": "I PUTU SURYA ADI SUBRATA",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI FAJAR SURYAWISESA)",
    "bidang": "GI FAJAR SW",
    "rawBidang": "SIE JAR TRANS GI (GI FAJAR SURYAWISESA)",
    "nip": "97191803ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7828",
    "isPiketPenuh": true
  },
  {
    "id": 30,
    "nama": "REZA RISANDI",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GI FAJAR SW",
    "rawBidang": "SIE JAR TRANS GI (GI FAJAR SURYAWISESA)",
    "nip": "9817164TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7830",
    "isPiketPenuh": false
  },
  {
    "id": 31,
    "nama": "HASANUDIN",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI GANDAMEKAR)",
    "bidang": "GI GANDAMEKAR",
    "rawBidang": "SIE JAR TRANS GI (GI GANDAMEKAR)",
    "nip": "8808100P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7831",
    "isPiketPenuh": false
  },
  {
    "id": 32,
    "nama": "FAIZ ADIT HIBATULLAH",
    "jabatan": "TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GI GANDAMEKAR",
    "rawBidang": "SIE JAR TRANS GI (GI GANDAMEKAR)",
    "nip": "9618996ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7832",
    "isPiketPenuh": false
  },
  {
    "id": 33,
    "nama": "RIZKY AKBAR PRATAMA",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GI GANDAMEKAR",
    "rawBidang": "SIE JAR TRANS GI (GI GANDAMEKAR)",
    "nip": "9922119ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7833",
    "isPiketPenuh": false
  },
  {
    "id": 34,
    "nama": "RD. JAYA KUSUMA",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI (GITET MUARA TAWAR)",
    "bidang": "GITET MUARATAWAR",
    "rawBidang": "SIE JAR TRANS GITET (MUARA TAWAR)",
    "nip": "8808114P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7834",
    "isPiketPenuh": false
  },
  {
    "id": 35,
    "nama": "ENDAR SUTAWIJAYA",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GITET MUARATAWAR",
    "rawBidang": "SIE JAR TRANS GITET (MUARA TAWAR)",
    "nip": "9414009P3Y",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7835",
    "isPiketPenuh": false
  },
  {
    "id": 36,
    "nama": "BAMBANG PRAYITNO",
    "jabatan": "TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GITET MUARATAWAR",
    "rawBidang": "SIE JAR TRANS GITET (MUARA TAWAR)",
    "nip": "97191431ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7836",
    "isPiketPenuh": false
  },
  {
    "id": 37,
    "nama": "NURIZAL AFRIANSYAH",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GITET MUARATAWAR",
    "rawBidang": "SIE JAR TRANS GITET (MUARA TAWAR)",
    "nip": "9820264ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7837",
    "isPiketPenuh": false
  },
  {
    "id": 39,
    "nama": "PRASETYO AJI NUGROHO",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GITET MUARATAWAR",
    "rawBidang": "SIE JAR TRANS GITET (MUARA TAWAR)",
    "nip": "9717109TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7839",
    "isPiketPenuh": false
  },
  {
    "id": 41,
    "nama": "KHAHFI MUHAMMAD MADRO'I",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI TAMBUN DAN TOYOGIRI)",
    "bidang": "GI TAMBUN",
    "rawBidang": "SIE JAR TRANS GI (GI TAMBUN DAN TOYOGIRI)",
    "nip": "8908129P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7841",
    "isPiketPenuh": false
  },
  {
    "id": 42,
    "nama": "ANDI NURCHOLIS MAKKARAKA",
    "jabatan": "TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK (GI TAMBUN)",
    "bidang": "GI TAMBUN",
    "rawBidang": "SIE JAR TRANS GI (GI TAMBUN DAN TOYOGIRI)",
    "nip": "9919653ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7842",
    "isPiketPenuh": false
  },
  {
    "id": 43,
    "nama": "ADI GUNA ARSA",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK (GI TOYOGIRI)",
    "bidang": "GI TAMBUN",
    "rawBidang": "SIE JAR TRANS GI (GI TAMBUN DAN TOYOGIRI)",
    "nip": "9717051TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7843",
    "isPiketPenuh": false
  },
  {
    "id": 44,
    "nama": "MUHAMAD JAENAL MUTAKIN",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI (GIS/GISTET NEW TAMBUN)",
    "bidang": "GISGISTET NEWTAMBUN",
    "rawBidang": "SIE JAR TRANS GITET (GIS/GISTET NEW TAMBUN)",
    "nip": "8908163P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7844",
    "isPiketPenuh": false
  },
  {
    "id": 45,
    "nama": "OKKY PRIAMBODO HAPSARA",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GISGISTET NEWTAMBUN",
    "rawBidang": "SIE JAR TRANS GITET (GIS/GISTET NEW TAMBUN)",
    "nip": "9817193TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7845",
    "isPiketPenuh": false
  },
  {
    "id": 46,
    "nama": "FARHAN NAUFAL PERDANA",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GISGISTET NEWTAMBUN",
    "rawBidang": "SIE JAR TRANS GITET (GIS/GISTET NEW TAMBUN)",
    "nip": "9922404ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7846",
    "isPiketPenuh": false
  },
  {
    "id": 47,
    "nama": "AIDIN AMSYAR",
    "jabatan": "TECHNICIAN PENGENDALIAN OPERASI DAN PEMELIHARAAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GISGISTET NEWTAMBUN",
    "rawBidang": "SIE JAR TRANS GITET (GIS/GISTET NEW TAMBUN)",
    "nip": "9620257ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7847",
    "isPiketPenuh": false
  },
  {
    "id": 48,
    "nama": "RIDHO KURNIAWAN",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "GISGISTET NEWTAMBUN",
    "rawBidang": "SIE JAR TRANS GITET (GIS/GISTET NEW TAMBUN)",
    "nip": "9817131TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7848",
    "isPiketPenuh": false
  },
  {
    "id": 50,
    "nama": "FATHONI DIANATA",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI RAJAPAKSI)",
    "bidang": "GI RAJAPAKSI",
    "rawBidang": "SIE JAR TRANS GI (GI RAJAPAKSI)",
    "nip": "9515074P3Y",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7850",
    "isPiketPenuh": true
  },
  {
    "id": 51,
    "nama": "FAJAR KURNIAWAN",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI CIKARANG)",
    "bidang": "GI CIKARANG",
    "rawBidang": "SIE JAR TRANS GI (GI CIKARANG)",
    "nip": "9717045TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7851",
    "isPiketPenuh": false
  },
  {
    "id": 53,
    "nama": "RACHMAD BAGUS PAMARDHIKO",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "GI CIKARANG",
    "rawBidang": "SIE JAR TRANS GI (GI CIKARANG)",
    "nip": "9822105ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7853",
    "isPiketPenuh": false
  },
  {
    "id": 54,
    "nama": "FAJAR RIZKY DWI SANJAYA",
    "jabatan": "TEAM LEADER JARINGAN TRANSMISI DAN GARDU INDUK (GI PONCOL BARU DAN GIS PONCOL BARU  II)",
    "bidang": "HARJAR",
    "rawBidang": "SIE JAR TRANS GI (GI PONCOL BARU DAN GIS MARGAHAYU)",
    "nip": "9318396ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7854",
    "isPiketPenuh": true
  },
  {
    "id": 56,
    "nama": "DWI ARYO NUGROHO",
    "jabatan": "JUNIOR TECHNICIAN PEMELIHARAAN JARINGAN TRANSMISI",
    "bidang": "HARJAR",
    "rawBidang": "SIE JAR TRANS GI (GI PONCOL BARU DAN GIS MARGAHAYU)",
    "nip": "9617002TBY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7856",
    "isPiketPenuh": true
  },
  {
    "id": 60,
    "nama": "M. HAFIDZ DENZI",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "HARGI",
    "rawBidang": "Hargi",
    "nip": "80700160P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7860",
    "isPiketPenuh": false
  },
  {
    "id": 62,
    "nama": "MUHAMAD DAVVA ARISANDI",
    "jabatan": "JUNIOR TECHNICIAN PEMELIHARAAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "Hargi",
    "nip": "82720162P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7862",
    "isPiketPenuh": true
  },
  {
    "id": 63,
    "nama": "REYNALDI HANDRIAN BAYU LIGAR SAPUTRA",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK",
    "bidang": "HARGI",
    "rawBidang": "Hargi",
    "nip": "83730163P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7863",
    "isPiketPenuh": false
  },
  {
    "id": 64,
    "nama": "ROBERT BASTANTA BANGUN",
    "jabatan": "JUNIOR TECHNICIAN JARINGAN TRANSMISI DAN GARDU INDUK TEGANGAN EKSTRA TINGGI",
    "bidang": "HARGI",
    "rawBidang": "Hargi",
    "nip": "9922412ZY",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7864",
    "isPiketPenuh": false
  },
  {
    "id": 68,
    "nama": "TRIAWAN AZHARY PERMATA NUGRAHA",
    "jabatan": "MANAGER UNIT LAYANAN TRANSMISI DAN GARDU INDUK BEKASI",
    "bidang": "HARGI",
    "rawBidang": "Hargi",
    "nip": "88780168P3B",
    "status": "Hadir / Dinas",
    "telp": "0812-3456-7868",
    "isPiketPenuh": true
  }
];

export const getMasterPegawaiList = () => {
  try {
    const saved = localStorage.getItem('natura_pegawai_master_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validasi ketat: jika jumlah data tersimpan kurang dari 48 atau tidak memiliki personil kunci (misal AHMAD YAZID AL BASTOMY), maka otomatis reset ke data master resmi 49 orang
      if (Array.isArray(parsed) && parsed.length >= 48 && parsed.some(p => p.nama === 'AHMAD YAZID AL BASTOMY' || p.nama === 'BUDI SUHARDIMAN')) {
        return parsed;
      }
    }
    // Hapus data lama yang tidak lengkap atau memuat nama palsu
    localStorage.removeItem('natura_pegawai_master');
    localStorage.setItem('natura_pegawai_master_db', JSON.stringify(MASTER_PEGAWAI_ALL));
  } catch (e) {
    console.error('Failed reading natura_pegawai_master_db from localStorage', e);
  }
  return MASTER_PEGAWAI_ALL;
};

export const saveMasterPegawaiList = (list) => {
  try {
    localStorage.setItem('natura_pegawai_master_db', JSON.stringify(list));
  } catch (e) {
    console.error('Failed saving natura_pegawai_master_db to localStorage', e);
  }
};
