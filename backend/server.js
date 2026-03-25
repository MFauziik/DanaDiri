const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const app = require('./src/app');
const budgetRoutes = require('./src/routes/budgetRoutes');
const insightRoutes = require('./src/routes/insightRoutes');
const { startRecurringJob } = require('./src/utils/recurringJob');

// Load environment variables
dotenv.config();

// 🔥 DAFTARKAN ROUTE DULU
app.use('/api/budget', budgetRoutes);
app.use('/api/insights', insightRoutes);

// Koneksi ke database
connectDB();

// 🔥 START RECURRING JOB (tunggu database siap)
setTimeout(() => {
  console.log('🚀 Starting recurring job scheduler...');
  startRecurringJob();
}, 5000); // Tunggu 5 detik setelah server start

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
});