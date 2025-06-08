'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '@/app/components/navbarAdmin';
import Footer from '@/app/footer';

export default function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      // Simpan token dan username ke localStorage
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);

      setMessage('Login berhasil!');
      setIsError(false);
      setTimeout(() => {
        router.push('/admin/produk');
      }, 1500);
    } catch (error: any) {
      setMessage(error.message || 'Terjadi kesalahan saat login');
      setIsError(true);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <main>
        <h1>ADMIN LOG IN</h1>
        <div className="kotak_login">
          <form onSubmit={handleLogin}>
            <div className="baris_form">
              <label>Username</label>
              <input
                type="text"
                placeholder="Masukkan Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="baris_form">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className="form-message">
                <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>
              </div>
            )}

            <div className="btn-group">
              <button type="button" className="btn-back" onClick={() => router.push('/')}>
                BACK
              </button>
              <button type="submit" className="btn-next">
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
