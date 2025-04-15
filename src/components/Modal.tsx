'use client';
import ApiExpress from '@/koneksi/ApiExpress';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Modal(props) {
    const [stateKodeRegistrasi, setStateKodeRegistrasi] = useState('');

    const PeriksaKodeRegistrasi = () => {
        ApiExpress.post('registrasi/periksaLogRegistrasi', {
            kodeRegistrasi: stateKodeRegistrasi
        }).then(res => {
            if (res.data.data) {
                toast.success('Kode registrasi valid')
            } else {
                toast.error('Kode registrasi tidak valid')
            }
        }).catch(err => {

        })
    }

    return (
        <AnimatePresence>
            {props.isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={props.onClose}
                >
                    {/* Background dengan opacity */}
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal content */}
                    <motion.div
                        className="bg-white rounded-lg shadow-lg w-full max-w-md relative z-10"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b px-4 py-2">
                            <h2 className="text-lg font-semibold">{props.header}</h2>
                            <button
                                onClick={props?.onClose}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Masukkan Kode Registrasi</label>
                                    <input
                                        onChange={(e) => setStateKodeRegistrasi(e.target.value)}
                                        maxLength={6} // Maksimal 6 digit untuk kode OTP
                                        className="mt-1 w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                                        placeholder="Masukkan kode registrasi disini"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type='button'
                                        onClick={PeriksaKodeRegistrasi}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                                    >
                                        Validasi Kode Registrasi
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        {props.footer && (
                            <div className="border-t px-4 py-2 flex justify-end space-x-2">
                                {props.footer}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
