import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HealthyIndexDashboard() {
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/relay/tests');
      if (res.ok) setTests(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const getStatusColor = (hi) => {
    if (hi >= 95) return '#10B981'; // Green
    if (hi >= 85) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getStatusText = (hi) => {
    if (hi >= 95) return 'SEHAT';
    if (hi >= 85) return 'WASPADA';
    return 'KRITIS';
  };

  const statusCounts = {
    sehat: tests.filter(t => t.healthy_index >= 95).length,
    waspada: tests.filter(t => t.healthy_index >= 85 && t.healthy_index < 95).length,
    kritis: tests.filter(t => t.healthy_index < 85).length
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <h2 style={{ color: '#0F172A', marginBottom: '16px', fontWeight: 800 }}>Healthy Index - Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#DCFCE7', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldCheck size={36} color="#16A34A" />
          <div><h4 style={{ margin: 0, color: '#166534' }}>SEHAT</h4><span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>{statusCounts.sehat}</span></div>
        </div>
        <div style={{ backgroundColor: '#FEF3C7', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={36} color="#D97706" />
          <div><h4 style={{ margin: 0, color: '#92400E' }}>WASPADA</h4><span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>{statusCounts.waspada}</span></div>
        </div>
        <div style={{ backgroundColor: '#FEE2E2', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={36} color="#DC2626" />
          <div><h4 style={{ margin: 0, color: '#991B1B' }}>KRITIS</h4><span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DC2626' }}>{statusCounts.kritis}</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize: '1.1rem' }}>Status Kesehatan Keseluruhan</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', borderRadius: '8px', color: '#64748B', flexDirection: 'column' }}>
            <Activity size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
            <span>[ Donut Chart Placeholder ]</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize: '1.1rem' }}>Daftar Peringatan & Status Kritis</h3>
          <div style={{ height: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', position: 'sticky', top: 0 }}>
                  <th style={{ padding: '12px', color: '#475569' }}>GI</th>
                  <th style={{ padding: '12px', color: '#475569' }}>Bay</th>
                  <th style={{ padding: '12px', color: '#475569' }}>Healthy Index</th>
                  <th style={{ padding: '12px', color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tests.length > 0 ? tests.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px', color: '#334155', fontWeight: 600 }}>{t.gi}</td>
                    <td style={{ padding: '12px', color: '#64748B' }}>{t.bay}</td>
                    <td style={{ padding: '12px', fontWeight: 800, color: getStatusColor(t.healthy_index) }}>{t.healthy_index}%</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: getStatusColor(t.healthy_index) + '20', color: getStatusColor(t.healthy_index) }}>
                        {getStatusText(t.healthy_index)}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Belum ada data hasil uji yang masuk</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
