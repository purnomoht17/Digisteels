"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  return (
    <header>
      <div className="container header-content">
        <Image
          src="/assets/images/majumakmur.png"
          alt="Logo"
          className="logo"
          width={200}
          height={80}
        />
        <div className="tagline">
          Your trusted supplier for High Quality Stainless Steel Materials
        </div>
        <div className="login-signup-btn">
          <button className="login-btn" onClick={() => router.push("/login")}>
            LOG IN
          </button>
          <button className="signup-btn" onClick={() => router.push("/register")}>
            SIGN UP
          </button>
        </div>
      </div>
    </header>
  );
}
