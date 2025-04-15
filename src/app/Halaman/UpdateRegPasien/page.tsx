'use client'
import ApiExpress from "@/koneksi/ApiExpress"
import { useRouter } from "next/navigation"
import { useState } from "react"
// import { toast } from "react-toastify"
import toast, { Toaster } from "react-hot-toast";

export default function UpdateRegPasien() {
    const router = useRouter()
    const [stateNoWa, setStateNoWa] = useState()
    const [stateForm, setStateForm] = useState()
    const CariSurkes = () => {
        toast.dismiss()
        ApiExpress.get('registrasi/cariSurkes', {
            params: {
                noWa: stateNoWa
            }
        }).then(res => {
            setStateForm(res.data.data)
        }).catch(err => {
            toast.error(err.response.data.message)
        })
    }
    const pencarian = (e) => {
        if (e.which === 13) {
            CariSurkes()
        }
    }

    const UpdateReg = () => {
        ApiExpress.post('registrasi/updateRegistrasi', {
            ...stateForm
        }).then(res => {
            toast.success('Data berhasil diperbarui')
        }).catch(err => {
            toast.error('Terjadi kesalahan, coba kembali')

        })
    }
    return (
        <div className="min-h-screen bg-gradient-to-tr from-white via-blue-100 to-blue-200 p-6 mb-8 flex flex-col justify-center">
            <Toaster position="top-right" />
            <h1 className="text-2xl font-bold mb-1 text-center text-black-500">RSUD I.A. MOEIS SAMARINDA</h1>
            <h2 className="text-lg font-bold mb-5 text-blue-900 text-center">UPDATE REGISTRASI MEDICAL CHECK UP</h2>
            <form className="w-full space-y-4 bg-card p-8 rounded-2xl shadow-lg space-y-4 border border-border">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MASUKKAN NO WHATSAPP</label>
                    <div className="flex space-x-2">
                        <input
                            onChange={(e) => setStateNoWa(e.target.value)}
                            type="number"
                            onKeyUp={(e) => pencarian(e)}
                            className="flex-1 border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                            placeholder="Ketik no whatsapp disini..."
                        />
                        <button
                            type="button"
                            onClick={CariSurkes}
                            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                        >
                            Cari
                        </button>
                    </div>

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">NAMA</label>
                    <input
                        value={stateForm?.nama}
                        readOnly
                        className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">BERAT BADAN</label>
                    <input
                        value={stateForm?.bb}
                        type="number"
                        className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">TINGGI BADAN</label>
                    <input
                        value={stateForm?.tb}
                        type="number"
                        className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">KEPERLUAN</label>
                    <textarea
                        value={stateForm?.keperluan}
                        onChange={(e) => setStateForm((prev) => ({
                            ...prev,
                            keperluan: e.target.value
                        }))}
                        className="mt-1 text-gray-900 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="pt-4">
                    <button
                        onClick={UpdateReg}
                        type='button'
                        className='w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md py-2 hover:bg-blue-900 hover:text-white'>
                        UPDATE
                    </button>
                </div>
                <div className="pt-2">
                    <button
                        onClick={() => router.push('/Halaman/RegistrasiPasien')}
                        type='button'
                        className='w-full bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md py-2 hover:bg-blue-900 hover:text-white'>
                        REGISTRASI BARU
                    </button>
                </div>
            </form>
        </div>
    )
}