const express = require("express");
const router = express.Router();
const koneksi = require("../config/db");
const koneksi124 = require("../config/Db124");
var request = require("request");
router.get("/cekMasterPasien", async (req, res) => {
  const params = req.query;
  // return res.send(params);
  const query = `SELECT * FROM regpasien WHERE nik=?`;
  if (!params.nik) {
    return res.status(400).send("NIK tidak boleh kosong");
  } else if (!params.noWa) {
    return res.status(400).send("No Whatsapp wajib diisi");
  } else if (!params.bb) {
    return res.status(400).send("Berat badan anda berapa ?");
  } else if (!params.tb) {
    return res.status(400).send("Tinggi badan anda berapa ?");
  } else if (!params.gol_darah) {
    return res.status(400).send("Golongan darah apa ?");
  } else if (!params.keperluan) {
    return res.status(400).send("Keperluan anda apa ?");
  }
  try {
    const [[result]] = await koneksi.query(query, [params.nik]);
    if (result) {
      res.send({
        data: result,
        status: "Registrasi berhasil",
      });
    } else {
      res.send({
        data: 0,
        status:
          "Data anda belum tercatat disystem kami, silahkan tekan tombol ENTRI DATA DIRI",
      });
    }
  } catch (err) {
    res
      .status(400)
      .send(
        "Data anda belum tercatat disystem kami, silahkan tekan tombol ENTRI DATA DIRI"
      );
  }
});

router.post("/insertKodeRegistrasi", async (req, res) => {
  const params = req.body;
  res.send(params);
});

router.post("/insertRegistrasi", async (req, res) => {
  try {
    const params = req.body;
    // return res.send(params);
    // Ambil dua digit terakhir tahun sekarang
    const tahun = new Date().getFullYear().toString().slice(-2); // '25'

    // Cari urutan terakhir
    const queryMax = `
      SELECT MAX(CAST(SUBSTRING(no, 6) AS UNSIGNED)) AS max_urut
      FROM surkes
      WHERE SUBSTRING(no, 4, 2) = ?
    `;
    const [[hasil]] = await koneksi.query(queryMax, [tahun]);
    const urutanBaru = (hasil.max_urut || 0) + 1;
    const urutanFormatted = urutanBaru.toString().padStart(4, "0");
    const nomorBaru = `SK-${tahun}${urutanFormatted}`;

    // Insert data ke tabel surkes
    const queryInsert = `
      INSERT INTO surkes SET ?
    `;
    await koneksi.query(queryInsert, [
      {
        no: nomorBaru,
        dari: new Date(),
        noreg: params.noreg,
        nama: params.nama,
        tmp_lahir: params.tmp_lahir,
        tgl_lahir: params.tgl_lahir,
        sex: params.sex,
        agama: params.agama,
        pekerjaan: params.pekerjaan,
        alamat: params.alamat,
        keperluan: params.form.keperluan,
        tb: params.form.tb,
        bb: params.form.bb,
        gol_darah: params.form.gol_darah,
        telp: params.form.noWa,
      },
    ]);
    var options = {
      method: "POST",
      url: "https://app.wapanels.com/api/create-message",
      headers: {},
      formData: {
        appkey: "022269fe-e735-47be-b8b4-56e60defad00",
        authkey: "JOw8gewhNzhAQdJDjng9uQg4LxgdYwZW8l6uD2XnbiWq3G1HQa",
        to: params.form.noWa.startsWith("62")
          ? params.form.noWa
          : "62" + params.form.noWa.replace(/^0+/, ""),
        message: `Hai ${params.nama} registrasi kamu berhasil dilakukan dengan no registrasi ${nomorBaru}. silahkan konfirmasi ke petugas MCU RSUD I.A Moeis Samarinda. Terima Kasih`,
      },
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
    return res.send({ success: true, no: nomorBaru });
  } catch (err) {
    console.error("Error saat insert data registrasi:", err);
    return res
      .status(500)
      .send({ error: "Terjadi kesalahan saat menyimpan data." });
  }
});

router.post("/periksaLogRegistrasi", async (req, res) => {
  const params = req.body;
  const queryLogReg = `select * from logreg WHERE kodeRegistrasi=?`;
  const [[hasilQueryLogReg]] = await koneksi124.query(queryLogReg, [
    params.kodeRegistrasi,
  ]);
  res.send({
    data: hasilQueryLogReg,
  });
});

router.get("/cariSurkes", async (req, res) => {
  const params = req.query;
  const query = `SELECT * FROM surkes WHERE telp=? ORDER BY dari DESC limit 1`;
  const [hasil] = await koneksi.query(query, [params.noWa]);

  if (hasil.length === 0) {
    return res
      .status(404)
      .send({ success: false, message: "Data tidak ditemukan." });
  }

  return res.send({ success: true, data: hasil[0] });
});

router.post("/updateRegistrasi", async (req, res) => {
  const params = req.body;
  const queryupdate = `UPDATE surkes SET ? WHERE no=?`;
  try {
    await koneksi.query(queryupdate, [
      {
        bb: params.bb,
        tb: params.tb,
        keperluan: params.keperluan,
      },
      params.no,
    ]);
    res.send("berhasil");
  } catch (err) {
    res.status(400).send("gagal");
  }
});

module.exports = router;
