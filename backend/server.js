  const dotenv = require('dotenv');
  const connectDB = require('./src/config/database');
  const app = require('./src/app');
  const budgetRoutes = require('./src/routes/budgetRoutes');
  const insightRoutes = require('./src/routes/insightRoutes');
  const runRecurring = require('./src/utils/recurringJob');

// 🔥 jalan tiap 1 jam (bisa diubah)
setInterval(() => {
  runRecurring();
}, 1000 * 60 * 60);

  dotenv.config();

  // koneksi DB
  connectDB();

  // 🔥 DAFTARKAN ROUTE DULU
  app.use('/api/budget', budgetRoutes);
  app.use('/api/insight', insightRoutes);

  // BARU JALANKAN SERVER
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });