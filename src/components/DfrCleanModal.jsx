import React, { useState, useEffect } from 'react';
import { X, Server, Lock, User, Terminal, Loader2, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';

export default function DfrCleanModal({ isOpen, onClose, selectedDfrInitial, dfrList }) {
  const [selectedDfr, setSelectedDfr] = useState(selectedDfrInitial || '');
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  
  // Status execution
  const [isCleaning, setIsCleaning] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (selectedDfrInitial) {
      setSelectedDfr(selectedDfrInitial);
    }
  }, [selectedDfrInitial]);

  // Polling status
  useEffect(() => {
    let interval;
    if (isCleaning && taskId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/dfr/clean/status/${taskId}`);
          if (res.ok) {
            const data = await res.json();
            setStatusMessage(data.status);
            if (data.done) {
              setIsCleaning(false);
              setIsDone(true);
              setIsError(data.error);
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error("Gagal mengambil status:", e);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCleaning, taskId]);

  if (!isOpen) return null;

  const activeDevice = dfrList.find(d => d.id === selectedDfr);
  const homeStorage = activeDevice?.storage?.find(s => s.mount === '/home');

  const handleStartClean = async () => {
    if (!selectedDfr || !username || !password) {
      alert("Harap lengkapi pilihan DFR, Username, dan Password!");
      return;
    }
    setIsCleaning(true);
    setIsDone(false);
    setIsError(false);
    setStatusMessage('Memulai perintah bersih-bersih...');

    try {
      const res = await fetch('/api/dfr/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: activeDevice.id,
          ip: activeDevice.ip,
          username,
          password
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTaskId(data.task_id);
      } else {
        throw new Error("Gagal memulai task di server");
      }
    } catch (e) {
      setIsCleaning(false);
      setIsDone(true);
      setIsError(true);
      setStatusMessage(`Gagal: ${e.message}`);
    }
  };

  const resetState = () => {
    setIsCleaning(false);
    setTaskId(null);
    setStatusMessage('');
    setIsDone(false);
    setIsError(false);
    setPassword('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={20} color="#EF4444" /> DFR SSH Auto-Clean
          </h3>
          <button onClick={handleClose} disabled={isCleaning} style={{ background: 'none', border: 'none', cursor: isCleaning ? 'not-allowed' : 'pointer', color: '#64748B' }}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {!isCleaning && !isDone && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Pilih Perangkat DFR</label>
                <select 
                  value={selectedDfr}
                  onChange={(e) => setSelectedDfr(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                >
                  <option value="">-- Pilih DFR --</option>
                  {dfrList.map(dev => (
                    <option key={dev.id} value={dev.id}>{dev.nama_gi} - {dev.nama_bay} ({dev.ip})</option>
                  ))}
                </select>
              </div>

              {activeDevice && homeStorage && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    <HardDrive size={14} /> Status Memori Induk (/home)
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                      <span>{homeStorage.mount}</span>
                      <span style={{ color: homeStorage.used_percent >= 90 ? '#EF4444' : homeStorage.used_percent >= 75 ? '#F59E0B' : '#10B981' }}>
                        {homeStorage.used_percent.toFixed(1).replace('.0', '')}%
                      </span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(100, Math.max(0, homeStorage.used_percent))}%`, 
                        backgroundColor: homeStorage.used_percent >= 90 ? '#EF4444' : homeStorage.used_percent >= 75 ? '#F59E0B' : '#10B981', 
                        height: '100%' 
                      }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Username SSH</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Password SSH</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password DFR"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button 
                onClick={handleStartClean}
                disabled={!selectedDfr || !password}
                style={{ width: '100%', padding: '12px', backgroundColor: (!selectedDfr || !password) ? '#94A3B8' : '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: (!selectedDfr || !password) ? 'not-allowed' : 'pointer' }}
              >
                Mulai Pembersihan (rm -rf *)
              </button>
            </>
          )}

          {(isCleaning || isDone) && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              {isCleaning ? (
                <Loader2 size={48} color="#00A2E9" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
              ) : isError ? (
                <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 16px auto' }} />
              ) : (
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
              )}
              
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: isError ? '#EF4444' : '#0F172A' }}>
                {isCleaning ? 'Sedang Diproses...' : isError ? 'Terjadi Kesalahan' : 'Selesai!'}
              </h4>
              
              <div style={{ backgroundColor: '#F1F5F9', padding: '12px', borderRadius: '8px', color: '#334155', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '24px', borderLeft: `4px solid ${isError ? '#EF4444' : '#00A2E9'}` }}>
                &gt; {statusMessage}
              </div>

              {isDone && (
                <button 
                  onClick={handleClose}
                  style={{ padding: '10px 24px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Tutup Jendela
                </button>
              )}
            </div>
          )}
          
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
