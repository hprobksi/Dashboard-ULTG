import React from 'react';
import { Leaf } from 'lucide-react';

export default function K3Lingkungan() {
  return (
    <div style={{ padding: '32px' }}>
      <div className="card" style={{ padding: '36px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', backgroundColor: '#ECFDF5', borderRadius: '12px' }}>
            <Leaf size={32} color="#10B981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Manajemen Lingkungan</h2>
            <p style={{ color: '#64748B', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>
              Modul pemantauan dan pengelolaan lingkungan hidup. (Dalam Pengembangan)
            </p>
          </div>
        </div>
        <div style={{ border: '2px dashed #E2E8F0', borderRadius: '12px', padding: '48px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
          <p style={{ color: '#94A3B8', margin: 0, fontWeight: 500 }}>
            Halaman ini akan segera hadir. Anda dapat menambahkan tabel atau formulir data Lingkungan di sini.
          </p>
        </div>
      </div>
    </div>
  );
}
