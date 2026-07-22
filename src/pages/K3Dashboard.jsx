import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Upload, ClipboardCheck, Sun, 
  BookOpen, AlertCircle, Megaphone, AlertTriangle, 
  Activity, Award, Clock, ChevronRight, CheckCircle2
} from 'lucide-react';

const K3_CARDS = [
  {
    id: 'peralatan-k3',
    title: 'Pembaruan Data Peralatan K3',
    subtitle: 'Sistem Proteksi Kebakaran, CCTV, Tanggap Darurat, & Denah',
    icon: ShieldCheck,
    color: '#3B82F6', // Blue
    bgColor: '#EFF6FF'
  },
  {
    id: 'temuan-inspekta',
    title: 'Temuan Inspekta Manajemen UPT',
    subtitle: 'Laporan hasil inspeksi & tindak lanjut',
    icon: Search,
    color: '#8B5CF6', // Purple
    bgColor: '#F5F3FF'
  },
  {
    id: 'scan-wp',
    title: 'Upload Scan Working Permit',
    subtitle: 'Dokumen Izin Kerja Digital',
    icon: Upload,
    color: '#10B981', // Emerald
    bgColor: '#D1FAE5'
  },
  {
    id: 'checklist-proteksi',
    title: 'Formulir Checklist Kesiapan',
    subtitle: 'Alat Proteksi Kebakaran',
    icon: ClipboardCheck,
    color: '#F59E0B', // Amber
    bgColor: '#FEF3C7'
  },
  {
    id: 'morning-report',
    title: 'Morning Report Satgas Safety',
    subtitle: 'Laporan Harian UIT JBT',
    icon: Sun,
    color: '#EAB308', // Yellow
    bgColor: '#FEF08A'
  },
  {
    id: 'super-one-ik',
    title: 'SUPER ONE: Standardisasi IK',
    subtitle: 'Instruksi Kerja Standar',
    icon: BookOpen,
    color: '#0EA5E9', // Sky
    bgColor: '#E0F2FE'
  },
  {
    id: 'super-one-ccv',
    title: 'SUPER ONE: Critical Verification',
    subtitle: '(CCV) Pemastian Kritis',
    icon: CheckCircle2,
    color: '#059669', // Green
    bgColor: '#A7F3D0'
  },
  {
    id: 'super-one-slt',
    title: 'SUPER ONE: Safety Leader Talk',
    subtitle: 'Arahan & Sosialisasi K3',
    icon: Megaphone,
    color: '#EC4899', // Pink
    bgColor: '#FCE7F3'
  },
  {
    id: 'super-one-anomali',
    title: 'SUPER ONE: Temuan Anomali',
    subtitle: 'Laporan Anomali Inspekta',
    icon: AlertTriangle,
    color: '#EF4444', // Red
    bgColor: '#FEE2E2'
  },
  {
    id: 'asesmen-k3',
    title: 'Asesmen Peralatan K3',
    subtitle: 'Penilaian kelayakan & kepatuhan',
    icon: Activity,
    color: '#14B8A6', // Teal
    bgColor: '#CCFBF1'
  },
  {
    id: 'lomba-5s',
    title: 'Penilaian Lomba 5S',
    subtitle: 'Pemantauan 5S Pos Satpam',
    icon: Award,
    color: '#F43F5E', // Rose
    bgColor: '#FFE4E6'
  },
  {
    id: 'coming-soon',
    title: 'Segera Hadir',
    subtitle: 'Modul tambahan sedang dalam pengembangan',
    icon: Clock,
    color: '#94A3B8', // Slate
    bgColor: '#F1F5F9'
  }
];

export default function K3Dashboard({ setActiveTab }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '16px', 
        padding: '24px', 
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} color="#0F766E" />
            Dashboard Utama K3
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#64748B', fontSize: '0.95rem', fontWeight: 600 }}>
            Pilih modul atau formulir Kesehatan dan Keselamatan Kerja (K3) yang ingin Anda akses.
          </p>
        </div>
      </div>

      {/* 12 Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {K3_CARDS.map((card, idx) => {
          const isHovered = hoveredCard === idx;
          const IconComponent = card.icon;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                borderLeft: `6px solid ${card.color}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                cursor: card.id === 'coming-soon' ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered && card.id !== 'coming-soon' ? 'translateY(-6px)' : 'none',
                boxShadow: isHovered && card.id !== 'coming-soon' 
                  ? `0 16px 32px ${card.color}25` 
                  : '0 4px 15px rgba(15,23,42,0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => {
                if (card.id === 'peralatan-k3') {
                  if (setActiveTab) setActiveTab('peralatan-k3');
                } else if (card.id !== 'coming-soon') {
                  alert(`Modul "${card.title}" akan segera tersedia pada pembaruan berikutnya!`);
                }
              }}
            >
              {/* Background Accent */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: card.bgColor,
                opacity: 0.6,
                zIndex: 0
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                <div style={{ 
                  backgroundColor: card.bgColor, 
                  color: card.color,
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'inline-flex'
                }}>
                  <IconComponent size={24} />
                </div>
                {card.id !== 'coming-soon' && (
                  <div style={{ 
                    color: isHovered ? card.color : '#CBD5E1', 
                    transition: 'color 0.3s ease',
                    transform: isHovered ? 'translateX(4px)' : 'none'
                  }}>
                    <ChevronRight size={20} strokeWidth={3} />
                  </div>
                )}
              </div>
              
              <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.3 }}>
                  {card.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600, lineHeight: 1.4 }}>
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
