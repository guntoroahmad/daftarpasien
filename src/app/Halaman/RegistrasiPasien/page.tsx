"use client";
import Modal from "@/components/Modal";
import ApiExpress from "@/koneksi/ApiExpress";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Select from "react-select";
// import { toast } from 'react-toastify';
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion"; // Import motion
export default function RegistrasiPasien() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [stateForm, setStateForm] = useState({
    nik: "",
    noWa: "",
    bb: "",
    tb: "",
    gol_darah: "",
    keperluan: "",
  });

  const [stateTombolRegistrasi, setStateTombolRegistrasi] = useState(false);
  const Registrasi = () => {
    toast.dismiss();
    toast.loading("Sedang memproses registrasi");
    setStateTombolRegistrasi(true);

    ApiExpress.get("registrasi/cekMasterPasien", {
      params: {
        ...stateForm,
      },
    })
      .then((res) => {
        toast.dismiss();
        if (res.data.data === 0) {
          toast.error(res.data.status);
        } else {
          ApiExpress.post("registrasi/insertRegistrasi", {
            form: stateForm,
            ...res.data.data,
          })
            .then((res) => {
              if (res.data.success) {
                setStateForm({
                  nik: "",
                  noWa: "",
                  bb: "",
                  tb: "",
                  gol_darah: "",
                  keperluan: "",
                });

                setShowSuccessModal(true); // Tampilkan modal sukses

                // Redirect setelah 3 detik
                setTimeout(() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }, 3000);
              } else {
                toast.error("Terjadi kesalahan, coba kembali");
              }
            })
            .catch(() => {
              toast.error("Terjadi kesalahan, coba kembali");
            });
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.response?.data || "Terjadi kesalahan");
      })
      .finally(() => {
        setStateTombolRegistrasi(false);
      });
  };


  const GolDarah = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
    { value: "-", label: "-" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }} // Initial position and opacity
      animate={{ opacity: 1, y: 0 }} // Animate to final state
      exit={{ opacity: 0, y: 100 }} // Animate back when leaving
      transition={{
        type: "spring", // Bounce effect
        stiffness: 100,
        damping: 20,
      }}
      className="min-h-screen bg-gradient-to-tr from-white via-blue-100 to-blue-200 p-4 flex flex-col justify-center"
    >
      <Toaster position="top-right" />
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">🎉 Registrasi Berhasil</h2>
            <p className="mb-4">Silakan menuju ke Poli MCU</p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500 mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Mengalihkan ke halaman utama...</p>
          </div>
        </div>
      )}
      {/* <Modal
        isOpen={stateShowModal}
        onClose={() => setStateShowModal(false)}
        setStateForm={setStateForm}
      /> */}
      <h1 className="text-2xl font-bold mb-1 text-center text-black-500">
        RSUD I.A. MOEIS SAMARINDA
      </h1>{" "}
      {/* Changed text color to yellow */}
      <h5 className="text-black-600 mb-5 text-center">
        REGISTRASI MEDICAL CHECK UP
      </h5>{" "}
      {/* Changed text color to yellow */}
      <form className="w-full space-y-4 bg-card p-8 rounded-2xl shadow-lg space-y-4 border border-border">
        {/* NIK */}
        <div>
          <label className="text-black-500">
            <h5>NIK</h5>
          </label>
          <input
            type="number"
            value={stateForm?.nik}
            onChange={(e) =>
              setStateForm((prev) => ({
                ...prev,
                nik: e.target.value,
              }))
            }
            // className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black-400"
            className="w-full p-2 rounded-md bg-muted text-black dark:text-black border border-border"
            placeholder="Masukkan NIK"
          />
        </div>

        {/* NOPE */}
        <div>
          <label className="block text-sm font-medium text-black-400">
            NO WHATSAPP
          </label>
          <input
            type="number"
            value={stateForm?.noWa}
            onChange={(e) =>
              setStateForm((prev) => ({
                ...prev,
                noWa: e.target.value,
              }))
            }
            className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black-400"
            placeholder="Masukkan No Whatsapp yang aktif"
          />
        </div>

        {/* Berat Badan */}
        <div>
          <label className="block text-sm font-medium text-black-400">
            Berat Badan (kg)
          </label>
          <input
            type="number"
            value={stateForm?.bb}
            onChange={(e) =>
              setStateForm((prev) => ({
                ...prev,
                bb: e.target.value,
              }))
            }
            className="mt-1 text-black-400 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan berat badan"
          />
        </div>

        {/* Tinggi Badan */}
        <div>
          <label className="block text-sm font-medium text-black-400">
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            value={stateForm?.tb}
            onChange={(e) =>
              setStateForm((prev) => ({
                ...prev,
                tb: e.target.value,
              }))
            }
            className="mt-1 w-full text-black-400 border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan tinggi badan"
          />
        </div>

        {/* Golongan Darah */}
        <div>
          <label className="block text-sm font-medium text-black-400">
            Golongan Darah
          </label>
          <Select
            placeholder="--Pilih--"
            className="text-black-400"
            options={GolDarah}
            value={
              GolDarah.find((opt) => opt.value === stateForm.gol_darah) || null
            }
            onChange={(e) =>
              setStateForm((prev) => ({
                ...prev,
                gol_darah: e?.value || "",
              }))
            }
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "inherit", // Membuat background inheritance
                color: "black", // Mengatur warna teks pada kontrol
              }),
              singleValue: (base) => ({
                ...base,
                color: "black", // Menetapkan warna teks untuk nilai yang dipilih
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "" : "inherit", // Atur background ketika opsi dipilih
                color: state.isSelected ? "black" : "black", // Atur warna teks ketika dipilih
                "&:hover": {
                  backgroundColor: "", // Background saat hover
                  color: "black", // Warna teks saat hover
                },
              }),
            }}
          />
        </div>

        {/* Keperluan */}
        <div>
          <label className="block text-sm font-medium text-black-400">
            Keperluan
          </label>
          <textarea
            value={stateForm?.keperluan}
            onChange={(e) =>
              setStateForm((prev) => ({
                ...prev,
                keperluan: e.target.value,
              }))
            }
            rows={4}
            className="mt-1 text-black-400 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tulis keperluan di sini"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            disabled={stateTombolRegistrasi}
            type="button"
            onClick={Registrasi}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md py-2 hover:bg-blue-900 hover:text-white"
          /* whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }} */
          >
            REGISTRASI
          </motion.button>
        </div>
        <div>
          <motion.button
            disabled={stateTombolRegistrasi}
            type="button"
            onClick={() => router.push("/Halaman/UpdateRegPasien")}
            className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md py-2 hover:bg-blue-900 hover:text-white"
          /* whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }} */
          >
            UPDATE DATA REGISTRASI
          </motion.button>
        </div>

        {/* <div >
                    <motion.button
                        disabled={stateTombolRegistrasi}
                        type='button'
                        onClick={() => router.push('/')}                        
                        className='w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-md py-2 hover:bg-blue-900 hover:text-white'
                        // whileHover={{ scale: 1.05 }}
                        // whileTap={{ scale: 0.95 }}
                    >
                        Dashboard
                    </motion.button>
                </div> */}
      </form>
    </motion.div>
  );
}
