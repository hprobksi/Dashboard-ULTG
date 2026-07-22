import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Upload, Plus, Save, Eye, Trash2, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { getMasterPegawaiList, ALL_STANDARD_BIDANG } from '../data/pegawaiMaster';

// 100% Sesuai skema libur nasional dari web-natura/src/app/jadwal/page.tsx
const holidays2026 = {
  1: [1], // Tahun Baru Masehi
  2: [17], // Isra Mi'raj
  3: [19, 20, 21], // Nyepi & Idul Fitri
  4: [3], // Jumat Agung
  5: [1, 14, 26, 27], // Hari Buruh, Kenaikan Isa, Waisak, Idul Adha
  6: [1, 16], // Hari Lahir Pancasila, Tahun Baru Islam
  8: [17], // Hari Kemerdekaan
  9: [16], // Maulid Nabi
  12: [25] // Hari Raya Natal
};

export default function JadwalPiketNatura({ initialGardu = 'global' }) {
  const [pegawaiList, setPegawaiList] = useState(() => getMasterPegawaiList());
  const [garduList, setGarduList] = useState(() => {
    return [
      { id: 'GI CIKARANG', nama: 'GI CIKARANG' },
      { id: 'GI TAMBUN', nama: 'GI TAMBUN' },
      { id: 'GI GANDAMEKAR', nama: 'GI GANDAMEKAR' },
      { id: 'GITET MUARATAWAR', nama: 'GITET MUARATAWAR' },
      { id: 'GISGISTET NEWTAMBUN', nama: 'GIS/GISTET NEW TAMBUN' },
      { id: 'GI FAJAR SW', nama: 'GI FAJAR SURYAWISESA' },
      { id: 'GI JABABEKA', nama: 'GI JABABEKA' },
      { id: 'GI RAJAPAKSI', nama: 'GI RAJAPAKSI' },
      { id: 'GI PONCOL BARU', nama: 'GI PONCOL BARU & GIS MARGAHAYU' },
      { id: 'HARGI', nama: 'TIM PEMELIHARAAN GARDU INDUK (HARGI)' },
      { id: 'HARPRO', nama: 'TIM PEMELIHARAAN PROTEKSI & METER (HARPRO)' },
      { id: 'HARJAR', nama: 'TIM PEMELIHARAAN JARINGAN (HARJAR)' },
      { id: 'SOFKIN', nama: 'TIM SOFKIN & ADMINISTRASI ULTG' }
    ];
  });

  const [selectedGardu, setSelectedGardu] = useState(initialGardu);
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
  const [hiddenPegawais, setHiddenPegawais] = useState([]);
  
  // State matriks jadwal: array of { pegawaiId, tanggal, status }
  const [jadwal, setJadwal] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [autoRegister, setAutoRegister] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/gardu').then(res => res.ok ? res.json() : []),
      fetch('/api/pegawai').then(res => res.ok ? res.json() : getMasterPegawaiList())
    ]).then(([garduData, pegawaiData]) => {
      if (Array.isArray(garduData) && garduData.length > 0) {
        setGarduList([{ id: 'global', nama: 'Jadwal Global (Semua Personil)' }, ...garduData]);
      }
      if (Array.isArray(pegawaiData)) setPegawaiList(pegawaiData.filter(p => !p.isPiketPenuh));
    }).catch(() => {
      setPegawaiList(getMasterPegawaiList().filter(p => !p.isPiketPenuh));
    });
  }, []);

  useEffect(() => {
    fetch(`/api/jadwal?garduIndukId=${selectedGardu}&bulan=${selectedBulan}&tahun=${selectedTahun}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const mapped = Array.isArray(data)
          ? data.map(j => ({ pegawaiId: j.pegawaiId, tanggal: j.tanggal, status: j.status }))
          : [];
        setJadwal(mapped);
        setHiddenPegawais([]);
      })
      .catch(() => setJadwal([]));
  }, [selectedGardu, selectedBulan, selectedTahun]);

  const handleStatusChange = (pegawaiId, tanggal, rawStatus) => {
    let status = rawStatus.toUpperCase().trim();
    if (status === 'PSM') status = 'SM'; // Konversi otomatis sesuai aturan web-natura

    const existingIndex = jadwal.findIndex(j => j.pegawaiId === pegawaiId && j.tanggal === tanggal);
    const newJadwal = [...jadwal];
    
    if (existingIndex >= 0) {
      if (status === '') {
        newJadwal.splice(existingIndex, 1);
      } else {
        newJadwal[existingIndex].status = status;
      }
    } else if (status !== '') {
      newJadwal.push({ pegawaiId, tanggal, status });
    }
    setJadwal(newJadwal);
  };

  const handleRemovePegawaiFromJadwal = (pegawaiId) => {
    setHiddenPegawais(prev => [...prev, pegawaiId]);
    setJadwal(prev => prev.filter(j => j.pegawaiId !== pegawaiId));
  };

  const getStatus = (pegawaiId, tanggal) => {
    return jadwal.find(j => j.pegawaiId === pegawaiId && j.tanggal === tanggal)?.status || '';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garduIndukId: selectedGardu,
          bulan: selectedBulan,
          tahun: selectedTahun,
          entries: jadwal
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal menyimpan jadwal');
      }
      alert('Jadwal Piket berhasil disimpan ke database NATURA.');
    } catch (e) {
      alert('Gagal menyimpan jadwal: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGardu = async () => {
    const nama = window.prompt('Masukkan Nama Gardu Induk / Unit baru:');
    if (nama && nama.trim()) {
      try {
        const res = await fetch('/api/gardu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama: nama.trim() })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Gagal menambah gardu');
        }
        const data = await res.json();
        setGarduList(prev => [...prev, data]);
        setSelectedGardu(String(data.id));
      } catch (e) {
        alert('Gagal menambah gardu: ' + e.message);
      }
    }
  };

  // Matriks 31 Hari (Sesuai aturan web-natura: selalu 31 kolom agar konsisten)
  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  const isWeekendOrHoliday = (tgl) => {
    const d = new Date(selectedTahun, selectedBulan - 1, tgl);
    const day = d.getDay();
    const isWknd = day === 0 || day === 6; // 0 = Minggu, 6 = Sabtu
    const isHol = selectedTahun === 2026 && holidays2026[selectedBulan]?.includes(tgl);
    return isWknd || isHol;
  };

  // Skema styling shift sesuai warna/esensi web-natura dengan sentuhan premium
  const getShiftStyle = (status, isRed) => {
    if (isRed && !status) {
      return {
        background: '#FFF1F2',
        color: '#DC2626',
        border: '1px solid #FCA5A5',
        fontWeight: 'bold'
      };
    }

    return {
      background: status ? '#FFFFFF' : (isRed ? '#FFF1F2' : '#FFFFFF'),
      color: '#1E293B',
      border: '1px solid #CBD5E1',
      fontWeight: '700'
    };
  };

  // Filter pegawai berdasarkan gardu / bidang yang dipilih
  const filteredPegawai = useMemo(() => {
    return pegawaiList
      .filter(p => !hiddenPegawais.includes(p.id))
      .filter(p => {
        if (selectedGardu === 'global') return true;
        if (/^\d+$/.test(String(selectedGardu))) return true;
        // Cocokkan dengan bidang atau id gardu
        const gName = selectedGardu.toUpperCase();
        const pBidang = (p.bidang || '').toUpperCase();
        return pBidang.includes(gName) || gName.includes(pBidang);
      });
  }, [pegawaiList, hiddenPegawais, selectedGardu]);

  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bulan', selectedBulan.toString());
      formData.append('tahun', selectedTahun.toString());
      formData.append('autoRegister', autoRegister.toString());
      const res = await fetch('/api/jadwal/import', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal import jadwal');
      const parsedEntries = result.data || [];

      const importedPegawaiIds = new Set(parsedEntries.map(d => d.pegawaiId));
      const newHidden = pegawaiList
        .filter(p => !importedPegawaiIds.has(p.id))
        .map(p => p.id);
      setHiddenPegawais(newHidden);

      setJadwal(prev => {
        const newJ = [...prev];
        parsedEntries.forEach(imp => {
          const idx = newJ.findIndex(j => j.pegawaiId === imp.pegawaiId && j.tanggal === imp.tanggal);
          if (idx >= 0) newJ[idx].status = imp.status;
          else newJ.push(imp);
        });
        return newJ;
      });

      alert(`Berhasil mengimpor ${parsedEntries.length} slot penugasan jadwal personil. Silakan periksa dan klik Simpan Jadwal jika sudah sesuai.`);
    } catch (err) {
      console.error(err);
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Excel';
      alert(`❌ Terjadi kesalahan saat memproses file ${fileType}: ` + err.message);
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const mNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Banner Filter & Kontrol Utama */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD5E1',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={20} color="#00A2E9" /> Matriks Penugasan Dinas & Shift Kerja Personil
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
              Sistem rekapitulasi, pemantauan, dan pengelolaan jadwal penugasan shift kerja harian personil PT PLN (Persero) ULTG Bekasi.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept=".xlsx,.pdf"
                id="excel-upload-natura"
                style={{ display: 'none' }}
                onChange={handleExcelImport}
              />
              <label
                htmlFor="excel-upload-natura"
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #00A2E9',
                  backgroundColor: '#E0F2FE',
                  color: '#00A2E9',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isImporting ? 'wait' : 'pointer',
                  opacity: isImporting ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                <Upload size={16} />
                {isImporting ? 'Membaca File...' : 'Import Jadwal (.xlsx/.pdf)'}
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isSaving ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <Save size={16} />
              {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
            </button>
          </div>
        </div>

        {/* Bar Filter Pilihan Gardu, Bulan, Tahun, Auto-Register */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Gardu Induk / Unit Bidang
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={selectedGardu}
                onChange={e => setSelectedGardu(e.target.value)}
                style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0F172A', fontSize: '0.86rem', width: '260px' }}
              >
                <option value="global">🌐 Jadwal Global (Semua Personil)</option>
                {garduList.map(g => (
                  <option key={g.id} value={g.id}>{g.nama}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddGardu}
                title="Tambah Gardu Induk Baru"
                style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontWeight: 800, cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Bulan
            </label>
            <select
              value={selectedBulan}
              onChange={e => setSelectedBulan(Number(e.target.value))}
              style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0F172A', fontSize: '0.86rem', width: '150px' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(b => (
                <option key={b} value={b}>{mNames[b - 1]}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Tahun
            </label>
            <input
              type="number"
              value={selectedTahun}
              onChange={e => setSelectedTahun(Number(e.target.value))}
              style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0F172A', fontSize: '0.86rem', width: '110px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <input
              type="checkbox"
              id="auto-reg-checkbox"
              checked={autoRegister}
              onChange={e => setAutoRegister(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="auto-reg-checkbox" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }} title="Nama yang ada di Excel namun belum ada di database akan otomatis didaftarkan sebagai Pegawai Baru.">
              Auto-Registrasi Personil Baru saat Import
            </label>
          </div>
        </div>
      </div>

      {/* Legend & Panduan Kode Shift */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #CBD5E1',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: 800, color: '#1E293B' }}>
          <span>Keterangan Kode Penugasan Shift:</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '0.74rem', fontWeight: 700 }}>
          <span style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>P: Hadir / Pagi</span>
          <span style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>S / SM: Siang / Siaga Malam</span>
          <span style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>M: Malam</span>
          <span style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>L / OFF: Libur</span>
          <span style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>DL: Dinas Luar</span>
          <span style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>I / C / T: Izin/Cuti/Tukar</span>
          <span style={{ backgroundColor: '#FFF1F2', color: '#DC2626', padding: '3px 8px', borderRadius: '4px', border: '1px solid #FCA5A5' }}>Kolom Merah: Akhir Pekan / Libur</span>
        </div>
        {hiddenPegawais.length > 0 && (
          <button
            onClick={() => setHiddenPegawais([])}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              fontWeight: 800,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Eye size={14} /> Tampilkan Semua ({hiddenPegawais.length} disembunyikan)
          </button>
        )}
      </div>

      {/* Tabel Matriks 31 Hari dengan Sticky Columns */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        overflowX: 'auto',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
      }}>
        <table style={{ width: '100%', minWidth: '980px', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{
                minWidth: '180px',
                position: 'sticky',
                left: 0,
                background: '#F8FAFC',
                zIndex: 20,
                textAlign: 'left',
                padding: '8px 12px',
                borderBottom: '2px solid #CBD5E1',
                borderRight: '1px solid #E2E8F0',
                color: '#475569',
                fontSize: '0.76rem',
                fontWeight: 900,
                boxShadow: '3px 0 6px rgba(0,0,0,0.02)'
              }}>
                NAMA PERSONIL & JABATAN
              </th>
              {daysArray.map(d => {
                const isRed = isWeekendOrHoliday(d);
                return (
                  <th key={d} style={{
                    textAlign: 'center',
                    padding: '6px 1px',
                    width: '28px',
                    fontSize: '0.76rem',
                    fontWeight: 900,
                    borderBottom: '2px solid #CBD5E1',
                    background: isRed ? '#DC2626' : '#F8FAFC',
                    color: isRed ? '#FFFFFF' : '#334155',
                    borderLeft: '1px solid #F1F5F9'
                  }}>
                    {d}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredPegawai.length === 0 ? (
              <tr>
                <td colSpan={32} style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontWeight: 700, fontSize: '0.84rem' }}>
                  Tidak ada personil di unit/bidang ini. Silakan pilih unit lain atau klik 'Tampilkan Semua'.
                </td>
              </tr>
            ) : (
              filteredPegawai.map(p => (
                <tr key={p.id} style={{ transition: 'background-color 0.15s' }}>
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    background: '#FFFFFF',
                    zIndex: 10,
                    padding: '5px 12px',
                    borderBottom: '1px solid #E2E8F0',
                    borderRight: '1px solid #E2E8F0',
                    boxShadow: '3px 0 6px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.80rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '145px' }} title={p.nama}>
                          {p.nama}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '145px' }}>
                          {p.jabatan}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePegawaiFromJadwal(p.id)}
                        title="Sembunyikan baris ini dari tabel jadwal"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: '4px',
                          opacity: 0.35,
                          transition: 'opacity 0.2s',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.35'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                  {daysArray.map(d => {
                    const status = getStatus(p.id, d);
                    const isRed = isWeekendOrHoliday(d);
                    const cellStyle = getShiftStyle(status, isRed);
                    return (
                      <td key={d} style={{
                        padding: '2px',
                        textAlign: 'center',
                        borderBottom: '1px solid #E2E8F0',
                        borderLeft: '1px solid #F1F5F9',
                        background: isRed ? '#FFF1F2' : 'transparent'
                      }}>
                        <input
                          type="text"
                          maxLength={3}
                          value={status}
                          onChange={(e) => handleStatusChange(p.id, d, e.target.value)}
                          style={{
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            fontSize: '0.73rem',
                            borderRadius: '4px',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            boxSizing: 'border-box',
                            ...cellStyle
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #00A2E9'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>* Catatan: Perubahan kode shift pada tabel langsung tercermin pada sistem. Klik tombol <strong>Simpan Jadwal</strong> untuk memperbarui basis data operasional.</span>
      </div>
    </div>
  );
}
