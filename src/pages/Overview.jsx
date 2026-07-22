import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert, CheckCircle2, Calendar, Cpu, ArrowRight, Zap, AlertTriangle, Building2, MapPin, Users } from 'lucide-react';
import { storageService } from '../services/storage';

export default function Overview({ setActiveTab }) {
  const [stats, setStats] = useState({
    substationsCount: 0,
    schedulesCount: 0,
    relaysCount: 0,
    openAnomaliesCount: 0
  });
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  useEffect(() => {
    const loadOverviewData = async () => {
      const subs = await storageService.get('substations');
      const schs = await storageService.get('schedules');
      const rels = await storageService.get('relays');
      const anos = await storageService.get('anomalies');

      const openAnos = anos.filter(a => a.status === 'Open' || a.status === 'On Progress');

      setStats({
        substationsCount: subs.length,
        schedulesCount: schs.length,
        relaysCount: rels.length,
        openAnomaliesCount: openAnos.length
      });

      setRecentAnomalies(openAnos.slice(0, 3));
      setUpcomingSchedules(schs.filter(s => s.status !== 'Completed').slice(0, 3));
    };
    loadOverviewData();
  }, []);

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

        {/* Decorative Grid Watermark */}
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
        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#00A2E9' }}>
            <Building2 size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Gardu Induk</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{stats.substationsCount} Unit GI</h3>
            <p style={{ fontSize: '0.75rem', color: '#00A2E9', fontWeight: 600 }}>Tegangan Operasi 150kV</p>
          </div>
        </div>

        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <Calendar size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Program Kerja</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{stats.schedulesCount} Agenda</h3>
            <p style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Pemeliharaan Rutin</p>
          </div>
        </div>

        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F1F5F9', color: '#475569' }}>
            <Cpu size={28} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Aset Relay Terdata</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{stats.relaysCount} Unit</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Terhubung SCADA/IP</p>
          </div>
        </div>

        <div className="card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: stats.openAnomaliesCount > 0 ? '4px solid #EF4444' : '4px solid #10B981' }}>
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
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Urgent Anomalies */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#EF4444" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Alarm & Anomali Aktif</h3>
            </div>
            <button onClick={() => setActiveTab('anomali')} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentAnomalies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                <CheckCircle2 size={44} color="#10B981" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Sistem Proteksi Normal</p>
                <p style={{ fontSize: '0.8rem' }}>Seluruh catatan anomali peralatan telah terselesaikan.</p>
              </div>
            ) : (
              recentAnomalies.map((ano) => (
                <div key={ano.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00A2E9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={15} /> {ano.substation}
                    </span>
                    <span className={`badge badge-${ano.status.toLowerCase()}`}>{ano.status}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
                    {ano.equipment} ({ano.bay})
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                    "{ano.indication}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Harpro Schedules */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color="#00A2E9" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Agenda Program Kerja Terdekat</h3>
            </div>
            <button onClick={() => setActiveTab('program-kerja')} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Kalender Kerja <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingSchedules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                <p style={{ fontSize: '0.95rem' }}>Belum ada jadwal pemeliharaan terdekat.</p>
              </div>
            ) : (
              upcomingSchedules.map((sch) => (
                <div key={sch.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={15} color="#00A2E9" /> {sch.substation}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00A2E9', backgroundColor: '#E0F2FE', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} /> {sch.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
                    {sch.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {sch.bay}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} /> {sch.team}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
