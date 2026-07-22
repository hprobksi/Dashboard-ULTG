import React, { useState } from 'react';
import { Eye, EyeOff, CheckSquare, Square, Zap, Lock } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State form
  const [nama, setNama] = useState('');
  const [namaUnit, setNamaUnit] = useState('');
  const [password, setPassword] = useState('');
  
  // State notifikasi
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validasi & Eksekusi Registrasi
    if (isRegister) {
      if (!nama.trim() || !namaUnit.trim() || !password.trim()) {
        setErrorMessage("User Name, Unit, dan Password harus diisi semua!");
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('db_users') || '[]');
      if (users.find(u => u.username === nama.trim())) {
        setErrorMessage("User Name sudah terdaftar! Silakan login.");
        return;
      }
      
      users.push({ username: nama.trim(), unit: namaUnit.trim(), password: password });
      localStorage.setItem('db_users', JSON.stringify(users));
      
      setSuccessMessage("Pendaftaran berhasil! Silakan login menggunakan akun tersebut.");
      setIsRegister(false);
      setNama('');
      setNamaUnit('');
      setPassword('');
      
    // Validasi & Eksekusi Login
    } else {
      if (!nama.trim() || !password.trim()) {
        setErrorMessage("User Name dan Password harus diisi!");
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('db_users') || '[]');
      const validUser = users.find(u => u.username === nama.trim() && u.password === password);
      
      if (validUser) {
        onLogin(validUser);
      } else {
        setErrorMessage("User Name atau Password salah!");
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: '#F1F5F9', // Background polos abu-abu sangat muda
      fontFamily: 'Inter, sans-serif',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      {/* Container Card (Terbagi Dua) */}
      <div className="auth-override" style={{ 
        display: 'flex',
        flexDirection: 'row',
        width: '100%', 
        maxWidth: '900px', // Sedikit diperlebar agar seimbang
        backgroundColor: '#FFFFFF', 
        borderRadius: '24px', 
        boxShadow: '0 24px 50px rgba(0,0,0,0.15)', 
        overflow: 'hidden' // Memotong sudut latar biru
      }}>
        
        {/* Inject CSS untuk form */}
        <style>{`
          .auth-override h1 { color: #FFFFFF !important; }
          .auth-override label { color: #E2E8F0 !important; font-size: 0.85rem !important; }
          .auth-override input { 
            color: #0F172A !important; 
            background-color: #FFFFFF !important; 
            border: none !important; 
            border-radius: 8px !important;
            padding: 14px 16px !important;
            font-size: 0.95rem !important;
            width: 100%;
            transition: all 0.2s ease;
          }
          .auth-override input:focus {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4) !important;
            outline: none !important;
          }
          .auth-override input::placeholder { color: #94A3B8 !important; }
          
          /* Responsif untuk layar kecil (HP) */
          @media (max-width: 768px) {
            .auth-override { flex-direction: column !important; }
          }
        `}</style>

        {/* KIRI - BIRU (Menu Login) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#007BB0', 
          backgroundImage: 'linear-gradient(135deg, #00A2E9 0%, #005F8A 100%)',
          padding: '70px 40px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              lineHeight: 1.2, 
              marginBottom: '8px',
              color: '#FFFFFF',
              textShadow: '0 4px 10px rgba(0,0,0,0.2)' // Efek bayangan teks
            }}>
              {isRegister ? 'DAFTAR' : 'LOGIN'}
            </h1>
          </div>

          {/* Notifikasi Pesan */}
          {errorMessage && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderLeft: '4px solid #EF4444', color: '#DC2626', marginBottom: '24px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderLeft: '4px solid #16A34A', color: '#16A34A', marginBottom: '24px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Input User Name (Selalu Muncul) */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                User Name
              </label>
              <input 
                type="text" 
                placeholder="Masukkan User Name..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              />
            </div>

            {/* Input Unit (Hanya Muncul Saat Daftar) */}
            {isRegister && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  Unit
                </label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nama Unit..."
                  value={namaUnit}
                  onChange={(e) => setNamaUnit(e.target.value)}
                  style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                />
              </div>
            )}

            {/* Input Password (Selalu Muncul) */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan Password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '48px !important', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Submit Button (Warna Kuning/Oranye agar kontras dengan biru) */}
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '16px',
                backgroundColor: '#F59E0B', // Kuning/Oranye hangat
                color: '#FFFFFF', 
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F59E0B';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
              }}
            >
              {isRegister ? 'Daftar' : 'Login'}
            </button>

            {/* Toggle Link Button (Dipindah ke bawah tombol Login) */}
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: '#E2E8F0', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {isRegister ? (
                <>Sudah memiliki Akun? <span 
                  onClick={() => { setIsRegister(false); setErrorMessage(''); setSuccessMessage(''); }} 
                  style={{ color: '#FCD34D', cursor: 'pointer', fontWeight: 800, textDecoration: 'underline', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >Login sekarang</span></>
              ) : (
                <>Belum memiliki Akun? <span 
                  onClick={() => { setIsRegister(true); setErrorMessage(''); setSuccessMessage(''); }} 
                  style={{ color: '#FCD34D', cursor: 'pointer', fontWeight: 800, textDecoration: 'underline', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >daftar sekarang</span></>
              )}
            </div>

          </form>
        </div>

        {/* KANAN - PUTIH (Logo & Branding) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#FFFFFF', 
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          
          {/* Logo dengan Drop Shadow */}
          <img 
            src="/ULTG.png" 
            alt="Logo ULTG" 
            style={{ 
              width: '100%', 
              maxWidth: '220px', 
              marginBottom: '20px',
              filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.15))' 
            }} 
          />
          
          {/* Judul Utama */}
          <h2 style={{ 
            color: '#0F172A', 
            fontSize: '2.2rem', 
            fontWeight: 900, 
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.05)',
            letterSpacing: '-0.5px'
          }}>
            ULTG BEKASI
          </h2>

          {/* Sub-judul */}
          <p style={{ 
            color: '#475569', 
            fontSize: '1rem', 
            fontWeight: 700,
            lineHeight: 1.5,
            maxWidth: '300px',
            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            Unit Layanan Transmisi Dan Gardu Induk Bekasi
          </p>
          
        </div>

      </div>
    </div>
  );
}
