import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  PencilLine,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserRound,
  Users
} from 'lucide-react';

const initialForm = {
  id: '',
  nomorSpl: '',
  tanggalSurat: new Date().toISOString().slice(0, 10),
  tanggalLembur: new Date().toISOString().slice(0, 10),
  mulai: '08:00',
  selesai: '10:00',
  namaPekerjaan: '',
  jenisPekerjaan: 'Pekerjaan di luar jam kerja yang tidak meninggalkan tugas pokok',
  subKategori: 'Pekerjaan Keandalan',
  kategori: 'Pekerjaan terencana yang dilakukan di luar hari kerja berdasarkan justifikasi pengelola sistem/pemilik aset',
  jenisAction: 'Preventive Action',
  jenisHari: 'Hari Kerja Normal',
  sppd: 'Tanpa SPPD',
  lokasi: 'GI Cikarang',
  koordinator: 'Saepul Rohmat',
  rincian: '',
  kejadianPenting: 'Pekerjaan berjalan aman dan lancar.',
  kegiatanText: 'Safety Briefing\nPelaksanaan pekerjaan sesuai instruksi\nClosing Briefing',
  pegawaiList: [],
  docs: {
    perencanaan: 'Ada',
    perintah: 'Ada',
    persetujuan: 'Ada',
    laporan: 'Ada'
  },
  signers: {
    mupt: 'INDRA KURNIAWAN',
    muptJabatan: 'MUPT BEKASI',
    multg: 'TRIAWAN AZHARY P. N.',
    multgJabatan: 'MULTG BEKASI'
  }
};

