const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const app = require('./src/app');

dotenv.config();

// Koneksi ke database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});