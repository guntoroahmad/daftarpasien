const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5001; // Definisikan PORT di sini
const daftarRoutes = require("./routes/daftarRoutes");
const RegistrasiRouter = require("./routes/RegistrasiRouter");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gunakan Router
app.use("/api/daftar", daftarRoutes); // Pastikan path ini sesuai
app.use("/registrasi", RegistrasiRouter);
// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
