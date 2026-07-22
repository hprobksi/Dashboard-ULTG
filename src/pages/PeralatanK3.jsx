import React, { useEffect, useMemo, useState } from 'react';
import {
  Save, Download, ChevronRight, ShieldCheck, Activity,
  Trash2, Check, Loader2, RefreshCw
} from 'lucide-react';
import { storageService } from '../services/storage';

const STORAGE_KEY = 'peralatan_k3_data';

const DEFAULT_FORM_DATA = {
  unitInfo: {
    namaUnit: 'Gardu Induk 150kV Cikarang',
    jumlahPersonil: '14 Orang ( 1 TL, 3 Jargi, 7 Satpam, 2 CS, 1 LW)',
    tanggalPengisian: new Date().toISOString().split('T')[0]
  },
  tabs: []
};

const mergeTemplateWithSaved = (templateData, savedData) => {
  const savedTabs = Array.isArray(savedData?.tabs) ? savedData.tabs : [];
  const legacyApd = Array.isArray(savedData?.apd) ? savedData.apd : [];

  return {
    unitInfo: {
      ...(templateData.unitInfo || DEFAULT_FORM_DATA.unitInfo),
      ...(savedData?.unitInfo || {})
    },
    tabs: (templateData.tabs || []).map(tab => {
      const savedTab = savedTabs.find(item => item.id === tab.id);
      const savedRows = tab.id === 'apd' && !savedTab ? legacyApd : (savedTab?.rows || []);

      return {
        ...tab,
        rows: (tab.rows || []).map(row => {
          const savedRow = savedRows.find(item => item.rowNumber === row.rowNumber);
          if (!savedRow) return { ...row };

          const nextRow = { ...row };
          (tab.columns || []).forEach(column => {
            if (column.editable && savedRow[column.key] !== undefined) {
              nextRow[column.key] = savedRow[column.key];
            }
          });
          return nextRow;
        })
      };
    })
  };
};

