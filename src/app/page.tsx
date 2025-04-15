"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
      // Menggunakan POST dan mengirimkan query dalam body
      const response = await axios.post(
        "http://localhost:5001/api/daftar/cekPasien",
        { query: input } // Mengirimkan parameter dalam body
      );

      const { data } = response;
      if (data && data.found) {
        toast.success(`Pasien ditemukan: ${data.data.nama}`);
        router.push(`/daftar?noreg=${data.data.noreg}`); // Menyertakan noreg di URL
      } else {
        toast.error(
          "Data pasien tidak ditemukan, silahkan mengisi form data pasien baru."
        );
        router.push(`/daftar`);
      }
    } catch (error) {
      toast.error("Gagal mengecek data pasien");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Cek Data Pasien
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Masukkan NIK atau No. HP untuk memeriksa apakah pasien sudah pernah
          terdaftar di SIMRS.
        </p>
        <input
          type="text"
          placeholder="NIK atau No. HP"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded text-gray-700"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Memeriksa..." : "Cek Data"}
        </button>
      </div>
    </div>
  );
}
