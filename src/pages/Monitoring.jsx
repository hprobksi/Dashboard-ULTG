import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Zap, Radio, Server, Check, Clock3, AlertTriangle, Bell, RefreshCw, Trash2, LineChart as LineChartIcon, Gauge, HardDrive, WifiOff, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DcDatabase from '../components/DcDatabase';
import DcAlarmLog from '../components/DcAlarmLog';
import PqmDetailModal from '../components/PqmDetailModal';
import PqmAddModal from '../components/PqmAddModal';
import DfrCleanModal from '../components/DfrCleanModal';
import DfrAddModal from '../components/DfrAddModal';
import FlAddModal from '../components/FlAddModal';
import EditBayModal from '../components/EditBayModal';
import { Edit2 } from 'lucide-react';

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState('dc');
  const [dcSubTab, setDcSubTab] = useState('monitoring'); // 'dc', 'pqm', 'dfr', 'annunciator'

  // --- STATES ---
  const [dcStatus, setDcStatus] = useState({});
  const [giList, setGiList] = useState([]);
  const [pqmList, setPqmList] = useState([]);
  const [pqmDisturbanceEvents, setPqmDisturbanceEvents] = useState([]);
  const [pqmIticEvents, setPqmIticEvents] = useState([]);
  const [selectedPqmDevice, setSelectedPqmDevice] = useState(null);
  const [isPqmModalOpen, setIsPqmModalOpen] = useState(false);
  const [isPqmAddModalOpen, setIsPqmAddModalOpen] = useState(false);
  const [dfrList, setDfrList] = useState([]);
  const [isDfrAddModalOpen, setIsDfrAddModalOpen] = useState(false);
  const [dfrStatus, setDfrStatus] = useState({});
  const [annunciatorList, setAnnunciatorList] = useState([]);
  const [annunciatorStatus, setAnnunciatorStatus] = useState({});
  const [annGiFilter, setAnnGiFilter] = useState('');
  const [annBayFilter, setAnnBayFilter] = useState('');
  const [flList, setFlList] = useState([]);
  const [isFlAddModalOpen, setIsFlAddModalOpen] = useState(false);
  const [flStatus, setFlStatus] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [editType, setEditType] = useState('dfr');
  
  const [filterType, setFilterType] = useState('Semua');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDfrCleanModalOpen, setIsDfrCleanModalOpen] = useState(false);
  const [selectedDfrForClean, setSelectedDfrForClean] = useState(null);
  const [isFlCleanModalOpen, setIsFlCleanModalOpen] = useState(false);
  const [selectedFlForClean, setSelectedFlForClean] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [trendModalOpen, setTrendModalOpen] = useState(false);
  const [trendGiName, setTrendGiName] = useState('');
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);
  
  const openTrendModal = async (nama_gi) => {
    setTrendGiName(nama_gi);
    setTrendModalOpen(true);
    setTrendLoading(true);
    try {
      const res = await fetch(`/api/trend/${encodeURIComponent(nama_gi)}`);
      if (res.ok) {
        const data = await res.json();
        setTrendData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrendLoading(false);
    }
  };

  // --- FETCHERS ---
  const fetchDcStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/status`);
      if (!res.ok) throw new Error('Gagal memuat status DC');
      const data = await res.json();
      setDcStatus(data);
      setError('');
    } catch (err) {
      setError('Backend API tidak dapat diakses. Pastikan server Python lama berjalan.');
      console.error(err);
    }
  }, []);

  const fetchGiList = useCallback(async () => {
    try {
      const res = await fetch(`/api/gi`);
      if (!res.ok) throw new Error('Gagal memuat daftar GI');
      const data = await res.json();
      setGiList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchPqmList = useCallback(async () => {
    try {
      const res = await fetch(`/api/pqm`);
      if (!res.ok) throw new Error('Gagal memuat data PQM');
      const data = await res.json();
      setPqmList(data.devices || []);
      setPqmDisturbanceEvents(data.disturbance_events || []);
      setPqmIticEvents(data.itic_events || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchDfrList = useCallback(async () => {
    try {
      const res = await fetch(`/api/dfr`);
      if (!res.ok) throw new Error('Gagal memuat data DFR');
      const data = await res.json();
      setDfrStatus(data);
      setDfrList(data.devices || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAnnunciatorList = useCallback(async () => {
    try {
      const res = await fetch(`/api/annunciator`);
      if (!res.ok) throw new Error('Gagal memuat data Annunciator');
      const data = await res.json();
      setAnnunciatorStatus(data);
      setAnnunciatorList(Object.values(data.devices || {}));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchFlList = useCallback(async () => {
    try {
      const res = await fetch(`/api/fl`);
      if (!res.ok) throw new Error('Gagal memuat data FL');
      const data = await res.json();
      setFlStatus(data.metadata || {});
      setFlList(Object.values(data.devices || {}));
    } catch (err) {
      console.error(err);
    }
  }, []);

  // --- EFFECTS ---
  useEffect(() => {
    const loadData = () => {
      if (activeTab === 'dc') {
        fetchDcStatus();
        fetchGiList();
      } else if (activeTab === 'pqm') {
        fetchPqmList();
      } else if (activeTab === 'dfr') {
        fetchDfrList();
      } else if (activeTab === 'annunciator') {
        fetchAnnunciatorList();
      } else if (activeTab === 'fl') {
        fetchFlList();
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [activeTab, fetchDcStatus, fetchGiList, fetchPqmList, fetchDfrList, fetchAnnunciatorList, fetchFlList]);

  const forceRefresh = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dc') {
        await fetchDcStatus();
        await fetchGiList();
      } else if (activeTab === 'pqm') {
        await fetchPqmList();
      } else if (activeTab === 'dfr') {
        const res = await fetch('/api/dfr/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setDfrStatus(data);
          setDfrList(data.devices || []);
          setRefreshKey(prev => prev + 1); // Memaksa animasi garis untuk reset
        }
      } else if (activeTab === 'annunciator') {
        const res = await fetch('/api/annunciator/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setAnnunciatorStatus(data);
          setAnnunciatorList(Object.values(data.devices || {}));
          setRefreshKey(prev => prev + 1);
        }
      } else if (activeTab === 'fl') {
        const res = await fetch('/api/fl');
        if (res.ok) {
          const data = await res.json();
          setFlStatus(data.metadata || {});
          setFlList(Object.values(data.devices || {}));
          setRefreshKey(prev => prev + 1);
        }
      }
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBayName = async (device, newName) => {
    try {
      const endpoint = editType === 'fl' ? `/api/fl/devices/${device.id}` : `/api/dfr/devices/${device.id}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_bay: newName })
      });
      if (res.ok) {
        if (editType === 'fl') {
          await fetchFlList();
        } else {
          const fetchRes = await fetch('/api/dfr/refresh', { method: 'POST' });
          if (fetchRes.ok) {
            const data = await fetchRes.json();
            setDfrStatus(data);
            setDfrList(data.devices || []);
          }
        }
        setEditModalOpen(false);
      } else {
        const data = await res.json();
        setError(data.detail || 'Gagal menyimpan perubahan');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteFl = async (device) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus peralatan ${device.nama_gi} - ${device.nama_bay}?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/fl/devices/${device.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchFlList();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || 'Gagal menghapus peralatan');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus peralatan');
    }
  };

  const handleOpenPqmModal = (device) => {
    setSelectedPqmDevice(device);
    setIsPqmModalOpen(true);
  };

  const togglePqmPolling = async (deviceId, enabled) => {
    try {
      const res = await fetch(`/api/pqm/${deviceId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (res.ok) {
        const data = await res.json();
        setPqmList(data.devices || []);
        if (selectedPqmDevice && selectedPqmDevice.id === deviceId) {
          const updatedDevice = data.devices.find(d => d.id === deviceId);
          if (updatedDevice) setSelectedPqmDevice(updatedDevice);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAutoPolling = async () => {
    try {
      const isAuto = dcStatus?.auto_polling_active;
      const endpoint = isAuto ? '/api/stop' : '/api/start';
      await fetch(endpoint, { method: 'POST' });
      forceRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return '--';
    return Number(val).toFixed(2);
  };

  // --- DC FILTER LOGIC ---
  const dcDataList = dcStatus?.data || [];
  const filteredDcCards = dcDataList.filter(gi => {
    if (filterType === 'Semua') return true;
    if (filterType === 'Online') return gi.status === 'online';
    if (filterType === 'Offline') return gi.status !== 'online';
    if (filterType === 'Alarm') return gi.alarm_level === 'warning' || gi.alarm_level === 'critical';
    return true;
  });
  const activeDcCount = dcDataList.filter(g => g.status === 'online').length;

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100%' }}>
      
      {/* Header Halaman */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={28} color="#00A2E9" />
          Dashboard Monitoring Proteksi
        </h1>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
          Pusat pantauan data sistem kelistrikan, meliputi catu daya DC, Power Quality, DFR, dan Alarm Center.
        </p>
      </div>

      {/* Navigasi Tab Internal */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        backgroundColor: '#FFFFFF',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('dc')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: activeTab === 'dc' ? '#00A2E9' : 'transparent',
            color: activeTab === 'dc' ? '#FFFFFF' : '#64748B'
          }}
        >
          <Zap size={18} /> DC Monitoring
        </button>

        <button
          onClick={() => setActiveTab('pqm')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: activeTab === 'pqm' ? '#00A2E9' : 'transparent',
            color: activeTab === 'pqm' ? '#FFFFFF' : '#64748B'
          }}
        >
          <Activity size={18} /> PQM
        </button>

        <button
          onClick={() => setActiveTab('dfr')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: activeTab === 'dfr' ? '#00A2E9' : 'transparent',
            color: activeTab === 'dfr' ? '#FFFFFF' : '#64748B'
          }}
        >
          <Radio size={18} /> DFR
        </button>

        <button
          onClick={() => setActiveTab('fl')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: activeTab === 'fl' ? '#00A2E9' : 'transparent',
            color: activeTab === 'fl' ? '#FFFFFF' : '#64748B'
          }}
        >
          <Radio size={18} /> FL
        </button>

        <button
          onClick={() => setActiveTab('annunciator')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: activeTab === 'annunciator' ? '#EF4444' : 'transparent',
            color: activeTab === 'annunciator' ? '#FFFFFF' : '#64748B'
          }}
        >
          <Bell size={18} /> Alarm Center
        </button>
      </div>

      {/* Konten Area Berdasarkan Tab */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '16px', 
        padding: '30px', 
        minHeight: '400px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        border: '1px solid #F1F5F9'
      }}>
        
        {/* === TAMPILAN DC MONITORING === */}
        {activeTab === 'dc' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                Sistem Suplai DC Proteksi
                
                <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '4px', gap: '4px' }}>
                  <button 
                    onClick={() => setDcSubTab('monitoring')}
                    style={{ padding: '6px 12px', backgroundColor: dcSubTab === 'monitoring' ? '#FFFFFF' : 'transparent', color: dcSubTab === 'monitoring' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: dcSubTab === 'monitoring' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  >
                    Monitoring
                  </button>
                  <button 
                    onClick={() => setDcSubTab('database')}
                    style={{ padding: '6px 12px', backgroundColor: dcSubTab === 'database' ? '#FFFFFF' : 'transparent', color: dcSubTab === 'database' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: dcSubTab === 'database' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  >
                    Database Konfigurasi
                  </button>
                  <button 
                    onClick={() => setDcSubTab('alarms')}
                    style={{ padding: '6px 12px', backgroundColor: dcSubTab === 'alarms' ? '#FFFFFF' : 'transparent', color: dcSubTab === 'alarms' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: dcSubTab === 'alarms' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  >
                    Riwayat Alarm
                  </button>
                </div>
              </h2>
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#F8FAFC', padding: '10px 20px', borderRadius: '30px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} color="#00A2E9" /> Status: <span style={{ color: '#0F172A', fontWeight: 800 }}>{dcStatus?.is_scanning ? 'Memindai...' : 'Siap'}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={16} /> Total GI: <span style={{ color: '#0F172A', fontWeight: 800 }}>{giList.length}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#10B981" /> Online: <span style={{ color: '#0F172A', fontWeight: 800 }}>{activeDcCount}</span></div>
              </div>
            </div>
            
            {dcSubTab === 'database' ? (
              <DcDatabase forceRefresh={forceRefresh} />
            ) : dcSubTab === 'alarms' ? (
              <DcAlarmLog />
            ) : (
            <>

            {error && (
              <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            {/* Filter & Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '12px', marginBottom: dcStatus?.auto_polling_active ? '12px' : '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {['Semua', 'Alarm', 'Online', 'Offline'].map((item) => (
                  <button key={item} onClick={() => setFilterType(item)}
                    style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: filterType === item ? '#0F172A' : '#FFFFFF', color: filterType === item ? '#FFFFFF' : '#64748B', boxShadow: filterType === item ? '0 4px 6px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)' }}
                  >{item}</button>
                ))}
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginLeft: '10px' }}>
                  Menampilkan {filteredDcCards.length} dari {giList.length} GI
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={toggleAutoPolling} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: dcStatus?.auto_polling_active ? '#EF4444' : '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Activity size={16} /> {dcStatus?.auto_polling_active ? 'Stop Polling' : 'Auto Polling'}
                </button>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>
            </div>


            {/* Auto Polling Timer Line */}
            {dcStatus?.auto_polling_active && (
              <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: 'timerLine 10s linear infinite' }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}

            {/* Grid Kartu GI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredDcCards.length > 0 ? (
                filteredDcCards.map((gi) => (
                  <div key={gi.nama} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: `2px solid ${gi.alarm_level === 'critical' ? '#EF4444' : gi.alarm_level === 'warning' ? '#F59E0B' : '#E2E8F0'}`, padding: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Server size={18} color="#00A2E9" /> {gi.nama}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>IP: {gi.ip}</p>
                      </div>
                      <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: gi.status === 'online' ? '#DCFCE7' : '#F1F5F9', color: gi.status === 'online' ? '#16A34A' : '#94A3B8' }}>
                        {gi.status || 'offline'}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '10px' }}><p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#0369A1', fontWeight: 700 }}>TEGANGAN (V_PN)</p><p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>{gi.status === 'online' ? formatNumber(gi.v_pn) : '--'} <span style={{ fontSize: '0.9rem' }}>V</span></p></div>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px' }}><p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ARUS</p><p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>{gi.status === 'online' ? formatNumber(gi.arus) : '--'} <span style={{ fontSize: '0.9rem' }}>A</span></p></div>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px' }}><p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>V_PG</p><p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>{gi.status === 'online' ? formatNumber(gi.v_pg) : '--'} <span style={{ fontSize: '0.8rem' }}>V</span></p></div>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px' }}><p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>V_NG</p><p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>{gi.status === 'online' ? formatNumber(gi.v_ng) : '--'} <span style={{ fontSize: '0.8rem' }}>V</span></p></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '10px', borderRadius: '8px', fontWeight: 600, flex: 1, marginRight: '10px' }}>
                        {gi.status_message || 'Belum ada data polling DC.'}
                      </div>
                      <button 
                        onClick={() => openTrendModal(gi.nama)}
                        title="Lihat Trend Grafik"
                        style={{ padding: '10px', backgroundColor: '#F0F9FF', color: '#0EA5E9', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E0F2FE'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0F9FF'; }}
                      >
                        <LineChartIcon size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
                  <Gauge size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#0F172A', fontSize: '1.2rem', margin: '0 0 8px 0' }}>Tidak ada data</h3>
                </div>
              )}
            </div>
            </>
            )}
          </div>
        )}

        {/* === TAMPILAN PQM === */}
        {activeTab === 'pqm' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Data Power Quality Monitor (PQM)</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsPqmAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Server size={16} /> Tambah Peralatan
                </button>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {pqmList.length > 0 ? (
                pqmList.map((dev, idx) => (
                  <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '2px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{dev.nama_gi}</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#00A2E9', fontWeight: 700 }}>{dev.nama_bay}</p>
                      </div>
                      <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: dev.connected ? '#DCFCE7' : '#FEE2E2', color: dev.connected ? '#16A34A' : '#EF4444' }}>
                        {dev.connected ? 'CONNECTED' : 'OFFLINE'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                      <span style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>IP: {dev.ip}</span>
                      <span style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Tipe: {dev.pqm_type}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#0369A1', fontWeight: 700 }}>TEGANGAN (Vln)</p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0284C7' }}>R: {dev.connected ? formatNumber(dev.v_an) : '--'} <span style={{ fontSize: '0.8rem' }}>V</span></p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0284C7' }}>S: {dev.connected ? formatNumber(dev.v_bn) : '--'} <span style={{ fontSize: '0.8rem' }}>V</span></p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0284C7' }}>T: {dev.connected ? formatNumber(dev.v_cn) : '--'} <span style={{ fontSize: '0.8rem' }}>V</span></p>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ARUS (I)</p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>R: {dev.connected ? formatNumber(dev.current_a) : '--'} <span style={{ fontSize: '0.8rem' }}>A</span></p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>S: {dev.connected ? formatNumber(dev.current_b) : '--'} <span style={{ fontSize: '0.8rem' }}>A</span></p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>T: {dev.connected ? formatNumber(dev.current_c) : '--'} <span style={{ fontSize: '0.8rem' }}>A</span></p>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>DAYA AKTIF & FREK</p>
                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>{dev.connected ? formatNumber(dev.kw_total) : '--'} <span style={{ fontSize: '0.8rem' }}>kW</span></p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 700, color: '#64748B' }}>{dev.connected ? formatNumber(dev.freq) : '--'} <span style={{ fontSize: '0.8rem' }}>Hz</span></p>
                      </div>
                      <div style={{ backgroundColor: dev.new_disturbance_count > 0 ? '#FEF2F2' : '#F8FAFC', padding: '12px', borderRadius: '10px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: dev.new_disturbance_count > 0 ? '#DC2626' : '#64748B', fontWeight: 700 }}>GANGGUAN BARU</p>
                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: dev.new_disturbance_count > 0 ? '#EF4444' : '#334155' }}>{dev.new_disturbance_count || 0} <span style={{ fontSize: '0.8rem' }}>Event</span></p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: dev.connected ? '#334155' : '#EF4444', backgroundColor: dev.connected ? '#F8FAFC' : '#FEF2F2', padding: '12px', borderRadius: '8px', fontWeight: 600, flex: 1, marginRight: '10px' }}>
                        {dev.status_message || (dev.connected ? 'Beroperasi Normal' : 'Koneksi gagal')}
                      </div>
                      <button 
                        onClick={() => handleOpenPqmModal(dev)}
                        style={{ padding: '10px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        Detail Lengkap
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
                  <Activity size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#0F172A', fontSize: '1.2rem', margin: '0 0 8px 0' }}>Belum ada data PQM</h3>
                  <p style={{ color: '#64748B', margin: 0 }}>Pastikan perangkat ION/SATEC terhubung ke jaringan.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === TAMPILAN DFR === */}
        {activeTab === 'dfr' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Data Digital Fault Recorder (DFR)</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsDfrAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Server size={16} /> Tambah Peralatan
                </button>
                <button onClick={() => setIsDfrCleanModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Trash2 size={16} /> Clean Memory
                </button>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '12px', marginBottom: dfrStatus?.auto_polling_active ? '12px' : '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  Menampilkan {dfrList.length} DFR | Interval Polling: {dfrStatus?.poll_interval_seconds || '--'} detik
                </span>
              </div>
            </div>

            {/* Auto Polling Timer Line */}
            {dfrStatus?.auto_polling_active && (
              <div key={refreshKey} style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${dfrStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {dfrList.length > 0 ? (
                dfrList.map((dev, idx) => (
                  <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '2px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{dev.nama_gi}</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{dev.nama_bay} <button onClick={() => { setEditDevice(dev); setEditType('dfr'); setEditModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: '6px' }}><Edit2 size={14} color="#64748B" /></button></p>
                      </div>
                      <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: dev.connected ? '#DCFCE7' : '#FEE2E2', color: dev.connected ? '#16A34A' : '#EF4444' }}>
                        {dev.connected ? 'ONLINE' : 'OFFLINE'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                      <span style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>IP: {dev.ip}</span>
                      <span style={{ backgroundColor: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{dev.merk_tipe}</span>
                    </div>

                    {dev.connected && (dev.ram?.used_percent != null || (dev.storage && dev.storage.length > 0)) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dev.ram?.used_percent != null && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={14} /> RAM Usage</span>
                              <span style={{ color: dev.ram.used_percent >= 90 ? '#EF4444' : dev.ram.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>{formatNumber(dev.ram.used_percent)}%</span>
                            </div>
                            <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${Math.min(100, Math.max(0, dev.ram.used_percent))}%`, 
                                backgroundColor: dev.ram.used_percent >= 90 ? '#EF4444' : dev.ram.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                                height: '100%' 
                              }}></div>
                            </div>
                          </div>
                        )}
                        
                        {dev.storage && dev.storage.length > 0 && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              <HardDrive size={14} /> Storage Usage
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dev.storage.map((disk, dIdx) => (
                                <div key={dIdx}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                                    <span>{disk.mount}</span>
                                    <span style={{ color: disk.used_percent >= 90 ? '#EF4444' : disk.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>{formatNumber(disk.used_percent)}%</span>
                                  </div>
                                  <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ 
                                      width: `${Math.min(100, Math.max(0, disk.used_percent))}%`, 
                                      backgroundColor: disk.used_percent >= 90 ? '#EF4444' : disk.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                                      height: '100%' 
                                    }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <HardDrive size={16} color="#64748B"/>
                           <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{dev.kondisi_peralatan || 'Normal'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
                  <Radio size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#0F172A', fontSize: '1.2rem', margin: '0 0 8px 0' }}>Belum ada data DFR</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === TAMPILAN ANNUNCIATOR === */}

        {activeTab === 'fl' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Data Digital Fault Recorder (FL)</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsFlAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Server size={16} /> Tambah Peralatan
                </button>
                <button onClick={() => setIsFlCleanModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Trash2 size={16} /> Clean Memory
                </button>
                <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#00A2E9', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '12px', marginBottom: flStatus?.auto_polling_active ? '12px' : '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  Menampilkan {flList.length} FL | Interval Polling: {flStatus?.poll_interval_seconds || '--'} detik
                </span>
              </div>
            </div>

            {/* Auto Polling Timer Line */}
            {flStatus?.auto_polling_active && (
              <div key={refreshKey} style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#00A2E9', animation: `timerLine ${flStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {flList.length > 0 ? (
                flList.map((dev, idx) => (
                  <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '2px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{dev.nama_gi}</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{dev.nama_bay} 
                          <button onClick={() => { setEditDevice(dev); setEditType('fl'); setEditModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: '6px' }} title="Edit"><Edit2 size={14} color="#64748B" /></button>
                          <button onClick={() => handleDeleteFl(dev)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: '2px' }} title="Hapus"><Trash2 size={14} color="#EF4444" /></button>
                        </p>
                      </div>
                      <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: dev.connected ? '#DCFCE7' : '#FEE2E2', color: dev.connected ? '#16A34A' : '#EF4444' }}>
                        {dev.connected ? 'ONLINE' : 'OFFLINE'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                      <span style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>IP: {dev.ip}</span>
                      <span style={{ backgroundColor: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{dev.merk_tipe}</span>
                    </div>

                    {dev.connected && (dev.ram?.used_percent != null || (dev.storage && dev.storage.length > 0)) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dev.ram?.used_percent != null && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={14} /> RAM Usage</span>
                              <span style={{ color: dev.ram.used_percent >= 90 ? '#EF4444' : dev.ram.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>{formatNumber(dev.ram.used_percent)}%</span>
                            </div>
                            <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${Math.min(100, Math.max(0, dev.ram.used_percent))}%`, 
                                backgroundColor: dev.ram.used_percent >= 90 ? '#EF4444' : dev.ram.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                                height: '100%' 
                              }}></div>
                            </div>
                          </div>
                        )}
                        
                        {dev.storage && dev.storage.length > 0 && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              <HardDrive size={14} /> Storage Usage
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dev.storage.map((disk, dIdx) => (
                                <div key={dIdx}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                                    <span>{disk.mount}</span>
                                    <span style={{ color: disk.used_percent >= 90 ? '#EF4444' : disk.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>{formatNumber(disk.used_percent)}%</span>
                                  </div>
                                  <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ 
                                      width: `${Math.min(100, Math.max(0, disk.used_percent))}%`, 
                                      backgroundColor: disk.used_percent >= 90 ? '#EF4444' : disk.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                                      height: '100%' 
                                    }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <HardDrive size={16} color="#64748B"/>
                           <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{dev.kondisi_peralatan || 'Normal'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
                  <Radio size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#0F172A', fontSize: '1.2rem', margin: '0 0 8px 0' }}>Belum ada data FL</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === TAMPILAN ANNUNCIATOR === */}

        {activeTab === 'annunciator' && (
          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell color="#EF4444" size={24} /> Alarm Center (Annunciator)
              </h2>
              <button onClick={forceRefresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <RefreshCw size={16} /> Refresh Data
              </button>
            </div>

            {/* Auto Polling Timer Line */}
            {annunciatorStatus?.auto_polling_active && (
              <div key={refreshKey} style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#EF4444', animation: `timerLine ${annunciatorStatus?.poll_interval_seconds || 10}s linear infinite` }} />
                <style>{`@keyframes timerLine { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
              </div>
            )}

            {(() => {
              const annGis = [...new Set(annunciatorList.map(a => a.source_name))].filter(Boolean);
              const annBays = [...new Set(annunciatorList.filter(a => !annGiFilter || a.source_name === annGiFilter).map(a => a.bay_name))].filter(Boolean);
              
              const filteredAnnunciators = annunciatorList.filter(a => {
                const matchGi = !annGiFilter || a.source_name === annGiFilter;
                const matchBay = !annBayFilter || a.bay_name === annBayFilter;
                return matchGi && matchBay;
              });

              const allActiveAlarms = filteredAnnunciators.flatMap(ann => 
                (ann.active_alarms || []).map(alarm => ({
                  gi: ann.source_name,
                  bay: ann.bay_name,
                  ...alarm
                }))
              );

              return (
                <>
                  {/* Alarm Aktif Cards */}
                  {allActiveAlarms.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={20} /> Alarm Aktif Saat Ini
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {allActiveAlarms.map((alarm, idx) => (
                          <div key={idx} style={{ padding: '16px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>{alarm.gi} - {alarm.bay}</div>
                            <div style={{ fontSize: '0.9rem', color: '#B91C1C', fontWeight: 600 }}>Port {alarm.port}: {alarm.nama_alat} {alarm.flag ? `(${alarm.flag})` : ''}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Filter Gardu Induk (GI)</label>
                      <select value={annGiFilter} onChange={(e) => { setAnnGiFilter(e.target.value); setAnnBayFilter(''); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}>
                        <option value="">Semua GI</option>
                        {annGis.map(gi => <option key={gi} value={gi}>{gi}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Filter Bay</label>
                      <select value={annBayFilter} onChange={(e) => setAnnBayFilter(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }} disabled={!annGiFilter}>
                        <option value="">Semua Bay</option>
                        {annBays.map(bay => <option key={bay} value={bay}>{bay}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Content View */}
                  {(() => {
                    const isPanelView = annGiFilter && annBayFilter;
                    
                    if (filteredAnnunciators.length === 0) {
                      return (
                        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #CBD5E1' }}>
                          <Bell size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                          <h3 style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '1.2rem', fontWeight: 700 }}>Tidak ada data annunciator ditemukan</h3>
                          <p style={{ color: '#64748B', margin: 0 }}>Silakan sesuaikan filter GI atau Bay Anda.</p>
                        </div>
                      );
                    }

                    if (isPanelView) {
                      // TAMPILAN PANEL ALARM (GRID)
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          {filteredAnnunciators.map((ann, idx) => {
                            const mappingKeys = Object.keys(ann.qualitrol_mapping || {});
                            const hasMapping = mappingKeys.length > 0;
                            const hasChannels = ann.channels && ann.channels.length > 0;
                            const activePorts = (ann.active_alarms || []).map(a => String(a.port));

                            let displayPorts = [];
                            if (hasMapping) {
                              displayPorts = mappingKeys.map(portStr => ({
                                portStr: portStr,
                                name: ann.qualitrol_mapping[portStr]
                              }));
                            } else if (hasChannels) {
                              displayPorts = ann.channels.map(ch => ({
                                portStr: String(ch.port),
                                name: ch.nama_alat || `Port ${ch.port}`
                              }));
                            } else {
                              displayPorts = Array.from({ length: 64 }, (_, i) => ({
                                portStr: String(i + 1),
                                name: `Alarm Port ${i + 1}`
                              }));
                            }

                            // Filter out "spare"
                            displayPorts = displayPorts.filter(p => !p.name.toLowerCase().includes('spare'));

                            return (
                              <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #F8FAFC', paddingBottom: '16px' }}>
                                  <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>PANEL ANNUNCIATOR</h3>
                                    <p style={{ margin: 0, fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>{ann.source_name} - {ann.bay_name}</p>
                                  </div>
                                  <div style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: ann.connected ? '#DCFCE7' : '#F1F5F9', color: ann.connected ? '#16A34A' : '#94A3B8' }}>
                                    {ann.connected ? 'ONLINE' : 'OFFLINE'}
                                  </div>
                                </div>
                                
                                <style>
                                  {`
                                    @keyframes blinkRedDashboard {
                                      0% { background-color: #EF4444; color: white; border-color: #B91C1C; box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4); }
                                      50% { background-color: #FEF2F2; color: #EF4444; border-color: #FCA5A5; box-shadow: 0 4px 8px rgba(239, 68, 68, 0.1); }
                                      100% { background-color: #EF4444; color: white; border-color: #B91C1C; box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4); }
                                    }
                                  `}
                                </style>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                                  {displayPorts.map(portObj => {
                                    const portStr = portObj.portStr;
                                    const name = portObj.name;
                                    const isActive = activePorts.includes(portStr);
                                    
                                    return (
                                      <div key={portStr} style={{
                                        position: 'relative',
                                        padding: '16px 12px',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        fontWeight: 800,
                                        border: isActive ? '2px solid #B91C1C' : '1px solid #E2E8F0',
                                        backgroundColor: isActive ? '#EF4444' : '#FFFFFF',
                                        color: isActive ? '#FFFFFF' : '#334155',
                                        animation: isActive ? 'blinkRedDashboard 1s ease-in-out infinite' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '90px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isActive ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)'
                                      }}>
                                        <span style={{ 
                                          position: 'absolute', 
                                          top: '8px', 
                                          left: '10px', 
                                          fontSize: '0.7rem', 
                                          fontWeight: 900, 
                                          opacity: isActive ? 0.9 : 0.4, 
                                          color: isActive ? '#FFFFFF' : '#64748B' 
                                        }}>{portStr}</span>
                                        <span style={{ 
                                          lineHeight: '1.3', 
                                          fontSize: '0.95rem',
                                          marginTop: '4px'
                                        }}>{name}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // JIKA TIDAK ADA FILTER YANG DIPILIH (ATAU BELUM LENGKAP)
                    return (
                      <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0', marginTop: '20px' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: '#EFF6FF', marginBottom: '16px' }}>
                          <Bell size={40} color="#3B82F6" />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '1.25rem', fontWeight: 800 }}>Pilih Filter GI & Bay</h3>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                          Silakan pilih Gardu Induk dan Bay pada menu filter di atas untuk menampilkan detail Panel Annunciator.
                        </p>
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>
        )}

      </div>

      <PqmAddModal 
        isOpen={isPqmAddModalOpen} 
        onClose={() => setIsPqmAddModalOpen(false)} 
        onAddSuccess={(updatedList) => {
          setPqmList(updatedList);
        }} 
      />

      <DfrAddModal 
        isOpen={isDfrAddModalOpen} 
        onClose={() => setIsDfrAddModalOpen(false)} 
        onAddSuccess={(updatedList) => {
          setDfrList(updatedList);
        }} 
      />

      <DfrCleanModal 
        isOpen={isDfrCleanModalOpen} 
        onClose={() => { setIsDfrCleanModalOpen(false); setSelectedDfrForClean(null); }} 
        selectedDeviceInitial={selectedDfrForClean}
        deviceList={dfrList}
        deviceType="dfr"
      />

      <FlAddModal 
        isOpen={isFlAddModalOpen} 
        onClose={() => setIsFlAddModalOpen(false)} 
        onAddSuccess={(updatedList) => {
          setFlList(updatedList);
        }} 
      />

      <DfrCleanModal 
        isOpen={isFlCleanModalOpen} 
        onClose={() => { setIsFlCleanModalOpen(false); setSelectedFlForClean(null); }} 
        selectedDeviceInitial={selectedFlForClean}
        deviceList={flList}
        deviceType="fl"
      />

      {trendModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '800px', height: '80%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Trend Grafik - {trendGiName}</h3>
              <button onClick={() => setTrendModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748B" /></button>
            </div>
            <div style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: '#0F172A' }}>Trend {trendGiName}</h2>
              {trendLoading ? (
                <p>Memuat data...</p>
              ) : trendData.length > 0 ? (
                <div style={{ width: '100%', height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="waktu" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#0EA5E9" />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#F59E0B" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="v_pn" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Teg P-N (V)" />
                      <Line yAxisId="left" type="monotone" dataKey="v_pg" stroke="#10B981" strokeWidth={2} dot={false} name="Teg P-G (V)" />
                      <Line yAxisId="left" type="monotone" dataKey="v_ng" stroke="#EF4444" strokeWidth={2} dot={false} name="Teg N-G (V)" />
                      <Line yAxisId="right" type="monotone" dataKey="arus" stroke="#F59E0B" strokeWidth={2} dot={false} name="Arus (A)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p>Tidak ada data trend.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PQM */}
      <PqmDetailModal 
        isOpen={isPqmModalOpen} 
        onClose={() => setIsPqmModalOpen(false)} 
        device={selectedPqmDevice} 
        iticEvents={pqmIticEvents.filter(e => e.device_id === selectedPqmDevice?.id)}
        disturbanceEvents={pqmDisturbanceEvents.filter(e => e.device_id === selectedPqmDevice?.id)}
        onTogglePolling={togglePqmPolling}
      />
      <EditBayModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        device={editDevice}
        onSave={handleSaveBayName}
      />
    </div>
  );
}
