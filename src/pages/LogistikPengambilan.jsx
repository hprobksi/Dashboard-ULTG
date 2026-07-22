import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Package, MapPin, User, FileText, PlusCircle, Clock, RefreshCw } from 'lucide-react';

export default function LogistikPengambilan() {
  const [items, setItems] = useState([]);
  const [recentTrx, setRecentTrx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    namaGi: 'GI Bekasi',
    namaBarang: '',
    jumlah: 1,
    namaPengambil: '',
    keterangan: ''
  });

  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  const substations = [
    'GI Bekasi', 'GI Poncol', 'GI Tambun', 'GI Cikarang',
    'GI Cibitung', 'GI Harapan Indah', 'GI Babelan', 'GI Muara Bekasi',
    'GI Sukatani', 'GI Kedung Waringin', 'GI Deltamas', 'GI EJIP'
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const resStok = await fetch('/api/inventaris/stok');
      const dataStok = await resStok.json();
      if (dataStok.success) {
        setItems(dataStok.data || []);
      }

      const resTrx = await fetch('/api/inventaris/transaksi');
      const dataTrx = await resTrx.json();
      if (dataTrx.success) {
        setRecentTrx((dataTrx.data || []).slice(0, 10));
      }
    } catch (e) {
      console.error('Error loading inventaris data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectBarang = (nama) => {
    setFormData({ ...formData, namaBarang: nama });
    const found = items.find(i => i.namaBarang === nama);
    setSelectedItemDetail(found || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaBarang) {
      alert('⚠️ Silakan pilih barang material yang akan diambil!');
      return;
    }
    if (formData.jumlah <= 0) {
      alert('⚠️ Jumlah pengambilan minimal 1!');
      return;
    }
    if (selectedItemDetail && formData.jumlah > selectedItemDetail.sisaStok) {
      alert(`⚠️ Stok tidak mencukupi! Sisa stok saat ini hanya ${selectedItemDetail.sisaStok} ${selectedItemDetail.satuan}.`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/inventaris/add-transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waktu: new Date().toLocaleString('id-ID'),
          namaGi: formData.namaGi,
          namaBarang: formData.namaBarang,
          jumlah: Number(formData.jumlah),
          namaPengambil: formData.namaPengambil || 'Petugas ULTG',
          keterangan: formData.keterangan || 'Pemeliharaan rutin'
        })
      });
      const result = await res.json();
      if (result.success) {
        alert(`🎉 Pengambilan material berhasil dicatat & stok terpotong otomatis di sistem!`);
        setFormData({
          namaGi: 'GI Bekasi',
          namaBarang: '',
          jumlah: 1,
          namaPengambil: '',
          keterangan: ''
        });
        setSelectedItemDetail(null);
        loadData();
      } else {
        alert('⚠️ Gagal mencatat transaksi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('⚠️ Error koneksi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '14px', margin: 0, letterSpacing: '-0.02em' }}>
            <ShoppingCart size={34} color="#D97706" />
            Pengambilan Material & Kartu Gudang
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Form Pengambilan */}
        <div className="card" style={{ padding: '28px', borderTop: '5px solid #D97706' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={20} color="#D97706" /> Form Catat Transaksi Keluar
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <MapPin size={16} color="#00A2E9" /> Gardu Induk Tujuan *
                </label>
                <select
                  value={formData.namaGi}
                  onChange={e => setFormData({ ...formData, namaGi: e.target.value })}
                  className="input-field"
                  required
                >
                  {substations.map(gi => <option key={gi} value={gi}>{gi}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <User size={16} color="#00A2E9" /> Nama Petugas Pengambil *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Riki Hardianto / Tim Harpro"
                  value={formData.namaPengambil}
                  onChange={e => setFormData({ ...formData, namaPengambil: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                <Package size={16} color="#D97706" /> Pilih Material Gudang (Katalog Perkap) *
              </label>
              <select
                value={formData.namaBarang}
                onChange={e => handleSelectBarang(e.target.value)}
                className="input-field"
                required
              >
                <option value="">-- Pilih Material yang Akan Diambil --</option>
                {items.map(i => (
                  <option key={i.id} value={i.namaBarang}>
                    {i.namaBarang} ({i.kategori}) — Sisa: {i.sisaStok} {i.satuan} [{i.lokasi}]
                  </option>
                ))}
              </select>
            </div>

            {selectedItemDetail && (
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                    Informasi Stok Material Terpilih
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#78350F' }}>
                    {selectedItemDetail.namaBarang}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#92400E', display: 'block' }}>
                    Lokasi: Rak {selectedItemDetail.lokasi} | Kategori: {selectedItemDetail.kategori}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: selectedItemDetail.sisaStok > 5 ? '#15803D' : '#DC2626' }}>
                    {selectedItemDetail.sisaStok} {selectedItemDetail.satuan}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Tersedia di Gudang</span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Jumlah Ambil ({selectedItemDetail?.satuan || 'Pcs'}) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItemDetail?.sisaStok || 9999}
                  value={formData.jumlah}
                  onChange={e => setFormData({ ...formData, jumlah: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <FileText size={16} color="#64748B" /> Keterangan / Tujuan Penggunaan
                </label>
                <input
                  type="text"
                  placeholder="Misal: Penggantian relay OCR Bay Trafo 1 rusak..."
                  value={formData.keterangan}
                  onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn"
              style={{
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                fontWeight: 700,
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
              }}
            >
              <CheckCircle size={20} />
              {submitting ? 'Sedang Memproses Potong Stok...' : 'Konfirmasi Pengambilan Material Sekarang'}
            </button>
          </form>
        </div>

        {/* Riwayat Pengambilan Terkini */}
        <div className="card" style={{ padding: '24px', borderTop: '5px solid #00A2E9' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#00A2E9" /> 10 Transaksi Keluar Terakhir (Live Gudang)
          </h3>

          {recentTrx.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748B' }}>
              <Package size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p>Belum ada transaksi pengambilan tercatat hari ini.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '540px', overflowY: 'auto' }}>
              {recentTrx.map(trx => (
                <div key={trx.id} style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                      {trx.namaBarang}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <MapPin size={12} color="#00A2E9" /> {trx.namaGi} • <User size={12} color="#10B981" /> {trx.namaPengambil}
                    </span>
                    {trx.keterangan && (
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontStyle: 'italic', display: 'block', marginTop: '2px' }}>
                        "{trx.keterangan}"
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '4px 10px', borderRadius: '8px', display: 'inline-block' }}>
                      -{trx.jumlah}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                      {trx.waktu.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
