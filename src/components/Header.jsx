import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, FileText, Archive, Cpu, Zap, GitBranch, 
  ChevronDown, ChevronRight, Search, AlertCircle, Sparkles, Building2, UserCircle,
  FolderCheck, Wrench, Clock, FileCheck, AlertTriangle, Users, CalendarDays, Package, ShieldCheck,
  User, LogOut
} from 'lucide-react';
import ProfileModal from './ProfileModal';

export const domainsList = [
  {
    id: 'rekap-admin',
    label: 'DASHBOARD ULTG',
    desc: 'Overview Eksekutif & Statistik Seluruh ULTG',
    icon: LayoutDashboard,
    defaultTab: 'summary-ultg'
  },
  {
    id: 'data-pegawai-dom',
    label: 'DATA PEGAWAI',
    desc: 'Database Personil, Jabatan & SPPD',
    icon: Users,
    defaultTab: 'data-pegawai'
  },
  {
    id: 'anomali-parent',
    label: 'ANOMALI',
    desc: 'Manajemen Temuan, LKS & Berita Acara',
    icon: AlertTriangle,
    isParent: true,
    children: [
      {
        id: 'lks-dom',
        label: 'LKS',
        desc: 'Lembar Kerja Selesai',
        icon: FileCheck,
        defaultTab: 'lks-overview'
      },
      {
        id: 'ba-dom',
        label: 'BA',
        desc: 'Berita Acara',
        icon: FileText,
        defaultTab: 'lks-upload'
      }
    ]
  },
  {
    id: 'k3',
    label: 'K3',
    desc: 'Kesehatan & Keselamatan Kerja',
    icon: ShieldCheck,
    defaultTab: 'k3-overview'
  },
  {
    id: 'admin-umum-parent',
    label: 'ADMUM',
    desc: 'Kelola SPP Natura, Logistik Inventaris & Lemburan',
    icon: FolderCheck,
    isParent: true,
    children: [
      {
        id: 'spp-natura',
        label: 'SPP & Natura Kepegawaian',
        desc: 'Kelola & Arsip Input SPP Natura Pegawai',
        icon: FileText,
        defaultTab: 'kelola-natura'
      },
      {
        id: 'logistik-perkap',
        label: 'Logistik & Inventaris',
        desc: 'Dashboard Stok, Input Transaksi & Laporan GI',
        icon: Archive,
        defaultTab: 'logistik-dashboard'
      },
      {
        id: 'lemburan-dom',
        label: 'Lemburan',
        desc: 'Kelola Data Jam Lembur & Rekapitulasi Personil',
        icon: Clock,
        defaultTab: 'lemburan-overview'
      }
    ]
  },
  {
    id: 'pemeliharaan-parent',
    label: 'PEMELIHARAAN',
    desc: 'Pemeliharaan Gardu, Proteksi & Jaringan',
    icon: Wrench,
    isParent: true,
    children: [
      {
        id: 'data-peralatan',
        label: 'DATA PERALATAN',
        desc: 'Master Data Asset & Peralatan',
        icon: Cpu,
        defaultTab: 'peralatan-relay'
      },
      {
        id: 'hargi',
        label: 'HARGI',
        desc: 'Pemeliharaan Gardu Induk',
        icon: Zap,
        defaultTab: 'hargi-overview'
      },
      {
        id: 'harpro',
        label: 'HARPRO',
        desc: 'Pemeliharaan Proteksi',
        icon: ShieldCheck,
        defaultTab: 'harpro-overview'
      },
      {
        id: 'harjar',
        label: 'HARJAR',
        desc: 'Pemeliharaan Jaringan & Transmisi',
        icon: GitBranch,
        defaultTab: 'harjar-overview'
      }
    ]
  }
];

export const getFlatDomainsList = () => {
  const flat = [];
  domainsList.forEach(item => {
    if (item.children) {
      item.children.forEach(child => flat.push(child));
    } else {
      flat.push(item);
    }
  });
  return flat;
};

