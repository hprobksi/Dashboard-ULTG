import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert, CheckCircle2, Calendar, Cpu, ArrowRight, Zap, AlertTriangle, Building2, Activity, Wifi, WifiOff } from 'lucide-react';
import { storageService } from '../services/storage';

export default function Overview({ setActiveTab }) {
  const [stats, setStats] = useState({
    schedulesCount: 0,
    completedSchedulesCount: 0,
    relaysCount: 0,
    openAnomaliesCount: 0
  });
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  
  const [dfrData, setDfrData] = useState([]);
  const [flData, setFlData] = useState([]);
  const [annData, setAnnData] = useState([]);

  useEffect(() => {
    const loadOverviewData = async () => {
      const allEquipments = await storageService.get('master_peralatan_ultg_bekasi') || [];
      const RELAY_KEYWORDS = [
        'RELAY', 'OCR', 'DISTANCE', 'DIFFERENTIAL', '87', '50 ', '51 ', '64', 'RECLOSE',
        'AVR', 'SBEF', 'REF', 'VOLTAGE RELAY', 'FAULT LOCATOR', 'SYNCHROCHECK'
      ];
      
      const relayEquipments = allEquipments.filter(item => {
        if (!item) return false;
        const pstVal = String(item.jenisAsset || item.pst || '').toUpperCase();
        return RELAY_KEYWORDS.some(kw => pstVal.includes(kw));
      });

      const anos = await storageService.get('anomalies') || [];
      const pkSnapshot = await storageService.get('pk_18_programs_snapshot') || [];

      let totalPk = 0;
      let completedPk = 0;

      if (Array.isArray(pkSnapshot)) {
        const allRecords = pkSnapshot.flatMap((s) => s.records || []);
        totalPk = allRecords.length;
        completedPk = allRecords.filter(r => r.done).length;
      }

      const openAnos = anos.filter(a => a.status === 'Open' || a.status === 'On Progress');

      setStats({
        schedulesCount: totalPk,
        completedSchedulesCount: completedPk,
        relaysCount: relayEquipments.length,
        openAnomaliesCount: openAnos.length
      });

      setRecentAnomalies(openAnos.slice(0, 3));

      try {
        const [dfrRes, flRes, annRes] = await Promise.all([
          fetch('/api/dfr').catch(() => null),
          fetch('/api/fl').catch(() => null),
          fetch('/api/annunciator').catch(() => null)
        ]);

        if (dfrRes && dfrRes.ok) {
          const d = await dfrRes.json();
          setDfrData(Object.values(d.devices || {}));
        }
        if (flRes && flRes.ok) {
          const f = await flRes.json();
          setFlData(Object.values(f.devices || {}));
        }
        if (annRes && annRes.ok) {
          const a = await annRes.json();
          setAnnData(Object.values(a.devices || {}));
        }
      } catch (err) {
        console.error("Error fetching monitoring data", err);
      }
    };
    loadOverviewData();
  }, []);

  const totalMonitoring = dfrData.length + flData.length + annData.length;
  const totalOnline = 
    dfrData.filter(d => d.connected).length + 
    flData.filter(f => f.connected).length + 
    annData.filter(a => a.connected).length;

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Executive Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #00A2E9 0%, #0078AE 100%)',
        borderRadius: '16px',
        padding: '32px 36px',
        color: '#FFFFFF',
        marginBottom: '28px',
        boxShadow: '0 10px 25px -5px rgba(0, 162, 233, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            backgroundColor: '#FFD100',
            color: '#0F172A',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px'
          }}>
            <Zap size={14} fill="#0F172A" /> Command Center Proteksi ULTG Bekasi
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 900, marginBottom: 0, letterSpacing: '-0.025em' }}>
            Overview Harpro
          </h1>
        </div>
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          opacity: 0.15,
          transform: 'rotate(-15deg)',
          pointerEvents: 'none'
        }}>
          <Zap size={280} color="#FFFFFF" />
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTab('program-kerja')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <Calendar size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Program Kerja</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{stats.schedulesCount > 0 ? Math.round((stats.completedSchedulesCount / stats.schedulesCount) * 100) : 0}%</h3>
            <p style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Terealisasi ({stats.completedSchedulesCount}/{stats.schedulesCount})</p>
          </div>
        </div>

        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTab('monitoring')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#00A2E9' }}>
            <Activity size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Monitoring</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{totalMonitoring} Alat</h3>
            <p style={{ fontSize: '0.75rem', color: '#00A2E9', fontWeight: 600 }}>{totalOnline} Online / Terhubung</p>
          </div>
        </div>

        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: stats.openAnomaliesCount > 0 ? '4px solid #EF4444' : '4px solid #10B981', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTab('anomali')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: stats.openAnomaliesCount > 0 ? '#FEE2E2' : '#DCFCE7', color: stats.openAnomaliesCount > 0 ? '#DC2626' : '#16A34A' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Anomali Aktif</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: stats.openAnomaliesCount > 0 ? '#DC2626' : '#16A34A' }}>
              {stats.openAnomaliesCount} Kasus
            </h3>
            <p style={{ fontSize: '0.75rem', color: stats.openAnomaliesCount > 0 ? '#DC2626' : '#10B981', fontWeight: 600 }}>
              {stats.openAnomaliesCount > 0 ? 'Memerlukan Investigasi' : 'Sistem Andal'}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setActiveTab('peralatan-relay')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F1F5F9', color: '#475569' }}>
            <Cpu size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Aset Peralatan</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{stats.relaysCount} Unit</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Terdata di Sistem</p>
          </div>
        </div>
      </div>

      {/* DFR & FL Status Tables Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* DFR Status */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="#00A2E9" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Status Peralatan DFR</h3>
            </div>
            <button onClick={() => setActiveTab('monitoring')} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Detail <ArrowRight size={14} />
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 700 }}>Peralatan (GI - Bay)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>Alarm</th>
                </tr>
              </thead>
              <tbody>
                {dfrData.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Data DFR tidak tersedia</td>
                  </tr>
                ) : (
                  dfrData.slice(0, 5).map((dfr, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== Math.min(dfrData.length, 5) - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1E293B' }}>
                        {dfr.nama_gi} <span style={{ color: '#94A3B8', fontWeight: 500 }}>{dfr.nama_bay}</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {dfr.connected ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>
                            <Wifi size={12} /> ONLINE
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '12px' }}>
                            <WifiOff size={12} /> OFFLINE
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {dfr.active_alarms && dfr.active_alarms.length > 0 ? (
                          <span style={{ color: '#EF4444', fontWeight: 700 }}>{dfr.active_alarms.length} Aktif</span>
                        ) : (
                          <span style={{ color: '#64748B' }}>Aman</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {dfrData.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: '#64748B' }}>
              Menampilkan 5 dari {dfrData.length} peralatan DFR
            </div>
          )}
        </div>

        {/* FL Status */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="#F59E0B" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Status Peralatan FL</h3>
            </div>
            <button onClick={() => setActiveTab('monitoring')} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Detail <ArrowRight size={14} />
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 700 }}>Peralatan (GI - Bay)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#475569', fontWeight: 700 }}>Fault</th>
                </tr>
              </thead>
              <tbody>
                {flData.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Data FL tidak tersedia</td>
                  </tr>
                ) : (
                  flData.slice(0, 5).map((fl, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== Math.min(flData.length, 5) - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1E293B' }}>
                        {fl.nama_gi} <span style={{ color: '#94A3B8', fontWeight: 500 }}>{fl.nama_bay}</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {fl.connected ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>
                            <Wifi size={12} /> ONLINE
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '12px' }}>
                            <WifiOff size={12} /> OFFLINE
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {fl.last_fault_distance ? (
                          <span style={{ color: '#EF4444', fontWeight: 700 }}>{fl.last_fault_distance} km</span>
                        ) : (
                          <span style={{ color: '#64748B' }}>-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {flData.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: '#64748B' }}>
              Menampilkan 5 dari {flData.length} peralatan FL
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