export default function PeralatanK3({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('apd');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [templateData, setTemplateData] = useState(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [templateError, setTemplateError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeApdStep, setActiveApdStep] = useState(0);

  const tabs = useMemo(() => formData.tabs || [], [formData.tabs]);
  const activeTabData = tabs.find(tab => tab.id === activeSubTab);

  const apdCategories = useMemo(() => {
    const apdTab = tabs.find(tab => tab.id === 'apd');
    return [...new Set((apdTab?.rows || []).map(item => item.category).filter(Boolean))];
  }, [tabs]);

  const loadTemplate = async () => {
    setIsLoadingTemplate(true);
    setTemplateError('');

    try {
      const res = await fetch('/api/k3-template');
      const payload = await res.json();
      if (!payload.success) {
        throw new Error(payload.error || 'Template K3 tidak dapat dibaca.');
      }

      const saved = await storageService.get(STORAGE_KEY);
      const merged = mergeTemplateWithSaved(payload.data, saved);
      setTemplateData(payload.data);
      setFormData(merged);

      const firstTab = merged.tabs.find(tab => tab.id === 'apd') || merged.tabs[0];
      setActiveSubTab(firstTab?.id || 'info');
      setActiveApdStep(0);
    } catch (e) {
      setTemplateError(e.message);
      setFormData(DEFAULT_FORM_DATA);
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  useEffect(() => {
    loadTemplate();
  }, []);

  const saveToLocal = async () => {
    setIsSaving(true);
    await storageService.set(STORAGE_KEY, formData);
    setTimeout(() => {
      setIsSaving(false);
      alert('Data berhasil disimpan secara lokal!');
    }, 500);
  };

  const resetData = async () => {
    if (!templateData) return;
    if (confirm('Yakin ingin mereset formulir? Data isian Anda akan kembali mengikuti template Excel K3 awal.')) {
      const freshData = mergeTemplateWithSaved(templateData, null);
      await storageService.set(STORAGE_KEY, freshData);
      setFormData(freshData);
      setActiveApdStep(0);
      alert('Data berhasil di-reset ke format awal.');
    }
  };

  const handleDownloadExcel = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-k3-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Gagal membuat Excel.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Peralatan_K3_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateUnitInfo = (key, value) => {
    setFormData(prev => ({
      ...prev,
      unitInfo: { ...prev.unitInfo, [key]: value }
    }));
  };

  const updateRowValue = (tabId, rowNumber, key, value) => {
    setFormData(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab => {
        if (tab.id !== tabId) return tab;
        return {
          ...tab,
          rows: tab.rows.map(row => (
            row.rowNumber === rowNumber ? { ...row, [key]: value } : row
          ))
        };
      })
    }));
  };

  const renderTabs = () => (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
      {[{ id: 'info', label: 'Info Unit' }, ...tabs.map(tab => ({ id: tab.id, label: tab.label }))].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveSubTab(tab.id)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeSubTab === tab.id ? '#0F766E' : '#F1F5F9',
            color: activeSubTab === tab.id ? '#FFF' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderEditableCell = (tab, row, column) => {
    const value = row[column.key] ?? '';
    const commonStyle = {
      width: '100%',
      minWidth: column.input === 'select' ? '140px' : '120px',
      padding: '9px 10px',
      borderRadius: '7px',
      border: '1px solid #CBD5E1',
      outlineColor: '#0F766E',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      fontWeight: 600,
      boxSizing: 'border-box'
    };

    if (!column.editable) {
      return (
        <div style={{ color: '#0F172A', fontWeight: column.key === 'no' ? 800 : 650, whiteSpace: 'pre-line' }}>
          {value || '-'}
        </div>
      );
    }

    if (column.input === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => updateRowValue(tab.id, row.rowNumber, column.key, e.target.value)}
          style={commonStyle}
        >
          {Array.from(new Set([...(column.options || []), value].filter(item => item !== undefined))).map(option => (
            <option key={option || 'blank'} value={option}>{option || '-'}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={value}
        placeholder="Opsional"
        onChange={(e) => updateRowValue(tab.id, row.rowNumber, column.key, e.target.value)}
        style={commonStyle}
      />
    );
  };

  const renderTable = (tab, rows) => (
    <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#0F766E', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.95rem' }}>{rows.length}</span>
            {tab.label}
          </h3>
          <div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 700, marginTop: '6px' }}>
            Sheet sumber: {tab.sheetName}
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #E2E8F0' }}>
              {(tab.columns || []).map(column => (
                <th key={column.key} style={{ padding: '12px', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', minWidth: column.key === 'no' ? '64px' : '150px' }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.rowNumber} style={{ borderBottom: '1px solid #E2E8F0' }}>
                {(tab.columns || []).map(column => (
                  <td key={column.key} style={{ padding: '12px', verticalAlign: 'top', fontSize: '0.88rem' }}>
                    {renderEditableCell(tab, row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApdWizard = () => {
    const apdTab = tabs.find(tab => tab.id === 'apd');
    if (!apdTab) return null;

    const activeCategory = apdCategories[activeApdStep] || apdCategories[0] || '';
    const categoryItems = apdTab.rows.filter(item => item.category === activeCategory);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ position: 'relative', padding: '20px 0', display: 'flex', alignItems: 'center', overflowX: 'auto', gap: '10px' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', backgroundColor: '#E2E8F0', zIndex: 0, transform: 'translateY(-50%)' }} />

          {apdCategories.map((category, index) => {
            const isCompleted = index < activeApdStep;
            const isActive = index === activeApdStep;
            return (
              <div
                key={category}
                onClick={() => setActiveApdStep(index)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '100px',
                  flex: 1,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#0F766E' : (isCompleted ? '#0EA5E9' : '#FFF'),
                  border: `3px solid ${isActive || isCompleted ? 'transparent' : '#CBD5E1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  boxShadow: isActive ? '0 0 0 4px rgba(15,118,110,0.2)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : (index + 1)}
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '0.7rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0F766E' : '#64748B',
                  textAlign: 'center',
                  maxWidth: '90px',
                  lineHeight: 1.2
                }}>
                  {category.replace(' *', '').replace(' **', '')}
                </div>
              </div>
            );
          })}
        </div>

        {renderTable(apdTab, categoryItems)}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            disabled={activeApdStep === 0}
            onClick={() => setActiveApdStep(prev => prev - 1)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 700, cursor: activeApdStep === 0 ? 'not-allowed' : 'pointer', opacity: activeApdStep === 0 ? 0.5 : 1 }}
          >
            Kembali
          </button>

          <button
            onClick={() => {
              if (activeApdStep < apdCategories.length - 1) {
                setActiveApdStep(prev => prev + 1);
              } else {
                saveToLocal();
              }
            }}
            style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0F766E', color: '#FFF', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,118,110,0.2)' }}
          >
            {activeApdStep === apdCategories.length - 1 ? 'Simpan Data APD' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    );
  };

  const renderInfoUnit = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#334155' }}>Nama Unit</label>
        <input type="text" value={formData.unitInfo.namaUnit} onChange={e => updateUnitInfo('namaUnit', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#334155' }}>Jumlah Personil</label>
        <input type="text" value={formData.unitInfo.jumlahPersonil} onChange={e => updateUnitInfo('jumlahPersonil', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: '#334155' }}>Tanggal Pengisian Data</label>
        <input type="text" value={formData.unitInfo.tanggalPengisian} onChange={e => updateUnitInfo('tanggalPengisian', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <button onClick={() => setActiveTab('k3-dashboard')} style={{ background: 'none', border: 'none', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0, marginBottom: '8px', fontWeight: 600 }}>
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Kembali ke K3
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={32} color="#0F766E" />
            Form Peralatan K3 & Proteksi
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#64748B', fontWeight: 600 }}>
            Input data K3 secara bertahap untuk di-generate menjadi Laporan Excel Resmi.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={loadTemplate} disabled={isLoadingTemplate} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFF', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: 700, cursor: isLoadingTemplate ? 'not-allowed' : 'pointer' }}>
            <RefreshCw size={18} /> Muat Template
          </button>
          <button onClick={resetData} disabled={!templateData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #B91C1C', borderRadius: '8px', fontWeight: 700, cursor: templateData ? 'pointer' : 'not-allowed', opacity: templateData ? 1 : 0.55 }}>
            <Trash2 size={18} /> Reset Form
          </button>
          <button onClick={saveToLocal} disabled={isSaving || !templateData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFF', color: '#0F766E', border: '1px solid #0F766E', borderRadius: '8px', fontWeight: 700, cursor: isSaving || !templateData ? 'not-allowed' : 'pointer', opacity: templateData ? 1 : 0.55 }}>
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Sementara'}
          </button>
          <button onClick={handleDownloadExcel} disabled={isGenerating || !templateData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0F766E', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: isGenerating || !templateData ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(15,118,110,0.2)', opacity: templateData ? 1 : 0.55 }}>
            <Download size={18} /> {isGenerating ? 'Memproses Excel...' : 'Generate Excel (.xlsx)'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        {isLoadingTemplate ? (
          <div style={{ minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#64748B', fontWeight: 800 }}>
            <Loader2 size={34} style={{ animation: 'spin 1s linear infinite' }} />
            Membaca template Excel K3...
          </div>
        ) : templateError ? (
          <div style={{ minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', gap: '12px' }}>
            <Activity size={48} color="#B91C1C" />
            <h3 style={{ margin: 0, color: '#0F172A' }}>Template K3 belum dapat dibaca</h3>
            <p style={{ margin: 0, color: '#64748B', fontWeight: 600 }}>{templateError}</p>
          </div>
        ) : (
          <>
            {renderTabs()}
            {activeSubTab === 'info' && renderInfoUnit()}
            {activeSubTab === 'apd' && renderApdWizard()}
            {activeSubTab !== 'info' && activeSubTab !== 'apd' && activeTabData && renderTable(activeTabData, activeTabData.rows || [])}
          </>
        )}
      </div>
    </div>
  );
}
