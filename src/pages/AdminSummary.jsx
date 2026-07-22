import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CalendarDays, Shield, Zap, TrendingUp, CheckCircle2, Clock, AlertCircle, Award, Phone, Mail, Search, UserPlus, Trash2, RefreshCw, Bell, Calendar, ShieldCheck, FileText } from 'lucide-react';
import BannerCarousel from '../components/BannerCarousel';
import JadwalKalender from '../components/JadwalKalender';
import DatabasePegawai from './DatabasePegawai';
import { getMasterPegawaiList, saveMasterPegawaiList, ALL_STANDARD_BIDANG, getAvatarUrl } from '../data/pegawaiMaster';

export default function AdminSummary({ initialSubTab = 'summary-ultg', onNavigateModule }) {
  const [subTab, setSubTab] = useState(initialSubTab);

  useEffect(() => {
    if (initialSubTab) setSubTab(initialSubTab);
  }, [initialSubTab]);

  const [pegawaiListState, setPegawaiListState] = useState(() => getMasterPegawaiList());
  const [dashboardStats, setDashboardStats] = useState({
    anomali: { count: 0, loaded: false },
    lemburan: { count: 0, loaded: false },
    logistik: { count: 0, loaded: false }
  });

  useEffect(() => {
    fetch('/api/pln-bridge/latest')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const activeAnomali = (json.data || []).filter(item => item['Status Anomali'] !== 'Selesai');
          setDashboardStats(prev => ({ ...prev, anomali: { count: activeAnomali.length, loaded: true } }));
        }
      }).catch(() => {});

    fetch('/api/lemburan/arsip')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setDashboardStats(prev => ({ ...prev, lemburan: { count: (json.data || []).length, loaded: true } }));
        }
      }).catch(() => {});

    fetch('/api/inventaris/stok')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setDashboardStats(prev => ({ ...prev, logistik: { count: (json.data || []).length, loaded: true } }));
        }
      }).catch(() => {});
  }, []);
  const [filterPegawaiBidang, setFilterPegawaiBidang] = useState('SEMUA');
  const [searchPegawai, setSearchPegawai] = useState('');
  const [viewPegawaiMode, setViewPegawaiMode] = useState('tabel');
  const [showAddPegawaiModal, setShowAddPegawaiModal] = useState(false);
  const [newPegawaiNama, setNewPegawaiNama] = useState('');
  const [newPegawaiNip, setNewPegawaiNip] = useState('');
  const [newPegawaiBidang, setNewPegawaiBidang] = useState('HARPRO');
  const [newPegawaiJabatan, setNewPegawaiJabatan] = useState('');
  const [masterLoaded, setMasterLoaded] = useState(false);
  const [masterSource, setMasterSource] = useState('local');
  const [masterStatus, setMasterStatus] = useState('');

  useEffect(() => {
    fetch('/api/master-pegawai')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPegawaiListState(json.data);
          setMasterSource(json.source || 'dashboard');
          setMasterStatus(`Master pegawai aktif: ${json.count} personil`);
        }
      })
      .catch(() => {
        setMasterStatus('Master pegawai memakai data lokal browser.');
      })
      .finally(() => setMasterLoaded(true));
  }, []);

  useEffect(() => {
    if (!masterLoaded) return;
    saveMasterPegawaiList(pegawaiListState);
    fetch('/api/master-pegawai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: pegawaiListState })
    }).catch(() => {});
  }, [pegawaiListState, masterLoaded]);

  const reloadMasterPegawaiFromExcel = async () => {
    try {
      const res = await fetch('/api/master-pegawai/reload', { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gagal reload master pegawai.');
      setPegawaiListState(json.data || []);
      setMasterSource('excel');
      setMasterStatus(`Reload sukses dari Excel: ${json.count} personil`);
    } catch (err) {
      setMasterStatus(err.message);
    }
  };

  const [jadwalList, setJadwalList] = useState([]);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // Fetch real schedule data for Banner
    fetch('/data/jadwal_pekerjaan_juli_2026.json')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((item, idx) => ({
          id: item.no || idx,
          tanggal: item.dateDates || [item.startDate], // Array of dates
          waktu: item.pukul,
          kegiatan: `${item.lokasi} - ${item.uraian}`,
          penanggungJawab: item.pelaksana,
          status: 'Terjadwal' // Default
        }));
        setJadwalList(mappedData);
      })
      .catch(err => console.error("Failed to load schedule for banner", err));
  }, []);

  // Generate dynamic news based on dashboard stats
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const dynamicNews = [
      {
        id: 1,
        date: todayStr,
        tag: 'DASHBOARD ULTG',
        title: 'Sistem Dashboard ULTG termutakhir berhasil disinkronisasi dengan master data jadwal dan logistik.'
      },
      {
        id: 2,
        date: todayStr,
        tag: 'INFO JADWAL',
        title: `Jadwal pemeliharaan dan inspeksi rutin hari ini telah diupdate secara otomatis dari Kalender Induk.`
      }
    ];
    if (dashboardStats.anomali.count > 0) {
      dynamicNews.push({
        id: 3,
        date: todayStr,
        tag: 'PERINGATAN ANOMALI',
        title: `Terdapat ${dashboardStats.anomali.count} kasus anomali aktif yang memerlukan penanganan segera.`
      });
    }
    setNewsList(dynamicNews);
  }, [dashboardStats]);

  return (
    <div style={{ padding: '16px 22px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Banner */}
      {subTab !== 'jadwal-dinas' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', backgroundColor: '#FFFFFF', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, letterSpacing: '-0.02em' }}>
              {subTab === 'summary-ultg' && <LayoutDashboard size={28} color="#00A2E9" />}
              {subTab === 'data-pegawai' && <Users size={28} color="#10B981" />}
              
              {subTab === 'summary-ultg' && 'Dashboard ULTG'}
              {subTab === 'data-pegawai' && 'Data Personil Pegawai'}
            </h1>
          </div>
        </div>
      )}

      {subTab === 'summary-ultg' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hero Banner Auto Carousel & PLN News Bar */}
          <BannerCarousel onNavigateModule={onNavigateModule} jadwalList={jadwalList} newsList={newsList} />

          {/* Executive KPI Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div className="card" style={{ padding: '16px', borderTop: '4px solid #10B981', cursor: 'pointer' }} onClick={() => setSubTab('data-pegawai')}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Data Pegawai</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10B981' }}>{pegawaiListState.length} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Orang</span></span>
                <div style={{ backgroundColor: '#D1FAE5', padding: '10px', borderRadius: '10px' }}>
                  <Users size={20} color="#10B981" />
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, display: 'block', marginTop: '6px' }}>• Master Pegawai ULTG</span>
            </div>

            <div className="card" style={{ padding: '16px', borderTop: '4px solid #D97706', cursor: 'pointer' }} onClick={() => onNavigateModule('lemburan-arsip')}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Arsip Lemburan</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{dashboardStats.lemburan.count} <span style={{ fontSize: '1rem', color: '#64748B' }}>Dokumen</span></span>
                <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '12px' }}>
                  <Clock size={24} color="#D97706" />
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600, display: 'block', marginTop: '8px' }}>• Dokumen SPP & SPL</span>
            </div>

            <div className="card" style={{ padding: '16px', borderTop: '4px solid #EF4444', cursor: 'pointer' }} onClick={() => onNavigateModule('anomali')}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Anomali Peralatan</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#EF4444' }}>{dashboardStats.anomali.count} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Kasus</span></span>
                <div style={{ backgroundColor: '#FEE2E2', padding: '10px', borderRadius: '10px' }}>
                  <AlertCircle size={20} color="#EF4444" />
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600, display: 'block', marginTop: '6px' }}>• Kasus Aktif / Open</span>
            </div>

            <div className="card" style={{ padding: '16px', borderTop: '4px solid #6366F1', cursor: 'pointer' }} onClick={() => onNavigateModule('logistik-stok')}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Stok Material Gudang</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#4F46E5' }}>{dashboardStats.logistik.count} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Item</span></span>
                <div style={{ backgroundColor: '#E0E7FF', padding: '10px', borderRadius: '10px' }}>
                  <TrendingUp size={20} color="#4F46E5" />
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600, display: 'block', marginTop: '6px' }}>• Terintegrasi Database Logistik</span>
            </div>
          </div>

          {/* Department Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} color="#00A2E9" /> Ringkasan Bidang Pemeliharaan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #00A2E9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>🔌 Pemeliharaan Proteksi (HARPRO)</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>Optimal</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '6px 0 0 0' }}>Seluruh relai proteksi bay transmisi & trafo beroperasi normal sesuai standar keandalan.</p>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #D97706' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>⚡ Pemeliharaan Gardu (HARGI)</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>Optimal</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '6px 0 0 0' }}>Pemeliharaan rutin 2 tahunan Trafo Daya sedang dilaksanakan sesuai jadwal kerja.</p>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #10B981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>🌐 Pemeliharaan Jaringan (HARJAR)</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>Inspeksi Selesai</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '6px 0 0 0' }}>Patroli rutin & thermovision transmisi SUTT 150kV Bekasi selesai tanpa temuan kritis.</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={20} color="#0EA5E9" /> Informasi Pembaruan Terbaru
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                  <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '50%' }}>
                    <Calendar size={18} color="#0EA5E9" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'block', fontSize: '0.95rem' }}>Sinkronisasi Jadwal Dinas</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', margin: '4px 0' }}>Fitur pencarian personil di SPP otomatis memfilter data personil piket hari ini sesuai jadwal.</span>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Hari ini, 08:30 WIB</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                  <div style={{ backgroundColor: '#FEF3C7', padding: '8px', borderRadius: '50%' }}>
                    <FileText size={18} color="#D97706" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'block', fontSize: '0.95rem' }}>Arsip Lemburan Tervalidasi</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', margin: '4px 0' }}>Seluruh dokumen SPP dan rekapan lemburan telah berhasil diunggah dengan status valid.</span>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Kemarin, 15:45 WIB</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ backgroundColor: '#DCFCE7', padding: '8px', borderRadius: '50%' }}>
                    <ShieldCheck size={18} color="#10B981" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'block', fontSize: '0.95rem' }}>Pemeliharaan HARPRO & HARGI</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', margin: '4px 0' }}>Pekerjaan telah mencapai progress 85% dengan peralatan normal tanpa anomali mayor.</span>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>2 Hari lalu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'data-pegawai' && (
        <DatabasePegawai />
      )}

      {subTab === 'jadwal-dinas' && <JadwalKalender />}
    </div>
  );
}
