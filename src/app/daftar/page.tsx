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
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (alamatSama && name === "alamat") {
        updated.alamat_sekarang = value;
      }
      return updated;
    });
  };

  const handleAlamatSamaChange = (e) => {
    const checked = e.target.checked;
    setAlamatSama(checked);
    setForm((prev) => ({
      ...prev,
      alamat_sekarang: checked ? prev.alamat : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        router.push("http://10.200.1.10:3000/Halaman/RegistrasiPasien");
      }, 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/daftar/updatePasien/${noreg}`,
        form
      );
      toast.success("Data berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui data");
    }
  };

  const handleDaftarAntrian = () => {
    router.push("/Halaman/RegistrasiPasien");
  };

  useEffect(() => {
    const fetchPasien = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/daftar/detailPasien/${noreg}`
        );
        if (res.data) {
          const pasien = res.data;
          const tgl = new Date(pasien.tgl_lahir);
          tgl.setHours(tgl.getHours() + 8);
          setForm({ ...pasien, tgl_lahir: tgl.toISOString().split("T")[0] });
        }
      } catch {
        toast.error("Gagal memuat data pasien.");
      }
    };
    if (noreg) fetchPasien();
  }, [noreg]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-card p-8 rounded-2xl shadow-lg space-y-4 border border-border"
      >
        <h1 className="text-2xl font-bold">
          {noreg ? "Edit Data Pasien" : "Form Pasien Baru"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Pasien"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
          <Input
            label="NIK"
            name="nik"
            value={form.nik}
            onChange={handleChange}
          />
          <Input
            label="No. Telepon"
            name="telp"
            value={form.telp}
            onChange={handleChange}
          />
          <Input
            label="Tempat Lahir"
            name="tmp_lahir"
            value={form.tmp_lahir}
            onChange={handleChange}
          />
          <Input
            type="date"
            label="Tanggal Lahir"
            name="tgl_lahir"
            value={form.tgl_lahir}
            onChange={handleChange}
            max={today}
          />
          <Select
            label="Jenis Kelamin"
            name="sex"
            value={form.sex}
            onChange={handleChange}
            options={[
              { label: "-- Pilih --", value: "" },
              { label: "Laki-laki", value: "L" },
              { label: "Perempuan", value: "P" },
            ]}
          />
          <Select
            label="Pendidikan"
            name="pendidikan"
            value={form.pendidikan}
            onChange={handleChange}
            options={[
              { label: "-- Pilih --", value: "" },
              { label: "SD", value: "SD" },
              { label: "SMP", value: "SMP" },
              { label: "SMA", value: "SMA" },
              { label: "SMK", value: "SMK" },
              { label: "D3", value: "D3" },
              { label: "D4", value: "D4" },
              { label: "S1", value: "S1" },
              { label: "S2", value: "S2" },
              { label: "S3", value: "S3" },
              { label: "Lainnya", value: "-" },
            ]}
          />
          <Select
            label="Pekerjaan"
            name="pekerjaan"
            value={form.pekerjaan}
            onChange={handleChange}
            options={[
              { label: "-- Pilih --", value: "" },
              { label: "Swasta", value: "Swasta" },
              { label: "Pelajar", value: "Pelajar" },
              { label: "TNI", value: "TNI" },
              { label: "Polisi", value: "Polisi" },
              { label: "Pegawai Negeri Sipil", value: "Pegawai Negeri Sipil" },
              { label: "Petani", value: "Petani" },
              { label: "Ibu Rumah Tangga", value: "Ibu Rumah Tangga" },
              { label: "Pensiun", value: "Pensiun" },
              { label: "Karyawan RSUD IAM", value: "Karyawan RSUD IAM" },
              { label: "Tidak Bekerja", value: "Tidak Bekerja" },
              { label: "Lainnya", value: "-" },
            ]}
          />
        </div>

        <div>
          <Label text="Alamat" />
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-muted text-black dark:text-black border border-border"
            rows={2}
          />
          <div className="flex items-center mt-2 gap-2">
            <input
              type="checkbox"
              id="alamatSama"
              checked={alamatSama}
              onChange={handleAlamatSamaChange}
              className="accent-blue-500"
            />
            <label
              htmlFor="alamatSama"
              className="text-sm text-muted-foreground"
            >
              Samakan dengan alamat di atas
            </label>
          </div>
        </div>

        <div>
          <Label text="Alamat Domisili" />
          <textarea
            name="alamat_sekarang"
            value={form.alamat_sekarang}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-muted text-black dark:text-black border border-border"
            rows={2}
            disabled={alamatSama}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-4">
          {noreg ? (
            <>
              <button
                type="button"
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-red-500 hover:bg-yellow-400 text-white py-2 rounded-md transition"
              >
                UPDATE DATA
              </button>
              <button
                type="button"
                onClick={handleDaftarAntrian}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:bg-blue-500 text-white py-2 rounded-md transition"
              >
                DAFTAR ANTRIAN
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:bg-green-500 text-white py-2 rounded-md transition"
            >
              DAFTAR
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <Label text={label} />
      <input
        {...props}
        className="w-full p-2 rounded-md bg-muted text-black dark:text-black border border-border"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <Label text={label} />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded-md bg-muted text-black dark:text-black border border-border"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Label({ text }) {
  return (
    <label className="block mb-1 text-sm font-medium text-muted-foreground">
      {text}
    </label>
  );
}
