import React, { useState, useMemo } from 'react';
import { CalendarDays, CheckCircle2 } from 'lucide-react';

// Data Rencana Pemeliharaan Rutin Transmisi & Gardu Induk Periode Juli 2026
// Khusus ULTG BEKASI (37 WO) dari File Jadwal Pekerjaan R NR Juli.pdf (PT PLN PERSERO UPT BEKASI)
const jadwalBekasiData = [
  {
    id: 1, area: 'ULTG BEKASI', lokasi: 'RJPSI', bay: 'BAY KONSUMEN #1', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'RABU, 1 JULI 2026', days: [1], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '300395164'
  },
  {
    id: 2, area: 'ULTG BEKASI', lokasi: 'RJPSI', bay: 'BAY KONSUMEN #2', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 2 JULI 2026', days: [2], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '300395166'
  },
  {
    id: 3, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRAFO#1', tegangan: '150 kV', sifat: '5',
    programHar: '-', tanggal: "JUM'AT, 3 JULI 2026", days: [3], pukul: '08.00 - 16.00 WIB',
    uraian: 'PELEPASAN JUMPERAN BUSBAR DALAM PENGGANTIAN DS BUS B BAY TRAFO#1', pelaksana: 'PDKB', penanggungJawab: 'MUPT BEKASI', noWo: '1002936186'
  },
  {
    id: 4, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRAFO#1', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SABTU, 4 JULI 2026', days: [4], pukul: '08.00 - 16.00 WIB',
    uraian: '- PENGGANTIAN DS BUS B\n- PEMASANGAN WAP\n- PENGGANTIAN AVR', pelaksana: 'PT. BMP / ULTG / PT. SIMETRIK', penanggungJawab: 'MUPT BEKASI', noWo: '1002936189'
  },
  {
    id: 5, area: 'ULTG BEKASI', lokasi: 'GISTET NEW TAMBUN', bay: 'BAY IBT#1 500/150kV (HV) TAHAP 1', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'MINGGU, 5 JULI 2026', days: [5], pukul: '07.00 - 15.00 WIB',
    uraian: '- PEMELIHARAAN RUTIN 2 TAHUNAN\n- REPOSISI LA', pelaksana: 'ULTG / PT. JAMINDO', penanggungJawab: 'MUPT BEKASI', noWo: '1002935426'
  },
  {
    id: 6, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRAFO#1', tegangan: '150 kV', sifat: '5',
    programHar: '-', tanggal: 'SENIN, 6 JULI 2026', days: [6], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMASANGAN JUMPERAN BUSBAR DALAM PENGGANTIAN DS BUS B BAY TRAFO#1', pelaksana: 'PDKB', penanggungJawab: 'MUPT BEKASI', noWo: '1002936190'
  },
  {
    id: 7, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7AB2 / BAY 7B2 DIA#2 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '-', tanggal: 'SENIN - RABU, 6 - 8 JULI 2026', days: [6, 7, 8], pukul: '07.00 - 15.00 WIB (PADAM INAP)',
    uraian: 'PENGGANTIAN CCP', pelaksana: 'PT. SPE', penanggungJawab: 'MUPT BEKASI', noWo: '1002935427 / 1002935428'
  },
  {
    id: 8, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7AB1 DIA#1 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '-', tanggal: 'SENIN, 6 JULI 2026', days: [6], pukul: '07.00 - 15.00 WIB',
    uraian: 'PENGAMANAN DALAM PENGGANTIAN PMT', pelaksana: 'PT. GPS', penanggungJawab: 'MUPT BEKASI', noWo: '1002934860'
  },
  {
    id: 9, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7AB2 DIA#2 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '-', tanggal: 'SENIN - SENIN, 6 - 13 JULI 2026', days: [6, 7, 8, 9, 10, 11, 12, 13], pukul: '07.00 - 15.00 WIB (PADAM INAP)',
    uraian: 'PENGGANTIAN PMT', pelaksana: 'PT. GPS', penanggungJawab: 'MUPT BEKASI', noWo: '1002935427'
  },
  {
    id: 10, area: 'ULTG BEKASI', lokasi: 'GISTET NEW TAMBUN', bay: 'BAY 7A4 DIA#4 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'SELASA, 7 JULI 2026', days: [7], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002935429'
  },
  {
    id: 11, area: 'ULTG BEKASI', lokasi: 'GISTET NEW TAMBUN', bay: 'BAY 7AB4 DIA#4 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'RABU, 8 JULI 2026', days: [8], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002935430'
  },
  {
    id: 12, area: 'ULTG BEKASI', lokasi: 'CIKRG', bay: 'BAY TRAFO#2 150/20 KV', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 9 JULI 2026', days: [9], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002934860'
  },
  {
    id: 13, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY BUSBAR B 150kV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SABTU, 11 JULI 2026', days: [11], pukul: '08.00 - 16.00 WIB',
    uraian: 'PENGAMANAN PENGGANTIAN DS BUS B', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936187'
  },
  {
    id: 14, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRAFO#2 150/20 KV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SABTU - MINGGU, 11 - 12 JULI 2026', days: [11, 12], pukul: '08.00 - 16.00 WIB (PADAM INAP)',
    uraian: '- PENGGANTIAN BUSHING\n- PENGGANTIAN DS REL BUS B', pelaksana: 'PT. ENINDO / PT BMP', penanggungJawab: 'MUPT BEKASI', noWo: '1002936188'
  },
  {
    id: 15, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7A11 DIA#11 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'SELASA, 14 JULI 2026', days: [14], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936231'
  },
  {
    id: 16, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7B2 DIA#1 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '-', tanggal: 'SELASA - SELASA, 14 - 21 JULI 2026', days: [14, 15, 16, 17, 18, 19, 20, 21], pukul: '07.00 - 15.00 WIB (PADAM INAP)',
    uraian: 'PENGGANTIAN PMT', pelaksana: 'PT. GPS', penanggungJawab: 'MUPT BEKASI', noWo: '1002936232'
  },
  {
    id: 17, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7AB11 DIA#11 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'RABU, 15 JULI 2026', days: [15], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936238'
  },
  {
    id: 18, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7AB4 DIA#4 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 16 JULI 2026', days: [16], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002937314'
  },
  {
    id: 19, area: 'ULTG BEKASI', lokasi: 'JBBKA', bay: 'BAY PHT 150kV HANKOOK#2', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'SABTU, 18 JULI 2026', days: [18], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '300395243'
  },
  {
    id: 20, area: 'ULTG BEKASI', lokasi: 'JBBKA', bay: 'BAY TRAFO#1', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SABTU, 18 JULI 2026', days: [18], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMASANGAN WAP & PERBAIKAN PROTEKSI BINATANG', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936242'
  },
  {
    id: 21, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRF#3 150/20kV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: "SABTU - JUM'AT, 18 - 24 JULI 2026", days: [18, 19, 20, 21, 22, 23, 24], pukul: '08.00 - 16.00 WIB (PADAM INAP)',
    uraian: '- PENGGANTIAN INCOMING\n- PENGGANTIAN KABEL POWER & RELE AVR\n- AKTIVASI REF LOW IMPEDANCE\n- PENGGANTIAN DS REL BUS A', pelaksana: 'PT. DCI / PT. SIMBARHOL / PT. SIMETRIK / ULTG / PT BMP', penanggungJawab: 'MUPT BEKASI', noWo: '1002936234'
  },
  {
    id: 22, area: 'ULTG BEKASI', lokasi: 'JBBKA', bay: 'BAY TRF#3 150/20kV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SENIN, 20 JULI 2026', days: [20], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMASANGAN WAP & PERBAIKAN PROTEKSI BINATANG', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936235'
  },
  {
    id: 23, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRAFO#3', tegangan: '150 kV', sifat: '5',
    programHar: '-', tanggal: 'SENIN, 20 JULI 2026', days: [20], pukul: '08.00 - 16.00 WIB',
    uraian: 'PELEPASAN JUMPERAN BUSBAR DALAM PENGGANTIAN DS BUS A BAY TRAFO#3', pelaksana: 'PDKB', penanggungJawab: 'MUPT BEKASI', noWo: '1002936237'
  },
  {
    id: 24, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7B3 DIA#3 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'SELASA, 21 JULI 2026', days: [21], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002937315'
  },
  {
    id: 25, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRF#3 150/20kV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SELASA, 21 JULI 2026', days: [21], pukul: '08.00 - 16.00 WIB',
    uraian: 'PENGGANTIAN DS REL BUS A', pelaksana: 'PT BMP', penanggungJawab: 'MUPT BEKASI', noWo: '1002936239'
  },
  {
    id: 26, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRAFO#3', tegangan: '150 kV', sifat: '5',
    programHar: '-', tanggal: 'RABU, 22 JULI 2026', days: [22], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMASANGAN JUMPERAN BUSBAR DALAM PENGGANTIAN DS BUS A BAY TRAFO#3', pelaksana: 'PDKB', penanggungJawab: 'MUPT BEKASI', noWo: '1002936241'
  },
  {
    id: 27, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRF#3 150/20kV TAHAP 1', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'RABU, 22 JULI 2026', days: [22], pukul: '08.00 - 16.00 WIB',
    uraian: '- PEMELIHARAAN RUTIN 2 TAHUNAN\n- PENGGANTIAN MINYAK OLTC\n- PEMASANGAN WAP', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936234'
  },
  {
    id: 28, area: 'ULTG BEKASI', lokasi: 'GDMKR', bay: 'BAY TRF#3 150/20kV TAHAP 2', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 23 JULI 2026', days: [23], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936234'
  },
  {
    id: 29, area: 'ULTG BEKASI', lokasi: 'TMBUN', bay: 'BAY TRF#3 150/20kV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SABTU, 25 JULI 2026', days: [25], pukul: '08.00 - 16.00 WIB',
    uraian: 'TINDAK LANJUT ANOMALI HASIL UJI DAN KEBISINGAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936236'
  },
  {
    id: 30, area: 'ULTG BEKASI', lokasi: 'JBBKA', bay: 'BAY TRF#4 150/20kV', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SENIN, 27 JULI 2026', days: [27], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMASANGAN WAP & PERBAIKAN PROTEKSI BINATANG', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936243'
  },
  {
    id: 31, area: 'ULTG BEKASI', lokasi: 'MGHYU', bay: 'BAY PONCOL BARU#2', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'SENIN, 27 JULI 2026', days: [27], pukul: '08.00 - 16.00 WIB',
    uraian: 'STD SETTING DAN LOGIC', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936249'
  },
  {
    id: 32, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7A12 DIA#12 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'SELASA, 28 JULI 2026', days: [28], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936244'
  },
  {
    id: 33, area: 'ULTG BEKASI', lokasi: 'MRTWR', bay: 'BAY 7AB12 DIA#12 500kV', tegangan: '500 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'RABU, 29 JULI 2026', days: [29], pukul: '07.00 - 15.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936245'
  },
  {
    id: 34, area: 'ULTG BEKASI', lokasi: 'RJPSI', bay: 'BAY BUSBAR A 150 KV', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 30 JULI 2026', days: [30], pukul: '08.00 - 12.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936247'
  },
  {
    id: 35, area: 'ULTG BEKASI', lokasi: 'RJPSI', bay: 'BAY BUSBAR B 150 KV', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 30 JULI 2026', days: [30], pukul: '12.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936248'
  },
  {
    id: 36, area: 'ULTG BEKASI', lokasi: 'RJPSI', bay: 'BAY KOPEL 150 KV', tegangan: '150 kV', sifat: '3',
    programHar: '2 TAHUNAN', tanggal: 'KAMIS, 30 JULI 2026', days: [30], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN RUTIN 2 TAHUNAN', pelaksana: 'ULTG', penanggungJawab: 'MUPT BEKASI', noWo: '1002936246'
  },
  {
    id: 37, area: 'ULTG BEKASI', lokasi: 'PNCRU', bay: 'BAY TRAFO#1', tegangan: '150 kV', sifat: '3',
    programHar: '-', tanggal: 'KAMIS, 30 JULI 2026', days: [30], pukul: '08.00 - 16.00 WIB',
    uraian: 'PEMELIHARAAN BUSBAR 20 KV', pelaksana: 'UP2D JABAR', penanggungJawab: 'MUP2D JABAR', noWo: '1002935425'
  }
];

