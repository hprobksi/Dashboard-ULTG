import React, { useState } from 'react';
import { FileText, PlusCircle, Activity } from 'lucide-react';
import LksForm from '../components/lks/LksForm';
import LksMonitoring from '../components/lks/LksMonitoring';

export default function Lks() {
  const [activeSubTab, setActiveSubTab] = useState('pengajuan');

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '16px', 
        padding: '24px 28px', 
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#00A2E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 162, 233, 0.3)',
            flexShrink: 0
          }}>
            <FileText size={28} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Modul LKS (Lembar Kerja Selesai) - ULTG Bekasi
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '0.92rem', fontWeight: 600 }}>
              Pencatatan, Pengajuan, Verifikasi Tanda Tangan Digital & Monitoring Lembar Kerja Selesai
            </p>
          </div>
        </div>
      </div>

      {/* Top Horizontal Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '2px'
      }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('pengajuan')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeSubTab === 'pengajuan' ? '3px solid #00A2E9' : '3px solid transparent',
            backgroundColor: activeSubTab === 'pengajuan' ? '#EFF6FF' : 'transparent',
            color: activeSubTab === 'pengajuan' ? '#00A2E9' : '#64748B',
            fontWeight: activeSubTab === 'pengajuan' ? 800 : 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          <PlusCircle size={18} color={activeSubTab === 'pengajuan' ? '#00A2E9' : '#64748B'} />
          1. Pengajuan LKS
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('monitoring')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeSubTab === 'monitoring' ? '3px solid #00A2E9' : '3px solid transparent',
            backgroundColor: activeSubTab === 'monitoring' ? '#EFF6FF' : 'transparent',
            color: activeSubTab === 'monitoring' ? '#00A2E9' : '#64748B',
            fontWeight: activeSubTab === 'monitoring' ? 800 : 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          <Activity size={18} color={activeSubTab === 'monitoring' ? '#00A2E9' : '#64748B'} />
          2. Monitoring LKS
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '8px' }}>
        {activeSubTab === 'pengajuan' && (
          <LksForm onSuccessSubmitted={() => setActiveSubTab('monitoring')} />
        )}
        {activeSubTab === 'monitoring' && (
          <LksMonitoring onAddNew={() => setActiveSubTab('pengajuan')} />
        )}
      </div>

    </div>
  );
}
