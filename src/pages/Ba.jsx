import React, { useState, useEffect } from 'react';
import { FileText, UploadCloud, Activity, Archive, X } from 'lucide-react';
import BaUpload from '../components/ba/BaUpload';
import BaMonitoring from '../components/ba/BaMonitoring';
import BaArchive from '../components/ba/BaArchive';

export default function Ba({ initialTab = 'ba-upload' }) {
  const [activeSubTab, setActiveSubTab] = useState('upload');
  const [activePdfModal, setActivePdfModal] = useState(null);

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'ba-archive' || initialTab === 'ba-arsip' || initialTab === 'archive') {
        setActiveSubTab('archive');
      } else if (initialTab === 'ba-monitoring' || initialTab === 'monitoring') {
        setActiveSubTab('monitoring');
      } else if (initialTab === 'ba-upload' || initialTab === 'upload') {
        setActiveSubTab('upload');
      }
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
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 6px 16px -2px rgba(2, 132, 199, 0.35)',
            flexShrink: 0,
            boxSizing: 'border-box',
            padding: 0
          }}>
            <FileText size={28} color="#FFFFFF" strokeWidth={2.2} style={{ display: 'block', margin: 'auto' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
              BERITA ACARA (BA) - ULTG BEKASI
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '0.92rem', fontWeight: 600 }}>
              Dokumen Berita Acara GI, HARGI, HARPRO dan HARJAR
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            backgroundColor: '#E0F2FE',
            color: '#0369A1',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            PLN ULTG BEKASI
          </span>
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
            borderBottom: activeSubTab === 'upload' ? '3px solid #0284C7' : '3px solid transparent',
            backgroundColor: activeSubTab === 'upload' ? '#F0F9FF' : 'transparent',
            color: activeSubTab === 'upload' ? '#0284C7' : '#64748B',
            fontWeight: activeSubTab === 'upload' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          <UploadCloud size={18} color={activeSubTab === 'upload' ? '#0284C7' : '#64748B'} />
          1. Upload BA
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
            borderBottom: activeSubTab === 'monitoring' ? '3px solid #0284C7' : '3px solid transparent',
            backgroundColor: activeSubTab === 'monitoring' ? '#F0F9FF' : 'transparent',
            color: activeSubTab === 'monitoring' ? '#0284C7' : '#64748B',
            fontWeight: activeSubTab === 'monitoring' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          <Activity size={18} color={activeSubTab === 'monitoring' ? '#0284C7' : '#64748B'} />
          2. Monitoring BA (HARGI, HARJAR, HARPRO)
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
            borderBottom: activeSubTab === 'archive' ? '3px solid #0284C7' : '3px solid transparent',
            backgroundColor: activeSubTab === 'archive' ? '#F0F9FF' : 'transparent',
            color: activeSubTab === 'archive' ? '#0284C7' : '#64748B',
            fontWeight: activeSubTab === 'archive' ? 800 : 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-2px'
          }}
        >
          <Archive size={18} color={activeSubTab === 'archive' ? '#0284C7' : '#64748B'} />
          3. Arsip BA
        </button>
      </div>

      {/* Dynamic Sub-Component Display */}
      {activeSubTab === 'upload' && (
        <BaUpload onUploadSuccess={() => setActiveSubTab('monitoring')} />
      )}

      {activeSubTab === 'monitoring' && (
        <BaMonitoring onViewPdf={(item) => setActivePdfModal(item)} />
      )}

      {activeSubTab === 'archive' && (
        <BaArchive onViewPdf={(item) => setActivePdfModal(item)} />
      )}

      {/* GLOBAL PDF PREVIEW MODAL */}
      {activePdfModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1000px',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{activePdfModal.judul}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>{activePdfModal.noBA} | {activePdfModal.garduInduk}</p>
              </div>
              <button
                onClick={() => setActivePdfModal(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, backgroundColor: '#525659' }}>
              <iframe
                src={activePdfModal.fileUrl || '/BA/29042026_BA AKTIVASI TRIPPING 1 DAN 2 BAY JATIWARINGIN #1 GIS NEW TAMBUN.pdf'}
                title="PDF Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
