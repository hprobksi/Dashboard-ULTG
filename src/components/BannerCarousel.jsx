import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bell, ShieldCheck, Zap, Award, ExternalLink, Sparkles, CalendarDays, Users } from 'lucide-react';

const defaultBanners = [
  {
    id: 1,
    badge: 'BUMN UNTUK INDONESIA',
    title: 'LINDUNGI DATA PRIBADI ANDA!',
    subtitle: 'PLN berkomitmen untuk menjaga keamanan dan privasi data pribadi pelanggan & pegawai sesuai standar Undang-Undang Perlindungan Data Pribadi serta keamanan informasi berskala nasional.',
    btnText: 'Pelajari Selengkapnya',
    bgGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.88) 0%, rgba(3, 105, 161, 0.85) 50%, rgba(7, 89, 133, 0.9) 100%), url(/dashboard-bg-1.jpg)',
    accentColor: '#FFD100',
    iconType: 'shield',
    bgImage: '/dashboard-bg-1.jpg'
  },
  {
    id: 2,
    badge: 'LIVE SCHEDULE',
    title: 'JADWAL PEKERJAAN HARI INI',
    subtitle: 'custom_jadwal', // This will trigger custom render
    btnText: 'Cek Jadwal Keseluruhan',
    bgGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.88) 0%, rgba(15, 23, 42, 0.85) 60%, rgba(37, 99, 235, 0.9) 100%), url(/dashboard-bg-2.jpg)',
    accentColor: '#38BDF8',
    iconType: 'calendar',
    bgImage: '/dashboard-bg-2.jpg'
  },
  {
    id: 3,
    badge: 'ZERO ACCIDENT & SAFETY FIRST',
    title: 'K3 & MANAJEMEN LOGISTIK PERKAP',
    subtitle: 'Optimalisasi kelancaran distribusi material gardu induk dan kelengkapan alat kerja lapangan dengan pencatatan otomatis, transparan, dan terverifikasi akurat.',
    btnText: 'Cek Stok Material Gudang',
    bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(51, 65, 85, 0.9) 100%), url(/dashboard-bg-1.jpg)',
    accentColor: '#10B981',
    iconType: 'award',
    bgImage: '/dashboard-bg-1.jpg'
  }
];

const plnNewsList = [
  {
    id: 1,
    date: '14 Juli 2026',
    tag: 'PENGUMUMAN RESMI',
    title: 'Pergantian Jadwal Pemeliharaan Gardu Induk Tambun & Harjar Bulan Juli 2026 telah diperbarui.'
  },
  {
    id: 2,
    date: '12 Juli 2026',
    tag: 'LOGISTIK PERKAP',
    title: 'Stok material baru (MCB 10A, Relay Sepam, Sarung Tangan 20kV) telah masuk ke Gudang ULTG Bekasi.'
  },
  {
    id: 3,
    date: '10 Juli 2026',
    tag: 'SISTEM IT',
    title: 'Peningkatan keamanan dan otentikasi ganda pada mode Administrator Master Stok & SPP Natura.'
  }
];

export default function BannerCarousel({ onNavigateModule, jadwalList = [], newsList = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeNewsIdx, setActiveNewsIdx] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % defaultBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentNewsList = newsList && newsList.length > 0 ? newsList : plnNewsList;

  useEffect(() => {
    const newsTimer = setInterval(() => {
      setActiveNewsIdx((prev) => (prev + 1) % currentNewsList.length);
    }, 3800);
    return () => clearInterval(newsTimer);
  }, [currentNewsList]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + defaultBanners.length) % defaultBanners.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % defaultBanners.length);
  };

  const banner = defaultBanners[currentSlide];

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Hero Banner Slide */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: banner.bgGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.35)',
          minHeight: '310px',
          display: 'flex',
          alignItems: 'center',
          padding: '28px 40px',
          color: '#FFFFFF',
          transition: 'all 0.5s ease'
        }}
      >
        {/* Background Decorative Circles */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '120px', bottom: '-80px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.07)', pointerEvents: 'none' }} />
        
        {/* Main Banner Content */}
        <div style={{ flex: 1, zIndex: 2, maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '14px', backdropFilter: 'blur(4px)' }}>
            <Sparkles size={14} color={banner.accentColor} /> {banner.badge}
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px 0', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            {banner.title}
          </h1>
          <div style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.92)', marginBottom: '22px', maxWidth: '600px' }}>
            {banner.subtitle === 'custom_jadwal' ? (() => {
              const todayStr = new Date().toISOString().split('T')[0];
              const todayJadwal = jadwalList.filter(j => 
                Array.isArray(j.tanggal) ? j.tanggal.includes(todayStr) : j.tanggal === todayStr
              );

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {todayJadwal.length > 0 ? todayJadwal.slice(0, 2).map(jadwal => (
                    <div key={jadwal.id} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>{jadwal.waktu}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: jadwal.status === 'Sedang Berjalan' ? '#10B981' : '#F59E0B' }}>{jadwal.status}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{jadwal.kegiatan}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> {jadwal.penanggungJawab}
                      </span>
                    </div>
                  )) : (
                    <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
                      Tidak ada jadwal pemeliharaan khusus untuk hari ini.
                    </div>
                  )}
                </div>
              );
            })() : (
              banner.subtitle
            )}
          </div>
          <div>
            <button
              onClick={() => {
                if (currentSlide === 1 && onNavigateModule) onNavigateModule('rekap-admin', 'jadwal-pekerjaan');
                else if (currentSlide === 2 && onNavigateModule) onNavigateModule('logistik-perkap', 'logistik-dashboard');
              }}
              style={{
                backgroundColor: '#FFD100',
                color: '#0F172A',
                border: 'none',
                padding: '12px 26px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 209, 0, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {banner.btnText} <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Right Graphic/Icon Section */}
        <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '24px' }}>
          <div style={{ width: '180px', height: '180px', borderRadius: '24px', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
            {banner.iconType === 'shield' && <ShieldCheck size={84} color="#FFD100" />}
            {banner.iconType === 'calendar' && <CalendarDays size={84} color="#38BDF8" />}
            {banner.iconType === 'award' && <Award size={84} color="#10B981" />}
            <span style={{ fontSize: '0.78rem', fontWeight: 800, marginTop: '12px', color: '#FFFFFF', letterSpacing: '0.04em' }}>PLN ULTG BEKASI</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3 }}
          title="Slide Sebelumnya"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={handleNext}
          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3 }}
          title="Slide Berikutnya"
        >
          <ChevronRight size={22} />
        </button>

        {/* Dot Indicators */}
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
          {defaultBanners.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentSlide === idx ? '#FFD100' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* PLN News Section (Below Banner exactly like hams.pln.co.id) */}
      <div style={{ marginTop: '16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#E0F2FE', color: '#0284C7', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            <Bell size={15} /> PLN News & Info
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
              {currentNewsList[activeNewsIdx]?.tag}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentNewsList[activeNewsIdx]?.title}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap', paddingLeft: '14px', borderLeft: '1px solid #E2E8F0' }}>
          📅 {currentNewsList[activeNewsIdx]?.date}
        </div>
      </div>
    </div>
  );
}
