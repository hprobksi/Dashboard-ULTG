import React, { useState } from 'react';
import { User, ShieldCheck, CheckCircle2, Save, X } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
  const [namaLengkap, setNamaLengkap] = useState(user?.username || '');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordBaru && passwordBaru !== konfirmasiPassword) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }
    
    // Update data di localStorage
    try {
      const users = JSON.parse(localStorage.getItem('db_users') || '[]');
      const userIndex = users.findIndex(u => u.username === user.username);
      
      if (userIndex !== -1) {
        if (passwordBaru) {
          users[userIndex].password = passwordBaru;
        }
        localStorage.setItem('db_users', JSON.stringify(users));
        setSuccess("Profil berhasil diperbarui!");
        
        setPasswordBaru('');
        setKonfirmasiPassword('');
      } else {
        setError("Gagal menemukan data pengguna.");
      }
    } catch (err) {
      setError("Gagal menyimpan perubahan.");
    }
  };

  const memberSince = "21 Juli 2026";

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '850px',
        backgroundColor: '#F8FAFC',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748B', padding: '4px', borderRadius: '50%',
            transition: 'background-color 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
        >
          <X size={24} />
        </button>

        <div style={{
          width: '320px',
          backgroundColor: '#005F8A',
          backgroundImage: 'linear-gradient(180deg, #007BB0 0%, #005F8A 100%)',
          color: '#FFFFFF',
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '120px', height: '120px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '4px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <User size={64} color="#FFFFFF" strokeWidth={1.5} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', textAlign: 'center' }}>
            {user?.username || 'User'}
          </h2>
          
          <div style={{
            backgroundColor: '#FFFFFF', color: '#0F172A',
            padding: '4px 12px', borderRadius: '4px',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.5px', marginBottom: '40px'
          }}>
            ADMIN_UPT
          </div>

          <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>ACCOUNT STATUS</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontWeight: 700, fontSize: '0.95rem' }}>
                <CheckCircle2 size={16} /> Active
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>ORGANIZATION SCOPE</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>{user?.unit || 'UPT Bekasi'}</p>
            </div>
            
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>MEMBER SINCE</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>{memberSince}</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px' }}>
          <h2 style={{ margin: '0 0 30px 0', fontSize: '1.4rem', color: '#0F172A', fontWeight: 800 }}>
            Update Informasi Profil
          </h2>

          {error && <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
          {success && <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#DCFCE7', color: '#16A34A', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>{success}</div>}

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Nama Lengkap
              </label>
              <input 
                type="text"
                value={namaLengkap}
                readOnly
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', fontSize: '0.95rem', color: '#475569', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '30px 0' }}></div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={20} color="#00A2E9" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F172A', fontWeight: 800 }}>Keamanan Akun</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Biarkan password kosong jika tidak ingin mengubahnya.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Password Baru
                </label>
                <input 
                  type="password"
                  placeholder="Password baru"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.95rem', color: '#0F172A' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Konfirmasi Password
                </label>
                <input 
                  type="password"
                  placeholder="Ulangi password"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.95rem', color: '#0F172A' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', backgroundColor: '#005F8A', color: '#FFFFFF',
                  border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'background-color 0.2s ease',
                  boxShadow: '0 4px 6px rgba(0, 95, 138, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004A6B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005F8A'}
              >
                <Save size={18} /> SIMPAN PERUBAHAN
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