const styles = {
  page: { padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' },
  label: { display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' },
  input: { width: '100%', minHeight: '44px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontWeight: 700, fontSize: '0.95rem', outline: 'none' },
  textarea: { width: '100%', minHeight: '96px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontWeight: 700, fontSize: '0.95rem', outline: 'none', resize: 'vertical' },
  primaryButton: { minHeight: '44px', padding: '10px 16px', borderRadius: '9px', border: 'none', backgroundColor: '#00A2E9', color: '#FFFFFF', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  secondaryButton: { minHeight: '44px', padding: '10px 16px', borderRadius: '9px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#1E293B', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  dangerButton: { minHeight: '38px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }
};

const getDuration = (start, end) => {
  const [sh, sm] = String(start || '00:00').split(':').map(Number);
  const [eh, em] = String(end || '00:00').split(':').map(Number);
  let startMinutes = (sh * 60) + (sm || 0);
  let endMinutes = (eh * 60) + (em || 0);
  if (endMinutes < startMinutes) endMinutes += 24 * 60;
  return Math.max(0, Math.round(((endMinutes - startMinutes) / 60) * 100) / 100);
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getMonthKey = (dateValue) => String(dateValue || '').slice(0, 7);

const formatEYD = (text) => {
  if (!text) return '';
  const prepositions = ['dan', 'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'dengan', 'yang', 'atau', 'serta', 'oleh', 'bagi', 'sebagai'];
  const acronyms = ['ds', 'avr', 'gi', 'ultg', 'upt', 'spp', 'spl', 'kv', 'mw', 'mva', 'kwh', 'pltu', 'pltg'];

  return String(text).split('\n').map(line => {
    return line.split(' ').map((word, index) => {
      if (!word) return '';
      const wLower = word.toLowerCase();
      if (index !== 0 && prepositions.includes(wLower)) {
        return wLower;
      }
      if (acronyms.includes(wLower)) {
        return wLower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + wLower.slice(1);
    }).join(' ');
  }).join('\n');
};

const getNextSplNumber = (currentSpl, list = []) => {
  const candidates = [
    String(currentSpl || '').trim(),
    ...(Array.isArray(list) ? list.map(row => String(row.nomorSpl || '').trim()) : [])
  ].filter(Boolean);

  let targetSpl = candidates[0] || '';
  let highestNumber = -1;
  candidates.forEach(candidate => {
    const match = candidate.match(/^(\d+)/);
    if (!match) return;
    const value = parseInt(match[1], 10);
    if (value > highestNumber) {
      highestNumber = value;
      targetSpl = candidate;
    }
  });

  if (!targetSpl) return '0972.SPL/SDM.06.01/UPTBKSI/2026';

  const match = targetSpl.match(/^(\d+)(.*)$/);
  if (match) {
    const numStr = match[1];
    const restStr = match[2];
    const nextNum = parseInt(numStr, 10) + 1;
    const paddedNum = String(nextNum).padStart(numStr.length, '0');
    return `${paddedNum}${restStr}`;
  }

  const midMatch = targetSpl.match(/^(.*?)(\d+)(.*)$/);
  if (midMatch) {
    const preStr = midMatch[1];
    const numStr = midMatch[2];
    const postStr = midMatch[3];
    const nextNum = parseInt(numStr, 10) + 1;
    const paddedNum = String(nextNum).padStart(numStr.length, '0');
    return `${preStr}${paddedNum}${postStr}`;
  }

  return targetSpl;
};

const incrementSpl = (baseSpl, amount) => {
  if (amount === 0) return baseSpl;
  const match = baseSpl.match(/^(\d+)(.*)$/);
  if (match) {
    const num = parseInt(match[1], 10) + amount;
    return `${String(num).padStart(match[1].length, '0')}${match[2]}`;
  }
  const midMatch = baseSpl.match(/^(.*?)(\d+)(.*)$/);
  if (midMatch) {
    const num = parseInt(midMatch[2], 10) + amount;
    return `${midMatch[1]}${String(num).padStart(midMatch[2].length, '0')}${midMatch[3]}`;
  }
  return baseSpl;
};

function StatCard({ icon: Icon, label, value, tone, caption }) {
  return (
    <div className="card" style={{ ...styles.card, padding: '22px', borderTop: `5px solid ${tone}` }}>
      <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '12px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 900, color: tone }}>{value}</span>
        <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={tone} />
        </div>
      </div>
      <span style={{ display: 'block', marginTop: '8px', fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>{caption}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

export default function Lemburan({ activeSubTab = 'lemburan-overview', setActiveTab }) {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [lemburanList, setLemburanList] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [overviewSearch, setOverviewSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [exportMonth, setExportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedArchiveIds, setSelectedArchiveIds] = useState([]);

  const loadData = async () => {
    const [pegawaiRes, lemburanRes] = await Promise.all([
      fetch('/api/master-pegawai'),
      fetch('/api/lemburan')
    ]);
    const pegawaiJson = await pegawaiRes.json();
    const lemburanJson = await lemburanRes.json();
    const rawPegawai = Array.isArray(pegawaiJson.data) ? pegawaiJson.data : [];
    const sortedPegawai = rawPegawai.slice().sort((a, b) => 
      String(a.nama || '').localeCompare(String(b.nama || ''), 'id', { sensitivity: 'base' })
    );
    setPegawaiList(sortedPegawai);
    const rows = Array.isArray(lemburanJson.data) ? lemburanJson.data : [];
    setLemburanList(rows);
    setSelectedArchiveIds(prev => prev.filter(id => rows.some(row => row.id === id)));
    setForm(prev => {
      if (!prev.nomorSpl) {
        return { ...prev, nomorSpl: getNextSplNumber('', rows) };
      }
      return prev;
    });
  };

  useEffect(() => {
    loadData().catch((err) => setStatus(`Gagal memuat data: ${err.message}`));
  }, []);

  const summary = useMemo(() => {
    const monthRows = lemburanList.filter(item => getMonthKey(item.tanggalLembur) === exportMonth);
    const totalHours = monthRows.reduce((sum, item) => sum + Number(item.durasi || 0), 0);
    const people = new Set(monthRows.map(item => item.pegawai?.nip || item.pegawai?.nama).filter(Boolean));
    const uniqueDays = new Set(monthRows.map(item => item.tanggalLembur).filter(Boolean));
    return {
      total: lemburanList.length,
      monthRows: monthRows.length,
      totalHours,
      people: people.size,
      uniqueDays: uniqueDays.size
    };
  }, [lemburanList, exportMonth]);

  const filteredRows = useMemo(() => {
    const keyword = search.toLowerCase();
    return lemburanList.filter(item => {
      if (!keyword) return true;
      return [
        item.nomorSpl,
        item.pegawai?.nama,
        item.pegawai?.nip,
        item.lokasi,
        item.namaPekerjaan
      ].some(value => String(value || '').toLowerCase().includes(keyword));
    });
  }, [lemburanList, search]);

  const visibleRowIds = useMemo(() => filteredRows.map(item => item.id), [filteredRows]);
  const allVisibleSelected = visibleRowIds.length > 0 && visibleRowIds.every(id => selectedArchiveIds.includes(id));

  const overviewFiltered = useMemo(() => {
    const keyword = overviewSearch.toLowerCase();
    const monthRows = lemburanList.filter(item => getMonthKey(item.tanggalLembur) === exportMonth);
    return monthRows.filter(item => {
      if (!keyword) return true;
      return (item.pegawai?.nama || '').toLowerCase().includes(keyword) || (item.namaPekerjaan || '').toLowerCase().includes(keyword);
    });
  }, [lemburanList, exportMonth, overviewSearch]);

  const updateForm = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'tanggalLembur' && value) {
        const day = new Date(value).getDay();
        next.jenisHari = (day === 0 || day === 6) ? 'Hari Libur / Libur Nasional' : 'Hari Kerja Normal';
      }
      return next;
    });
  };

  const addPegawai = (nip) => {
    if (!nip) return;
    const selected = pegawaiList.find(item => item.nip === nip);
    if (!selected) return;
    if (form.pegawaiList?.some(p => p.nip === nip)) {
      alert('Pegawai ini sudah ditambahkan.');
      return;
    }
    setForm(prev => ({
      ...prev,
      pegawaiList: [...(prev.pegawaiList || []), {
        nama: selected.nama,
        nip: selected.nip,
        pog: selected.pog,
        peg: selected.peg,
        jabatan: selected.jabatan,
        bidang: selected.bidang
      }]
    }));
  };

  const removePegawai = (nip) => {
    setForm(prev => ({
      ...prev,
      pegawaiList: (prev.pegawaiList || []).filter(p => p.nip !== nip)
    }));
  };

  const resetForm = (keepConsecutive = false, customNomor = '') => {
    let nextNumber = typeof customNomor === 'string' && customNomor ? customNomor : '';
    if (!nextNumber && (keepConsecutive === true || typeof keepConsecutive !== 'boolean')) {
      nextNumber = getNextSplNumber(form.nomorSpl, lemburanList);
    }
    if (!nextNumber) {
      nextNumber = getNextSplNumber('', lemburanList);
    }
    setForm({
      ...initialForm,
      nomorSpl: nextNumber,
      tanggalSurat: new Date().toISOString().slice(0, 10),
      tanggalLembur: new Date().toISOString().slice(0, 10)
    });
    setStatus('');
  };

  const editRow = (item) => {
    setForm({
      ...initialForm,
      ...item,
      pegawaiList: item.pegawai ? [item.pegawai] : [],
      kegiatanText: Array.isArray(item.kegiatan) ? item.kegiatan.join('\n') : initialForm.kegiatanText,
      docs: { ...initialForm.docs, ...(item.docs || {}) },
      signers: { ...initialForm.signers, ...(item.signers || {}) }
    });
    setStatus(`Mode edit: ${item.nomorSpl}`);
    if (setActiveTab) setActiveTab('lemburan-input');
  };

  const saveLemburan = async () => {
    if (!form.pegawaiList || form.pegawaiList.length === 0) {
      const msg = '⚠️ Mohon pilih minimal satu pegawai dari dropdown Master Pegawai.';
      setStatus(msg);
      alert(msg);
      return;
    }
    const pekerjaanFinal = form.namaPekerjaan || form.rincian;
    if (!pekerjaanFinal) {
      const msg = '⚠️ Mohon isi Nama Pekerjaan Lembur terlebih dahulu.';
      setStatus(msg);
      alert(msg);
      return;
    }

    setIsSaving(true);
    try {
      const payloads = form.pegawaiList.map((pegawai, index) => {
        const nextSpl = incrementSpl(form.nomorSpl, index);
        const rowId = form.id && form.pegawaiList.length === 1 ? form.id : `LBR-${Date.now()}-${index}`;
        return {
          ...form,
          id: rowId,
          nomorSpl: nextSpl,
          pegawai: pegawai,
          namaPekerjaan: pekerjaanFinal,
          rincian: pekerjaanFinal,
          durasi: getDuration(form.mulai, form.selesai),
          kegiatan: form.kegiatanText.split('\n').map(item => item.trim()).filter(Boolean)
        };
      });

      const res = await fetch('/api/lemburan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gagal menyimpan data.');
      
      const latestSpl = payloads[payloads.length - 1].nomorSpl;
      const nextNomor = getNextSplNumber(latestSpl, lemburanList);
      const successMsg = `✅ Data lembur untuk ${form.pegawaiList.length} personil berhasil disimpan!\n\nNomor SPL berikutnya otomatis disiapkan: ${nextNomor}`;
      setStatus(successMsg);
      alert(successMsg);
      resetForm(true, nextNomor);
      await loadData();
    } catch (err) {
      const errorMsg = `❌ Gagal menyimpan data lembur: ${err.message}`;
      setStatus(errorMsg);
      alert(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm('Hapus data lembur ini?')) return;
    const res = await fetch(`/api/lemburan?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) {
      setStatus(json.error || 'Gagal menghapus data.');
      return;
    }
    setStatus('Data lembur berhasil dihapus.');
    setSelectedArchiveIds(prev => prev.filter(rowId => rowId !== id));
    await loadData();
  };

  const downloadPdf = (id) => {
    window.location.href = `/api/lemburan/export-pdf?id=${encodeURIComponent(id)}`;
  };



  const exportBulkPdf = () => {
    if (!selectedArchiveIds.length) {
      const msg = 'Pilih minimal satu arsip lemburan terlebih dahulu.';
      setStatus(msg);
      alert(msg);
      return;
    }
    const qs = `?ids=${encodeURIComponent(selectedArchiveIds.join(','))}`;
    window.location.href = `/api/lemburan/export-bulk-pdf${qs}`;
  };

  const toggleArchiveSelection = (id) => {
    setSelectedArchiveIds(prev => (
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    ));
  };

  const toggleAllVisibleSelection = () => {
    setSelectedArchiveIds(prev => {
      if (allVisibleSelected) {
        return prev.filter(id => !visibleRowIds.includes(id));
      }
      return Array.from(new Set([...prev, ...visibleRowIds]));
    });
  };

  const renderHeader = (title, subtitle, Icon) => (
    <div style={{ ...styles.card, padding: '20px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon size={30} color="#00A2E9" /> {title}
        </h1>
        <p style={{ margin: '6px 0 0 42px', color: '#64748B', fontWeight: 700, fontSize: '0.9rem' }}>{subtitle}</p>
      </div>
      <button type="button" onClick={loadData} style={styles.secondaryButton}>
        <RefreshCw size={17} /> Refresh
      </button>
    </div>
  );

  const renderOverview = () => (
    <>
      {renderHeader('Rekapitulasi Lembur', 'Ringkasan input SPL, realisasi jam lembur, dan pencarian personil.', Clock)}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <StatCard icon={Archive} label="Total Arsip" value={summary.total} tone="#00A2E9" caption="SPL tersimpan di Dashboard AI" />
        <StatCard icon={CalendarDays} label="Hari Lembur" value={summary.uniqueDays} tone="#10B981" caption={`Total hari lembur di ${exportMonth}`} />
        <StatCard icon={Clock} label="Total Jam" value={`${summary.totalHours}`} tone="#D97706" caption={`Akumulasi jam pada ${exportMonth}`} />
        <StatCard icon={UserRound} label="Personil" value={summary.people} tone="#4F46E5" caption={`Pegawai pada ${exportMonth}`} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ ...styles.card, padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
              <FileText size={20} color="#00A2E9" /> Daftar Personil Lembur
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="month" value={exportMonth} onChange={(e) => setExportMonth(e.target.value)} style={{ ...styles.input, width: 'auto', minHeight: '40px', padding: '6px 12px' }} title="Pilih Bulan" />
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={overviewSearch} onChange={(e) => setOverviewSearch(e.target.value)} placeholder="Filter nama / pekerjaan..." style={{ ...styles.input, paddingLeft: '34px', minHeight: '40px', minWidth: '220px' }} />
              </div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="pk-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Personil</th>
                  <th>No SPL</th>
                  <th>Lokasi</th>
                  <th>Pekerjaan</th>
                  <th>Jam</th>
                </tr>
              </thead>
              <tbody>
                {overviewFiltered.map(item => (
                  <tr key={item.id}>
                    <td>{formatDate(item.tanggalLembur)}</td>
                    <td style={{ fontWeight: 800 }}>{item.pegawai?.nama}</td>
                    <td>{item.nomorSpl}</td>
                    <td>{item.lokasi}</td>
                    <td style={{ minWidth: '200px' }}>{item.namaPekerjaan}</td>
                    <td style={{ fontWeight: 700 }}>{item.durasi} jam</td>
                  </tr>
                ))}
                {!overviewFiltered.length && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#64748B', fontWeight: 700, padding: '28px' }}>Belum ada data lembur yang cocok pada bulan terpilih.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderInput = () => (
    <>
      {renderHeader('Form Input Perintah Lembur', 'Penerbitan Dokumen Lembur PT PLN (Persero) ULTG Bekasi', FileText)}
      <div style={{ margin: '0 auto', maxWidth: '1080px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {status && (
          <div style={{ ...styles.card, padding: '16px 20px', backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1', fontWeight: 800, fontSize: '0.96rem', borderRadius: '12px' }}>
            {status}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* SECTION 1: Nomor SPL & Waktu Pelaksanaan (Border Kiri PLN Blue) */}
            <div style={{
              border: '1px solid #BAE6FD',
              borderLeft: '6px solid #00A2E9',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 162, 233, 0.06)',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{ padding: '12px 18px', backgroundColor: '#F0F9FF', borderBottom: '1px solid #BAE6FD', fontWeight: 800, color: '#0369A1', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={19} color="#00A2E9" /> 1. Nomor SPL & Waktu Pelaksanaan
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px', marginBottom: '18px' }}>
                  <Field label="No Surat Perintah Lembur">
                    <input style={styles.input} value={form.nomorSpl} onChange={(e) => updateForm('nomorSpl', e.target.value)} placeholder="0972.SPL/SDM.06.01/UPTBKSI/2026" />
                  </Field>
                  <Field label="Tanggal Surat">
                    <input type="date" style={styles.input} value={form.tanggalSurat} onChange={(e) => updateForm('tanggalSurat', e.target.value)} />
                  </Field>
                  <Field label="Tanggal Lembur">
                    <input type="date" style={styles.input} value={form.tanggalLembur} onChange={(e) => updateForm('tanggalLembur', e.target.value)} />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '14px' }}>
                  <Field label="Jam Mulai">
                    <input type="time" style={styles.input} value={form.mulai} onChange={(e) => updateForm('mulai', e.target.value)} />
                  </Field>
                  <Field label="Jam Selesai">
                    <input type="time" style={styles.input} value={form.selesai} onChange={(e) => updateForm('selesai', e.target.value)} />
                  </Field>
                  <Field label="Durasi Otomatis">
                    <input style={{ ...styles.input, backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 800 }} value={`${getDuration(form.mulai, form.selesai)} jam`} readOnly />
                  </Field>
                  <Field label="Jenis Action">
                    <select style={styles.input} value={form.jenisAction} onChange={(e) => updateForm('jenisAction', e.target.value)}>
                      <option>Preventive Action</option>
                      <option>Predictive Action</option>
                      <option>Corrective Active</option>
                      <option>Corrective Action</option>
                    </select>
                  </Field>
                  <Field label="Jenis Hari Lembur">
                    <select style={styles.input} value={form.jenisHari || 'Hari Kerja Normal'} onChange={(e) => updateForm('jenisHari', e.target.value)}>
                      <option value="Hari Kerja Normal">Hari Kerja Normal</option>
                      <option value="Hari Libur / Libur Nasional">Hari Libur / Libur Nasional</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {/* SECTION 2: Data Personil yang Ditugaskan (Border Kiri Emerald Green) */}
            <div style={{
              border: '1px solid #A7F3D0',
              borderLeft: '6px solid #10B981',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{ padding: '12px 18px', backgroundColor: '#ECFDF5', borderBottom: '1px solid #A7F3D0', fontWeight: 800, color: '#047857', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={19} color="#10B981" /> 2. Data Personil yang Ditugaskan
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '18px' }}>
                  <Field label="Tambah Pegawai ke Daftar Lembur">
                    <select style={{ ...styles.input, border: '2px solid #10B981', color: '#065F46' }} value="" onChange={(e) => addPegawai(e.target.value)}>
                      <option value="">-- Pilih Pegawai untuk ditambahkan --</option>
                      {pegawaiList
                        .slice()
                        .sort((a, b) => String(a.nama || '').localeCompare(String(b.nama || ''), 'id', { sensitivity: 'base' }))
                        .map(item => (
                          <option key={item.nip} value={item.nip}>{item.nama} — {item.nip}</option>
                        ))}
                    </select>
                  </Field>
                </div>
                {form.pegawaiList?.length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                    <div style={{ marginBottom: '12px', fontWeight: 800, fontSize: '0.9rem', color: '#334155' }}>
                      Daftar Personil ({form.pegawaiList.length} orang):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {form.pegawaiList.map((p, idx) => (
                        <div key={p.nip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{idx + 1}. {p.nama}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{p.nip} — {p.jabatan}</div>
                          </div>
                          <button type="button" onClick={() => removePegawai(p.nip)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }} title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Uraian & Lokasi Pekerjaan (Border Kiri Amber/Yellow) */}
            <div style={{
              border: '1px solid #FDE68A',
              borderLeft: '6px solid #F59E0B',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.06)',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{ padding: '12px 18px', backgroundColor: '#FFFBEB', borderBottom: '1px solid #FDE68A', fontWeight: 800, color: '#B45309', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={19} color="#F59E0B" /> 3. Uraian & Lokasi Pekerjaan
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '18px' }}>
                  <Field label="Nama Pekerjaan Lembur">
                    <textarea style={styles.textarea} value={form.namaPekerjaan} onChange={(e) => updateForm('namaPekerjaan', e.target.value)} onBlur={(e) => updateForm('namaPekerjaan', formatEYD(e.target.value))} placeholder="Contoh: Monitoring Penggantian DS Bus A dan AVR Bay Trafo #1" />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
                  <Field label="Lokasi Pekerjaan">
                    <input style={styles.input} value={form.lokasi} onChange={(e) => updateForm('lokasi', e.target.value)} onBlur={(e) => updateForm('lokasi', formatEYD(e.target.value))} placeholder="Contoh: GI Cikarang" />
                  </Field>
                  <Field label="Koordinator Tugas">
                    <select style={styles.input} value={form.koordinator} onChange={(e) => updateForm('koordinator', e.target.value)}>
                      <option value="Saepul Rohmat">Saepul Rohmat</option>
                      <option value="Ervan Jagi Martha Wibowo">Ervan Jagi Martha Wibowo</option>
                      <option value="Ahmad Yazid Al Bastomy">Ahmad Yazid Al Bastomy</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {/* SECTION 4: Realisasi Aktivitas & Catatan Kejadian (Border Kiri Violet/Purple) */}
            <div style={{
              border: '1px solid #DDD6FE',
              borderLeft: '6px solid #8B5CF6',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.06)',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{ padding: '12px 18px', backgroundColor: '#F5F3FF', borderBottom: '1px solid #DDD6FE', fontWeight: 800, color: '#6D28D9', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={19} color="#8B5CF6" /> 4. Realisasi Aktivitas & Catatan Kejadian
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '18px' }}>
                  <Field label="Aktivitas Realisasi (1 baris per aktivitas)">
                    <textarea style={{ ...styles.textarea, minHeight: '136px' }} value={form.kegiatanText} onChange={(e) => updateForm('kegiatanText', e.target.value)} onBlur={(e) => updateForm('kegiatanText', formatEYD(e.target.value))} placeholder="Tuliskan tiap tahap aktivitas yang dilakukan..." />
                  </Field>
                  <Field label="Kejadian Penting / Catatan Tambahan">
                    <textarea style={{ ...styles.textarea, minHeight: '136px' }} value={form.kejadianPenting} onChange={(e) => updateForm('kejadianPenting', e.target.value)} onBlur={(e) => updateForm('kejadianPenting', formatEYD(e.target.value))} placeholder="Tuliskan catatan kejadian penting jika ada..." />
                  </Field>
                </div>
              </div>
            </div>
        </div>

        {/* Footer Action Bar */}
        <div style={{ padding: '20px 28px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {status && (
            <div style={{ padding: '12px 18px', backgroundColor: status.includes('❌') || status.includes('⚠️') ? '#FEF2F2' : '#ECFDF5', border: `1px solid ${status.includes('❌') || status.includes('⚠️') ? '#FECACA' : '#A7F3D0'}`, borderRadius: '10px', color: status.includes('❌') || status.includes('⚠️') ? '#DC2626' : '#047857', fontWeight: 800, fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {status}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => resetForm(false)} style={styles.secondaryButton}>
              <Plus size={18} /> Form Baru / Kosongkan
            </button>
            <button type="button" onClick={saveLemburan} disabled={isSaving} style={{ ...styles.primaryButton, padding: '12px 28px', fontSize: '1rem', boxShadow: '0 4px 14px rgba(0, 162, 233, 0.3)', opacity: isSaving ? 0.65 : 1 }}>
              <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Lemburan ke Arsip'}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderArchive = () => (
    <>
      {renderHeader('Arsip Lemburan', 'Kelola, edit, hapus, dan cetak ulang SPL beserta laporan realisasi.', Archive)}
      <div style={{ ...styles.card, padding: '18px 20px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 320px' }}>
          <Search size={17} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, NIP, no SPL, lokasi..." style={{ ...styles.input, paddingLeft: '38px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input type="month" value={exportMonth} onChange={(e) => setExportMonth(e.target.value)} style={{ ...styles.input, width: 'auto', minHeight: '44px', padding: '8px 12px', fontWeight: 800 }} title="Pilih Bulan Export" />
          <button
            type="button"
            onClick={exportBulkPdf}
            disabled={!selectedArchiveIds.length}
            title={selectedArchiveIds.length ? `Cetak ${selectedArchiveIds.length} arsip terpilih` : 'Centang arsip yang ingin dicetak'}
            style={{ ...styles.primaryButton, backgroundColor: '#7C3AED', borderColor: '#7C3AED', opacity: selectedArchiveIds.length ? 1 : 0.55, cursor: selectedArchiveIds.length ? 'pointer' : 'not-allowed' }}
          >
            <Printer size={17} /> Cetak Keseluruhan ({selectedArchiveIds.length})
          </button>
        </div>
      </div>

      <div style={{ ...styles.card, padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="pk-table">
            <thead>
              <tr>
                <th style={{ width: '52px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisibleSelection}
                    aria-label="Pilih semua arsip yang tampil"
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </th>
                <th>Tanggal</th>
                <th>Personil</th>
                <th>NIP</th>
                <th>No SPL</th>
                <th>Pekerjaan</th>
                <th>Durasi</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(item => (
                <tr key={item.id} style={selectedArchiveIds.includes(item.id) ? { backgroundColor: '#F0F9FF' } : undefined}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedArchiveIds.includes(item.id)}
                      onChange={() => toggleArchiveSelection(item.id)}
                      aria-label={`Pilih arsip ${item.nomorSpl}`}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </td>
                  <td>{formatDate(item.tanggalLembur)}</td>
                  <td style={{ fontWeight: 900 }}>{item.pegawai?.nama}</td>
                  <td>{item.pegawai?.nip}</td>
                  <td>{item.nomorSpl}</td>
                  <td style={{ minWidth: '260px' }}>{item.namaPekerjaan}</td>
                  <td>{item.durasi} jam</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => editRow(item)} title="Edit Data" style={{ ...styles.secondaryButton, minHeight: '36px', width: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PencilLine size={16} />
                      </button>
                      <button type="button" onClick={() => downloadPdf(item.id)} title="Download PDF" style={{ ...styles.secondaryButton, minHeight: '36px', width: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Printer size={16} />
                      </button>
                      <button type="button" onClick={() => deleteRow(item.id)} title="Hapus Data" style={{ ...styles.dangerButton, minHeight: '36px', width: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#64748B', fontWeight: 800, padding: '28px' }}>Belum ada arsip lemburan yang cocok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderExport = () => (
    <>
      {renderHeader('Export Rekap Lembur', 'Unduh rekap Excel sesuai format kolom file contoh Lemburan.', Download)}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '20px' }}>
        <div style={{ ...styles.card, padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={20} color="#10B981" /> Parameter Export
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: '16px', alignItems: 'end' }}>
            <Field label="Periode Bulan">
              <input type="month" style={styles.input} value={exportMonth} onChange={(e) => setExportMonth(e.target.value)} />
            </Field>
            <button type="button" onClick={() => {
              const qs = exportMonth ? `?month=${encodeURIComponent(exportMonth)}&t=${Date.now()}` : `?t=${Date.now()}`;
              window.location.href = `/api/lemburan/export-excel${qs}`;
            }} style={{ ...styles.primaryButton, width: 'fit-content' }}>
              <Download size={17} /> Download Rekap Excel
            </button>
          </div>
          <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            Export mengambil data yang sudah tersimpan di arsip lemburan dan mengisi kolom utama: NIP, nama, jabatan, grade, nomor SPL, tanggal lembur, pekerjaan, kategori, dokumen, hari, jam mulai, jam akhir, dan durasi.
          </div>
        </div>

        <div style={{ ...styles.card, padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: '0 0 14px' }}>Ringkasan Periode</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <StatLine label="Jumlah Baris" value={summary.monthRows} />
            <StatLine label="Total Jam" value={`${summary.totalHours} jam`} />
            <StatLine label="Personil Unik" value={summary.people} />
            <StatLine label="Master Pegawai" value={`${pegawaiList.length} personil`} />
          </div>
        </div>
      </div>
    </>
  );

  const currentView = activeSubTab === 'lemburan-input'
    ? renderInput()
    : activeSubTab === 'lemburan-arsip'
      ? renderArchive()
      : activeSubTab === 'lemburan-export'
        ? renderExport()
        : renderOverview();

  return (
    <div style={styles.page}>
      {currentView}
    </div>
  );
}

function StatLine({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
      <span style={{ color: '#64748B', fontWeight: 800 }}>{label}</span>
      <span style={{ color: '#0F172A', fontWeight: 900 }}>{value}</span>
    </div>
  );
}
