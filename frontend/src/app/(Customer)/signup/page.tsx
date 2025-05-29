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
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    try {
      const res = await fetch('http://localhost:3000/api/pelanggan/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
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

            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}

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
