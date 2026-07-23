import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle2, Clock, CheckCheck, Trash2, 
  PenTool, X, ShieldCheck, FileText, Building2, UserCheck, 
  Calendar, AlertCircle, Eye, RefreshCw, Check
} from 'lucide-react';
import lksService from '../../services/lksService';
import DigitalSignatureModal from './DigitalSignatureModal';

export default function LksMonitoring({ onAddNew }) {
  const [lksList, setLksList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('SEMUA');
  const [selectedStatus, setSelectedStatus] = useState('SEMUA');

  // Approval Modal State
  const [approvalModalItem, setApprovalModalItem] = useState(null);
  const [approvalRole, setApprovalRole] = useState('TL'); // 'TL' or 'MANAGER'
  const [approverName, setApproverName] = useState('');
  const [approverNote, setApproverNote] = useState('');
  const [approverSignature, setApproverSignature] = useState(null);
  const [isDigitalSigModalOpen, setIsDigitalSigModalOpen] = useState(false);

  // Detail Modal State
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Load LKS data from lksService
  const refreshData = () => {
    const data = lksService.getAll();
    setLksList(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered List calculation
  const filteredList = useMemo(() => {
    return lksList.filter((item) => {
      // 1. Search Query Filter (No LKS, Lokasi GI, Nama Pengaju)
      const q = searchQuery.toLowerCase().trim();
      const matchNoLks = (item.nomorLks || '').toLowerCase().includes(q);
      const matchLokasi = (item.substation || '').toLowerCase().includes(q);
      const matchPengaju = (
        (item.namaStaff || '') + ' ' + 
        (item.pelaksana || '') + ' ' + 
        (item.supervisor || '')
      ).toLowerCase().includes(q);

      const matchesSearch = !q || matchNoLks || matchLokasi || matchPengaju;

      // 2. Bidang Filter
      const itemBidang = (item.tim || '').toUpperCase();
      const matchesBidang = selectedBidang === 'SEMUA' || itemBidang === selectedBidang;

      // 3. Status Filter
      const matchesStatus = selectedStatus === 'SEMUA' || item.status === selectedStatus;

      return matchesSearch && matchesBidang && matchesStatus;
    });
  }, [lksList, searchQuery, selectedBidang, selectedStatus]);

  // Handle opening Approval Modal
  const openApprovalModal = (item, role) => {
    setApprovalModalItem(item);
    setApprovalRole(role);
    setApproverNote('');
    
    const existingApproval = item.approvalInfo || {};
    if (role === 'TL') {
      setApproverName(existingApproval.spvName || item.supervisor || 'Supervisor ' + (item.tim || 'HARPRO'));
      setApproverSignature(existingApproval.spvSignature || null);
    } else {
      setApproverName(existingApproval.managerName || existingApproval.approvedBy || 'Manager ULTG Bekasi');
      setApproverSignature(existingApproval.managerSignature || null);
    }
  };

  const closeApprovalModal = () => {
    setApprovalModalItem(null);
    setApproverName('');
    setApproverNote('');
    setApproverSignature(null);
    setIsDigitalSigModalOpen(false);
  };

  // Submit Approval
  const handleSaveApproval = () => {
    if (!approvalModalItem) return;
    if (!approverName.trim()) {
      alert('Mohon isi Nama Penandatangan/Approver.');
      return;
    }
    if (!approverSignature) {
      alert('Mohon bubuhkan Tanda Tangan Digital terlebih dahulu.');
      return;
    }

    const item = approvalModalItem;
    const nowIso = new Date().toISOString();
    const existingApproval = item.approvalInfo || {};

    let updatedApproval = { ...existingApproval };

    if (approvalRole === 'TL') {
      updatedApproval.ttdSpv = true;
      updatedApproval.spvName = approverName.trim();
      updatedApproval.spvSignature = approverSignature;
      updatedApproval.spvApprovedAt = nowIso;
    } else {
      updatedApproval.ttdManager = true;
      updatedApproval.managerName = approverName.trim();
      updatedApproval.managerSignature = approverSignature;
      updatedApproval.managerApprovedAt = nowIso;
    }

    if (approverNote.trim()) {
      updatedApproval.catatan = approverNote.trim();
    }

    // Check if both TL & Manager have signed off
    const bothApproved = Boolean(updatedApproval.ttdSpv && updatedApproval.ttdManager);
    
    // Elevate status to 'Approved' if both signed, otherwise keep current status (or 'On Progress')
    let newStatus = item.status;
    if (bothApproved) {
      newStatus = 'Approved';
      updatedApproval.approvedBy = updatedApproval.managerName || 'Manager ULTG Bekasi';
      updatedApproval.approvedAt = nowIso;
    } else if (item.status !== 'Done') {
      newStatus = 'On Progress';
    }

    lksService.updateStatus(item.id, newStatus, updatedApproval);
    refreshData();
    closeApprovalModal();
  };

  // Handle Set Done
  const handleSetDone = (item) => {
    if (window.confirm(`Tandai LKS ${item.nomorLks} sebagai selesai (Done)?`)) {
      lksService.updateStatus(item.id, 'Done', item.approvalInfo || null);
      refreshData();
    }
  };

  // Handle Delete
  const handleDelete = (item) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus LKS ${item.nomorLks}? Data yang dihapus tidak dapat dikembalikan.`)) {
      lksService.delete(item.id);
      refreshData();
    }
  };

  // Render Bidang Badge
  const renderBidangBadge = (bidang) => {
    const b = (bidang || 'HARPRO').toUpperCase();
    const styles = {
      HARPRO: { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
      HARGI: { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF' },
      HARJAR: { bg: '#FFF7ED', text: '#EA580C', border: '#FFEDD5' },
      JARGI: { bg: '#ECFEFF', text: '#0891B2', border: '#CFFAFE' }
    };

    const style = styles[b] || { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`
      }}>
        {b}
      </span>
    );
  };

  // Render Status Badge
  const renderStatusBadge = (status) => {
    if (status === 'Approved') {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '4px 12px', borderRadius: '20px',
          fontSize: '0.78rem', fontWeight: 700,
          backgroundColor: '#E0F2FE', color: '#0284C7', border: '1px solid #BAE6FD'
        }}>
          <CheckCheck size={14} /> Approved
        </span>
      );
    }
    if (status === 'Done') {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '4px 12px', borderRadius: '20px',
          fontSize: '0.78rem', fontWeight: 700,
          backgroundColor: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0'
        }}>
          <CheckCircle2 size={14} /> Done
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '0.78rem', fontWeight: 700,
        backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D'
      }}>
        <Clock size={14} /> On Progress
      </span>
    );
  };

  // Render Approval Checklist
  const renderApprovalChecklist = (item) => {
    const info = item.approvalInfo || {};
    const tlOk = Boolean(info.ttdSpv);
    const mgrOk = Boolean(info.ttdManager);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '18px', height: '18px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: tlOk ? '#D1FAE5' : '#F1F5F9',
            color: tlOk ? '#059669' : '#94A3B8',
            fontSize: '10px', fontWeight: 800
          }}>
            {tlOk ? '✓' : '•'}
          </span>
          <span style={{ fontWeight: 600, color: tlOk ? '#059669' : '#64748B' }}>
            TL: {tlOk ? (info.spvName || 'ACC') : 'Belum ACC'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '18px', height: '18px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: mgrOk ? '#D1FAE5' : '#F1F5F9',
            color: mgrOk ? '#059669' : '#94A3B8',
            fontSize: '10px', fontWeight: 800
          }}>
            {mgrOk ? '✓' : '•'}
          </span>
          <span style={{ fontWeight: 600, color: mgrOk ? '#059669' : '#64748B' }}>
            Manager: {mgrOk ? (info.managerName || 'ACC') : 'Belum ACC'}
          </span>
        </div>
      </div>
    );
  };

  const totalCount = lksList.length;
  const onProgressCount = lksList.filter(i => i.status === 'On Progress').length;
  const approvedCount = lksList.filter(i => i.status === 'Approved').length;
  const doneCount = lksList.filter(i => i.status === 'Done').length;

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderLeft: '6px solid #005F8A'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              backgroundColor: '#E0F2FE', color: '#005F8A',
              padding: '8px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Dashboard Monitoring LKS
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
            Monitoring & Approval Lembar Kerja Selesai (LKS) ULTG Bekasi
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={refreshData}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '10px',
              border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
              color: '#475569', fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <RefreshCw size={16} /> Refresh Data
          </button>

          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', borderRadius: '10px',
                border: 'none', backgroundColor: '#005F8A',
                color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 95, 138, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004A6B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005F8A'}
            >
              <Plus size={18} /> Buat LKS Baru
            </button>
          )}
        </div>
      </div>

      {/* Summary Counter Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px 20px',
          border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Total Dokumen LKS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{totalCount}</div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px 20px',
          border: '1px solid #FCD34D', borderLeft: '4px solid #F59E0B', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D97706', marginBottom: '4px' }}>On Progress</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B45309' }}>{onProgressCount}</div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px 20px',
          border: '1px solid #BAE6FD', borderLeft: '4px solid #0284C7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284C7', marginBottom: '4px' }}>Approved (TL & Mgr)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0369A1' }}>{approvedCount}</div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px 20px',
          border: '1px solid #A7F3D0', borderLeft: '4px solid #10B981', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', marginBottom: '4px' }}>Done (Selesai)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>{doneCount}</div>
        </div>
      </div>

      {/* Search & Filter Controls Panel */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 4px 15px -3px rgba(0,0,0,0.04)',
        marginBottom: '24px',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan No LKS, Lokasi GI, atau Nama Pengaju..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#005F8A';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 95, 138, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #F1F5F9'
          }}>
            {/* Bidang Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={14} /> Bidang:
              </span>
              {['SEMUA', 'HARPRO', 'HARGI', 'HARJAR', 'JARGI'].map((bidang) => {
                const isActive = selectedBidang === bidang;
                return (
                  <button
                    key={bidang}
                    type="button"
                    onClick={() => setSelectedBidang(bidang)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      border: isActive ? '1px solid #005F8A' : '1px solid #CBD5E1',
                      backgroundColor: isActive ? '#005F8A' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {bidang}
                  </button>
                );
              })}
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
                Status:
              </span>
              {['SEMUA', 'On Progress', 'Approved', 'Done'].map((status) => {
                const isActive = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      border: isActive ? '1px solid #005F8A' : '1px solid #CBD5E1',
                      backgroundColor: isActive ? '#005F8A' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 4px 20px -3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  No. LKS & Tanggal
                </th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Bidang
                </th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Pengaju
                </th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Lokasi GI & Peralatan
                </th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Approval TL & Manager
                </th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                    <AlertCircle size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>Tidak ada data LKS yang sesuai dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: isEven ? '#FFFFFF' : '#FAFAFA',
                        borderBottom: '1px solid #E2E8F0',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isEven ? '#FFFFFF' : '#FAFAFA'}
                    >
                      {/* No LKS & Tanggal */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>
                          {item.nomorLks}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <Calendar size={12} /> {item.tanggal || '-'}
                        </div>
                      </td>

                      {/* Bidang */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        {renderBidangBadge(item.tim)}
                      </td>

                      {/* Pengaju */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.85rem' }}>
                          {item.namaStaff || item.pelaksana || '-'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                          {item.jabatan || 'Teknisi Pemeliharaan'}
                        </div>
                      </td>

                      {/* Lokasi GI & Peralatan */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top', maxWidth: '240px' }}>
                        <div style={{ fontWeight: 700, color: '#0284C7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={13} /> {item.substation}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.bay ? `${item.bay} - ` : ''}{item.peralatan || item.uraianPekerjaan || '-'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Approval Status */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        {renderApprovalChecklist(item)}
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
                          
                          {/* Detail Button */}
                          <button
                            type="button"
                            title="Lihat Detail LKS"
                            onClick={() => setDetailModalItem(item)}
                            style={{
                              padding: '6px 10px', borderRadius: '6px',
                              border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                              color: '#475569', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}
                          >
                            <Eye size={13} /> Detail
                          </button>

                          {/* ACC TL Button */}
                          <button
                            type="button"
                            title="Approval Team Leader (TL)"
                            onClick={() => openApprovalModal(item, 'TL')}
                            style={{
                              padding: '6px 10px', borderRadius: '6px',
                              border: item.approvalInfo?.ttdSpv ? '1px solid #A7F3D0' : '1px solid #BAE6FD',
                              backgroundColor: item.approvalInfo?.ttdSpv ? '#ECFDF5' : '#F0F9FF',
                              color: item.approvalInfo?.ttdSpv ? '#047857' : '#0284C7',
                              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}
                          >
                            <PenTool size={13} /> ACC TL
                          </button>

                          {/* ACC MGR Button */}
                          <button
                            type="button"
                            title="Approval Manager ULTG"
                            onClick={() => openApprovalModal(item, 'MANAGER')}
                            style={{
                              padding: '6px 10px', borderRadius: '6px',
                              border: item.approvalInfo?.ttdManager ? '1px solid #A7F3D0' : '1px solid #E9D5FF',
                              backgroundColor: item.approvalInfo?.ttdManager ? '#ECFDF5' : '#F3E8FF',
                              color: item.approvalInfo?.ttdManager ? '#047857' : '#7E22CE',
                              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}
                          >
                            <PenTool size={13} /> ACC MGR
                          </button>

                          {/* Set Done Button */}
                          {item.status !== 'Done' && (
                            <button
                              type="button"
                              title="Set Status Done"
                              onClick={() => handleSetDone(item)}
                              style={{
                                padding: '6px 10px', borderRadius: '6px',
                                border: '1px solid #A7F3D0', backgroundColor: '#D1FAE5',
                                color: '#059669', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                                display: 'inline-flex', alignItems: 'center', gap: '4px'
                              }}
                            >
                              <CheckCircle2 size={13} /> Set Done
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            title="Hapus LKS"
                            onClick={() => handleDelete(item)}
                            style={{
                              padding: '6px 8px', borderRadius: '6px',
                              border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2',
                              color: '#DC2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                              display: 'inline-flex', alignItems: 'center'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL DIALOG MODAL */}
      {approvalModalItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            width: '100%',
            maxWidth: '540px',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: approvalRole === 'TL' ? '#F0F9FF' : '#F3E8FF',
              borderBottom: `1px solid ${approvalRole === 'TL' ? '#BAE6FD' : '#E9D5FF'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  backgroundColor: approvalRole === 'TL' ? '#0284C7' : '#9333EA',
                  color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <PenTool size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Approval LKS - {approvalRole === 'TL' ? 'Team Leader (TL)' : 'Manager ULTG'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    {approvalModalItem.nomorLks}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeApprovalModal}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748B', padding: '4px', borderRadius: '50%'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* LKS Info Summary Box */}
              <div style={{
                backgroundColor: '#F8FAFC',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                marginBottom: '18px',
                fontSize: '0.825rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Gardu Induk:</span>{' '}
                    <strong style={{ color: '#0F172A' }}>{approvalModalItem.substation}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Bidang:</span>{' '}
                    <strong style={{ color: '#0F172A' }}>{approvalModalItem.tim}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Pengaju:</span>{' '}
                    <strong style={{ color: '#0F172A' }}>{approvalModalItem.namaStaff || approvalModalItem.pelaksana || '-'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Peralatan:</span>{' '}
                    <strong style={{ color: '#0F172A' }}>{approvalModalItem.peralatan || approvalModalItem.bay || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Form Input Approver Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Nama Penandatangan ({approvalRole === 'TL' ? 'Spv / TL' : 'Manager'}) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  placeholder="Masukkan nama lengkap & gelar"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Form Input Catatan */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Catatan / Rekomendasi (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={approverNote}
                  onChange={(e) => setApproverNote(e.target.value)}
                  placeholder="Catatan persetujuan atau arahan pekerjaan..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Digital Signature Area */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tanda Tangan Digital <span style={{ color: '#EF4444' }}>*</span>
                </label>

                {approverSignature ? (
                  <div style={{
                    border: '1px solid #10B981',
                    borderRadius: '10px',
                    backgroundColor: '#ECFDF5',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <CheckCircle2 size={15} /> Tanda Tangan Terpasang
                    </div>
                    <img
                      src={approverSignature}
                      alt="Preview TTD"
                      style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                    />
                    <div style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setIsDigitalSigModalOpen(true)}
                        style={{
                          padding: '6px 12px', borderRadius: '6px',
                          border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                          color: '#475569', fontSize: '0.78rem', fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Ubah Tanda Tangan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsDigitalSigModalOpen(true)}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '10px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  >
                    <PenTool size={28} style={{ color: '#94A3B8', marginBottom: '6px' }} />
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: 700, color: '#005F8A' }}>
                      Klik di sini untuk membubuhkan Tanda Tangan Digital
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      Bisa langsung menggambar di layar atau me-upload gambar TTD
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={closeApprovalModal}
                  style={{
                    padding: '9px 16px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    color: '#64748B', fontSize: '0.875rem', fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSaveApproval}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '9px 20px', borderRadius: '8px',
                    border: 'none',
                    backgroundColor: approvalRole === 'TL' ? '#0284C7' : '#9333EA',
                    color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  <Check size={16} /> Simpan Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Signature Canvas Modal */}
      <DigitalSignatureModal
        isOpen={isDigitalSigModalOpen}
        onClose={() => setIsDigitalSigModalOpen(false)}
        onSave={(dataUrl) => {
          setApproverSignature(dataUrl);
          setIsDigitalSigModalOpen(false);
        }}
        title={`Tanda Tangan Digital - ${approvalRole === 'TL' ? 'Supervisor / TL' : 'Manager ULTG'}`}
      />

      {/* LKS DETAIL MODAL */}
      {detailModalItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} style={{ color: '#005F8A' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Detail Lembar Kerja Selesai (LKS)
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    {detailModalItem.nomorLks}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Nomor LKS</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{detailModalItem.nomorLks}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Tanggal Pelaksanaan</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{detailModalItem.tanggal}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Bidang / Tim</div>
                  <div style={{ marginTop: '4px' }}>{renderBidangBadge(detailModalItem.tim)}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Status LKS</div>
                  <div style={{ marginTop: '4px' }}>{renderStatusBadge(detailModalItem.status)}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Lokasi Gardu Induk</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0284C7' }}>{detailModalItem.substation}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Bay / Peralatan</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    {detailModalItem.bay ? `${detailModalItem.bay} - ` : ''}{detailModalItem.peralatan || '-'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Pengaju / Pelaksana</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    {detailModalItem.namaStaff || detailModalItem.pelaksana || '-'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Supervisor / Spv</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    {detailModalItem.supervisor || '-'}
                  </div>
                </div>
              </div>

              {/* Deskripsi Pekerjaan */}
              <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Uraian Pekerjaan / Temuan:</div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1E293B', whiteSpace: 'pre-line' }}>
                  {detailModalItem.uraianPekerjaan || detailModalItem.uraianTemuan || detailModalItem.catatan || 'Tidak ada uraian'}
                </p>
              </div>

              {/* Tanda Tangan & Approval Details */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                  Status Tanda Tangan & Approval
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* TL Signature Box */}
                  <div style={{
                    padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0',
                    backgroundColor: detailModalItem.approvalInfo?.ttdSpv ? '#F0FDF4' : '#F8FAFC'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Team Leader / Supervisor:
                    </div>
                    {detailModalItem.approvalInfo?.ttdSpv ? (
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#059669' }}>
                          ✓ {detailModalItem.approvalInfo.spvName || 'ACC'}
                        </div>
                        {detailModalItem.approvalInfo.spvSignature && (
                          <img
                            src={detailModalItem.approvalInfo.spvSignature}
                            alt="TTD TL"
                            style={{ maxHeight: '70px', marginTop: '6px', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFF' }}
                          />
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', italic: 'true' }}>Belum ditandatangani</span>
                    )}
                  </div>

                  {/* Manager Signature Box */}
                  <div style={{
                    padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0',
                    backgroundColor: detailModalItem.approvalInfo?.ttdManager ? '#F0FDF4' : '#F8FAFC'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Manager ULTG:
                    </div>
                    {detailModalItem.approvalInfo?.ttdManager ? (
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#059669' }}>
                          ✓ {detailModalItem.approvalInfo.managerName || detailModalItem.approvalInfo.approvedBy || 'ACC'}
                        </div>
                        {detailModalItem.approvalInfo.managerSignature && (
                          <img
                            src={detailModalItem.approvalInfo.managerSignature}
                            alt="TTD Manager"
                            style={{ maxHeight: '70px', marginTop: '6px', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFF' }}
                          />
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', italic: 'true' }}>Belum ditandatangani</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setDetailModalItem(null)}
                  style={{
                    padding: '8px 20px', borderRadius: '8px',
                    border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF',
                    color: '#475569', fontSize: '0.875rem', fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
