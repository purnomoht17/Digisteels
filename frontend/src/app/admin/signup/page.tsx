'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '@/app/components/navbarAdmin';
import Footer from '@/app/footer';

export default function SignupAdmin() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const { username, password, confirmPassword } = form;

    if (!username.trim()) return "Username wajib diisi";
    if (typeof username !== "string") return "Username harus berupa string";
    if (username.length > 50) return "Username maksimal 50 karakter";

    if (!password.trim()) return "Password wajib diisi";
    if (typeof password !== "string") return "Password harus berupa string";
    if (password.length < 8) return "Password minimal 8 karakter";

    if (password !== confirmPassword) return "Konfirmasi password tidak cocok";

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Pendaftaran admin gagal');
        return;
      }

      setSuccess('Pendaftaran admin berhasil!');
      setTimeout(() => {
        router.push('/admin/login');
      }, 1500);

    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    }
  };

  return (
    <>
      <NavbarAdmin />
      <main>
        <h1>Admin Sign Up</h1>
        <div className="kotak_login">
          <form onSubmit={handleSubmit}>
            <div className="baris_form">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Masukkan username..."
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="baris_form">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Masukkan password..."
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="baris_form">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Konfirmasi password..."
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {(error || success) && (
              <div className="form-message">
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
              </div>
            )}

            <div className="btn-group">
              <button type="button" className="btn-back" onClick={() => router.push('/')}>
                BACK
              </button>
              <button type="submit" className="btn-next">
                NEXT
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