export default function JadwalKalender() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    if (today.getFullYear() === 2026 && today.getMonth() === 6) {
      return today.getDate();
    }
    return 14; // Default persis tanggal realtime saat ini (14 Juli 2026)
  });

  const holidayDays = [4, 5, 11, 12, 18, 19, 25, 26];

  const selectedDayItems = useMemo(() => {
    return jadwalBekasiData.filter(item => item.days.includes(selectedDay));
  }, [selectedDay]);

  const calendarWeeks = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null]
  ];

  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* KOP Banner Bersih Sesuai Request (Tanpa badge total & Tanpa search box) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        padding: '16px 24px',
        borderLeft: '6px solid #00A2E9',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#00A2E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
          <CalendarDays size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0, textTransform: 'uppercase' }}>
            RENCANA PEMELIHARAAN RUTIN TRANSMISI DAN GARDU INDUK (ULTG BEKASI)
          </h2>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', margin: '2px 0 0 0' }}>
            PT PLN (PERSERO) UPT BEKASI — SISTEM MANAJEMEN K3 — PERIODE JULI 2026
          </p>
        </div>
      </div>

      {/* DETAIL JADWAL HARI ITU (Cukup 1 Icon, Tanpa tombol lihat semua) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        padding: '18px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <CalendarDays size={20} color="#00A2E9" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0, textTransform: 'uppercase' }}>
            DETAIL JADWAL HARI: {selectedDay} JULI 2026 ({selectedDayItems.length} WO)
          </h3>
        </div>

        {/* Tabel Detail Rapi */}
        {selectedDayItems.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1' }}>
            <CheckCircle2 size={26} color="#10B981" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Tidak Ada Pekerjaan Terjadwal Pada Tanggal {selectedDay} Juli 2026</div>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', whiteSpace: 'normal' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', color: '#334155', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 12px', width: '45px', textAlign: 'center' }}>NO</th>
                  <th style={{ padding: '10px 12px', width: '110px' }}>LOKASI</th>
                  <th style={{ padding: '10px 12px', width: '150px' }}>BAY / PERALATAN</th>
                  <th style={{ padding: '10px 12px', width: '65px', textAlign: 'center' }}>TEG.</th>
                  <th style={{ padding: '10px 12px', width: '55px', textAlign: 'center' }}>SIFAT</th>
                  <th style={{ padding: '10px 12px', width: '110px' }}>PROGRAM HAR</th>
                  <th style={{ padding: '10px 12px', width: '140px' }}>TANGGAL & PUKUL</th>
                  <th style={{ padding: '10px 12px' }}>URAIAN PEKERJAAN</th>
                  <th style={{ padding: '10px 12px', width: '130px' }}>PELAKSANA</th>
                  <th style={{ padding: '10px 12px', width: '130px' }}>PENANGGUNG JAWAB</th>
                  <th style={{ padding: '10px 12px', width: '110px', textAlign: 'center' }}>NO. WO</th>
                </tr>
              </thead>
              <tbody>
                {selectedDayItems.map((item, index) => {
                  const isLibur = holidayDays.includes(item.days[0]);
                  return (
                    <tr 
                      key={item.id} 
                      style={{ 
                        borderBottom: '1px solid #E2E8F0',
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                      }}
                    >
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#475569' }}>{item.id}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 900, color: '#0F172A' }}>{item.lokasi}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: '#1E293B' }}>{item.bay}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: item.tegangan === '500 kV' ? '#FEF3C7' : '#E0F2FE',
                          color: item.tegangan === '500 kV' ? '#D97706' : '#0284C7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.74rem'
                        }}>
                          {item.tegangan}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#475569' }}>{item.sifat}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#334155' }}>{item.programHar}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 800, color: isLibur ? '#DC2626' : '#0F172A', fontSize: '0.8rem' }}>{item.tanggal}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>{item.pukul}</div>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                        {item.uraian}
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#334155', whiteSpace: 'pre-line' }}>{item.pelaksana}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: '#00A2E9' }}>{item.penanggungJawab}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                        {item.noWo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TABEL KALENDER JULI 2026 (Ringkas, Rapi, & Proporsional Sesuai Request) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        padding: '18px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={20} color="#00A2E9" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0, textTransform: 'uppercase' }}>
              KALENDER PEMELIHARAAN — JULI 2026
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '2px' }}></span>
              Hari Kerja Regululer
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '2px' }}></span>
              Hari Libur (Sabtu & Minggu)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#EFF6FF', border: '2px solid #2563EB', borderRadius: '2px' }}></span>
              Hari Terpilih
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px', width: '100%' }}>
          {dayNames.map((name, idx) => {
            const isWeekend = idx === 5 || idx === 6;
            return (
              <div
                key={name}
                style={{
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  backgroundColor: isWeekend ? '#FEF2F2' : '#F1F5F9',
                  color: isWeekend ? '#DC2626' : '#0F172A',
                  border: isWeekend ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {isWeekend ? `🔴 ${name}` : name}
              </div>
            );
          })}

          {calendarWeeks.map((week, wIdx) => (
            <React.Fragment key={wIdx}>
              {week.map((dayNum, dIdx) => {
                if (dayNum === null) {
                  return (
                    <div
                      key={`empty-${wIdx}-${dIdx}`}
                      style={{
                        minHeight: '82px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px dashed #E2E8F0',
                        opacity: 0.4,
                        minWidth: 0
                      }}
                    />
                  );
                }

                const isLibur = holidayDays.includes(dayNum);
                const isSelected = selectedDay === dayNum;
                const dayItems = jadwalBekasiData.filter(item => item.days.includes(dayNum));

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDay(dayNum)}
                    style={{
                      minHeight: '82px',
                      padding: '6px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#EFF6FF' : (isLibur ? '#FEF2F2' : '#FFFFFF'),
                      border: isSelected ? '2px solid #2563EB' : (isLibur ? '1px solid #FCA5A5' : '1px solid #CBD5E1'),
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.15s ease',
                      minWidth: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#2563EB' : (isLibur ? '#DC2626' : '#0F172A'),
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        flexShrink: 0
                      }}>
                        {dayNum}
                      </span>
                      {isLibur && (
                        <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
                          Libur
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 }}>
                      {dayItems.length === 0 ? (
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textAlign: 'center', marginTop: '10px' }}>
                          - Normal -
                        </div>
                      ) : (
                        <>
                          {dayItems.slice(0, 2).map(item => (
                            <div
                              key={item.id}
                              style={{
                                padding: '3px 6px',
                                borderRadius: '5px',
                                backgroundColor: '#E0F2FE',
                                borderLeft: '3px solid #00A2E9',
                                fontSize: '0.67rem',
                                fontWeight: 800,
                                color: '#0F172A',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                minWidth: 0
                              }}
                              title={`${item.lokasi} - ${item.bay}`}
                            >
                              <strong>{item.lokasi}</strong> | {item.bay.replace('BAY ', '')}
                            </div>
                          ))}
                          {dayItems.length > 2 && (
                            <div style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              color: '#2563EB',
                              backgroundColor: '#EFF6FF',
                              padding: '1px 4px',
                              borderRadius: '4px',
                              textAlign: 'center',
                              minWidth: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              + {dayItems.length - 2} WO Lainnya
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}
