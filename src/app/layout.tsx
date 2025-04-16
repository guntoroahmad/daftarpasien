import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // ⬅️ Import komponen client

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-green-100 selection:text-green-800">
        <Navbar />
        <main className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-green-100 selection:text-green-800">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-500 mt-10 mb-4">
          © {new Date().getFullYear()} SIMRS RSUD Inche Abdoel Moeis.<br/>
           All rights reserved.
        </footer>
      </body>
    </html>
  );
}
