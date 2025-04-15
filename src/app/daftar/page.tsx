"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function DataPasien() {
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    tmp_lahir: "",
    tgl_lahir: "",
    alamat: "",
    alamat_sekarang: "",
    telp: "",
    sex: "",
    pekerjaan: "",
    pendidikan: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const noreg = searchParams.get("noreg");
  const [alamatSama, setAlamatSama] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };
      if (alamatSama && name === "alamat") {
        updatedForm.alamat_sekarang = value;
      }
      return updatedForm;
    });
  };

  const handleAlamatSamaChange = (e) => {
    const checked = e.target.checked;
    setAlamatSama(checked);
    setForm((prevForm) => ({
      ...prevForm,
      alamat_sekarang: checked ? prevForm.alamat : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // SIMPAN BARU
      const res = await axios.post(
        "http://localhost:5001/api/daftar/daftarPasien",
        form
      );
      toast.success(res.data.message || "Pasien berhasil didaftarkan!");
      setForm({
        nama: "",
        nik: "",
        tmp_lahir: "",
        tgl_lahir: "",
        alamat: "",
        alamat_sekarang: "",
        telp: "",
        sex: "",
        pekerjaan: "",
        pendidikan: "",
      });
      setAlamatSama(false);
      setTimeout(() => {
        router.push(`http://10.200.1.23/apm`);
      }, 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/daftar/updatePasien/${noreg}`,
        form
      );
      toast.success("Data berhasil diperbarui");
    } catch (err) {
      toast.error("Gagal memperbarui data");
    }
  };

  const handleDaftarAntrian = () => {
    // Ganti '/antrian' dengan path halaman antrian yang sesuai
    router.push(`http://10.200.1.23/apm`);
  };

  // 🔄 Auto-fetch jika ada noreg
  useEffect(() => {
    const fetchPasien = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/daftar/detailPasien/${noreg}`
        );

        if (res.data) {
          const pasien = res.data;

          // Format tgl_lahir agar sesuai input[type="date"]
          const tgl = new Date(pasien.tgl_lahir);

          // Menambahkan 7 jam untuk mengubah waktu ke WIB
          tgl.setHours(tgl.getHours() + 8);

          // Format menjadi YYYY-MM-DD
          const tglFormatted = tgl.toISOString().split("T")[0];

          setForm({
            ...pasien,
            tgl_lahir: tglFormatted,
          });
        }
      } catch (err) {
        toast.error("Gagal memuat data pasien.");
      }
    };

    if (noreg) {
      fetchPasien();
    }
  }, [noreg]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-3"
      >
        <h1 className="text-2xl font-bold text-gray-700">
          {noreg ? "Edit Data Pasien" : "Form Pasien Baru"}
        </h1>

        {/* Nama */}
        <label className="block text-gray-700 mb-1">Nama Pasien</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        />

        {/* NIK */}
        <label className="block text-gray-700 mb-1">NIK</label>
        <input
          type="text"
          name="nik"
          value={form.nik}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        />

        {/* Telp */}
        <label className="block text-gray-700 mb-1">No. Telepon</label>
        <input
          type="text"
          name="telp"
          value={form.telp}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        />

        {/* Alamat */}
        <label className="block text-gray-700 mb-1">Alamat</label>
        <textarea
          className="w-full p-2 border rounded text-gray-700"
          name="alamat"
          rows={2}
          value={form.alamat}
          onChange={handleChange}
          required
        />

        {/* Checkbox */}
        <div className="flex items-center mt-1">
          <input
            type="checkbox"
            id="alamatSama"
            checked={alamatSama}
            onChange={handleAlamatSamaChange}
            className="mr-2"
          />
          <label htmlFor="alamatSama" className="text-sm text-gray-600">
            Samakan dengan Alamat
          </label>
        </div>

        {/* Alamat Domisili */}
        <label className="block text-gray-700 mt-2 mb-1">Alamat Domisili</label>
        <textarea
          className="w-full p-2 border rounded text-gray-700"
          name="alamat_sekarang"
          rows={2}
          value={form.alamat_sekarang}
          onChange={handleChange}
          disabled={alamatSama}
          required
        />

        {/* Tempat Lahir */}
        <label className="block text-gray-700 mb-1">Tempat Lahir</label>
        <input
          type="text"
          name="tmp_lahir"
          value={form.tmp_lahir}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        />

        {/* Tanggal Lahir */}
        <label className="block text-gray-700 mb-1">Tanggal Lahir</label>
        <input
          type="date"
          name="tgl_lahir"
          value={form.tgl_lahir}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          max={today}
          required
        />

        {/* Jenis Kelamin */}
        <label className="block text-gray-700 mb-1">Jenis Kelamin</label>
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        >
          <option value="">-- Pilih Jenis Kelamin --</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>

        {/* Pendidikan */}
        <label className="block text-gray-700 mb-1">Pendidikan</label>
        <select
          name="pendidikan"
          value={form.pendidikan}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        >
          <option value="">-- Pilih Pendidikan --</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
          <option value="SMK">SMK</option>
          <option value="D3">D3</option>
          <option value="D4">D4</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
          <option value="-">Lainnya</option>
        </select>

        {/* Pekerjaan */}
        <label className="block text-gray-700 mb-1">Pekerjaan</label>
        <select
          name="pekerjaan"
          value={form.pekerjaan}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-700"
          required
        >
          <option value="">-- Pilih Pekerjaan --</option>
          <option value="Swasta">Swasta</option>
          <option value="Pelajar">Pelajar</option>
          <option value="TNI">TNI</option>
          <option value="Polisi">Polisi</option>
          <option value="Pegawai Negeri Sipil">Pegawai Negeri Sipil</option>
          <option value="Petani">Petani</option>
          <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
          <option value="Pensiun">Pensiun</option>
          <option value="Karyawan RSUD IAM">
            Karyawan RSUD Inche Abdoel Moeis
          </option>
          <option value="Tidak Bekerja">Tidak Bekerja</option>
          <option value="-">Lainnya</option>
        </select>

        {/* Submit */}
        <div className="flex flex-col gap-2 mt-3">
          {noreg ? (
            <>
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
              >
                UPDATE DATA
              </button>

              <button
                type="button"
                onClick={handleDaftarAntrian}
                className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                DAFTAR ANTRIAN
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              DAFTAR
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
