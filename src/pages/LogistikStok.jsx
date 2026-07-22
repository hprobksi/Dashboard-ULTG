import React, { useState, useEffect } from 'react';
import { TrendingDown, Package, Search, Filter, AlertTriangle, RefreshCw, CheckCircle, Clock, MapPin, User } from 'lucide-react';

export default function LogistikStok() {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('stok');

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
        setTransactions(dataTrx.data || []);
      }
    } catch (e) {
      console.error('Error loading stock:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['ALL', 'Proteksi', 'Gardu', 'Jaringan', 'Catu Daya', 'Umum'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.namaBarang.toLowerCase().includes(search.toLowerCase()) ||
                          item.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.kategori.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const filteredTrx = transactions.filter(trx => {
    return trx.namaBarang.toLowerCase().includes(search.toLowerCase()) ||
           trx.namaGi.toLowerCase().includes(search.toLowerCase()) ||
           trx.namaPengambil.toLowerCase().includes(search.toLowerCase());
  });

  const totalItems = items.length;
  const criticalItems = items.filter(i => i.sisaStok <= 5).length;
  const totalKeluar = items.reduce((acc, curr) => acc + (curr.totalKeluar || 0), 0);

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '14px', margin: 0, letterSpacing: '-0.02em' }}>
            <TrendingDown size={34} color="#D97706" />
            Stok Material & Kartu Riwayat Gudang
          </h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #00A2E9' }}>
          <div style={{ backgroundColor: '#E0F2FE', padding: '14px', borderRadius: '12px' }}>
            <Package size={28} color="#00A2E9" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Katalog Material</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>{totalItems} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>Item</span></span>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #EF4444' }}>
          <div style={{ backgroundColor: '#FEE2E2', padding: '14px', borderRadius: '12px' }}>
            <AlertTriangle size={28} color="#EF4444" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Stok Kritis / Menipis (≤5)</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#DC2626', display: 'block' }}>{criticalItems} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>Barang</span></span>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #10B981' }}>
          <div style={{ backgroundColor: '#D1FAE5', padding: '14px', borderRadius: '12px' }}>
            <TrendingDown size={28} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Material Keluar</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>{totalKeluar} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>Pcs</span></span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Toolbar */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('stok')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'stok' ? '#00A2E9' : '#F1F5F9',
                color: activeTab === 'stok' ? '#FFFFFF' : '#475569',
                transition: 'all 0.18s ease'
              }}
            >
              📦 Katalog & Sisa Stok Gudang ({filteredItems.length})
            </button>

            <button
              onClick={() => setActiveTab('riwayat')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'riwayat' ? '#00A2E9' : '#F1F5F9',
                color: activeTab === 'riwayat' ? '#FFFFFF' : '#475569',
                transition: 'all 0.18s ease'
              }}
            >
              📜 Riwayat Transaksi Keluar ({filteredTrx.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, maxWidth: '520px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari nama barang, rak, atau nama GI..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px', width: '100%' }}
              />
            </div>

            {activeTab === 'stok' && (
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="input-field"
                style={{ width: '160px' }}
              >
                {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'Semua Kategori' : c}</option>)}
              </select>
            )}
          </div>

        </div>
      </div>

      {/* Main Table Content */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {activeTab === 'stok' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Nama Material</th>
                <th style={{ padding: '16px' }}>Kategori</th>
                <th style={{ padding: '16px' }}>Lokasi Rak</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Stok Awal</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Keluar</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Sisa Stok</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    Material tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isCritical = item.sisaStok <= 5;
                  const isZero = item.sisaStok <= 0;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0F172A' }}>
                        {item.namaBarang}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: '#EFF6FF', color: '#00A2E9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                          {item.kategori}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#475569', fontSize: '0.88rem' }}>
                        Rak {item.lokasi}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: '#64748B' }}>
                        {item.stokAwal} {item.satuan}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: '#D97706' }}>
                        {item.totalKeluar} {item.satuan}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: 800, fontSize: '1.05rem', color: isZero ? '#DC2626' : (isCritical ? '#D97706' : '#15803D') }}>
                        {item.sisaStok} {item.satuan}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {isZero ? (
                          <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                            Habis
                          </span>
                        ) : isCritical ? (
                          <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ⚠️ Menipis
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Waktu Keluar</th>
                <th style={{ padding: '16px' }}>Gardu Induk / Lokasi</th>
                <th style={{ padding: '16px' }}>Nama Material</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Jumlah</th>
                <th style={{ padding: '16px' }}>Pengambil</th>
                <th style={{ padding: '16px' }}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrx.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    Belum ada riwayat transaksi yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredTrx.map(trx => (
                  <tr key={trx.id} style={{ borderBottom: '1px solid #F1F5F9' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '16px 20px', fontSize: '0.84rem', color: '#64748B' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {trx.waktu}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#0F172A' }}>
                      <MapPin size={15} color="#00A2E9" style={{ display: 'inline', marginRight: '6px' }} />
                      {trx.namaGi}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>
                      {trx.namaBarang}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem' }}>
                        -{trx.jumlah}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#334155', fontWeight: 600 }}>
                      <User size={15} color="#10B981" style={{ display: 'inline', marginRight: '6px' }} />
                      {trx.namaPengambil}
                    </td>
                    <td style={{ padding: '16px', color: '#64748B', fontSize: '0.84rem', fontStyle: trx.keterangan ? 'normal' : 'italic' }}>
                      {trx.keterangan || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
