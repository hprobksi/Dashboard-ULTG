import React from 'react';
import { ShieldAlert, Activity, Calendar, GitBranch, AlertTriangle, CheckCircle2, Zap, Clock, MapPin } from 'lucide-react';

export default function HargiHarjar({ mode = 'hargi', subView = 'overview' }) {
  const isHargi = mode === 'hargi';

  const hargiAnomalies = [
    { id: 'AN-GI-01', peralatan: 'Bay Trafo Daya 1 GI Bekasi', temuan: 'Suhu bushing fasa R meningkat 68°C pada beban puncak', status: 'Rencana Pemeliharaan', prioritas: 'Tinggi', tanggal: '11 Juli 2026' },
    { id: 'AN-GI-02', peralatan: 'Bay Pengantar Bekasi - Poncol #2', temuan: 'Indikasi kebocoran minor gas SF6 pada CB Bay', status: 'Dalam Investigasi', prioritas: 'Sedang', tanggal: '10 Juli 2026' },
    { id: 'AN-GI-03', peralatan: 'Kamar Baterai 110V GI Cikarang', temuan: 'Tegangan per sel sel #14 turun di bawah 2.15V', status: 'Selesai Perbaikan', prioritas: 'Sedang', tanggal: '08 Juli 2026' }
  ];

  const harjarAnomalies = [
    { id: 'AN-SUTT-01', peralatan: 'Tower #24 SUTT 150kV Bekasi - Tambun', temuan: 'Kawat pentanahan (GSW) mengalami rantas 2 urat akibat sambaran petir', status: 'Rencana Pemadaman', prioritas: 'Darurat / Tinggi', tanggal: '12 Juli 2026' },
    { id: 'AN-SUTT-02', peralatan: 'Tower #08 SUTT 150kV Bekasi - Babelan', temuan: 'Pohon rambat mendekati batas ROW jarak bebas (Clearance < 4 meter)', status: 'Eksekusi Pemangkasan', prioritas: 'Tinggi', tanggal: '11 Juli 2026' },
    { id: 'AN-SUTT-03', peralatan: 'Isolator String Tower #45 SUTET 500kV', temuan: 'Flashover minor pada piringan ke-3 saat inspeksi thermovision malam hari', status: 'Pantau Rutin', prioritas: 'Sedang', tanggal: '09 Juli 2026' }
  ];

  const currentAnomalies = isHargi ? hargiAnomalies : harjarAnomalies;

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '14px', margin: 0, letterSpacing: '-0.02em' }}>
            {isHargi ? <Activity size={34} color="#D97706" /> : <GitBranch size={34} color="#10B981" />}
            {subView.includes('program') ? (isHargi ? 'Jadwal & Program Gardu' : 'Jadwal & Program Jaringan') :
             subView.includes('anomali') ? (isHargi ? 'Anomali & Laporan Gardu' : 'Anomali & Laporan Jaringan') :
             (isHargi ? 'Overview Hargi' : 'Overview Harjar')}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ backgroundColor: isHargi ? '#FEF3C7' : '#D1FAE5', color: isHargi ? '#D97706' : '#10B981', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
            Bidang Operasional Aktif: {isHargi ? 'HARGI' : 'HARJAR'}
          </span>
        </div>
      </div>

      {subView === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="card" style={{ padding: '22px', borderLeft: isHargi ? '5px solid #D97706' : '5px solid #10B981' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {isHargi ? 'Total Bay & Trafo Daya' : 'Total Ruas & Tower SUTT/SUTET'}
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', display: 'block', marginTop: '8px' }}>
                {isHargi ? '48 Bay' : '312 Tower'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, display: 'block', marginTop: '6px' }}>✓ Semua peralatan siap operasi</span>
            </div>

            <div className="card" style={{ padding: '22px', borderLeft: '5px solid #EF4444' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Anomali Terbuka / Investigasi
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#DC2626', display: 'block', marginTop: '8px' }}>
                {currentAnomalies.filter(a => !a.status.includes('Selesai')).length} Temuan
              </span>
              <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600, display: 'block', marginTop: '6px' }}>⚠️ Dalam penanganan tim teknis</span>
            </div>

            <div className="card" style={{ padding: '22px', borderLeft: '5px solid #00A2E9' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Realisasi Program Kerja
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#00A2E9', display: 'block', marginTop: '8px' }}>
                94.2%
              </span>
              <span style={{ fontSize: '0.75rem', color: '#00A2E9', fontWeight: 600, display: 'block', marginTop: '6px' }}>📋 Sesuai jadwal Rencana Kerja Triwulan</span>
            </div>
          </div>

          {/* Quick Anomaly Table */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={22} color={isHargi ? '#D97706' : '#10B981'} /> Temuan Anomali & Tindak Lanjut {isHargi ? 'Gardu Induk' : 'Jaringan'}
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 20px' }}>ID Anomali</th>
                  <th style={{ padding: '16px' }}>Peralatan / Lokasi</th>
                  <th style={{ padding: '16px' }}>Deskripsi Temuan</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Prioritas</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Status Penanganan</th>
                </tr>
              </thead>
              <tbody>
                {currentAnomalies.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#0F172A' }}>{a.id}</td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{a.peralatan}</td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '0.88rem' }}>{a.temuan}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: a.prioritas.includes('Tinggi') ? '#FEE2E2' : '#FEF3C7',
                        color: a.prioritas.includes('Tinggi') ? '#DC2626' : '#D97706',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {a.prioritas}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: a.status.includes('Selesai') ? '#DCFCE7' : '#EFF6FF',
                        color: a.status.includes('Selesai') ? '#16A34A' : '#00A2E9',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subView === 'anomali' && (
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} color="#DC2626" /> Daftar Lengkap Anomali {isHargi ? 'Gardu Induk & Trafo Daya' : 'Jaringan Transmisi'}
          </h3>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>
            Semua temuan anomali dari hasil patroli, thermovision, dan pengujian berkala dicatat dan dipantau hingga penyelesaian akhir.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentAnomalies.map(a => (
              <div key={a.id} style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>{a.peralatan}</span>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#E2E8F0', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>{a.id}</span>
                  </div>
                  <p style={{ color: '#475569', margin: '4px 0 8px 0', fontSize: '0.92rem' }}>{a.temuan}</p>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Tanggal Temuan: {a.tanggal}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'block',
                    backgroundColor: a.status.includes('Selesai') ? '#DCFCE7' : '#EFF6FF',
                    color: a.status.includes('Selesai') ? '#16A34A' : '#00A2E9',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    marginBottom: '8px'
                  }}>
                    {a.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Prioritas: <strong style={{ color: a.prioritas.includes('Tinggi') ? '#DC2626' : '#D97706' }}>{a.prioritas}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subView === 'program' && (
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} color="#00A2E9" /> Program Kerja & Pemeliharaan Rutin {isHargi ? 'HARGI' : 'HARJAR'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <span style={{ fontSize: '0.8rem', color: '#1D4ED8', fontWeight: 700, textTransform: 'uppercase' }}>Program Bulan Ini</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E3A8A', margin: '8px 0' }}>
                {isHargi ? 'Pemeliharaan Trafo Daya #1 GI Bekasi (2 Tahunan)' : 'Patroli thermovision malam hari SUTT Bekasi - Poncol'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#1E40AF', margin: 0 }}>Jadwal eksekusi: Minggu ke-3 Juli 2026 • Tim Pelaksana: Regu Pemeliharaan {isHargi ? 'Gardu Induk' : 'Jaringan'}</p>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 700, textTransform: 'uppercase' }}>Status Keseluruhan</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#14532D', margin: '8px 0' }}>
                24 dari 26 Program Terealisasi (92.3%)
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0 }}>Kinerja pemeliharaan triwulan II memenuhi target sasaran mutu korporat PLN.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
