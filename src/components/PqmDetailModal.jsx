import React, { useState } from 'react';
import { X, Activity, Zap, AlertTriangle, Battery, ShieldAlert, Cpu } from 'lucide-react';

export default function PqmDetailModal({ isOpen, onClose, device, iticEvents = [], disturbanceEvents = [], onTogglePolling }) {
  if (!isOpen || !device) return null;

  const formatNumber = (val) => {
    if (val === undefined || val === null) return '--';
    return Number(val).toFixed(2);
  };

  const isConnected = device.connected;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#F8FAFC' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity color="#00A2E9" /> {device.nama_gi}
            </h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', color: '#00A2E9', fontWeight: 700 }}>{device.nama_bay}</span>
              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: isConnected ? '#DCFCE7' : '#FEE2E2', color: isConnected ? '#16A34A' : '#EF4444' }}>
                {isConnected ? 'CONNECTED' : 'OFFLINE'}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>IP: {device.ip}</span>
              <span style={{ fontSize: '0.85rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>Tipe: {device.pqm_type}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#F1F5F9' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Kartu Status & Kontrol */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Cpu size={18} color="#64748B" /> Kontrol & Status
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>Auto Polling PQM</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Ambil data otomatis berkala</div>
                </div>
                <button 
                  onClick={() => onTogglePolling(device.id, !device.enabled)}
                  style={{ width: '50px', height: '26px', borderRadius: '26px', backgroundColor: device.enabled ? '#10B981' : '#CBD5E1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FFFFFF', position: 'absolute', top: '2px', left: device.enabled ? '26px' : '2px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                </button>
              </div>
              <div style={{ fontSize: '0.85rem', color: isConnected ? '#334155' : '#EF4444', backgroundColor: isConnected ? '#F8FAFC' : '#FEF2F2', padding: '12px', borderRadius: '8px', fontWeight: 600 }}>
                {device.status_message || (isConnected ? 'Beroperasi Normal' : 'Koneksi gagal')}
              </div>
            </div>

            {/* Kartu Daya & Energi */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Battery size={18} color="#00A2E9" /> Daya & Frekuensi
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>DAYA AKTIF (kW)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{isConnected ? formatNumber(device.kw_total) : '--'}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>FREKUENSI (Hz)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00A2E9' }}>{isConnected ? formatNumber(device.freq) : '--'}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ENERGI KIRIM (kWh)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>{isConnected ? formatNumber(device.kwh_del) : '--'}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ENERGI TERIMA (kWh)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>{isConnected ? formatNumber(device.kwh_rec) : '--'}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <Zap size={18} color="#F59E0B" /> Kelistrikan (Tegangan & Arus)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              
              <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #BAE6FD', paddingBottom: '4px' }}>TEGANGAN (Vln)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0284C7', display: 'flex', justifyContent: 'space-between' }}><span>Fase R:</span> <span>{isConnected ? formatNumber(device.v_an) : '--'} V</span></div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0284C7', display: 'flex', justifyContent: 'space-between' }}><span>Fase S:</span> <span>{isConnected ? formatNumber(device.v_bn) : '--'} V</span></div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0284C7', display: 'flex', justifyContent: 'space-between' }}><span>Fase T:</span> <span>{isConnected ? formatNumber(device.v_cn) : '--'} V</span></div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>TEGANGAN (Vll)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', display: 'flex', justifyContent: 'space-between' }}><span>RS:</span> <span>{isConnected ? formatNumber(device.v_ab) : '--'} V</span></div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', display: 'flex', justifyContent: 'space-between' }}><span>ST:</span> <span>{isConnected ? formatNumber(device.v_bc) : '--'} V</span></div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', display: 'flex', justifyContent: 'space-between' }}><span>TR:</span> <span>{isConnected ? formatNumber(device.v_ca) : '--'} V</span></div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>ARUS (I)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}><span>Fase R:</span> <span>{isConnected ? formatNumber(device.current_a) : '--'} A</span></div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}><span>Fase S:</span> <span>{isConnected ? formatNumber(device.current_b) : '--'} A</span></div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}><span>Fase T:</span> <span>{isConnected ? formatNumber(device.current_c) : '--'} A</span></div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>UNBALANCE & THD</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between' }}><span>V Unbalance:</span> <span>{isConnected ? formatNumber(device.v_unbal) : '--'} %</span></div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between' }}><span>I Unbalance:</span> <span>{isConnected ? formatNumber(device.i_unbal) : '--'} %</span></div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}><span>V THD Max:</span> <span>{isConnected ? formatNumber(device.v_thd_max) : '--'} %</span></div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between' }}><span>I THD Max:</span> <span>{isConnected ? formatNumber(device.i_thd_max) : '--'} %</span></div>
              </div>

            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <ShieldAlert size={18} color="#EF4444" /> Sinkronisasi Insiden PME & Disturbance
            </h3>
            
            {disturbanceEvents.length === 0 && iticEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#F8FAFC', borderRadius: '8px', color: '#64748B' }}>
                <CheckCircle2 size={32} color="#10B981" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 600 }}>Tidak ada insiden tercatat untuk perangkat ini.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>WAKTU INSIDEN</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>TIPE INSIDEN</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>KETERANGAN / MAGNITUDE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...disturbanceEvents, ...iticEvents]
                      .map(e => ({ ...e, eventTime: e.waktu || e.waktu_mulai || e.timestamp || '-' }))
                      .sort((a, b) => new Date(b.eventTime === '-' ? 0 : b.eventTime) - new Date(a.eventTime === '-' ? 0 : a.eventTime))
                      .map((event, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{event.eventTime}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                            {event.event_type || 'DISTURBANCE'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#334155' }}>
                          {event.magnitude_percent ? `Magnitude: ${event.magnitude_percent}% | Durasi: ${event.duration_ms}ms` : event.description || `Event Code: ${event.event_code}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const CheckCircle2 = ({ size, color, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
