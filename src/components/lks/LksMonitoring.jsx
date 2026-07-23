import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle2, Clock, Trash2, 
  PenTool, ShieldCheck, FileText, Building2, 
  Calendar, Eye, RefreshCw, Check, Plus, Printer
} from 'lucide-react';
import lksService from '../../services/lksService';
import DigitalSignatureModal from './DigitalSignatureModal';

export default function LksMonitoring({ onAddNew }) {
  const [lksList, setLksList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('SEMUA');
  const [selectedStatus, setSelectedStatus] = useState('SEMUA');

  // Modal State
  const [viewItem, setViewItem] = useState(null);
  const [approvalModalItem, setApprovalModalItem] = useState(null);
  const [approvalRole, setApprovalRole] = useState('TL');
  const [approverName, setApproverName] = useState('');
  const [approverNip, setApproverNip] = useState('');
  const [approverSig, setApproverSig] = useState('');
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);

  const loadData = () => {
    setLksList(lksService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = lksList.filter(item => {
    const matchBidang = selectedBidang === 'SEMUA' || item.bidang === selectedBidang;
    const matchStatus = selectedStatus === 'SEMUA' || item.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchQuery = !searchQuery || 
      item.nomorLks.toLowerCase().includes(q) ||
      (item.dataPeralatan?.namaPeralatan || '').toLowerCase().includes(q) ||
      item.penempatanPeralatan.toLowerCase().includes(q) ||
      item.pengaju.nama.toLowerCase().includes(q);
    return matchBidang && matchStatus && matchQuery;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Progress':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.76rem', fontWeight: 800 }}>
            <Clock size={13} /> On Progress
          </span>
        );
      case 'Approved':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#E0F2FE', color: '#0284C7', fontSize: '0.76rem', fontWeight: 800 }}>
            <ShieldCheck size={13} /> Approved
          </span>
        );
      case 'Done':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#D1FAE5', color: '#059669', fontSize: '0.76rem', fontWeight: 800 }}>
            <CheckCircle2 size={13} /> Done
          </span>
        );
      default:
        return status;
    }
  };

  const handleOpenApproval = (item, role) => {
    setApprovalModalItem(item);
    setApprovalRole(role);
    if (role === 'TL') {
      setApproverName(item.approval.tlNama || 'AHMAD Y. AL BASTOMY');
      setApproverNip(item.approval.tlNip || '921839182');
    } else {
      setApproverName(item.approval.managerNama || 'TRIAWAN AZHARY P. N.');
      setApproverNip(item.approval.managerNip || '891726351');
    }
    setApproverSig('');
  };

  const handleSaveApproval = () => {
    if (!approvalModalItem) return;

    let payload = {};
    if (approvalRole === 'TL') {
      payload = {
        tlApproved: true,
        tlNama: approverName,
        tlNip: approverNip,
        tlSignature: approverSig
      };
    } else {
      payload = {
        managerApproved: true,
        managerNama: approverName,
        managerNip: approverNip,
        managerSignature: approverSig
      };
    }

    const willBeApproved = (approvalModalItem.approval.tlApproved || approvalRole === 'TL') &&
      (approvalModalItem.approval.managerApproved || approvalRole === 'MANAGER');

    const nextStatus = willBeApproved ? 'Approved' : approvalModalItem.status;

    lksService.updateStatus(approvalModalItem.id, nextStatus, payload);
    setApprovalModalItem(null);
    loadData();
  };

  const handleSetDone = (id) => {
    if (window.confirm('Ubah status LKS ini menjadi Done (Selesai 100%)?')) {
      lksService.updateStatus(id, 'Done');
      loadData();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus dokumen LKS ini?')) {
      lksService.delete(id);
      loadData();
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Dashboard Monitoring LKS / LKP</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>Data Draf Standar Resmi Pemeliharaan ULTG Bekasi</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              <Plus size={16} /> Input LKS Baru
            </button>
          )}

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari LKS / Peralatan / GI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '20px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Bidang:</span>
          {['SEMUA', 'HARPRO', 'HARGI', 'HARJAR', 'JARGI'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBidang(b)}
              style={{ padding: '4px 12px', borderRadius: '14px', border: 'none', backgroundColor: selectedBidang === b ? '#00A2E9' : '#F1F5F9', color: selectedBidang === b ? '#FFFFFF' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {b}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
          {['SEMUA', 'On Progress', 'Approved', 'Done'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedStatus(s)}
              style={{ padding: '4px 12px', borderRadius: '14px', border: 'none', backgroundColor: selectedStatus === s ? '#0F172A' : '#F1F5F9', color: selectedStatus === s ? '#FFFFFF' : '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Monitoring Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '10px 12px' }}>No. LKS & Tanggal</th>
              <th style={{ padding: '10px 12px' }}>Nama Peralatan</th>
              <th style={{ padding: '10px 12px' }}>Penempatan Peralatan</th>
              <th style={{ padding: '10px 12px' }}>Jenis Kerusakan</th>
              <th style={{ padding: '10px 12px' }}>Status</th>
              <th style={{ padding: '10px 12px' }}>ACC TL & Mgr</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>Belum ada data LKS yang sesuai.</td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.nomorLks}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{item.tanggalKejadian}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#334155' }}>{item.dataPeralatan?.namaPeralatan || '-'}</div>
                    <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 800 }}>{item.bidang}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                    {item.penempatanPeralatan}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#0F172A', fontWeight: 600 }}>
                    {item.jenisKerusakan}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.74rem' }}>
                      <span style={{ color: item.approval.tlApproved ? '#059669' : '#D97706', fontWeight: 700 }}>
                        TL: {item.approval.tlApproved ? `✓ ${item.approval.tlNama}` : '⏳ Belum ACC'}
                      </span>
                      <span style={{ color: item.approval.managerApproved ? '#059669' : '#D97706', fontWeight: 700 }}>
                        MGR: {item.approval.managerApproved ? `✓ ${item.approval.managerNama}` : '⏳ Belum ACC'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setViewItem(item)}
                        title="Lihat Draf / Cetak"
                        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', cursor: 'pointer' }}
                      >
                        <Eye size={14} />
                      </button>

                      {!item.approval.tlApproved && (
                        <button
                          type="button"
                          onClick={() => handleOpenApproval(item, 'TL')}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#0284C7', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ACC TL
                        </button>
                      )}

                      {!item.approval.managerApproved && (
                        <button
                          type="button"
                          onClick={() => handleOpenApproval(item, 'MANAGER')}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#4F46E5', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ACC MGR
                        </button>
                      )}

                      {item.status !== 'Done' && (
                        <button
                          type="button"
                          onClick={() => handleSetDone(item.id)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Done
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal View 1:1 Docx Output */}
      {viewItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', width: '800px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontFamily: 'serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/ULTG.png" alt="PLN" style={{ height: '40px' }} onError={(e) => e.target.style.display = 'none'} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>PT PLN (PERSERO) ULTG BEKASI</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>LEMBAR KERJA PEMELIHARAAN (LKP)</p>
                </div>
              </div>
              <button type="button" onClick={() => setViewItem(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', fontFamily: 'sans-serif' }}>✕</button>
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#000' }}>
              <h3 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px' }}>LEMBAR KERJA PEMELIHARAAN (LKP)</h3>
              
              <p style={{ fontWeight: 'bold', margin: '12px 0 4px 0' }}>DATA PERALATAN</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                <tbody>
                  <tr><td style={{ width: '160px' }}>Nama Peralatan</td><td>: {viewItem.dataPeralatan?.namaPeralatan || '-'}</td></tr>
                  <tr><td>Merk</td><td>: {viewItem.dataPeralatan?.merk || '-'}</td></tr>
                  <tr><td>Type</td><td>: {viewItem.dataPeralatan?.type || '-'}</td></tr>
                  <tr><td>No Seri</td><td>: {viewItem.dataPeralatan?.noSeri || '-'}</td></tr>
                  <tr><td>Harga</td><td>: {viewItem.dataPeralatan?.harga || '-'}</td></tr>
                  <tr><td>Kode Asset</td><td>: {viewItem.dataPeralatan?.kodeAsset || '-'}</td></tr>
                  <tr><td>Tahun Operasi</td><td>: {viewItem.dataPeralatan?.tahunOperasi || '-'}</td></tr>
                  <tr><td>Tahun Buat</td><td>: {viewItem.dataPeralatan?.tahunBuat || '-'}</td></tr>
                </tbody>
              </table>

              <p style={{ margin: '8px 0' }}><b>PENEMPATAN PERALATAN:</b> {viewItem.penempatanPeralatan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>TANGGAL KEJADIAN:</b> {viewItem.tanggalKejadian || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>JENIS KERUSAKAN:</b> {viewItem.jenisKerusakan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>PENYEBAB KERUSAKAN:</b> {viewItem.penyebabKerusakan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>AKIBAT KERUSAKAN:</b> {viewItem.akibatKerusakan || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>USUL DAN SARAN:</b> {viewItem.usulDanSaran || '-'}</p>
              <p style={{ margin: '8px 0' }}><b>LAMPIRAN:</b> {viewItem.lampiranText || '-'}</p>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 10px 0' }}><b>Mengetahui,<br />{viewItem.approval.tlJabatan || 'TL TERKAIT'}</b></p>
                  {viewItem.approval.tlSignature ? (
                    <img src={viewItem.approval.tlSignature} alt="TTD TL" style={{ height: '60px', marginBottom: '8px' }} />
                  ) : (
                    <div style={{ height: '60px' }} />
                  )}
                  <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>{viewItem.approval.tlNama || viewItem.pengaju.nama}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>NIP. {viewItem.approval.tlNip || '-'}</p>
                </div>

                <div>
                  <p style={{ margin: '0 0 10px 0' }}>Bekasi, {viewItem.tanggalKejadian}<br /><b>Mengetahui,<br />MANAGER ULTG BEKASI</b></p>
                  {viewItem.approval.managerSignature ? (
                    <img src={viewItem.approval.managerSignature} alt="TTD Mgr" style={{ height: '60px', marginBottom: '8px' }} />
                  ) : (
                    <div style={{ height: '60px' }} />
                  )}
                  <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>{viewItem.approval.managerNama || 'TRIAWAN AZHARY P. N.'}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>MANAGER ULTG BEKASI</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'right', fontFamily: 'sans-serif' }}>
              <button type="button" onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#00A2E9', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={16} /> Print Dokumen Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Approval */}
      {approvalModalItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '450px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
              Approval {approvalRole === 'TL' ? 'Team Leader (TL)' : 'Manager ULTG'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>
              No. LKS: <b>{approvalModalItem.nomorLks}</b><br />
              Peralatan: <b>{approvalModalItem.dataPeralatan?.namaPeralatan}</b>
            </p>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Nama Pejabat Penandatangan</label>
              <input type="text" value={approverName} onChange={(e) => setApproverName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Tanda Tangan Digital</label>
              {approverSig ? (
                <div style={{ border: '1px solid #10B981', borderRadius: '8px', padding: '6px', backgroundColor: '#F0FDF4', textAlign: 'center' }}>
                  <img src={approverSig} alt="TTD" style={{ maxHeight: '60px' }} />
                  <button type="button" onClick={() => setIsSigModalOpen(true)} style={{ display: 'block', margin: '2px auto 0 auto', border: 'none', background: 'none', color: '#0284C7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Ubah TTD</button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsSigModalOpen(true)} style={{ width: '100%', padding: '12px', border: '1px dashed #CBD5E1', borderRadius: '8px', backgroundColor: '#F8FAFC', color: '#0284C7', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  + Tambah Tanda Tangan Digital
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setApprovalModalItem(null)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Batal</button>
              <button type="button" onClick={handleSaveApproval} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#00A2E9', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Simpan Approval</button>
            </div>
          </div>
        </div>
      )}

      <DigitalSignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(dataUrl) => setApproverSig(dataUrl)}
        title={`Tanda Tangan Digital ${approvalRole === 'TL' ? 'TL' : 'Manager'}`}
      />
    </div>
  );
}
