"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-500 to-teal-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-white tracking-wide hover:scale-105 transition-transform duration-300">
          SIMRS<span className="text-yellow-300">+</span>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none z-50 relative"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* Menu */}
        <div className="hidden md:flex items-center space-x-6 text-white font-medium">
          <Link href="/" className="hover:text-yellow-200 hover:underline underline-offset-4">
            Dashboard
          </Link>
          <Link href="/daftar" className="hover:text-yellow-200 hover:underline underline-offset-4">
            Data Pasien
          </Link>
          <Link href="/Halaman/RegistrasiPasien" className="hover:text-yellow-200 hover:underline underline-offset-4">
            Registrasi
          </Link>
        </div>
      </div>

      {/* Mobile Menu with Smooth Transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        } bg-gradient-to-r from-green-500 to-teal-500 px-6 text-white font-medium`}
      >
        <div className="flex flex-col space-y-3 py-4">
          <Link
            href="/"
            className="hover:text-yellow-200 hover:underline underline-offset-4"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/daftar"
            className="hover:text-yellow-200 hover:underline underline-offset-4"
            onClick={() => setIsOpen(false)}
          >
            Data Pasien
          </Link>
          <Link
            href="/Halaman/RegistrasiPasien"
            className="hover:text-yellow-200 hover:underline underline-offset-4"
            onClick={() => setIsOpen(false)}
          >
            Registrasi
          </Link>
        </div>
      </div>
    </nav>
  );
}
