import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import ProgramKerja from './pages/ProgramKerja';
import JadwalPekerjaan from './pages/JadwalPekerjaan';
import PeralatanRelay from './pages/PeralatanRelay';
import Dokumen from './pages/Dokumen';
import Anomali from './pages/Anomali';
import PelaporanGangguan from './pages/PelaporanGangguan';
import Settings from './pages/Settings';
import AdminSummary from './pages/AdminSummary';
import SppNatura from './pages/SppNatura';
import LogistikPerkap from './pages/LogistikPerkap';
import HargiHarjar from './pages/HargiHarjar';
import HargiProgramKerja from './pages/HargiProgramKerja';
import Lemburan from './pages/Lemburan';
import K3Kam from './pages/K3Kam';
import K3Lingkungan from './pages/K3Lingkungan';
import Monitoring from './pages/Monitoring';
import K3Dashboard from './pages/K3Dashboard';
import PeralatanK3 from './pages/PeralatanK3';
import AuthPage from './pages/AuthPage';
import Lks from './pages/Lks';

import { storageService } from './services/storage';

export default function App() {
  const [activeDomain, setActiveDomain] = useState('rekap-admin');
  const [activeTab, setActiveTab] = useState('summary-ultg');
  const [visitedTabs, setVisitedTabs] = useState({ 'summary-ultg': true, overview: true, anomali: true });
  const [apiKey, setApiKey] = useState('');
  const [activeModel, setActiveModel] = useState('gemini-2.5-pro');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    setVisitedTabs(prev => ({ ...prev, [activeTab]: true }));
  }, [activeTab]);

  const loadAppSettings = async () => {
    try {
      await storageService.init();
      const st = await storageService.getSettings();
      if (st) {
        setApiKey(st.apiKey || '');
        setActiveModel(st.engineModel || 'gemini-2.5-pro');
      }
      
      // Cek sesi login yang tersimpan
      const activeSession = localStorage.getItem('active_session');
      if (activeSession) {
        setLoggedInUser(JSON.parse(activeSession));
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    loadAppSettings();
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', color: '#0F172A' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/ULTG.png" alt="PLN" style={{ height: '60px', marginBottom: '16px', opacity: 0.8 }} />
          <p style={{ fontWeight: 600 }}>Memuat Portal Terpadu ULTG BEKASI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={(user) => {
      setIsAuthenticated(true);
      setLoggedInUser(user);
      localStorage.setItem('active_session', JSON.stringify(user));
    }} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      {/* Sticky Corporate Header */}
      <Header 
        activeDomain={activeDomain} 
        setActiveDomain={setActiveDomain} 
        setActiveTab={setActiveTab} 
        apiKey={apiKey} 
        activeModel={activeModel} 
        loggedInUser={loggedInUser}
        onLogout={() => {
          setIsAuthenticated(false);
          setLoggedInUser(null);
          localStorage.removeItem('active_session');
        }}
      />

      {/* Body Container: Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        {['data-pegawai-dom', 'spp-natura', 'logistik-perkap', 'lemburan-dom', 'lks-ba-dom', 'anomali-pilar-dom', 'harpro', 'hargi', 'harjar', 'k3'].includes(activeDomain) && (
          <Sidebar 
            activeDomain={activeDomain} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          
          {/* REKAP & ADMINISTRASI */}
          <div style={{ display: activeTab === 'summary-ultg' ? 'block' : 'none' }}>
            {visitedTabs['summary-ultg'] && (
              <AdminSummary 
                initialSubTab="summary-ultg" 
                key="sum" 
                onNavigateModule={(domain, tab) => {
                  setActiveDomain(domain);
                  setActiveTab(tab);
                }} 
              />
            )}
          </div>
          <div style={{ display: activeTab === 'data-pegawai' ? 'block' : 'none' }}>
            {visitedTabs['data-pegawai'] && <AdminSummary initialSubTab="data-pegawai" key="peg" />}
          </div>
          <div style={{ display: activeTab === 'jadwal-dinas' ? 'block' : 'none' }}>
            {visitedTabs['jadwal-dinas'] && <AdminSummary initialSubTab="jadwal-dinas" key="jad" />}
          </div>

          {/* SPP & NATURA */}
          <div style={{ display: activeTab === 'dashboard-natura' ? 'block' : 'none' }}>
            {visitedTabs['dashboard-natura'] && <SppNatura initialSubTab="dashboard-natura" key="nat-dash" />}
          </div>
          <div style={{ display: activeTab === 'kelola-natura' ? 'block' : 'none' }}>
            {visitedTabs['kelola-natura'] && <SppNatura initialSubTab="kelola-natura" key="nat" />}
          </div>
          <div style={{ display: activeTab === 'arsip-natura' ? 'block' : 'none' }}>
            {visitedTabs['arsip-natura'] && <SppNatura initialSubTab="arsip-natura" key="ars" />}
          </div>
          <div style={{ display: activeTab === 'pegawai-natura' ? 'block' : 'none' }}>
            {visitedTabs['pegawai-natura'] && <SppNatura initialSubTab="pegawai-natura" key="nat-peg" />}
          </div>
          <div style={{ display: activeTab === 'jadwal-piket-natura' ? 'block' : 'none' }}>
            {visitedTabs['jadwal-piket-natura'] && <SppNatura initialSubTab="jadwal-piket-natura" key="nat-jad" />}
          </div>

          {/* LOGISTIK & INVENTARIS (PERKAP ULTG) */}
          <div style={{ display: activeTab === 'logistik-dashboard' ? 'block' : 'none' }}>
            {visitedTabs['logistik-dashboard'] && <LogistikPerkap activeSubTab="logistik-dashboard" key="log-dash" />}
          </div>
          <div style={{ display: activeTab === 'logistik-input' ? 'block' : 'none' }}>
            {visitedTabs['logistik-input'] && <LogistikPerkap activeSubTab="logistik-input" key="log-input" />}
          </div>
          <div style={{ display: activeTab === 'logistik-bidang' ? 'block' : 'none' }}>
            {visitedTabs['logistik-bidang'] && <LogistikPerkap activeSubTab="logistik-bidang" key="log-bid" />}
          </div>
          <div style={{ display: activeTab === 'logistik-history' ? 'block' : 'none' }}>
            {visitedTabs['logistik-history'] && <LogistikPerkap activeSubTab="logistik-history" key="log-hist" />}
          </div>
          <div style={{ display: activeTab === 'logistik-admin' ? 'block' : 'none' }}>
            {visitedTabs['logistik-admin'] && <LogistikPerkap activeSubTab="logistik-admin" key="log-adm" />}
          </div>
          <div style={{ display: activeTab === 'logistik-export' ? 'block' : 'none' }}>
            {visitedTabs['logistik-export'] && <LogistikPerkap activeSubTab="logistik-export" key="log-exp" />}
          </div>

          {/* PEMELIHARAAN PROTEKSI (HARPRO) */}
          <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
            {visitedTabs.overview && <Overview setActiveTab={setActiveTab} />}
          </div>
          <div style={{ display: activeTab === 'program-kerja' ? 'block' : 'none' }}>
            {visitedTabs['program-kerja'] && <ProgramKerja />}
          </div>
          <div style={{ display: activeTab === 'jadwal-pekerjaan' ? 'block' : 'none' }}>
            {visitedTabs['jadwal-pekerjaan'] && <JadwalPekerjaan />}
          </div>
          <div style={{ display: activeTab === 'peralatan-relay' ? 'block' : 'none' }}>
            {visitedTabs['peralatan-relay'] && <PeralatanRelay />}
          </div>
          <div style={{ display: activeTab === 'dokumen' ? 'block' : 'none' }}>
            {visitedTabs.dokumen && <Dokumen setActiveTab={setActiveTab} />}
          </div>
          <div style={{ display: activeTab === 'anomali' ? 'block' : 'none' }}>
            {visitedTabs.anomali && <Anomali />}
          </div>
          <div style={{ display: activeTab === 'pelaporan-gangguan' ? 'block' : 'none' }}>
            {visitedTabs['pelaporan-gangguan'] && <PelaporanGangguan />}
          </div>
          <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
            {visitedTabs.settings && <Settings onSettingsChange={loadAppSettings} />}
          </div>

          {/* PEMELIHARAAN GARDU (HARGI) */}
          <div style={{ display: activeTab === 'hargi-overview' ? 'block' : 'none' }}>
            {visitedTabs['hargi-overview'] && <HargiHarjar mode="hargi" subView="overview" />}
          </div>
          <div style={{ display: activeTab === 'hargi-anomali' ? 'block' : 'none' }}>
            {visitedTabs['hargi-anomali'] && <HargiHarjar mode="hargi" subView="anomali" />}
          </div>
          <div style={{ display: activeTab === 'hargi-program' ? 'block' : 'none' }}>
            {visitedTabs['hargi-program'] && <HargiProgramKerja />}
          </div>

          {/* PEMELIHARAAN JARINGAN (HARJAR) */}
          <div style={{ display: activeTab === 'harjar-overview' ? 'block' : 'none' }}>
            {visitedTabs['harjar-overview'] && <HargiHarjar mode="harjar" subView="overview" />}
          </div>
          <div style={{ display: activeTab === 'monitoring' ? 'block' : 'none' }}>
            {activeTab === 'monitoring' && <Monitoring />}
          </div>
          <div style={{ display: activeTab === 'harjar-anomali' ? 'block' : 'none' }}>
            {visitedTabs['harjar-anomali'] && <HargiHarjar mode="harjar" subView="anomali" />}
          </div>
          <div style={{ display: activeTab === 'harjar-program' ? 'block' : 'none' }}>
            {visitedTabs['harjar-program'] && <HargiHarjar mode="harjar" subView="program" />}
          </div>

          {/* LEMBURAN */}
          <div style={{ display: activeTab.startsWith('lemburan-') ? 'block' : 'none' }}>
            {(visitedTabs['lemburan-overview'] || visitedTabs['lemburan-input'] || visitedTabs['lemburan-arsip'] || visitedTabs['lemburan-export']) && (
              <Lemburan activeSubTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </div>

          {/* LKS & BA SECTION */}
          <div style={{ display: activeTab === 'lks-overview' ? 'block' : 'none' }}>
            {visitedTabs['lks-overview'] && <Lks />}
          </div>
          <div style={{ display: activeTab === 'lks-upload' ? 'block' : 'none', padding: '32px' }}>
            {visitedTabs['lks-upload'] && (
              <div className="card" style={{ padding: '36px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Upload BA / LKS ULTG Bekasi</h2>
                <p style={{ color: '#64748B', fontWeight: 600, margin: 0 }}>Modul ini dalam tahap pengembangan. Silakan hubungi administrator.</p>
              </div>
            )}
          </div>

          {/* K3 SECTION */}
          <div style={{ display: activeTab === 'k3-overview' ? 'block' : 'none', padding: '32px' }}>
            {visitedTabs['k3-overview'] && (
              <div className="card" style={{ padding: '36px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Overview K3 ULTG Bekasi</h2>
                <p style={{ color: '#64748B', fontWeight: 600, margin: 0 }}>Modul ini dalam tahap pengembangan (Tahap 3). Silakan akses menu Monitoring HR di sidebar.</p>
              </div>
            )}
          </div>
          <div style={{ display: activeTab === 'k3-dashboard' ? 'block' : 'none', padding: '32px' }}>
            {visitedTabs['k3-dashboard'] && <K3Dashboard setActiveTab={setActiveTab} />}
          </div>
          <div style={{ display: activeTab === 'peralatan-k3' ? 'block' : 'none' }}>
            {visitedTabs['peralatan-k3'] && <PeralatanK3 setActiveTab={setActiveTab} />}
          </div>
          <div style={{ display: activeTab === 'monitoring-hr' ? 'block' : 'none', padding: '16px', height: 'calc(100vh - 100px)' }}>
            {visitedTabs['monitoring-hr'] && (
              <div style={{ 
                height: '100%', 
                width: '100%', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <iframe 
                  src="https://k3-monitoring-system.vercel.app/dashboard" 
                  style={{ width: '100%', height: '100%', border: 'none', flex: 1 }}
                  title="Monitoring HR K3"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            )}
          </div>

          <div style={{ display: activeTab === 'k3-kam' ? 'block' : 'none' }}>
            {visitedTabs['k3-kam'] && <K3Kam />}
          </div>

          <div style={{ display: activeTab === 'k3-lingkungan' ? 'block' : 'none' }}>
            {visitedTabs['k3-lingkungan'] && <K3Lingkungan />}
          </div>

        </main>
      </div>
    </div>
  );
}
