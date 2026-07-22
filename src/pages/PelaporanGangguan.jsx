import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, MessageSquare, FileText, Copy, Check, Loader2, RefreshCw, Send, ShieldCheck, Database, PenTool, Layers, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storage';
import { geminiService } from '../services/gemini';

export default function PelaporanGangguan() {
  const [activeSubTab, setActiveSubTab] = useState('WA'); // 'WA' or 'BA'
  const [substations, setSubstations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  // Form State
  const [gi, setGi] = useState('');
  const [bay, setBay] = useState('');
  const [time, setTime] = useState('13.55 WIB');
  const [rawPoints, setRawPoints] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Structured WA State (Standar UIT JBT)
  const [waCategory, setWaCategory] = useState('SUTT'); // 'SUTT', 'TRAFO', 'LAINNYA', 'AUX'
  const [waTripType, setWaTripType] = useState('Trip 3 phasa');
  const [waWeather, setWaWeather] = useState('Cerah');
  const [waImpact, setWaImpact] = useState('Tidak ada pemadaman beban');
  const [waAssetArea, setWaAssetArea] = useState('UPT Bekasi - ULTG Cikarang');
  const [waIndications, setWaIndications] = useState('DTT Receive di HMI & Relay F87L');
  const [waCause, setWaCause] = useState('Sinyal DTT diduga muncul akibat di sisi GIS lawan (PT PDG) sedang melakukan pengujian relay OCR tanpa koordinasi dengan pihak GI Sukamahi, dimana rangkaian arus relay OCR diseri dengan relay CBF');
  const [waAction, setWaAction] = useState('Proteksi Line Diff tidak kerja (Sesuai). Pihak PT PDG akan membuat Berita Acara / Surat Pernyataan terkait pekerjaan uji relay yang mengakibatkan trip.');

  // Output State
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    const subs = await storageService.get('substations');
    const docs = await storageService.get('documents');
    const anos = await storageService.get('anomalies');
    
    setSubstations(subs);
    setAnomalies(anos);
    
    const baTemplates = docs.filter(d => d.category.includes('BA'));
    setTemplates(baTemplates);

    if (subs.length > 0 && !gi) setGi(subs[0].name);
    if (baTemplates.length > 0 && !selectedTemplateId) setSelectedTemplateId(baTemplates[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatOfflineWaReport = () => {
    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const targetGi = gi || 'GI Sukamahi';
    const targetBay = bay || 'SKTT 150 kV bay KTT 3';

    const sectionContent = `Pukul ${time} ${targetBay} di ${targetGi} ${waTripType}

 Penyebab Gangguan :
- ${waCause || rawPoints || 'Dalam investigasi tim proteksi'}

 Dampak Gangguan :
- ${waImpact || 'Tidak ada pemadaman beban'}

 Wilayah Aset Terganggu :
- ${waAssetArea || 'UPT Bekasi - ULTG Cikarang'}

Analisa Gangguan :
1. Kondisi cuaca saat gangguan di ${targetGi} yaitu ${waWeather || 'Cerah'}
2. Indikasi di ${targetGi} bay ${targetBay}:
- ${waIndications || 'Indikasi Annunciator/HMI mencatat trip'}
${rawPoints ? `3. Catatan lapangan tambahan: ${rawPoints}` : ''}

Tindak Lanjut:
1. ${waAction || 'Dilakukan koordinasi dengan pihak terkait'}

Kesimpulan
1. Kinerja Sistem Proteksi ${targetBay} di ${targetGi}:
- Sistem proteksi bekerja sesuai prinsip pengamanan instalasi`;

    return `LAPORAN GANGGUAN HARIAN HARTRANS#1 UIT JBT
${dateStr}

I. GANGGUAN SUTT/SUTET/SKTT
${waCategory === 'SUTT' ? sectionContent : '========== NIHIL =========='}

II. GANGGUAN TRAFO
${waCategory === 'TRAFO' ? sectionContent : '========== NIHIL =========='}

III. GANGGUAN BAY LAINNYA
${waCategory === 'LAINNYA' ? sectionContent : '========== NIHIL =========='}

IV. GANGGUAN LAIN-LAIN
${waCategory === 'AUX' ? sectionContent : '========== NIHIL =========='}


Demikian kami laporkan, semoga instalasi senantiasa beroperasi dengan aman dan andal,
Aamiin Yaa Rabbal'Alamin 🤲`;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!gi || !bay) {
      alert('Mohon isi Gardu Induk dan Bay / Peralatan.');
      return;
    }

    setLoading(true);
    setResultText('');
    setCopied(false);

    try {
      if (activeSubTab === 'WA') {
        try {
          const report = await geminiService.generateWaReport({
            category: waCategory,
            substation: gi,
            bay,
            tripType: waTripType,
            time,
            weather: waWeather,
            impact: waImpact,
            assetArea: waAssetArea,
            indications: waIndications,
            cause: waCause,
            action: waAction,
            rawPoints
          });
          setResultText(report);
        } catch (aiErr) {
          console.warn("AI Offline/Error, fallback ke Generator Baku UIT JBT:", aiErr);
          setResultText(formatOfflineWaReport());
        }
      } else {
        const targetTpl = templates.find(t => t.id === selectedTemplateId);
        if (!targetTpl) throw new Error('Template dokumen tidak ditemukan');

        const giAnos = anomalies.filter(a => a.substation === gi);

        const doc = await geminiService.generateBaDocument({
          templateContent: targetTpl.templateContent,
          rawPoints,
          substation: gi,
          bay,
          anomaliesHistory: giAnos
        });
        setResultText(doc);
      }
    } catch (err) {
      setResultText('[ERROR]: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: '#FFD100', padding: '10px', borderRadius: '12px' }}>
            <Zap size={30} color="#0F172A" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Pelaporan Gangguan & Kronologi</h1>
          </div>
        </div>
      </div>

      {/* Sub Tab Pemilih: WA vs BA */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '26px' }}>
        <button
          onClick={() => { setActiveSubTab('WA'); setResultText(''); }}
          className={`btn ${activeSubTab === 'WA' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, padding: '16px', fontSize: '0.95rem', fontWeight: 700, backgroundColor: activeSubTab === 'WA' ? '#00A2E9' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <MessageSquare size={20} /> Modul 1: Format Laporan Cepat WhatsApp
        </button>

        <button
          onClick={() => { setActiveSubTab('BA'); setResultText(''); }}
          className={`btn ${activeSubTab === 'BA' ? 'btn-yellow' : 'btn-outline'}`}
          style={{ flex: 1, padding: '16px', fontSize: '0.95rem', fontWeight: 700, backgroundColor: activeSubTab === 'BA' ? '#FFD100' : '#FFFFFF', color: activeSubTab === 'BA' ? '#0F172A' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <FileText size={20} /> Modul 2: Draft Berita Acara (BA) Gangguan Resmi
        </button>
      </div>

      {/* Main Two Column Generator Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Left Column: Input Form */}
        <div className="card" style={{ padding: '28px', borderTop: activeSubTab === 'WA' ? '4px solid #00A2E9' : '4px solid #FFD100' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PenTool size={18} color="#00A2E9" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                {activeSubTab === 'WA' ? 'Formulir Standar Gangguan UIT JBT' : 'Input Poin Kasar Lapangan'}
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' }}>
              <ShieldCheck size={14} /> Gemini 3.1 Pro + Offline Fallback
            </span>
          </div>

          {activeSubTab === 'WA' && (
            <div style={{ backgroundColor: '#EFF6FF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: '#1E3A8A', fontWeight: 600 }}>
                💡 Standarisasi Pelaporan Harian UPT Bekasi / UIT JBT
              </span>
              <button
                type="button"
                onClick={() => {
                  setGi('GI Sukamahi');
                  setBay('SKTT 150 kV bay KTT 3');
                  setTime('13.55 WIB');
                  setWaCategory('SUTT');
                  setWaTripType('Trip 3 phasa');
                  setWaWeather('Cerah');
                  setWaImpact('Tidak ada pemadaman beban');
                  setWaAssetArea('UPT Bekasi - ULTG Cikarang');
                  setWaIndications('Indikasi di HMI dan F87L ada DTT Receive');
                  setWaCause('Sinyal DTT diduga muncul akibat di sisi GIS lawan (PT PDG) sedang melakukan pengujian relay OCR tanpa koordinasi dengan pihak GI Sukamahi, dimana rangkaian arus relay OCR diseri dengan relay CBF yang bekerja sampai stage 2 (T2)');
                  setWaAction('Proteksi Line Diff tidak kerja (Sesuai). Pihak PT PDG akan membuat Berita Acara / Surat Pernyataan terkait pekerjaan uji relay yang mengakibatkan trip.');
                  setRawPoints('Jam 13.55 SKTT Sukamahi bay KTT 3 trip 3 phasa. Cuaca cerah. Indikasi di HMI dan F87L ada DTT Receive. Beban aman ga padam. Setelah dicek ternyata GIS PDG lawan lagi tes relay OCR ga info ke kita, karena wiring arus OCR diseri sama CBF, CBF kerja sampai stage 2 (T2) ngirim DTT ke Sukamahi. Proteksi kita line diff ga kerja (sesuai). Nanti PDG mau buat Berita Acara.');
                }}
                style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#00A2E9', color: '#FFF', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ⚡ Isi Contoh DTT Sukamahi
              </button>
            </div>
          )}

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeSubTab === 'BA' && (
              <div style={{ backgroundColor: '#FFF9DB', padding: '14px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>
                  <Layers size={16} /> Pilih Template Berita Acara Baku Kantor:
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="input-field"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  {templates.map(t => <option key={t.id} value={t.id}>{t.title} ({t.category})</option>)}
                </select>
              </div>
            )}

            {activeSubTab === 'WA' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Klasifikasi Kategori Laporan *</label>
                  <select value={waCategory} onChange={e => setWaCategory(e.target.value)} className="input-field">
                    <option value="SUTT">I. GANGGUAN SUTT/SUTET/SKTT</option>
                    <option value="TRAFO">II. GANGGUAN TRAFO</option>
                    <option value="LAINNYA">III. GANGGUAN BAY LAINNYA</option>
                    <option value="AUX">IV. GANGGUAN LAIN-LAIN</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Jenis Trip / Status</label>
                  <input type="text" value={waTripType} onChange={e => setWaTripType(e.target.value)} className="input-field" placeholder="Misal: Trip 3 phasa" />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Gardu Induk *</label>
                <select value={gi} onChange={e => setGi(e.target.value)} className="input-field">
                  <option value="GI Sukamahi">GI Sukamahi</option>
                  {substations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Bay / Peralatan Trip *</label>
                <input type="text" placeholder="Misal: SKTT 150 kV bay KTT 3" value={bay} onChange={e => setBay(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Jam Kejadian</label>
                <input type="text" value={time} onChange={e => setTime(e.target.value)} className="input-field" />
              </div>
            </div>

            {activeSubTab === 'WA' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Kondisi Cuaca</label>
                    <input type="text" value={waWeather} onChange={e => setWaWeather(e.target.value)} className="input-field" placeholder="Misal: Cerah / Hujan" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Dampak Beban</label>
                    <input type="text" value={waImpact} onChange={e => setWaImpact(e.target.value)} className="input-field" placeholder="Misal: Tidak ada pemadaman" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Wilayah Aset</label>
                    <input type="text" value={waAssetArea} onChange={e => setWaAssetArea(e.target.value)} className="input-field" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Indikasi Annunciator / HMI / Relay</label>
                  <input type="text" value={waIndications} onChange={e => setWaIndications(e.target.value)} className="input-field" placeholder="Misal: DTT Receive, F87L" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Penyebab / Analisa Kronologi</label>
                  <textarea value={waCause} onChange={e => setWaCause(e.target.value)} className="input-field" rows={2} placeholder="Misal: Sinyal DTT muncul akibat pengujian relay OCR di sisi GIS lawan tanpa info..." />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Tindak Lanjut & Kesimpulan</label>
                  <textarea value={waAction} onChange={e => setWaAction(e.target.value)} className="input-field" rows={2} placeholder="Misal: Proteksi line diff tidak kerja (Sesuai). Pihak lawan akan membuat Berita Acara..." />
                </div>
              </>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  {activeSubTab === 'WA' ? 'Catatan Tambahan / Poin Mentah dari WA Petugas' : 'Ketik Poin Poin Singkat Gangguan / Hasil Uji *'}
                </label>
              </div>
              <textarea
                placeholder="Petugas cukup paste pesan WA mentah dari lapangan di sini..."
                value={rawPoints}
                onChange={e => setRawPoints(e.target.value)}
                className="input-field"
                rows={activeSubTab === 'WA' ? 3 : 6}
              />
            </div>

            {activeSubTab === 'BA' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Database size={16} color="#00A2E9" />
                <span>AI akan otomatis mencocokkan riwayat anomali GI {gi || 'terkait'} di database lokal.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn ${activeSubTab === 'WA' ? 'btn-primary' : 'btn-yellow'}`}
              style={{ padding: '14px', fontSize: '0.95rem', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Sedang Menjabarkan dengan Penalaran AI...' : `Jabarkan ke ${activeSubTab === 'WA' ? 'Format WhatsApp' : 'Dokumen Berita Acara'}`}
            </button>
          </form>
        </div>

        {/* Right Column: AI Generated Output */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#0F172A" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                  Hasil Penjabaran AI ({activeSubTab === 'WA' ? 'WhatsApp Dispatcher' : 'Berita Acara Resmi'})
                </h3>
              </div>

              {resultText && (
                <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.825rem' }}>
                  {copied ? <Check size={16} color="#FFD100" /> : <Copy size={16} />}
                  {copied ? 'Berhasil Disalin!' : 'Salin Laporan'}
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '70px 20px', color: '#64748B' }}>
                <Loader2 size={48} color="#00A2E9" className="animate-spin" style={{ margin: '0 auto 18px' }} />
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A' }}>Gemini 3.1 Pro sedang berpikir...</p>
                <p style={{ fontSize: '0.85rem', maxWidth: '320px', margin: '8px auto', color: '#64748B' }}>
                  Menerapkan kosa kata teknik ketenagalistrikan PLN dan mencocokkan struktur format standar.
                </p>
              </div>
            ) : !resultText ? (
              <div style={{ textAlign: 'center', padding: '70px 20px', color: '#94A3B8', border: '2px dashed #CBD5E1', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
                <Sparkles size={44} style={{ margin: '0 auto 14px', color: '#CBD5E1' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>Belum ada hasil laporan.</p>
                <p style={{ fontSize: '0.825rem' }}>Isi poin lapangan di panel sebelah kiri lalu klik tombol "Jabarkan".</p>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '22px',
                fontFamily: activeSubTab === 'WA' ? 'system-ui, sans-serif' : 'monospace',
                fontSize: activeSubTab === 'WA' ? '0.925rem' : '0.85rem',
                lineHeight: 1.65,
                color: '#1E293B',
                whiteSpace: 'pre-wrap',
                maxHeight: '520px',
                overflowY: 'auto',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}>
                {resultText}
              </div>
            )}
          </div>

          {resultText && (
            <div style={{ marginTop: '18px', fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
              <AlertCircle size={14} color="#00A2E9" />
              <span>Klik tombol <b>Salin Laporan</b> di kanan atas lalu tempelkan ke WhatsApp / Ms Word.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
