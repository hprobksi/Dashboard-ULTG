import React from 'react';
import {
  LayoutDashboard, Users, CalendarDays, FileText, Archive, ShoppingCart,
  Cpu, AlertTriangle, ShieldAlert, Building, Clock,
  ChevronRight, FolderTree, Download, Activity, ShieldCheck, Leaf, ClipboardList, LayoutGrid,
  PlusCircle, UploadCloud
} from 'lucide-react';
import { getFlatDomainsList } from './Header';

export default function Sidebar({ activeDomain, activeTab, setActiveTab }) {
  const flatList = getFlatDomainsList();
  const currentDomainObj = flatList.find(d => d.id === activeDomain) || flatList[0];
  const DomainIcon = currentDomainObj.icon || LayoutDashboard;

  const getMenuItems = () => {
    switch (activeDomain) {
      case 'rekap-admin':
        return [
          { id: 'summary-ultg', label: 'Dashboard Manajemen', icon: LayoutDashboard, desc: 'Overview & Statistik Seluruh ULTG' }
        ];
      case 'data-pegawai-dom':
        return [
          { id: 'data-pegawai', label: 'Database Pegawai', icon: Users, desc: 'Tabel Personil & Avatar' },
          { id: 'jadwal-pekerjaan', label: 'Jadwal Pekerjaan', icon: CalendarDays, desc: 'Agenda Kedinasan Luar Kota' }
        ];
      case 'lks-dom':
        return [
          { id: 'lks-pengajuan', label: 'Pengajuan LKS', icon: PlusCircle, desc: 'Input Form LKS Resmi' },
          { id: 'lks-monitoring', label: 'Monitoring LKS', icon: Activity, desc: 'Dashboard Status Open / Close' },
          { id: 'lks-upload', label: 'Upload LKS', icon: UploadCloud, desc: 'Upload File Scan PDF / Word LKS' },
        ];
      case 'harpro':
        return [
          { id: 'overview', label: 'Overview Proteksi', icon: LayoutDashboard, desc: 'Ringkasan & Statistik Proteksi' },
          { id: 'program-kerja', label: 'Program Kerja', icon: CalendarDays, desc: 'Rencana Pemeliharaan Proteksi' },
          { id: 'monitoring', label: 'Monitoring', icon: Activity, desc: 'DC Monitoring, PQM & DFR' },
          { id: 'dokumen', label: 'Dokumen / LKS', icon: Archive, desc: 'Arsip & File Hasil Uji' },
          { id: 'anomali', label: 'Anomali Proteksi', icon: AlertTriangle, desc: 'Daftar Temuan Gangguan' },
          { id: 'pelaporan-gangguan', label: 'Pelaporan Gangguan', icon: FileText, desc: 'Form Pelaporan Gangguan' },
        ];
      case 'hargi':
        return [
          { id: 'hargi-overview', label: 'Overview HARGI', icon: LayoutDashboard, desc: 'Ringkasan Pemeliharaan Gardu Induk' },
          { id: 'hargi-program', label: 'Program Kerja', icon: CalendarDays, desc: 'Read-only program kerja ULTG Bekasi' },
          { id: 'hargi-anomali', label: 'Anomali / Temuan', icon: AlertTriangle, desc: 'Daftar temuan dan tindak lanjut HARGI' },
        ];
      case 'harjar':
        return [
          { id: 'harjar-overview', label: 'Overview HARJAR', icon: LayoutDashboard, desc: 'Ringkasan Pemeliharaan Jaringan' },
          { id: 'monitoring', label: 'Monitoring', icon: Activity, desc: 'Monitoring peralatan dan kondisi jaringan' },
          { id: 'harjar-program', label: 'Program Kerja', icon: CalendarDays, desc: 'Agenda dan program kerja HARJAR' },
          { id: 'harjar-anomali', label: 'Anomali / Temuan', icon: AlertTriangle, desc: 'Daftar temuan dan tindak lanjut HARJAR' },
        ];
      case 'data-peralatan':
        return [
          { id: 'peralatan-relay', label: 'Peralatan Relay', icon: Cpu, desc: 'Data Asset Relay Proteksi' },
        ];
      case 'spp-natura':
        return [
          { id: 'dashboard-natura', label: 'Dashboard Natura', icon: LayoutDashboard, desc: 'Rekap & Grafik Pembayaran' },
          { id: 'kelola-natura', label: 'Input SPP & Natura', icon: FileText, desc: 'Form Pengajuan & Verifikasi' },
          { id: 'arsip-natura', label: 'Arsip & Rekap Natura', icon: Archive, desc: 'Riwayat Pembayaran & File' },
          { id: 'jadwal-piket-natura', label: 'Jadwal Dinas & Piket', icon: CalendarDays, desc: 'Matriks Piket Personil' },
        ];
      case 'logistik-perkap':
        return [
          { id: 'logistik-dashboard', label: 'Dashboard Stok', icon: LayoutDashboard, desc: 'Grafik & Status Ketersediaan' },
          { id: 'logistik-input', label: 'Input Transaksi', icon: ShoppingCart, desc: 'Pengambilan & Pemakaian Barang' },
          { id: 'logistik-bidang', label: 'Laporan Bidang / GI', icon: Building, desc: 'Akumulasi Pengambilan Per Bidang' },
          { id: 'logistik-history', label: 'Histori Pengambilan', icon: Clock, desc: 'Riwayat Transaksi Terbaru' },
          { id: 'logistik-admin', label: 'Panel Admin', icon: ShieldAlert, desc: 'Manajemen Master Pasokan Awal' },
          { id: 'logistik-export', label: 'Export ke Excel', icon: Download, desc: 'Unduh Rekap Database XLS', isExport: true },
        ];
      case 'lemburan-dom':
        return [
          { id: 'lemburan-overview', label: 'Rekapitulasi Lembur', icon: LayoutDashboard, desc: 'Overview Data Lembur Personil' },
          { id: 'lemburan-input', label: 'Input SPL Lembur', icon: Clock, desc: 'Pencatatan Surat Perintah Lembur' },
          { id: 'lemburan-arsip', label: 'Arsip Lemburan', icon: Archive, desc: 'Edit, Hapus & Cetak Ulang SPL' },
          { id: 'lemburan-export', label: 'Export Rekap Excel', icon: Download, desc: 'Unduh Rekap Jam Lembur XLSX' },
        ];
      case 'k3':
        return [
          { id: 'k3-overview', label: 'Overview K3', icon: ShieldCheck, desc: 'Ringkasan Kesehatan & Keselamatan' },
          { id: 'k3-dashboard', label: 'K3', icon: LayoutGrid, desc: 'Menu Utama K3' },
          { id: 'monitoring-hr', label: 'Monitoring HR', icon: Activity, desc: 'Akses Vercel K3 Monitoring System' },
          { id: 'k3-kam', label: 'KAM', icon: ClipboardList, desc: 'Keamanan Aset & Mutu' },
          { id: 'k3-lingkungan', label: 'Lingkungan', icon: Leaf, desc: 'Manajemen Lingkungan Hidup' }
        ];
      default:
        const domain = activeDomain || 'rekap-admin';
        return [
          { id: `${domain}-overview`, label: 'Overview', icon: LayoutDashboard, desc: `Ringkasan & Statistik ${domain.toUpperCase()}` },
          { id: `${domain}-input`, label: 'Input', icon: FileText, desc: `Form Input & Pencatatan Data` },
          { id: `${domain}-jadwal`, label: 'Jadwal / Program Kerja', icon: CalendarDays, desc: `Agenda & Timeline Pemeliharaan` },
          { id: `${domain}-anomali`, label: 'Anomali / Temuan', icon: AlertTriangle, desc: `Daftar Temuan & Status` },
          { id: `${domain}-dokumen`, label: 'Dokumen / Arsip', icon: Archive, desc: `Manajemen File & Arsip Laporan` },
          { id: `${domain}-export`, label: 'Export / Laporan', icon: Download, desc: `Unduh Rekapitulasi Data` },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside style={{
      width: '230px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: 'calc(100vh - 54px)',
      position: 'sticky',
      top: '54px',
      overflowY: 'auto'
    }}>
      {/* Top Active Domain Header Banner inside Sidebar */}
      <div style={{
        padding: '12px 12px 10px 12px',
        borderBottom: '1px solid #F1F5F9',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '10px',
          backgroundColor: '#00A2E9',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0, 162, 233, 0.25)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <DomainIcon size={22} color="#FFFFFF" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#E0F2FE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              MODUL AKTIF
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentDomainObj.label.split('(')[0].trim()}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sub-items List */}
      <div style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FolderTree size={14} /> SUB-MENU LAYANAN
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'logistik-export' || item.isExport) {
                    window.location.href = '/api/inventaris/export';
                    return;
                  }
                  setActiveTab(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #00A2E9' : '1px solid transparent',
                  backgroundColor: isActive ? '#EFF6FF' : (item.isExport ? '#F0F9FF' : 'transparent'),
                  color: isActive ? '#00A2E9' : (item.isExport ? '#0369A1' : '#334155'),
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                  marginTop: item.isExport ? '18px' : '0',
                  borderTop: item.isExport && !isActive ? '1px solid #E2E8F0' : (isActive ? '1px solid #00A2E9' : '1px solid transparent')
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#334155';
                  }
                }}
              >
                <Icon size={22} color={isActive ? '#00A2E9' : '#64748B'} style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '1.02rem', fontWeight: isActive ? 800 : 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                </div>

                {isActive && <ChevronRight size={18} color="#00A2E9" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom PLN Corporate Footer */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid #F1F5F9',
        backgroundColor: '#F8FAFC',
        fontSize: '0.74rem',
        color: '#64748B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1E293B' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          Sistem Standar Nasional PLN
        </div>
        <div style={{ marginTop: '2px', fontSize: '0.68rem', color: '#94A3B8' }}>
          © 2026 PT PLN (Persero) ULTG Bekasi
        </div>
      </div>
    </aside>
  );
}
