import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, ShoppingCart, Building, Clock, ShieldAlert,
  Search, Plus, Trash2, Send, RefreshCw, ArrowLeft, ArrowRight, Lock, LogIn,
  Package, TrendingDown, AlertTriangle, CheckCircle, Download, FileSpreadsheet,
  Edit, X, Key, LogOut, AlertCircle
} from 'lucide-react';
import Chart from 'chart.js/auto';

export default function LogistikPerkap({ activeSubTab = 'logistik-dashboard' }) {
  const [stockList, setStockList] = useState([]);
  const [trxList, setTrxList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchStock, setSearchStock] = useState('');
  const [searchHistory, setSearchHistory] = useState('');

  // Cart / Input Transaksi State
  const [waktuTrx, setWaktuTrx] = useState(new Date().toISOString().slice(0, 10));
  const [namaGi, setNamaGi] = useState('');
  const [namaPengambil, setNamaPengambil] = useState('');
  const [keteranganTrx, setKeteranganTrx] = useState('');
  const [selectedBarang, setSelectedBarang] = useState('');
  const [jumlahTrx, setJumlahTrx] = useState('');
  const [cart, setCart] = useState([]);

  // Laporan Bidang State
  const [selectedBidang, setSelectedBidang] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');

  // Admin & Modals State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminBarang, setAdminBarang] = useState('');
  const [adminStokBaru, setAdminStokBaru] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editingTrx, setEditingTrx] = useState(null);
  const [editForm, setEditForm] = useState({ waktu: '', namaGi: '', namaBarang: '', jumlah: '', satuan: '', namaPengambil: '', keterangan: '' });
  const [notification, setNotification] = useState(null);

  // Chart Ref
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Load Data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [resStok, resTrx] = await Promise.all([
        fetch('/api/inventaris/stok'),
        fetch('/api/inventaris/transaksi')
      ]);
      const dataStok = await resStok.json();
      const dataTrx = await resTrx.json();

      if (dataStok.success) setStockList(dataStok.data || []);
      if (dataTrx.success) setTrxList(dataTrx.data || []);
    } catch (e) {
      console.error('Failed to load inventory data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Render Chart.js when on dashboard tab and stockList is available
  useEffect(() => {
    if (activeSubTab !== 'logistik-dashboard' || stockList.length === 0 || !chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    // Sort data by sisaStok ascending and take top 15 lowest items
    const sorted = [...stockList].sort((a, b) => a.sisaStok - b.sisaStok);
    const topLowest = sorted.slice(0, 15);

    const labels = topLowest.map(i => i.namaBarang);
    const values = topLowest.map(i => i.sisaStok);

    const backgroundColors = values.map(val => {
      if (val <= 5) return 'rgba(231, 76, 60, 0.85)'; // Red for <= 5
      if (val <= 10) return 'rgba(243, 156, 18, 0.85)'; // Orange for <= 10
      return 'rgba(52, 152, 219, 0.85)'; // Blue for > 10
    });

    const borderColors = values.map(val => {
      if (val <= 5) return 'rgb(231, 76, 60)';
      if (val <= 10) return 'rgb(243, 156, 18)';
      return 'rgb(52, 152, 219)';
    });

    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sisa Stok Tersedia',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` Sisa Stok: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: { size: 11, weight: '600' }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [activeSubTab, stockList]);

  const totalItems = stockList.length;
  const totalOut = stockList.reduce((acc, curr) => acc + (curr.totalKeluar || 0), 0);
  const criticalCount = stockList.filter(i => i.sisaStok <= 5).length;

  const filteredStock = stockList.filter(i =>
    i.namaBarang.toLowerCase().includes(searchStock.toLowerCase()) ||
    (i.id || '').toLowerCase().includes(searchStock.toLowerCase())
  );

  const filteredHistory = trxList.filter(t =>
    (t.id || '').toLowerCase().includes(searchHistory.toLowerCase()) ||
    (t.namaGi || '').toLowerCase().includes(searchHistory.toLowerCase()) ||
    (t.namaBarang || '').toLowerCase().includes(searchHistory.toLowerCase()) ||
    (t.namaPengambil || '').toLowerCase().includes(searchHistory.toLowerCase()) ||
    (t.keterangan || '').toLowerCase().includes(searchHistory.toLowerCase())
  );

  const bidangList = [
    'GISGISTET NEWTAMBUN', 'GITET MUARATAWAR', 'HARGI', 'HARJAR', 'HARPRO',
    'GI FAJAR SW', 'GI CIKARANG', 'GI GANDAMEKAR', 'GI JABABEKA', 'GI MUARATAWAR',
    'GIS MARGAHAYU', 'GI PONCOL BARU', 'GI RAJAPAKSI', 'GI TAMBUN'
  ];

  const handleAddToCart = () => {
    if (!selectedBarang || !jumlahTrx || Number(jumlahTrx) <= 0) {
      alert('⚠️ Pilih barang dan pastikan jumlah minimal 1.');
      return;
    }

    const itemStok = stockList.find(s => s.namaBarang === selectedBarang);
    const satuan = itemStok ? itemStok.satuan : '-';

    const existingIndex = cart.findIndex(i => i.namaBarang === selectedBarang);
    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].jumlah += Number(jumlahTrx);
      if (keteranganTrx) {
        updatedCart[existingIndex].keterangan = updatedCart[existingIndex].keterangan
          ? updatedCart[existingIndex].keterangan + ", " + keteranganTrx
          : keteranganTrx;
      }
      setCart(updatedCart);
    } else {
      const cartItem = {
        id: Date.now() + Math.random(),
        waktu: waktuTrx || new Date().toISOString().slice(0, 10),
        namaGi,
        namaPengambil,
        keterangan: keteranganTrx,
        namaBarang: selectedBarang,
        jumlah: Number(jumlahTrx),
        satuan
      };
      setCart([...cart, cartItem]);
    }

    setSelectedBarang('');
    setJumlahTrx('');
    setKeteranganTrx('');
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleSubmitAllTrx = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) {
      alert('⚠️ Keranjang masih kosong! Tambahkan minimal satu barang ke daftar terlebih dahulu.');
      return;
    }

    if (!waktuTrx || !namaGi || !namaPengambil.trim()) {
      alert('⚠️ Data Belum Lengkap: Pastikan Tanggal, Bidang/GI, dan Nama Pengambil sudah terisi.');
      return;
    }

    try {
      const res = await fetch('/api/inventaris/add-transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            waktu: item.waktu || waktuTrx,
            namaGi: item.namaGi || namaGi,
            namaPengambil: item.namaPengambil || namaPengambil,
            namaBarang: item.namaBarang,
            jumlah: item.jumlah,
            keterangan: item.keterangan || ""
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 Berhasil! ${cart.length} transaksi berhasil dicatat dan stok gudang terpotong otomatis.`);
        setCart([]);
        setNamaPengambil('');
        setKeteranganTrx('');
        loadAllData();
      } else {
        alert(`❌ Gagal menyimpan transaksi: ${data.error}`);
      }
    } catch (e) {
      alert(`❌ Terjadi kesalahan jaringan: ${e.message}`);
    }
  };

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleLoginAdminSubmit = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setAdminPasswordInput('');
      setLoginError('');
      showNotification('success', '✅ Akses Diberikan! Selamat datang di Mode Administrator Master.');
    } else {
      setLoginError('⚠️ Password salah! Silakan coba lagi dengan kata sandi yang valid.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    showNotification('info', '🔒 Anda telah keluar dari mode Administrator.');
  };

  const handleOpenEditModal = (t) => {
    setEditingTrx(t);
    setEditForm({
      waktu: t.waktu || new Date().toISOString().slice(0, 10),
      namaGi: t.namaGi || 'GI Bekasi',
      namaBarang: t.namaBarang || '',
      jumlah: t.jumlah || 1,
      satuan: t.satuan || 'Pcs',
      namaPengambil: t.namaPengambil || '',
      keterangan: t.keterangan || ''
    });
  };

  const handleSaveEditTrx = async (e) => {
    e.preventDefault();
    if (!editingTrx) return;
    try {
      const payload = {
        id: editingTrx.id,
        ...editForm,
        jumlah: Number(editForm.jumlah || 1)
      };
      const res = await fetch('/api/inventaris/update-transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `✅ Transaksi (${editingTrx.id}) berhasil dikoreksi.`);
        setEditingTrx(null);
        loadAllData();
      } else {
        alert('Gagal mengupdate transaksi: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error koneksi ke server: ' + err.message);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminBarang || adminStokBaru === '') {
      alert('⚠️ Pilih barang dan masukkan angka stok baru!');
      return;
    }
    if (!window.confirm(`⚠️ Konfirmasi Perubahan Pasokan Master:\n\nBarang: ${adminBarang}\nStok Awal Baru: ${adminStokBaru}\n\nApakah Anda yakin ingin menyimpan perubahan ini?`)) return;
    try {
      const res = await fetch('/api/inventaris/update-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaBarang: adminBarang, stokFinal: Number(adminStokBaru) })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `✅ Stok master untuk "${adminBarang}" berhasil di-update menjadi ${adminStokBaru}!`);
        setAdminStokBaru('');
        loadAllData();
      } else {
        alert(`❌ Gagal update stok: ${data.error}`);
      }
    } catch (e) {
      alert(`❌ Error: ${e.message}`);
    }
  };

  const handleDeleteTrx = async (id) => {
    if (!window.confirm(`⚠️ Konfirmasi Hapus Transaksi:\n\nApakah Anda yakin ingin menghapus transaksi "${id}"?\nPerhatian: Data tidak dapat dikembalikan dan jumlah barang akan dikembalikan ke stok gudang otomatis!`)) return;
    try {
      const res = await fetch('/api/inventaris/delete-transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `✅ Transaksi (${id}) berhasil dihapus dan stok dikembalikan.`);
        loadAllData();
      } else {
        alert(`❌ Gagal menghapus: ${data.error}`);
      }
    } catch (e) {
      alert(`❌ Error: ${e.message}`);
    }
  };

  // Filter bidang details
  const getBidangDetails = () => {
    if (!selectedBidang) return [];
    return trxList.filter(t => {
      if (t.namaGi !== selectedBidang) return false;
      if (timeFilter === 'all') return true;
      const trxDate = new Date(t.waktu);
      if (isNaN(trxDate.getTime())) return true;
      const now = new Date();
      const diffDays = (now - trxDate) / (1000 * 60 * 60 * 24);
      if (timeFilter === '1w') return diffDays <= 7;
      if (timeFilter === '1m') return diffDays <= 30;
      if (timeFilter === '3m') return diffDays <= 90;
      if (timeFilter === '1y') return diffDays <= 365;
      return true;
    });
  };

  const getBidangDetailsGrouped = () => {
    const transactions = getBidangDetails();
    const grouped = {};
    transactions.forEach(trx => {
      const name = trx.namaBarang;
      if (!grouped[name]) {
        grouped[name] = {
          satuan: trx.satuan || 'Pcs',
          totalJumlah: 0,
          history: []
        };
      }
      grouped[name].totalJumlah += Number(trx.jumlah || 0);
      grouped[name].history.push({
        id: trx.id || Math.random(),
        tanggal: trx.waktu,
        jumlah: trx.jumlah,
        pengambil: trx.namaPengambil,
        keterangan: trx.keterangan,
        rawTrx: trx
      });
    });
    return grouped;
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1450px', margin: '0 auto', backgroundColor: '#F8FAFC', minHeight: '85vh', position: 'relative' }}>
      
      {/* Toast Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 100000,
          backgroundColor: notification.type === 'success' ? '#10B981' : (notification.type === 'error' ? '#EF4444' : '#3B82F6'),
          color: '#FFFFFF', padding: '16px 24px', borderRadius: '14px', fontWeight: 700,
          boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.98rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {notification.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Interactive Admin Login Modal (Matching SweetAlert / PLN style) */}
      {showLoginModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '440px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', border: '1px solid #E2E8F0', position: 'relative', textAlign: 'center'
          }}>
            <button
              type="button"
              onClick={() => { setShowLoginModal(false); setLoginError(''); setAdminPasswordInput(''); }}
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={24} />
            </button>

            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Key size={32} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>
              Login Administrator Master
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Masukkan kata sandi administrator untuk membuka fitur pemeliharaan stok master dan koreksi riwayat transaksi.
            </p>

            {loginError && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 14px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Password Administrator
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password admin (admin123)..."
                  value={adminPasswordInput}
                  onChange={e => setAdminPasswordInput(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(false); setLoginError(''); setAdminPasswordInput(''); }}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1.5, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
                >
                  <LogIn size={18} /> Login Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Edit Transaksi Modal (Koreksi Admin) */}
      {editingTrx && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', border: '1px solid #E2E8F0', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button
              type="button"
              onClick={() => setEditingTrx(null)}
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Koreksi Transaksi Admin
                </h3>
                <small style={{ color: '#64748B', fontWeight: 600 }}>ID: {editingTrx.id}</small>
              </div>
            </div>

            <form onSubmit={handleSaveEditTrx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Waktu Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.waktu}
                    onChange={e => setEditForm({ ...editForm, waktu: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Bidang / Gardu Induk
                  </label>
                  <select
                    required
                    value={editForm.namaGi}
                    onChange={e => setEditForm({ ...editForm, namaGi: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                  >
                    {[
                      'HARPRO', 'HARGI', 'HARJAR', 'GITET MUARATAWAR', 'GIGISTET NEW TAMBUN',
                      'GI FAJAR SW', 'GI CIKARANG', 'GI GANDAMEKAR', 'GI JABABEKA',
                      'GI MUARATAWAR', 'GIS MARGAHAYU', 'GI PONCOL BARU', 'GI RAJAPAKSI', 'GI TAMBUN'
                    ].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Nama Barang
                </label>
                <select
                  required
                  value={editForm.namaBarang}
                  onChange={e => {
                    const found = stockList.find(s => s.namaBarang === e.target.value);
                    setEditForm({
                      ...editForm,
                      namaBarang: e.target.value,
                      satuan: found?.satuan || editForm.satuan
                    });
                  }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                >
                  <option value="" disabled>Pilih Barang...</option>
                  {stockList.map(s => (
                    <option key={s.id} value={s.namaBarang}>{s.namaBarang}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Jumlah Pengambilan
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.jumlah}
                    onChange={e => setEditForm({ ...editForm, jumlah: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '1.05rem', color: '#2563EB' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Satuan
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editForm.satuan}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', fontWeight: 700, color: '#64748B' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Nama Pengambil
                </label>
                <input
                  type="text"
                  required
                  value={editForm.namaPengambil}
                  onChange={e => setEditForm({ ...editForm, namaPengambil: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Keterangan / Keperluan
                </label>
                <input
                  type="text"
                  placeholder="Opsional..."
                  value={editForm.keterangan}
                  onChange={e => setEditForm({ ...editForm, keterangan: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setEditingTrx(null)}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                >
                  <CheckCircle size={18} /> Simpan Koreksi Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '20px 26px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
        <div>
          <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '14px', margin: 0, letterSpacing: '-0.02em' }}>
            {activeSubTab === 'logistik-dashboard' && <LayoutDashboard size={34} color="#2563EB" />}
            {activeSubTab === 'logistik-input' && <ShoppingCart size={34} color="#10B981" />}
            {activeSubTab === 'logistik-bidang' && <Building size={34} color="#D97706" />}
            {activeSubTab === 'logistik-history' && <Clock size={34} color="#6366F1" />}
            {activeSubTab === 'logistik-admin' && <ShieldAlert size={34} color="#EF4444" />}
            {activeSubTab === 'logistik-export' && <Download size={34} color="#00A2E9" />}
            
            {activeSubTab === 'logistik-dashboard' && 'Dashboard Stok'}
            {activeSubTab === 'logistik-input' && 'Input Transaksi'}
            {activeSubTab === 'logistik-bidang' && 'Laporan Bidang / GI'}
            {activeSubTab === 'logistik-history' && 'Histori Pengambilan'}
            {activeSubTab === 'logistik-admin' && 'Panel Admin'}
            {activeSubTab === 'logistik-export' && 'Export ke Excel'}
          </h1>
        </div>
      </div>

      {/* =========================================
          PAGE 1: DASHBOARD STOK (logistik-dashboard)
         ========================================= */}
      {activeSubTab === 'logistik-dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 3 Cards Container (Exact Perkap UI Layout) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)', borderTop: '4px solid #2563EB' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700, margin: 0 }}>Total Barang</h3>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', margin: '8px 0 0 0' }}>{totalItems}</h2>
              </div>
              <div style={{ backgroundColor: '#EFF6FF', padding: '16px', borderRadius: '14px' }}>
                <Package size={36} color="#2563EB" />
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)', borderTop: '4px solid #F59E0B' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700, margin: 0 }}>Total Pengeluaran</h3>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#D97706', margin: '8px 0 0 0' }}>{totalOut}</h2>
              </div>
              <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderRadius: '14px' }}>
                <TrendingDown size={36} color="#D97706" />
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)', borderTop: '4px solid #EF4444' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700, margin: 0 }}>Stok Kritis (&lt;= 5)</h3>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#EF4444', margin: '8px 0 0 0' }}>{criticalCount}</h2>
              </div>
              <div style={{ backgroundColor: '#FEE2E2', padding: '16px', borderRadius: '14px' }}>
                <AlertTriangle size={36} color="#EF4444" />
              </div>
            </div>
          </div>

          {/* Grafik 15 Barang dengan Stok Terendah (Exact Chart.js Canvas as Perkap_ULTG) */}
          <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
            <div style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Grafik 15 Barang dengan Stok Terendah
              </h3>
            </div>
            <div style={{ height: '340px', width: '100%', position: 'relative' }}>
              <canvas ref={chartRef} id="stockChart"></canvas>
            </div>
          </div>

          {/* Database Stok Real-Time Table */}
          <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Database Stok Real-Time
              </h3>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  id="search-stock"
                  placeholder="Cari nama barang..."
                  value={searchStock}
                  onChange={e => setSearchStock(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px', width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>ID Barang</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Nama Barang</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Satuan</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Stok Awal</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Total Keluar</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Sisa Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Belum ada data barang atau tidak ditemukan.</td></tr>
                  ) : (
                    filteredStock.map(item => {
                      const stok = item.sisaStok;
                      const isCritical = stok <= 5;
                      const isWarning = stok > 5 && stok <= 10;

                      let rowStyle = { borderBottom: '1px solid #F1F5F9' };
                      if (isCritical) rowStyle.backgroundColor = '#FEF2F2'; // var(--danger-bg)
                      else if (isWarning) rowStyle.backgroundColor = 'rgba(243, 156, 18, 0.1)';

                      return (
                        <tr key={item.id} style={rowStyle}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>{item.id || '-'}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>{item.namaBarang || '-'}</td>
                          <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 600 }}>{item.satuan || '-'}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: '#475569' }}>{item.stokAwal}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: '#475569' }}>{item.totalKeluar}</td>
                          <td style={{ padding: '14px 16px' }}>
                            {isCritical ? (
                              <span style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', display: 'inline-block' }}>
                                {stok} (Kritis)
                              </span>
                            ) : isWarning ? (
                              <span style={{ backgroundColor: '#F59E0B', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', display: 'inline-block' }}>
                                {stok} (Hampir Habis)
                              </span>
                            ) : (
                              <strong style={{ color: '#0F172A', fontSize: '0.98rem' }}>{stok}</strong>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          PAGE 2: INPUT TRANSAKSI (logistik-input)
         ========================================= */}
      {activeSubTab === 'logistik-input' && (
        <div className="card" style={{ padding: '32px', maxWidth: '960px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
          <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCart size={24} color="#10B981" /> Form Pengambilan Material
            </h2>
            <p style={{ color: '#64748B', margin: '6px 0 0 0', fontSize: '0.92rem' }}>
              Sistem Keranjang: Tambahkan beberapa barang sekaligus, lalu kirim dalam 1 klik.
            </p>
          </div>

          {/* 1. Informasi Pengambil */}
          <div style={{ marginBottom: '28px', borderBottom: '2px solid #F1F5F9', paddingBottom: '24px' }}>
            <h4 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#2563EB', marginBottom: '16px' }}>
              1. Informasi Pengambil
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Tanggal Pengambilan</label>
                <input
                  type="date"
                  value={waktuTrx}
                  onChange={e => setWaktuTrx(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Bidang / Nama GI</label>
                <select
                  value={namaGi}
                  onChange={e => setNamaGi(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                >
                  <option value="" disabled>Pilih Bidang / GI...</option>
                  {bidangList.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nama Pengambil</label>
                <input
                  type="text"
                  placeholder="Nama lengkap teknisi..."
                  value={namaPengambil}
                  onChange={e => setNamaPengambil(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Untuk pemeliharaan GI X..."
                  value={keteranganTrx}
                  onChange={e => setKeteranganTrx(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>
            </div>
          </div>

          {/* 2. Pilih Barang */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#2563EB', marginBottom: '16px' }}>
              2. Pilih Barang
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nama Barang</label>
                <select
                  value={selectedBarang}
                  onChange={e => setSelectedBarang(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                >
                  <option value="">Ketik 2-3 huruf untuk mencari...</option>
                  {stockList.map(item => (
                    <option key={item.id} value={item.namaBarang}>
                      {item.namaBarang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Satuan (Otomatis)</label>
                <input
                  type="text"
                  disabled
                  value={selectedBarang ? (stockList.find(s => s.namaBarang === selectedBarang)?.satuan || '-') : '-'}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Jumlah</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Angka..."
                  value={jumlahTrx}
                  onChange={e => setJumlahTrx(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn"
                  style={{ backgroundColor: '#1E293B', color: '#FFFFFF', fontWeight: 700, padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', height: '42px' }}
                >
                  <Plus size={18} /> Tambah ke Daftar
                </button>
              </div>
            </div>
          </div>

          {/* Keranjang Table */}
          <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
              Daftar Barang yang akan diambil:
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', color: '#334155', fontSize: '0.82rem' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Nama Barang</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Satuan</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jumlah</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Keterangan</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748B', fontStyle: 'italic' }}>
                      Belum ada barang di keranjang.
                    </td>
                  </tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{item.namaBarang}</td>
                      <td style={{ padding: '12px 14px', color: '#64748B', fontWeight: 600 }}>{item.satuan}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#D97706', fontSize: '1rem' }}>{item.jumlah}</td>
                      <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.86rem' }}>{item.keterangan || '-'}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(index)}
                          style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                          title="Hapus barang dari daftar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Actions */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={handleSubmitAllTrx}
              disabled={cart.length === 0}
              className="btn"
              style={{
                backgroundColor: cart.length > 0 ? '#2563EB' : '#94A3B8',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.05rem',
                padding: '16px 28px',
                borderRadius: '10px',
                border: 'none',
                cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Send size={22} /> KIRIM SEMUA TRANSAKSI
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          PAGE 3: LAPORAN BIDANG / GI (logistik-bidang)
         ========================================= */}
      {activeSubTab === 'logistik-bidang' && (
        <div>
          {!selectedBidang ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
                {bidangList.map(bidang => {
                  const trxBidang = trxList.filter(t => t.namaGi === bidang);
                  const totalBarang = trxBidang.reduce((sum, curr) => sum + Number(curr.jumlah || 0), 0);

                  return (
                    <div
                      key={bidang}
                      onClick={() => { setSelectedBidang(bidang); setTimeFilter('all'); }}
                      className="card"
                      style={{
                        padding: '22px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderLeft: '5px solid #2563EB',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>{bidang}</h3>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '6px', color: totalBarang > 0 ? '#2563EB' : '#64748B' }}>
                          {totalBarang} Item
                        </h2>
                      </div>
                      <ArrowRight size={28} color="#2563EB" />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="card" style={{ padding: '20px 24px', marginBottom: '20px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    onClick={() => setSelectedBidang(null)}
                    style={{ backgroundColor: '#64748B', color: '#FFFFFF', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={18} /> Kembali ke Daftar
                  </button>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    Detail Pengambilan: <span style={{ color: '#2563EB' }}>{selectedBidang}</span>
                  </h2>
                </div>

                <div>
                  <select
                    value={timeFilter}
                    onChange={e => setTimeFilter(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }}
                  >
                    <option value="all">Semua Waktu</option>
                    <option value="1w">1 Minggu Terakhir</option>
                    <option value="1m">1 Bulan Terakhir</option>
                    <option value="3m">3 Bulan Terakhir</option>
                    <option value="1y">1 Tahun Terakhir</option>
                  </select>
                </div>
              </div>

              <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
                  Akumulasi Barang Diambil
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>Nama Barang</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>Jumlah</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>Satuan</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, colSpan: isAdmin ? 2 : 3 }}>Keterangan / Akumulasi</th>
                        {isAdmin && <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700 }}>Aksi Admin</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getBidangDetailsGrouped()).length === 0 ? (
                        <tr><td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Belum ada riwayat pengambilan untuk bidang ini.</td></tr>
                      ) : (
                        Object.entries(getBidangDetailsGrouped()).map(([name, data]) => (
                          <React.Fragment key={`group-${name}`}>
                            {/* Header Row (Total Akumulasi) */}
                            <tr style={{ backgroundColor: '#F1F5F9', borderTop: '2px solid #E2E8F0' }}>
                              <td style={{ padding: '14px 16px' }}>
                                <strong style={{ color: '#1E293B', fontSize: '0.96rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Package size={16} color="#2563EB" /> {name}
                                </strong>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <strong style={{ color: '#2563EB', fontSize: '1.05rem' }}>{data.totalJumlah}</strong>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <strong style={{ color: '#1E293B' }}>{data.satuan}</strong>
                              </td>
                              <td colSpan={isAdmin ? 2 : 3} style={{ padding: '14px 16px' }}>
                                <small style={{ fontStyle: 'italic', color: '#64748B', fontWeight: 600 }}>
                                  (Total Akumulasi dari {data.history.length}x pengambilan)
                                </small>
                              </td>
                              {isAdmin && <td style={{ padding: '14px 16px' }}></td>}
                            </tr>

                            {/* Sub-detail Rows (Per Tanggal, terbaru duluan) */}
                            {data.history.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).map((hist, idx) => (
                              <tr key={`hist-${name}-${idx}`} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '10px 16px 10px 36px', color: '#64748B', fontSize: '0.86rem' }}>
                                  ↳ Rincian
                                </td>
                                <td style={{ padding: '10px 16px', color: '#0F172A', fontWeight: 700 }}>{hist.jumlah}</td>
                                <td style={{ padding: '10px 16px', color: '#64748B', fontSize: '0.86rem' }}>{data.satuan}</td>
                                <td style={{ padding: '10px 16px', color: '#64748B', fontSize: '0.86rem' }}>
                                  📅 {hist.tanggal}
                                </td>
                                <td style={{ padding: '10px 16px', color: '#334155', fontWeight: 600, fontSize: '0.86rem' }}>
                                  👤 {hist.pengambil}
                                </td>
                                <td style={{ padding: '10px 16px' }}>
                                  <small style={{ color: '#64748B' }}>{hist.keterangan || '-'}</small>
                                </td>
                                {isAdmin && (
                                  <td style={{ padding: '10px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditModal(hist.rawTrx || { id: hist.id, waktu: hist.tanggal, namaGi: selectedBidang, namaBarang: name, jumlah: hist.jumlah, satuan: data.satuan, namaPengambil: hist.pengambil, keterangan: hist.keterangan })}
                                        style={{ backgroundColor: '#DBEAFE', color: '#2563EB', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                        title="Koreksi Transaksi"
                                      >
                                        <Edit size={15} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTrx(hist.id)}
                                        style={{ backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                        title="Hapus Transaksi"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          PAGE 4: HISTORI PENGAMBILAN (logistik-history)
         ========================================= */}
      {activeSubTab === 'logistik-history' && (
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Riwayat Transaksi Terbaru
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Cari data transaksi..."
                  value={searchHistory}
                  onChange={e => setSearchHistory(e.target.value)}
                  style={{ paddingLeft: '38px', width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                />
              </div>
              <button
                onClick={() => isAdmin ? handleLogoutAdmin() : setShowLoginModal(true)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: isAdmin ? '#FEF2F2' : '#F1F5F9',
                  color: isAdmin ? '#EF4444' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={15} /> Mode Admin: {isAdmin ? 'AKTIF (Bisa Koreksi & Hapus)' : 'OFF (Klik untuk Login)'}
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>ID Transaksi</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Waktu</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Bidang / GI</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Nama Barang</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Jumlah</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Satuan</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Pengambil</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Keterangan</th>
                  {isAdmin && <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700 }}>Aksi Admin</th>}
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr><td colSpan={isAdmin ? "9" : "8"} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Belum ada transaksi.</td></tr>
                ) : (
                  filteredHistory.slice().reverse().map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}><small>{t.id || '-'}</small></td>
                      <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.86rem' }}>{t.waktu}</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontWeight: 600, color: '#2563EB' }}>{t.namaGi}</span></td>
                      <td style={{ padding: '14px 16px', color: '#0F172A' }}>{t.namaBarang}</td>
                      <td style={{ padding: '14px 16px' }}><strong style={{ color: '#0F172A', fontSize: '1rem' }}>{t.jumlah}</strong></td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>{t.satuan || 'Pcs'}</td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>{t.namaPengambil}</td>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}><small>{t.keterangan || '-'}</small></td>
                      {isAdmin && (
                        <td style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(t)}
                              style={{ backgroundColor: '#DBEAFE', color: '#2563EB', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                              title="Koreksi Transaksi"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTrx(t.id)}
                              style={{ backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Hapus Transaksi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================
          PAGE 5: PANEL ADMIN (logistik-admin)
         ========================================= */}
      {activeSubTab === 'logistik-admin' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
            <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={24} color="#EF4444" /> Manajemen Master Stok
              </h2>
              <p style={{ color: '#64748B', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
                Hanya Admin yang dapat merubah pasokan awal barang.
              </p>
            </div>

            {!isAdmin ? (
              <div style={{ textAlign: 'center', padding: '36px 24px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA', color: '#EF4444' }}>
                <Lock size={64} style={{ margin: '0 auto 16px display' }} />
                <h3 style={{ color: '#991B1B', fontWeight: 800, fontSize: '1.3rem', marginBottom: '8px' }}>Akses Ditolak</h3>
                <p style={{ color: '#7F1D1D', marginBottom: '24px', fontSize: '0.95rem' }}>
                  Anda harus login sebagai Admin untuk mengakses menu ini.
                </p>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: 700, padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.98rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                >
                  <LogIn size={18} /> Login Sekarang
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Pilih Barang yang akan di-update
                  </label>
                  <select
                    value={adminBarang}
                    onChange={e => setAdminBarang(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    required
                  >
                    <option value="" disabled>Pilih Barang...</option>
                    {stockList.map(item => (
                      <option key={item.id} value={item.namaBarang}>
                        {item.namaBarang} (Stok Awal: {item.stokAwal} | Sisa: {item.sisaStok})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Stok Awal Saat Ini
                  </label>
                  <input
                    type="text"
                    disabled
                    value={adminBarang ? `${stockList.find(s => s.namaBarang === adminBarang)?.stokAwal || 0} ${stockList.find(s => s.namaBarang === adminBarang)?.satuan || 'Pcs'}` : '-'}
                    className="input-field"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: 800, fontSize: '1.1rem', color: '#2563EB', backgroundColor: '#EFF6FF' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Update Stok Awal Menjadi (Angka Pasti / Overwrite)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Masukkan angka stok final baru..."
                    value={adminStokBaru}
                    onChange={e => setAdminStokBaru(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: 800, fontSize: '1.1rem' }}
                    required
                  />
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: 800, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                  >
                    <CheckCircle size={20} /> SIMPAN PERUBAHAN STOK
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutAdmin}
                    style={{ backgroundColor: '#64748B', color: '#FFFFFF', fontWeight: 700, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <LogOut size={18} /> Logout Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          PAGE 6: EXPORT KE EXCEL (logistik-export)
         ========================================= */}
      {activeSubTab === 'logistik-export' && (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
            <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={26} color="#10B981" /> Unduh & Sinkronisasi Database
              </h2>
              <p style={{ color: '#64748B', margin: '6px 0 0 0', fontSize: '0.94rem' }}>
                Unduh rekapitulasi lengkap database material dalam format Microsoft Excel (.XLSX) atau CSV standar nasional.
              </p>
            </div>

            <div style={{ padding: '18px 22px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE', marginBottom: '28px', color: '#1E3A8A', fontSize: '0.92rem' }}>
              <strong>💡 Informasi Sistem:</strong> Semua transaksi yang telah Anda proses tersinkronisasi otomatis dengan master `Database_AppSheet_Lengkap.xlsx` dan JSON lokal di server Node.js.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/inventaris/export';
                }}
                style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800, fontSize: '1.05rem', padding: '16px 22px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
              >
                <Download size={22} /> Export Database Rekapitulasi Lengkap (.XLSX)
              </button>

              <button
                type="button"
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "ID,Nama Barang,Satuan,Stok Awal,Total Keluar,Sisa Stok\n" +
                    stockList.map(i => `${i.id},"${i.namaBarang}",${i.satuan},${i.stokAwal},${i.totalKeluar},${i.sisaStok}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `Master_Stok_Perkap_${new Date().toISOString().slice(0,10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={{ backgroundColor: '#1E293B', color: '#FFFFFF', fontWeight: 700, padding: '14px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
              >
                <FileSpreadsheet size={18} /> Export Master Stok ke CSV
              </button>

              <button
                type="button"
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "ID Transaksi,Waktu,Bidang/GI,Nama Barang,Jumlah,Pengambil,Keterangan\n" +
                    trxList.map(t => `${t.id},"${t.waktu}","${t.namaGi}","${t.namaBarang}",${t.jumlah},"${t.namaPengambil}","${t.keterangan}"`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `Riwayat_Transaksi_${new Date().toISOString().slice(0,10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: 700, padding: '14px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
              >
                <FileSpreadsheet size={18} /> Export Riwayat Transaksi ke CSV
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
