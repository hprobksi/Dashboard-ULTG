import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, Download, Upload, Trash2, Plus, Check, AlertCircle, ShieldAlert, Lock, Cpu, Building2 } from 'lucide-react';
import { storageService } from '../services/storage';

export default function Settings({ onSettingsChange }) {
  const [settings, setSettings] = useState({
    apiKey: '',
    engineModel: 'gemini-2.5-pro',
    companyName: 'PT PLN (Persero) ULTG Bekasi',
    unitName: 'HARPRO ULTG BEKASI'
  });
  const [substations, setSubstations] = useState([]);
  const [newGiName, setNewGiName] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  const loadData = async () => {
    const st = await storageService.getSettings();
    const subs = await storageService.get('substations');
    if (st) setSettings(st);
    setSubstations(subs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await storageService.saveSettings(settings);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
    if (onSettingsChange) onSettingsChange();
  };

  const handleAddGi = async (e) => {
    e.preventDefault();
    if (!newGiName.trim()) return;
    const newSub = {
      id: 'gi-' + Date.now(),
      name: newGiName.includes('GI') ? newGiName : `GI 150kV ${newGiName}`,
      code: newGiName.substring(0, 3).toUpperCase(),
      voltage: '150kV'
    };
    const updated = [...substations, newSub];
    await storageService.set('substations', updated);
    setSubstations(updated);
    setNewGiName('');
  };

  const deleteGi = async (id) => {
    if (!window.confirm('Hapus Gardu Induk ini dari Master Data?')) return;
    const updated = substations.filter(s => s.id !== id);
    await storageService.set('substations', updated);
    setSubstations(updated);
  };

  const handleExportJson = async () => {
    const jsonStr = await storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_HarproUltgBekasi_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        await storageService.importBackup(evt.target.result);
        alert('Berhasil mengimpor dan memulihkan ingatan database lokal!');
        loadData();
        if (onSettingsChange) onSettingsChange();
      } catch (err) {
        alert('Gagal memproses file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetMemory = async () => {
    if (!window.confirm('PERINGATAN KRITIS: Seluruh jadwal, catatan anomali, dan template akan dihapus kembali ke data bawaan awal. Lanjutkan?')) return;
    localStorage.clear();
    indexedDB.deleteDatabase('HarproUltgBekasi');
    alert('Ingatan telah direset. Halaman akan dimuat ulang.');
    window.location.reload();
  };

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#334155' }}>
            <SettingsIcon size={30} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Pengaturan Sistem</h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Section 1: Gemini Pro AI Engine Configuration */}
        <div className="card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
            <Key size={20} color="#00A2E9" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Koneksi Engine AI Gemini Pro</h3>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Google Gemini API Key (Dari Google AI Studio)
              </label>
              <input
                type="password"
                placeholder="AIzaSy.........."
                value={settings.apiKey}
                onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                className="input-field"
                style={{ fontFamily: 'monospace' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={13} color="#10B981" />
                <span>API Key Anda dijamin aman 100% karena hanya disimpan di dalam IndexedDB browser Anda sendiri.</span>
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Mesin Penalaran Aktif (High Reasoning Tier)
              </label>
              <select
                value={settings.engineModel}
                onChange={e => setSettings({ ...settings, engineModel: e.target.value })}
                className="input-field"
              >
                <option value="gemini-2.5-pro">gemini-2.5-pro (Kasta Pro Tertinggi / High Reasoning setara Gemini 3.1 Pro)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Pro Enterprise Standard)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash (Kecepatan Tinggi - Non Rekomendasi Laporan Formal)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Unit Induk / PLN</label>
                <input type="text" value={settings.companyName} onChange={e => setSettings({ ...settings, companyName: e.target.value })} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Nama Aplikasi</label>
                <input type="text" value={settings.unitName} onChange={e => setSettings({ ...settings, unitName: e.target.value })} className="input-field" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
              {savedStatus ? <Check size={18} color="#FFD100" /> : null}
              {savedStatus ? 'Berhasil Menyimpan Konfigurasi!' : 'Simpan Konfigurasi AI'}
            </button>
          </form>
        </div>

        {/* Section 2: Master Gardu Induk ULTG Bekasi */}
        <div className="card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
            <Building2 size={20} color="#D97706" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Master Daftar Gardu Induk (ULTG Bekasi)</h3>
          </div>

          <form onSubmit={handleAddGi} style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
            <input
              type="text"
              placeholder="Ketik Nama GI Baru (Misal: GI Harapan Indah)"
              value={newGiName}
              onChange={e => setNewGiName(e.target.value)}
              className="input-field"
              required
            />
            <button type="submit" className="btn btn-yellow" style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}>
              <Plus size={18} /> Tambah GI
            </button>
          </form>

          <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {substations.map(sub => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{sub.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '8px' }}>({sub.voltage})</span>
                </div>
                <button onClick={() => deleteGi(sub.id)} style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '4px' }} title="Hapus GI">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Backup & Restore Offline Memory */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
            <Database size={22} color="#00A2E9" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>Manajemen Memory & Backup Database Lokal</h3>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '22px', lineHeight: 1.6 }}>
            Karena aplikasi ini berjalan tanpa server cloud (*Offline-First*), seluruh ingatan tersimpan di harddisk komputer Anda ini. Gunakan fitur Export secara berkala untuk memindahkan seluruh jadwal, anomali, aset relay, dan template Berita Acara ke komputer rekan kerja atau atasan Anda.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <button onClick={handleExportJson} className="btn btn-primary" style={{ flex: '1 1 220px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Download size={18} /> 1. Export Backup ke File (.JSON)
            </button>

            <label className="btn btn-outline" style={{ flex: '1 1 220px', padding: '14px', borderColor: '#CBD5E1', color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Upload size={18} /> 2. Restore / Import dari File (.JSON)
              <input type="file" accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
            </label>

            <button onClick={handleResetMemory} className="btn btn-danger" style={{ flex: '0 1 auto', padding: '14px 22px', backgroundColor: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Trash2 size={18} /> Reset Ulang Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
