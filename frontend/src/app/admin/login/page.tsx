'use client';

import NavbarAdmin from '@/app/components/navbarAdmin';
import Footer from '@/app/footer';

export default function LoginAdmin() {
  return (
    <>
      <NavbarAdmin />
      <main style={{ marginTop: '100px', padding: '2rem', textAlign: 'center' }}>
        <h1>Login Admin</h1>
      </main>
      <Footer />
    </>
  );
}
