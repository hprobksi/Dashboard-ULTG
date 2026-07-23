import React, { useState, useEffect } from 'react';
import { FileText, Activity, UploadCloud, Archive } from 'lucide-react';
import LksMonitoring from '../components/lks/LksMonitoring';
import LksUpload from '../components/lks/LksUpload';
import LksArchive from '../components/lks/LksArchive';

export default function Lks({ initialTab = 'upload' }) {
  const [activeSubTab, setActiveSubTab] = useState('upload');

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'lks-archive' || initialTab === 'lks-arsip') setActiveSubTab('archive');
      else if (initialTab === 'lks-monitoring') setActiveSubTab('monitoring');
      else if (initialTab === 'lks-upload') setActiveSubTab('upload');
    }
  }, [initialTab]);

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
        justify: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#00A2E9',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 4px 12px rgba(0, 162, 233, 0.3)',
            flexShrink: 0,
            lineHeight: 1,
            boxSizing: 'border-box'
          }}>
            <FileText size={28} color="#FFFFFF" style={{ display: 'block', margin: 0 }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
              LKS ( LEMBAR KETIDAKSESUAIAN ) - ULTG BEKASI
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '0.92rem', fontWeight: 600 }}>
              Monitoring Pengajuan LKS ULTG Bekasi
            </p>
          </div>
        </div>
      </div>

      {/* Top Horizontal Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '2px',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('upload')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeSubTab === 'upload' ? '3px solid #00A2E9' : '3px solid transparent',
            backgroundColor: activeSubTab === 'upload' ? '#EFF6FF' : 'transparent',
            color: activeSubTab === 'upload' ? '#00A2E9' : '#64748B',
            fontWeight: activeSubTab === 'upload' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px',
            lineHeight: 1
          }}
        >
          <UploadCloud size={18} color={activeSubTab === 'upload' ? '#00A2E9' : '#64748B'} style={{ display: 'block', margin: 0 }} />
          1. Upload LKS
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('monitoring')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeSubTab === 'monitoring' ? '3px solid #00A2E9' : '3px solid transparent',
            backgroundColor: activeSubTab === 'monitoring' ? '#EFF6FF' : 'transparent',
            color: activeSubTab === 'monitoring' ? '#00A2E9' : '#64748B',
            fontWeight: activeSubTab === 'monitoring' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px',
            lineHeight: 1
          }}
        >
          <Activity size={18} color={activeSubTab === 'monitoring' ? '#00A2E9' : '#64748B'} style={{ display: 'block', margin: 0 }} />
          2. Monitoring LKS
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('archive')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeSubTab === 'archive' ? '3px solid #00A2E9' : '3px solid transparent',
            backgroundColor: activeSubTab === 'archive' ? '#EFF6FF' : 'transparent',
            color: activeSubTab === 'archive' ? '#00A2E9' : '#64748B',
            fontWeight: activeSubTab === 'archive' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px',
            lineHeight: 1
          }}
        >
          <Archive size={18} color={activeSubTab === 'archive' ? '#00A2E9' : '#64748B'} style={{ display: 'block', margin: 0 }} />
          3. Arsip LKS
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '8px' }}>
        {activeSubTab === 'upload' && (
          <LksUpload onUploadSuccess={() => setActiveSubTab('archive')} />
        )}
        {activeSubTab === 'monitoring' && (
          <LksMonitoring onAddNew={() => setActiveSubTab('upload')} />
        )}
        {activeSubTab === 'archive' && (
          <LksArchive />
        )}
      </div>

    </div>
  );
}
