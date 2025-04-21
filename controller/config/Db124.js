const mysql = require("mysql2/promise");

// Konfigurasi koneksi pool ke database MySQL
const pool = mysql.createPool({
  // host: "10.147.18.66", // Ganti dengan host database Anda
  // host: "10.200.1.24", // Ganti dengan host database Anda
  host: "10.200.1.24", // Ganti dengan host database Anda
  // host: "192.168.7.2",
  user: "oqpunya", // Ganti dengan username database Anda
  password: "123456", // Ganti dengan password database Anda
  database: "mcu", // Ganti dengan nama database Anda
  waitForConnections: true,
  connectTimeout: 60000,
  connectionLimit: 300, // Jumlah maksimum koneksi dalam pool
  queueLimit: 0, // Jumlah maksimum query yang dapat antri sebelum error
});

// Menghubungkan ke database
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database.");

  // Jangan lupa untuk melepaskan koneksi setelah digunakan
  connection.release();
});

module.exports = pool;
