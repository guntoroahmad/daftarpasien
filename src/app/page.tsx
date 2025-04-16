"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ipApp from "@/koneksi/IpApp";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheck = async () => {
    if (!input) {
      toast.error("Silakan masukkan NIK atau No. HP terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(ipApp + "api/daftar/cekPasien", {
        query: input,
      });

      const { data } = response;
      if (data && data.found) {
        toast.success(`Pasien ditemukan: ${data.data.nama}`);
        router.push(`/daftar?noreg=${data.data.noreg}`);
      } else {
        toast.error("Data pasien tidak ditemukan. Silakan daftar baru.");
        router.push(`/daftar`);
      }
    } catch (error) {
      toast.error("Gagal mengecek data pasien");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-blue-200"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <img
            src="/logo-pemkot.png" // ganti sesuai logo kamu
            alt="Logo Pemkot"
            className="h-16 w-16 object-contain"
          />
          <img
            src="/logo-rs.png" // ganti sesuai logo kamu
            alt="Logo Rumah Sakit"
            className="h-16 w-16 object-contain"
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-bold text-center text-blue-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Sistem Informasi Pasien
        </motion.h1>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Masukkan <span className="font-medium">NIK</span> atau{" "}
          <span className="font-medium">No. HP</span> untuk memeriksa data
          pasien.
        </p>

        <motion.input
          type="text"
          placeholder="Contoh: 1234567890"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 mb-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />

        <motion.button
          onClick={handleCheck}
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Memeriksa..." : "CEK SEKARANG"}
        </motion.button>
      </motion.div>
    </div>
  );
}
