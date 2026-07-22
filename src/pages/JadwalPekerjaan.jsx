import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Search, Filter, Upload, FileText, CheckCircle2, Clock, MapPin, Layers, RefreshCw, X, ChevronLeft, ChevronRight, AlertCircle, Eye, ShieldCheck, Briefcase, Plus, Check, Sparkles, ChevronDown } from 'lucide-react';
import { storageService } from '../services/storage';

export default function JadwalPekerjaan() {
  const [scheduleList, setScheduleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGI, setSelectedGI] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calendar Navigation State (Default: Juli 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed: 6 adalah Juli
  
  // Modals
  const [selectedDayModal, setSelectedDayModal] = useState(null); // { dateStr, dayNumber, jobs }
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState({ step: 'idle', file: null, preview: [], message: '' });
  const [toastMessage, setToastMessage] = useState(null);

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const DAYS_OF_WEEK = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Tanggal Hari Ini (untuk highlight warna khusus)
  const todayStr = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Load master data dari public/data/jadwal_pekerjaan_juli_2026.json atau storage
  const loadScheduleData = async () => {
    setIsLoading(true);
    try {
      const cached = await storageService.get('jadwal_pekerjaan_ultg_bekasi');
      if (cached && cached.length > 0) {
        setScheduleList(cached);
        setIsLoading(false);
      }

      const res = await fetch('/data/jadwal_pekerjaan_juli_2026.json');
      if (res.ok) {
        const data = await res.json();
        const bekasiOnly = data.filter(item => !item.wilayah || item.wilayah === 'ULTG BEKASI');
        setScheduleList(bekasiOnly);
        await storageService.set('jadwal_pekerjaan_ultg_bekasi', bekasiOnly);
      }
    } catch (err) {
      console.error('Gagal memuat data jadwal pekerjaan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Daftar unik Gardu Induk untuk dropdown
  const giList = useMemo(() => {
    const counts = {};
    scheduleList.forEach(item => {
      const loc = item.lokasi || 'LAINNYA';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [scheduleList]);

  // Filtered Schedule
  const filteredSchedule = useMemo(() => {
    return scheduleList.filter(item => {
      const matchGI = selectedGI === 'ALL' || item.lokasi === selectedGI;
      if (!matchGI) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (item.lokasi && item.lokasi.toLowerCase().includes(q)) ||
        (item.bay && item.bay.toLowerCase().includes(q)) ||
        (item.uraian && item.uraian.toLowerCase().includes(q)) ||
        (item.pelaksana && item.pelaksana.toLowerCase().includes(q)) ||
        (item.notif && item.notif.toLowerCase().includes(q))
      );
    });
  }, [scheduleList, selectedGI, searchQuery]);

  // Detail Jadwal Hari Ini
  const todayJobs = useMemo(() => {
    return filteredSchedule.filter(job => {
      if (Array.isArray(job.dateDates)) {
        return job.dateDates.includes(todayStr);
      }
      return job.startDate === todayStr;
    });
  }, [filteredSchedule, todayStr]);

  // Logika pembuatan Kalender Grid Bulanan (Satu Layar Full Tanpa Scroll)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Minggu

    const days = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ type: 'empty', key: `prev-${i}` });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const yyyy = currentYear;
      const mm = String(currentMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const jobsOnThisDay = filteredSchedule.filter(job => {
        if (Array.isArray(job.dateDates)) {
          return job.dateDates.includes(dateStr);
        }
        return job.startDate === dateStr;
      });

      days.push({
        type: 'day',
        dayNumber: d,
        dateStr,
        jobs: jobsOnThisDay,
        key: `day-${d}`
      });
    }

    const totalCells = days.length;
    const remainingCells = (totalCells > 35 ? 42 : 35) - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push({ type: 'empty', key: `next-${i}` });
    }

    return days;
  }, [currentYear, currentMonth, filteredSchedule]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Warna Titik / Dot berdasarkan Gardu Induk (Tema Dashboard Teal/Slate)
  const getGIDotColor = (lokasi) => {
    switch (lokasi) {
      case 'GISTET NEW TAMBUN':
      case 'TMBUN':
        return '#0F766E'; // Utama Teal Gelap
      case 'GDMKR':
        return '#14B8A6'; // Teal Terang
      case 'MRTWR':
        return '#0284C7'; // Sky Blue
      case 'RJPSI':
        return '#334155'; // Slate Gelap
      case 'CIKRG':
        return '#0EA5E9'; // Sky Terang
      case 'JBBKA':
        return '#64748B'; // Slate Sedang
      default:
        return '#94A3B8'; // Slate Pudar
    }
  };

  // Handler Import PDF Real
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportStatus({ step: 'processing', file, preview: [], message: 'Mengirim file PDF ke server untuk diekstrak...' });
    
    try {
      // Baca file sebagai Base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result.split(',')[1];
        
        try {
          const res = await fetch('/api/import-jadwal-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileBase64: base64Data, fileName: file.name })
          });
          
          const result = await res.json();
          if (res.ok && result.success) {
            setImportStatus({
              step: 'preview',
              file,
              preview: result.data,
              message: `Berhasil mengekstrak ${result.data.length} jadwal baru khusus ULTG BEKASI!`
            });
          } else {
            setImportStatus({ step: 'idle', file: null, preview: [], message: '' });
            alert('Gagal mengekstrak: ' + (result.error || 'Terjadi kesalahan'));
          }
        } catch (err) {
          setImportStatus({ step: 'idle', file: null, preview: [], message: '' });
          alert('Gagal menghubungi server.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setImportStatus({ step: 'idle', file: null, preview: [], message: '' });
      alert('Gagal membaca file lokal.');
    }
  };

  const handleConfirmImport = async () => {
    const newList = [...scheduleList, ...importStatus.preview];
    setScheduleList(newList);
    await storageService.set('jadwal_pekerjaan_ultg_bekasi', newList);
    setShowImportModal(false);
    setImportStatus({ step: 'idle', file: null, preview: [], message: '' });
    showToast('✅ Berhasil mengimpor dan menjabarkan jadwal baru ke dalam kalender web!');
  };

  return (
    <div style={{ padding: '16px 24px', height: 'calc(100vh - 71px)', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar - Ultra Minimalis & Mewah */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)' }}>
            <CalendarIcon size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <h1 style={{ fontSize: '2.15rem', fontWeight: 900, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Jadwal Pemeliharaan & Kalender Rutin
              </h1>
              <span style={{ backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', border: '1px solid #BBF7D0' }}>
                ULTG BEKASI
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Import Button */}
          <button
            onClick={() => setShowImportModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369A1'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284C7'}
          >
            <Upload size={14} />
            Import PDF
          </button>

          {/* Refresh Button */}
          <button
            onClick={loadScheduleData}
            style={{
              padding: '7px',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Refresh Data Jadwal"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>      {/* HEADER CALENDAR & DETAIL HARI INI (Compact & Superpower UI - Blue Theme) */}
      <div style={{
        marginBottom: '12px',
        background: 'linear-gradient(90deg, #4A88BD 0%, #3B72A0 100%)', // Blue Harpro theme
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(59, 114, 160, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dekorasi Background */}
        <div style={{ position: 'absolute', top: '-10px', right: '40%', opacity: 0.05, pointerEvents: 'none' }}>
          <Sparkles size={80} color="#FFFFFF" />
        </div>

        {/* Top Row: Title and Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1, flexWrap: 'wrap', gap: '8px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '6px', color: '#FFFFFF', display: 'flex' }}>
              <Briefcase size={14} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.01em' }}>
              Detail Jadwal Hari Ini
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', marginLeft: '4px' }}>
              {new Date(todayStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Month Navigation (Glassmorphism) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handlePrevMonth}
              style={{
                padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              onClick={() => { setCurrentMonth(6); setCurrentYear(2026); }}
              style={{
                padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
            >
              <CalendarIcon size={14} style={{ color: '#FFFFFF' }} />
              {MONTH_NAMES[currentMonth]} {currentYear}
            </button>

            <button
              onClick={handleNextMonth}
              style={{
                padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Jobs List */}
        <div style={{ zIndex: 1 }}>
          {todayJobs.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', width: 'fit-content' }}>
              <ShieldCheck size={14} color="#FFFFFF" /> Tidak ada jadwal pemeliharaan terdaftar untuk hari ini. Gardu Induk beroperasi normal!
            </p>
          ) : (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'thin' }}>
              {todayJobs.map((job, idx) => {
                const giColor = getGIDotColor(job.lokasi);
                return (
                  <div key={idx} style={{
                    minWidth: '260px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '10px',
                    border: '1px solid #E2E8F0',
                    borderLeft: `4px solid ${giColor}`,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: giColor, backgroundColor: `${giColor}15`, padding: '2px 6px', borderRadius: '4px' }}>
                        {job.lokasi}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {job.pukul || '08:00'}
                      </span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.uraian || job.bay}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', paddingTop: '4px' }}>
                      <MapPin size={10} color="#94A3B8" />
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{job.pelaksana || job.pj}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FULL-SCREEN CALENDAR GRID CONTAINER (Satu Layar Pas!) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden'
      }}>
        
        {/* Days of Week Header - Modern & Minimalis */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
          {DAYS_OF_WEEK.map((dayName, idx) => (
            <div key={dayName} style={{
              padding: '10px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              color: idx >= 5 ? '#DC2626' : '#475569', // Sabtu & Minggu merah/highlight
              borderRight: idx < 6 ? '1px solid #E2E8F0' : 'none',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid Boxes (Auto-scaling height agar pas 1 layar full tanpa scroll!) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: '#E2E8F0',
          gap: '1px',
          flex: 1,
          minHeight: 0
        }}>
          {calendarDays.map((cell, idx) => {
            if (cell.type === 'empty') {
              return (
                <div key={cell.key} style={{ backgroundColor: '#F8FAFC', opacity: 0.35 }} />
              );
            }

            const isWeekend = (idx % 7 === 5) || (idx % 7 === 6);
            const hasJobs = cell.jobs.length > 0;
            const isToday = cell.dateStr === todayStr;

            return (
              <div
                key={cell.key}
                onClick={() => {
                  if (hasJobs) {
                    setSelectedDayModal({
                      dateStr: cell.dateStr,
                      dayNumber: cell.dayNumber,
                      jobs: cell.jobs
                    });
                  }
                }}
                style={{
                  backgroundColor: isToday ? '#F0F9FF' : (hasJobs ? '#FFFFFF' : '#FAFAFC'),
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: hasJobs ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: isToday ? 'inset 0 0 0 2px #0284C7' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (hasJobs || isToday) {
                    e.currentTarget.style.backgroundColor = '#E0F2FE';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasJobs || isToday) {
                    e.currentTarget.style.backgroundColor = isToday ? '#F0F9FF' : (hasJobs ? '#FFFFFF' : '#FAFAFC');
                  }
                }}
              >
                {/* Date Number - Highlight Khusus untuk Hari Ini */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.84rem',
                      fontWeight: (isToday || hasJobs) ? 800 : 600,
                      color: isToday ? '#FFFFFF' : (isWeekend ? '#DC2626' : (hasJobs ? '#0F172A' : '#94A3B8')),
                      width: isToday ? '26px' : '24px',
                      height: isToday ? '26px' : '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isToday ? '#0284C7' : (hasJobs ? '#F1F5F9' : 'transparent'),
                      boxShadow: isToday ? '0 2px 6px rgba(2, 132, 199, 0.4)' : 'none'
                    }}>
                      {cell.dayNumber}
                    </span>
                    {isToday && (
                      <span style={{
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 7px',
                        borderRadius: '10px',
                        letterSpacing: '0.04em',
                        boxShadow: '0 1px 3px rgba(2, 132, 199, 0.3)'
                      }}>
                        HARI INI
                      </span>
                    )}
                  </div>
                  {hasJobs && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: isToday ? '#0284C7' : '#64748B'
                    }}>
                      {cell.jobs.length} item
                    </span>
                  )}
                </div>

                {/* Job Pills - Simpel, Elegan, & Rapi (Linear App Style) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
                  {cell.jobs.slice(0, 2).map((job, jIdx) => {
                    const dotColor = getGIDotColor(job.lokasi);
                    return (
                      <div
                        key={`${job.no}-${jIdx}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #F1F5F9',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          color: '#334155',
                          fontWeight: 600,
                          transition: 'background-color 0.1s ease',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={`${job.lokasi} - ${job.bay}: ${job.uraian}`}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor, flexShrink: 0 }} />
                        <span style={{ fontWeight: 800, color: '#0F172A', marginRight: '2px' }}>{job.lokasi}</span>
                        <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {job.bay.replace('BAY ', '')}
                        </span>
                      </div>
                    );
                  })}
                  
                  {/* Teks "+N pekerjaan lainnya" agar tidak terpotong & sangat rapi */}
                  {cell.jobs.length > 2 && (
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#0284C7',
                      paddingLeft: '4px',
                      marginTop: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      +{cell.jobs.length - 2} jadwal lainnya...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: DETAIL PEKERJAAN PER TANGGAL */}
      {selectedDayModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            border: '1px solid #CBD5E1',
            animation: 'scaleUp 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#38BDF8', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                  {selectedDayModal.dayNumber}
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    JADWAL PEKERJAAN ULTG BEKASI
                  </span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                    {DAYS_OF_WEEK[(new Date(selectedDayModal.dateStr).getDay() + 6) % 7]}, {selectedDayModal.dayNumber} {MONTH_NAMES[currentMonth]} {currentYear}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDayModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - List Pekerjaan Hari Itu */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '2px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
                  Total {selectedDayModal.jobs.length} Kegiatan Terjadwal pada Hari Ini:
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                  ⚡ Siap Dilaksanakan
                </span>
              </div>

              {selectedDayModal.jobs.map((job, idx) => {
                const dotColor = getGIDotColor(job.lokasi);
                return (
                  <div key={idx} style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderLeft: `4px solid ${dotColor}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    {/* Header Card GI & Bay */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ padding: '4px 10px', backgroundColor: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }} />
                          GI {job.lokasi}
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                          {job.bay}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '4px 10px', borderRadius: '6px' }}>
                        {job.tegangan} kV • {job.sifat ? `Sifat ${job.sifat}` : 'Rutin'}
                      </span>
                    </div>

                    {/* Rencana Waktu */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#475569', fontWeight: 600, backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 700 }}>
                        <Clock size={15} style={{ color: '#0284C7' }} /> Pukul: {job.pukul || '08.00 - 16.00 WIB'}
                      </span>
                      <span>•</span>
                      <span>Program: <strong>{job.programHar || 'Rutin 2 Tahunan'}</strong></span>
                    </div>

                    {/* Uraian Kegiatan */}
                    <div style={{ backgroundColor: '#FFF7ED', padding: '12px 14px', borderRadius: '8px', border: '1px solid #FED7AA' }}>
                      <span style={{ fontSize: '0.7rem', color: '#C2410C', fontWeight: 800, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Uraian Kegiatan / Pekerjaan:
                      </span>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#7C2D12', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                        {job.uraian}
                      </div>
                    </div>

                    {/* Footer Card: Pelaksana & WO */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '4px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>PELAKSANA & PJ</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284C7' }}>{job.pelaksana} <span style={{ color: '#64748B', fontWeight: 600 }}>({job.pj})</span></span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>NO. NOTIF / WORK ORDER</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{job.notif || '-'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button
                onClick={() => setSelectedDayModal(null)}
                style={{
                  padding: '8px 24px',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPORT JADWAL (PDF / EXCEL) */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            animation: 'scaleUp 0.15s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Upload size={24} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Import & Jabarkan Jadwal dari PDF / Excel</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Smart Auto-Parser khusus format tabel PT PLN UPT BEKASI</span>
                </div>
              </div>
              <button
                onClick={() => { setShowImportModal(false); setImportStatus({ step: 'idle', file: null, preview: [], message: '' }); }}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {importStatus.step === 'idle' && (
                <div style={{ textAlign: 'center', padding: '32px 20px', border: '2px dashed #CBD5E1', borderRadius: '16px', backgroundColor: '#F8FAFC' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <FileText size={32} />
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Unggah File Jadwal Pemeliharaan Rutin
                  </h4>
                  <p style={{ margin: '0 0 20px 0', fontSize: '0.86rem', color: '#64748B', maxWidth: '440px', marginX: 'auto', lineHeight: 1.5 }}>
                    Sistem otomatis memfilter & memisahkan pekerjaan wilayah <strong>ULTG BEKASI</strong> dari file dokumen jadwal (seperti format <code>Jadwal Pekerjaan R NR Juli.pdf</code>).
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <label style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)'
                    }}>
                      <Upload size={18} /> Import PDF Jadwal Pekerjaan
                      <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              )}

              {importStatus.step === 'processing' && (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ width: '48px', height: '48px', border: '4px solid #E0F2FE', borderTopColor: '#0284C7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Membaca & Menjabarkan Tabel PDF...</h4>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B' }}>{importStatus.message}</p>
                </div>
              )}

              {importStatus.step === 'preview' && (
                <div>
                  <div style={{ padding: '12px 16px', backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '10px', color: '#16A34A', fontWeight: 700, fontSize: '0.86rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> {importStatus.message}
                  </div>

                  <h5 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    Pratinjau Hasil Ekstraksi ({importStatus.preview.length} Baris ULTG Bekasi):
                  </h5>

                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F1F5F9', color: '#334155', fontWeight: 800 }}>
                          <th style={{ padding: '10px' }}>GI</th>
                          <th style={{ padding: '10px' }}>Bay / Peralatan</th>
                          <th style={{ padding: '10px' }}>Tanggal & Pukul</th>
                          <th style={{ padding: '10px' }}>Uraian Pekerjaan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importStatus.preview.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderTop: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '10px', fontWeight: 800, color: '#0284C7' }}>{row.lokasi}</td>
                            <td style={{ padding: '10px', fontWeight: 700 }}>{row.bay}</td>
                            <td style={{ padding: '10px' }}>{row.tanggal}</td>
                            <td style={{ padding: '10px', color: '#475569' }}>{row.uraian}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      onClick={() => setImportStatus({ step: 'idle', file: null, preview: [], message: '' })}
                      style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmImport}
                      style={{ padding: '8px 20px', backgroundColor: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={16} /> Konfirmasi & Simpan ke Kalender
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
