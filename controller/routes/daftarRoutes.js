const express = require("express");
const router = express.Router();
const axios = require("axios");
const dayjs = require("dayjs");
const koneksi = require("../config/db");

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    koneksi.query(sql, params, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

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

// ✅ GET: Generate Token for update
router.post("/generateToken/:noreg", async (req, res) => {
  const { noreg } = req.params;
  console.log("Dapat noreg:", noreg);

  try {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = dayjs().add(5, "minute").format("YYYY-MM-DD HH:mm:ss");
    console.log("Token yang dihasilkan:", token);

    // Simpan token ke database
    await queryAsync(
      "UPDATE regpasien SET password_android = ?, token_expired_at = ? WHERE noreg = ?",
      [token, expiredAt, noreg]
    );
    console.log("Token berhasil disimpan di database");

    // Ambil nomor telp
    const pasien = await queryAsync(
      "SELECT telp FROM regpasien WHERE noreg = ?",
      [noreg]
    );
    console.log("Hasil query pasien:", pasien);

    const nomor = pasien[0]?.telp;
    console.log("Nomor yang diambil:", nomor);

    if (nomor) {
      /* const responseWA = await axios.post(
        "https://app.wapanels.com/api/create-message",
        {
          appkey: "27ee5f8a-91fe-4d2f-91e6-d6a74e0c18eb",
          authkey: "ofyLKwmacMfwl1xdDsOz7TbIgw27LnOzLUsVfBBThmlW1dil1W",
          to: `62${nomor.replace(/^0/, "")}`,
          message: `Yth. Pasien RSUD Inche Abdoel Moeis Samarinda,

Berikut adalah *token verifikasi* Anda untuk melakukan perubahan data di sistem SIMRS: *_${token}_*

Mohon untuk tidak membagikan token ini kepada pihak lain demi menjaga kerahasiaan data pribadi Anda di Rumah Sakit.

Terima kasih atas perhatian dan kerjasamanya.`,
        }
      ); */

      const response = await axios.post(
        "https://api.fonnte.com/send",
        {
          target: nomor,
          message: `Yth. Pasien RSUD Inche Abdoel Moeis Samarinda,

Berikut adalah *token verifikasi* Anda untuk melakukan perubahan data di sistem SIMRS: *_${token}_*

Mohon untuk tidak membagikan token ini kepada pihak lain demi menjaga kerahasiaan data pribadi Anda di Rumah Sakit.

Terima kasih atas perhatian dan kerjasamanya.

*_Mohon untuk tidak membalas pesan ini, karena pesan ini tergenerate langsung dari sistem._*`,
          countryCode: "62", // optional
        },
        {
          headers: {
            Authorization: "YpCVMcgJoWGirqrFaMZH",
          },
        }
      );

      console.log("WA response:", response.data);
    }

    return res.json({ success: true, token });
  } catch (error) {
    console.error("Terjadi error:", error);
    return res
      .status(500)
      .json({ message: "Gagal membuat token", error: error.message });
  }
});

// ✅ POST: Verifikasi Token for update
router.post("/verifikasiToken", async (req, res) => {
  const { noreg, token } = req.body;

  try {
    // return res.send(token);
    const result = await queryAsync(
      "SELECT * FROM regpasien WHERE noreg = ? and password_android = ?",
      [noreg, token]
    );
    // console.log("Hasil query pasien:", result);

    if (result.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Token tidak valid." });
    }

    const data = result[0];
    // return res.send(new Date())

    if (new Date(data.token_expired_at) < new Date()) {
      return res
        .status(401)
        .json({ success: false, message: "Token sudah kedaluwarsa." });
    }

    // Kalau token valid dan belum expired
    res.json({ success: true, message: "Token valid." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Verifikasi gagal." });
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

module.exports = router;
