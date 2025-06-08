'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/navbar';
import Footer from '@/app/footer';

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const { nama, email, password, confirmPassword } = form;

    if (!nama.trim()) return "Nama wajib diisi";
    if (typeof nama !== "string") return "Nama harus berupa string";
    if (nama.length > 100) return "Nama maksimal 100 karakter";

    if (!email.trim()) return "Email wajib diisi";
    if (typeof email !== "string") return "Email harus berupa string";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email harus dalam format yang valid";

    if (!password.trim()) return "Password wajib diisi";
    if (typeof password !== "string") return "Password harus berupa string";
    if (password.length < 8) return "Password minimal 8 karakter";
    if (password.length > 100) return "Password maksimal 100 karakter";
    const allowed = /^[a-zA-Z0-9!@#$%^&*()_+={}|<>?;:,.~]*$/;
    if (!allowed.test(password)) return "Password hanya boleh mengandung huruf, angka, dan karakter khusus";

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
      const res = await fetch('http://localhost:5001/api/pelanggan/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Email telah digunakan") {
          setError("Email telah digunakan");
        } else {
          setError(data.message || "Pendaftaran gagal");
        }
        return;
      }

      setSuccess("Pendaftaran berhasil!");
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi server");
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <h1>SIGN UP</h1>
        <div className="kotak_login">
          <form onSubmit={handleSubmit}>
            <div className="baris_form">
              <label htmlFor="nama">Name</label>
              <input
                type="text"
                id="nama"
                name="nama"
                placeholder="Masukkan name..."
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="baris_form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan email..."
                value={form.email}
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
                placeholder="Masukkan Password..."
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
                placeholder="Konfirmasi Password..."
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
