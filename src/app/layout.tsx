import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REGISTRASI PASIEN",
  description: "Sistem Registrasi Pasien Baru di SIMRS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-green-100 selection:text-green-800">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-green-500 to-teal-500 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-white tracking-wide hover:scale-105 transition-transform duration-300">
              SIMRS<span className="text-yellow-300">+</span>
            </div>
            <div className="space-x-6 text-white font-medium">
              <a
                href="/"
                className="hover:text-yellow-200 hover:underline underline-offset-4 transition duration-300"
              >
                Dashboard
              </a>
              <a
                href="/daftar"
                className="hover:text-yellow-200 hover:underline underline-offset-4 transition duration-300"
              >
                Data Pasien
              </a>
              <a
                href="/Halaman/RegistrasiPasien"
                className="hover:text-yellow-200 hover:underline underline-offset-4 transition duration-300"
              >
                Registrasi
              </a>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-green-100 selection:text-green-800">
          {children}
        </main>

        {/* Footer (optional) */}
        <footer className="text-center text-sm text-gray-500 mt-10 mb-4">
          © {new Date().getFullYear()} SIMRS RSUD Inche Abdoel Moeis. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
