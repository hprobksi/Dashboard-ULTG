import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, BarChart3, CheckCircle2, ExternalLink,
  FileText, RefreshCw, Search, ShieldCheck, Table2
} from 'lucide-react';
import { hargiProgramKerjaService } from '../services/hargiProgramKerja';
import { HARGI_SPREADSHEET_ID } from '../services/hargiProgramUtils';

const statusStyleMap = {
  done: { label: 'Terlaksana', bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0' },
  priority: { label: 'Prioritas', bg: '#FEE2E2', color: '#B91C1C', border: '#FECACA' },
  progress: { label: 'On Target', bg: '#DBEAFE', color: '#1D4ED8', border: '#BFDBFE' },
  open: { label: 'Belum Terlaksana', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  empty: { label: 'Belum Ada Status', bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' }
};

function StatusBadge({ type }) {
  const style = statusStyleMap[type] || statusStyleMap.open;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '5px 10px',
      borderRadius: '999px',
      border: `1px solid ${style.border}`,
      backgroundColor: style.bg,
      color: style.color,
      fontSize: '0.72rem',
      fontWeight: 800,
      whiteSpace: 'nowrap'
    }}>
      {style.label}
    </span>
  );
}

function MetricCard({ label, value, hint, icon: Icon, color, bg }) {
  return (
    <div className="pk-card" style={{ padding: '16px', borderLeft: `5px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>
        <span>{label}</span>
        <div style={{ padding: '7px', borderRadius: '9px', backgroundColor: bg, color }}>
          <Icon size={16} />
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '8px', fontWeight: 650 }}>{hint}</div>
    </div>
  );
}

export default function HargiProgramKerja() {
  const [data, setData] = useState({ sheets: [], summary: { total: 0, done: 0, open: 0, priority: 0, sheetCount: 0 } });
  const [activeSheetId, setActiveSheetId] = useState('anomaliDs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await hargiProgramKerjaService.fetchAll(forceRefresh);
      setData(result);
      setLastUpdated(result.lastUpdated);
      setActiveSheetId(prev => (
        result.sheets.some(sheet => sheet.id === prev) ? prev : (result.sheets[0]?.id || 'anomaliDs')
      ));
      if (result.warning) setError(`Menggunakan cache lokal: ${result.warning}`);
    } catch (err) {
      setError(err.message || 'Data Program Kerja HARGI belum dapat dimuat.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeSheet = data.sheets.find(sheet => sheet.id === activeSheetId) || data.sheets[0];
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const rows = activeSheet?.rows || [];
    if (!query) return rows;

    return rows.filter(row => [
      row.garduInduk,
      row.bay,
      row.status,
      row.realisasi,
      row.keterangan,
      ...row.values.map(item => item.value)
    ].join(' ').toLowerCase().includes(query));
  }, [activeSheet, searchQuery]);

  const progress = data.summary.total > 0 ? Math.round((data.summary.done / data.summary.total) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ padding: '24px', maxWidth: '1360px', margin: '0 auto' }}>
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
        borderRadius: '16px',
        padding: '26px 32px',
        color: '#FFFFFF',
        marginBottom: '22px',
        boxShadow: '0 10px 25px -5px rgba(217,119,6,0.32)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#FFD100', color: '#0F172A', fontSize: '0.75rem', fontWeight: 900, padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                Read Only
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#FEF3C7', fontWeight: 700 }}>
                <ShieldCheck size={14} /> Ruang Lingkup: ULTG Bekasi
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
              Program Kerja HARGI
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#FFFBEB', fontWeight: 650 }}>
              Monitoring program gardu induk dari spreadsheet resmi, ditampilkan khusus untuk ULTG Bekasi.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <a
              href={`https://docs.google.com/spreadsheets/d/${HARGI_SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.32)',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.82rem',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={15} /> Buka Spreadsheet
            </a>
            <button
              onClick={() => loadData(true)}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#92400E',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: isLoading ? 'wait' : 'pointer'
              }}
            >
              <RefreshCw size={15} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
              {isLoading ? 'Memuat...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="pk-card" style={{ padding: '10px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '0.8rem', color: '#475569', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 650 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: error ? '#F59E0B' : '#10B981', display: 'inline-block' }} />
          {error || 'Data dibaca dari 4 sheet Program Kerja HARGI ULTG Bekasi.'}
        </span>
        {lastUpdated && <span>Update Terakhir: <strong style={{ color: '#0F172A' }}>{lastUpdated}</strong></span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <MetricCard label="Total Item" value={data.summary.total} hint={`${data.summary.sheetCount} sheet program`} icon={Table2} color="#D97706" bg="#FEF3C7" />
        <MetricCard label="Terlaksana" value={data.summary.done} hint={`${progress}% dari total item`} icon={CheckCircle2} color="#16A34A" bg="#DCFCE7" />
        <MetricCard label="Belum Realisasi" value={data.summary.open} hint="Butuh monitoring berkala" icon={AlertCircle} color="#DC2626" bg="#FEE2E2" />
        <MetricCard label="Prioritas" value={data.summary.priority} hint="Perlu perhatian HARGI" icon={Activity} color="#B91C1C" bg="#FEE2E2" />
        <MetricCard label="Progress Total" value={`${progress}%`} hint="Berbasis kolom status/realisasi" icon={BarChart3} color="#00A2E9" bg="#E0F5FF" />
      </div>

      <div className="pk-card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {data.sheets.map(sheet => (
            <button
              key={sheet.id}
              onClick={() => setActiveSheetId(sheet.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: activeSheetId === sheet.id ? '1px solid #D97706' : '1px solid #E2E8F0',
                backgroundColor: activeSheetId === sheet.id ? '#FEF3C7' : '#FFFFFF',
                color: activeSheetId === sheet.id ? '#92400E' : '#475569',
                fontWeight: 850,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {sheet.title} ({sheet.rows.length})
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari Gardu Induk, Bay, status, atau keterangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '34px', fontSize: '0.82rem', padding: '9px 12px 9px 34px' }}
          />
        </div>
      </div>

      <div className="pk-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#D97706" /> {activeSheet?.title || 'Program Kerja HARGI'}
            </h2>
            <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 700, marginTop: '4px' }}>
              Data read-only, perubahan sumber tetap dilakukan di Google Spreadsheet.
            </div>
          </div>
          <span style={{ color: '#64748B', fontWeight: 800, fontSize: '0.82rem' }}>
            Menampilkan {filteredRows.length} dari {activeSheet?.rows?.length || 0} item
          </span>
        </div>

        {isLoading && !activeSheet ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', fontWeight: 800 }}>Memuat data Program Kerja HARGI...</div>
        ) : filteredRows.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8', fontWeight: 800 }}>Tidak ada data yang cocok dengan pencarian.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '980px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>No</th>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Gardu Induk / Bay</th>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Realisasi</th>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Keterangan</th>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dokumen</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 900, color: '#0F172A' }}>{row.rowNumber}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 850, color: '#0F172A' }}>{row.garduInduk || '-'}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 650, marginTop: '3px' }}>{row.bay || '-'}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge type={row.statusType} />
                      {row.status && <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px', fontWeight: 650 }}>{row.status}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 700 }}>{row.realisasi || '-'}</td>
                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.86rem', lineHeight: 1.45, maxWidth: '340px' }}>{row.keterangan || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {row.documentUrl ? (
                        <a href={row.documentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0078AE', fontWeight: 850, fontSize: '0.78rem', textDecoration: 'none' }}>
                          <ExternalLink size={14} /> Buka BA
                        </a>
                      ) : (
                        <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.78rem' }}>Belum ada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
