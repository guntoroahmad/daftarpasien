const mysql = require("mysql2");

const pool = mysql.createPool({
//   host: "10.200.1.6",
  host: "192.168.10.6",
  user: "user_rsud",
  password: "54m4Rind4",
  database: "app_rs",
  waitForConnections: true,
  connectTimeout: 60000,
  connectionLimit: 300,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Gagal koneksi ke database:", err.message);
    return;
  }
  console.log("✅ Koneksi ke database berhasil");
  connection.release();
});

module.exports = pool;
