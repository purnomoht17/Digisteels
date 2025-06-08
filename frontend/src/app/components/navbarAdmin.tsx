'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function NavbarAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);

    const isProtectedPage =
      pathname.startsWith('/admin') &&
      pathname !== '/admin/login' &&
      pathname !== '/admin/signup';

    if (!token && isProtectedPage) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  return (
    <header>
      <div className="container header-content">
        <div>
          <Image
            src="/assets/images/majumakmur.png"
            alt="Logo"
            className="logo"
            width={200}
            height={80}
          />
        </div>

        <div className="tagline">
          ADMIN PANEL - Stainless Steel Inventory
        </div>

        <div className="login-signup-btn">
          {isLoggedIn && (
            <button className="login-btn" onClick={handleLogout}>
              LOG OUT
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
