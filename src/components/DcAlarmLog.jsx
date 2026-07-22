import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Trash2, CheckCircle2 } from 'lucide-react';

export default function DcAlarmLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alarms');
      if (!res.ok) throw new Error('Gagal mengambil riwayat alarm');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearLog = async (id) => {
    if (!confirm('Hapus log alarm ini?')) return;
    try {
      await fetch(`/api/alarms/${id}`, { method: 'DELETE' });
      fetchLogs();
    } catch (err) {
      alert('Gagal menghapus log');
    }
  };
  const clearAllLogs = async () => {
    if (!confirm('Yakin ingin menghapus SEMUA riwayat alarm? Aksi ini tidak dapat dibatalkan.')) return;
    try {
      await fetch('/api/alarms/all', { method: 'DELETE' });
      fetchLogs();
    } catch (err) {
      alert('Gagal menghapus semua log');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 5px 0', color: '#0F172A', fontWeight: 800 }}>Riwayat Alarm DC</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Catatan riwayat offline dan gangguan DC Ground / anomali tegangan</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={clearAllLogs} style={{ padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={16}/> Hapus Semua</button>
          <button onClick={fetchLogs} style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Refresh</button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>WAKTU</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>UNIT / GI</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>LEVEL</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>KETERANGAN</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Memuat data...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Belum ada riwayat alarm.</td></tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>{log.waktu}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{log.nama}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {log.level === 'critical' ? (
                      <span style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>CRITICAL</span>
                    ) : log.level === 'warning' ? (
                      <span style={{ backgroundColor: '#FEF3C7', color: '#F59E0B', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>WARNING</span>
                    ) : log.level === 'offline' ? (
                      <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>OFFLINE</span>
                    ) : (log.level === 'online' || log.level === 'normal') ? (
                      <span style={{ backgroundColor: '#D1FAE5', color: '#10B981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{log.level.toUpperCase()}</span>
                    ) : (
                      <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>INFO</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#334155' }}>{log.keterangan}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => clearLog(log.id)} style={{ padding: '6px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
