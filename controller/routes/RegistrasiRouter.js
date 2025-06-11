const express = require("express");
const router = express.Router();
const koneksi = require("../config/Database");
const koneksi124 = require("../config/Db124");
const moment = require("moment");
var request = require("request");

// Jika suatu saat diperlukan untuk semua poli pendaftarannya bisa di buka ini -- 11/06/2025
const jlayMapping = {
  9: "0000000000100000010000", // THT
  12: "0100000000000000010000000", // Gigi
  7: "0000000000001000010000", // Saraf
  2: "000001000000000001000", // Bedah
  13: "000000000000000001001", // Jantung
  20: "000000000000010001000", // Rehab Medik
  1: "000010000000000001000", // Dalam
  15: "000000010000000001000", // Fisio
  4: "0001000000000000010000", // OBGYN
  10: "0000000010000000010000", // Mata
  11: "0000000001000000010000", // Kulit dan Kelamin
  15: "0000000000000010010000", // Orthopedi
  3: "0010000000000000010000", // Anak
  16: "0000000000000000010001", // Paru
  8: "0000000000010000010000", // Jiwa
};

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
  const params = req.body;
  const jlay = "0000000000000000010000010";
  const tglLahir = moment(params.tgl_lahir);
  const sekarang = moment();
  const umur = sekarang.diff(tglLahir, "years");
  const bulan = sekarang.diff(tglLahir, "months") % 12;
  const hari = sekarang.diff(tglLahir, "days") % 30;
  const tahun = new Date().getFullYear().toString().slice(-2); // '25'

  // Ambil koneksi dari pool
  const conn = await koneksi.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query("LOCK TABLES kunjung WRITE");

    const [[hasilGetLastNo]] = await conn.query(
      `
      SELECT LPAD(coalesce(max(right(no,6))+1,1),6,0) as urutan 
      FROM kunjung 
      WHERE year(tgl_masuk)= ?`,
      [moment().format("Y")]
    );

    const noBaru = moment().format("YY") + hasilGetLastNo.urutan;

    const data = {
      no: noBaru,
      tgl_masuk: moment().format("YYYY-MM-DD HH:mm:ss"),
      tgl_keluar: moment().format("YYYY-MM-DD HH:mm:ss"),
      noreg: params.noreg,
      no_jam: params.no_jam ? "" : params.no_jam,
      j_lay: jlay,
      kat_pel: 0,
      id_pembiayaan: 1,
      ruang: "Poliklinik",
      th: umur,
      bl: bulan,
      hr: hari,
    };

    await conn.query("INSERT INTO kunjung SET ?", [data]);

    await conn.query("UNLOCK TABLES");
    await conn.commit();

    const queryMax = `
      SELECT MAX(CAST(SUBSTRING(no, 6) AS UNSIGNED)) AS max_urut
      FROM surkes
      WHERE SUBSTRING(no, 4, 2) = ?
    `;
    const [[hasil]] = await conn.query(queryMax, [tahun]);
    const urutanBaru = (hasil.max_urut || 0) + 1;
    const urutanFormatted = urutanBaru.toString().padStart(4, "0");
    const nomorBaru = `SK-${tahun}${urutanFormatted}`;

    const queryInsert = `
      INSERT INTO surkes SET ?
    `;
    await conn.query(queryInsert, [
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

    // WA Notification
    var options = {
      method: "POST",
      url: "https://app.wapanels.com/api/create-message",
      headers: {},
      formData: {
        appkey: "27ee5f8a-91fe-4d2f-91e6-d6a74e0c18eb",
        authkey: "ofyLKwmacMfwl1xdDsOz7TbIgw27LnOzLUsVfBBThmlW1dil1W",
        to: params.form.noWa.startsWith("62")
          ? params.form.noWa
          : "62" + params.form.noWa.replace(/^0+/, ""),
        message: `Hai ${params.nama} registrasi kamu berhasil dilakukan dengan no registrasi ${nomorBaru}. silahkan konfirmasi ke petugas MCU RSUD I.A Moeis Samarinda. Terima Kasih`,
      },
    };

    request(options, function (error, response) {
      if (error) console.error("WA Error:", error);
      else console.log("WA sent:", response.body);
    });

    res.send({ success: true, no: nomorBaru });
  } catch (err) {
    console.error("Error saat insert data registrasi:", err);
    await conn.rollback();
    res.status(500).send({ error: "Terjadi kesalahan saat menyimpan data." });
  } finally {
    conn.release(); // Pastikan koneksi dilepas kembali ke pool
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