export default function Header({ activeDomain, setActiveDomain, setActiveTab, apiKey, activeModel, onLogout, loggedInUser }) {
  const [timeStr, setTimeStr] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredParentId, setHoveredParentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  // State untuk Profil & Dropdown Logout
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' };
      const datePart = now.toLocaleDateString('id-ID', options);
      const timePart = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' });
      setTimeStr(`${datePart} | ${timePart} WIB`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHoveredParentId(null);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const flatList = getFlatDomainsList();
  const currentDomainObj = flatList.find(d => d.id === activeDomain) || flatList[0];
  const CurrentIcon = currentDomainObj.icon || LayoutDashboard;

  const handleSelectDomain = (dom) => {
    setActiveDomain(dom.id);
    if (setActiveTab) setActiveTab(dom.defaultTab);
    setIsDropdownOpen(false);
    setHoveredParentId(null);
  };

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '8px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Left: Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img 
          src="/ULTG.png" 
          alt="PLN ULTG Bekasi" 
          style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              PT PLN PERSERO ULTG BEKASI
            </h1>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#00A2E9', fontWeight: 800, margin: '1px 0 0 0', letterSpacing: '0.02em' }}>
            UNIT LAYANAN TRANSMISI DAN GARDU INDUK BEKASI
          </p>
        </div>
      </div>

      {/* Center: Search Bar + PLN Top Mega Dropdown Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari Menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#00A2E9'; }}
            onBlur={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          />
        </div>

        {/* Mega Dropdown Button */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              if (isDropdownOpen) setHoveredParentId(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 18px',
              borderRadius: '24px',
              backgroundColor: isDropdownOpen ? '#E0F2FE' : '#F1F5F9',
              border: isDropdownOpen ? '1px solid #00A2E9' : '1px solid #E2E8F0',
              color: isDropdownOpen ? '#0284C7' : '#1E293B',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isDropdownOpen ? '0 4px 12px rgba(0, 162, 233, 0.18)' : 'none'
            }}
          >
            <CurrentIcon size={18} color={isDropdownOpen ? '#00A2E9' : '#475569'} />
            <span>{currentDomainObj.label}</span>
            <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {/* Main Dropdown Panel */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '125%',
              left: 0,
              width: '310px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 20px 35px -5px rgba(15, 23, 42, 0.22), 0 0 1px 1px rgba(0,0,0,0.06)',
              padding: '14px',
              zIndex: 200,
              animation: 'fadeIn 0.18s ease'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {domainsList.map((dom) => {
                  const Icon = dom.icon;
                  const isParent = Boolean(dom.isParent);
                  const isSelected = !isParent && activeDomain === dom.id;
                  const isChildActive = isParent && dom.children?.some(c => c.id === activeDomain);
                  const isHovered = hoveredParentId === dom.id;

                  return (
                    <div key={dom.id} style={{ position: 'relative' }}>
                      <div
                        onClick={(e) => {
                          if (isParent) {
                            e.stopPropagation();
                            setHoveredParentId(isHovered ? null : dom.id);
                          } else {
                            handleSelectDomain(dom);
                          }
                        }}
                        onMouseEnter={() => {
                          if (isParent) {
                            setHoveredParentId(dom.id);
                          } else {
                            setHoveredParentId(null);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          backgroundColor: (isSelected || isChildActive || isHovered) ? '#EFF6FF' : 'transparent',
                          borderLeft: (isSelected || isChildActive) ? '4px solid #2563EB' : '4px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: (isSelected || isChildActive || isHovered) ? '#2563EB' : '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: (isSelected || isChildActive || isHovered) ? '#FFFFFF' : '#475569',
                            flexShrink: 0
                          }}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: (isSelected || isChildActive || isHovered) ? 800 : 700, color: (isSelected || isChildActive || isHovered) ? '#1E3A8A' : '#0F172A' }}>
                              {dom.label}
                            </div>
                          </div>
                        </div>

                        {isParent && (
                          <ChevronRight
                            size={18}
                            style={{
                              color: (isChildActive || isHovered) ? '#2563EB' : '#94A3B8',
                              transform: isHovered ? 'translateX(3px)' : 'none',
                              transition: 'all 0.15s ease',
                              flexShrink: 0
                            }}
                          />
                        )}
                      </div>

                      {/* Flyout Side Menu ("Di kanan tanda panah bukan di kirinya") */}
                      {isParent && isHovered && (
                        <div
                          onMouseEnter={() => setHoveredParentId(dom.id)}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '100%',
                            marginLeft: '12px',
                            width: '340px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px -5px rgba(15, 23, 42, 0.28), 0 0 1px 1px rgba(0,0,0,0.08)',
                            padding: '14px',
                            zIndex: 300,
                            animation: 'fadeIn 0.18s ease'
                          }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                            {dom.children?.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildSelected = activeDomain === child.id;
                              return (
                                <div
                                  key={child.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectDomain(child);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    backgroundColor: isChildSelected ? '#EFF6FF' : 'transparent',
                                    borderLeft: isChildSelected ? '4px solid #2563EB' : '4px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isChildSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isChildSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '8px',
                                    backgroundColor: isChildSelected ? '#2563EB' : '#F1F5F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isChildSelected ? '#FFFFFF' : '#475569',
                                    flexShrink: 0
                                  }}>
                                    <ChildIcon size={20} />
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '0.98rem', fontWeight: isChildSelected ? 800 : 700, color: isChildSelected ? '#1E3A8A' : '#0F172A' }}>
                                      {child.label}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Operational Time & Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.84rem', color: '#0F172A', fontWeight: 800, margin: 0 }}>{timeStr}</p>
        </div>
        
        {/* User Profile Dropdown */}
        {loggedInUser && (
          <div style={{ position: 'relative' }} ref={profileDropdownRef}>
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px 6px 6px',
                backgroundColor: '#00A2E9', // Biru PLN
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 162, 233, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#008AC6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00A2E9'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: '#FFFFFF', color: '#00A2E9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.8rem'
              }}>
                {getInitials(loggedInUser.username)}
              </div>
              {loggedInUser.username}
              <ChevronDown size={16} />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div style={{
                position: 'absolute', top: '120%', right: 0,
                width: '160px', backgroundColor: '#FFFFFF',
                borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                overflow: 'hidden', border: '1px solid #E2E8F0', zIndex: 50
              }}>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsProfileDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '12px 16px', border: 'none',
                    backgroundColor: 'transparent', color: '#0F172A',
                    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                    textAlign: 'left', transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={16} color="#64748B" /> Profil
                </button>
                <div style={{ height: '1px', backgroundColor: '#E2E8F0' }} />
                <button
                  onClick={onLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '12px 16px', border: 'none',
                    backgroundColor: 'transparent', color: '#EF4444',
                    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                    textAlign: 'left', transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={loggedInUser}
        onLogout={onLogout}
      />
    </header>
  );
}
