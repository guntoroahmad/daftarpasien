const express = require("express");
const router = express.Router();
const axios = require("axios");
const koneksi = require("../config/db");

// 🟢 **Cek Data Pasien**
router.post("/cekPasien", (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Data tidak boleh kosong" });
  }

  const sql = `
    SELECT * FROM regpasien
    WHERE nik = ? OR telp = ?
    LIMIT 1
  `;

  koneksi.query(sql, [query, query], (err, results) => {
    if (err) {
      console.error("Kesalahan SQL:", err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil data pasien", error: err });
    }

    if (results.length > 0) {
      // Pasien ditemukan
      return res.status(200).json({
        found: true,
        data: results[0], // kalau kamu mau kirim semua datanya juga
      });
    } else {
      // Pasien tidak ditemukan
      return res.status(200).json({ found: false });
    }
  });
});

// 🟢 **Daftar Pasien Baru**
router.post("/daftarPasien", (req, res) => {
  const {
    nama,
    nik,
    tmp_lahir,
    tgl_lahir,
    alamat,
    alamat_domisili,
    telp,
    sex,
    pekerjaan,
    pendidikan,
  } = req.body;

  // Cek apakah NIK atau Telp sudah ada
  const cekDuplikat = "SELECT * FROM regpasien WHERE nik = ? OR telp = ?";
  koneksi.query(cekDuplikat, [nik, telp], (err, results) => {
    if (err) {
      console.error("Error checking duplikat:", err);
      return res
        .status(500)
        .json({ message: "Gagal memeriksa duplikat NIK / Telp" });
    }

    if (results.length > 0) {
      let pesan = "Data pasien sudah ada dengan ";
      if (results[0].nik === nik) pesan += "NIK yang sama.";
      else if (results[0].telp === telp) pesan += "No. Telp yang sama.";
      return res.status(400).json({ message: pesan });
    }

    // Ambil noreg terakhir
    const queryNoreg =
      "SELECT MAX(noreg)+1 AS lastNoreg FROM regpasien WHERE LEFT(noreg,1)<>'K' AND SUBSTR(noreg,2,1)<>'A'";
    koneksi.query(queryNoreg, (err, results) => {
      if (err) {
        console.error("Error fetching noreg:", err);
        return res
          .status(500)
          .json({ message: "Gagal mengambil nomor registrasi terakhir" });
      }

      const lastNoreg = results[0].lastNoreg || 0;
      // const newNoreg = String(Number(lastNoreg) + 1);

      const sql =
        "INSERT INTO regpasien (noreg, nama, nik, tmp_lahir, tgl_lahir, alamat, alamat_sekarang, telp, sex, pekerjaan, pendidikan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      koneksi.query(
        sql,
        [
          lastNoreg,
          nama,
          nik,
          tmp_lahir,
          tgl_lahir,
          alamat,
          alamat_domisili,
          telp,
          sex,
          pekerjaan,
          pendidikan,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal menyimpan pasien baru" });
          }
          res
            .status(200)
            .json({ message: "Pasien berhasil disimpan", noreg: lastNoreg });
        }
      );
    });
  });
});

// ✅ GET: Ambil data pasien by noreg
router.get("/detailPasien/:noreg", (req, res) => {
  const { noreg } = req.params;

  koneksi.query(
    "SELECT * FROM regpasien WHERE noreg = ?",
    [noreg],
    (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Pasien tidak ditemukan" });
      }

      res.json(results[0]);
    }
  );
});

// ✅ PUT: Update data pasien
router.put("/updatePasien/:noreg", async (req, res) => {
  const { noreg } = req.params;
  const data = req.body;

  try {
    koneksi.query("UPDATE regpasien SET ? WHERE noreg = ?", [data, noreg]);
    res.json({ message: "Data pasien berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Gagal update data pasien" });
  }
});

// 🟡 **Edit Pasien**
router.put("/editPasien/:id", (req, res) => {
  const { id } = req.params;
  const { nama_pasien, phone } = req.body;

  if (!nama_pasien || !phone) {
    return res
      .status(400)
      .json({ message: "Nama pasien dan phone wajib diisi" });
  }

  const sql = "UPDATE pasien SET nama_pasien = ?, phone = ? WHERE id = ?";
  koneksi.query(sql, [nama_pasien, phone, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengupdate pasien" });
    }
    res.status(200).json({ message: "Pasien berhasil diperbarui" });
  });
});

// 🔴 **Hapus Pasien**
router.delete("/deletePasien/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pasien WHERE id = ?";
  koneksi.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menghapus pasien" });
    }
    res.status(200).json({ message: "Pasien berhasil dihapus" });
  });
});

// 🟢 **Set Reminder via WhatsApp**
router.post("/set", async (req, res) => {
  const { phone, message, date } = req.body;
  const reminderDate = new Date(date);
  reminderDate.setDate(reminderDate.getDate() - 3); // Kirim reminder 3 hari sebelum tanggal kontrol

  // Jika hari ini adalah reminder date, kirim pesan WhatsApp
  /* if (
    new Date().toISOString().split("T")[0] ===
    reminderDate.toISOString().split("T")[0]
  ) { */
  try {
    const response = await axios.post(
      "https://app.wapanels.com/api/create-message",
      {
        appkey: "80ca53d0-3610-4424-a55b-66af744009d1",
        authkey: "Fihbt62abZaavJvyD6Ey3qwjFaFgUwjwpJxmNCNRcHomGesF9j",
        to: `62${phone.replace(/^0/, "")}`, // Hilangkan '0' di depan nomor
        message: `Reminder: ${message} - ${date}`,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("✅ Pesan berhasil dikirim:", response.data);
    res.status(200).json({ message: "Reminder sent!", data: response.data });
  } catch (error) {
    console.error(
      "❌ Gagal mengirim pesan WhatsApp:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to send reminder",
      error: error.response?.data || error.message,
    });
  }
  /* } else {
    res.status(200).json({ message: "Reminder scheduled but not sent today." });
  } */
});

module.exports = router;
