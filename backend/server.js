const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const app = require('./src/app');
const budgetRoutes = require('./src/routes/budgetRoutes');
const insightRoutes = require('./src/routes/insightRoutes');
const { processRecurringTransactions } = require('./src/utils/recurringJob');

// Load environment variables
dotenv.config();

// 🔥 DAFTARKAN ROUTE DULU
app.use('/api/budget', budgetRoutes);
app.use('/api/insights', insightRoutes); // Perbaiki: insights (pakai s)

// Koneksi ke database
connectDB();

// 🔥 JALANKAN RECURRING JOB (tiap 1 jam)
setInterval(async () => {
  console.log('🔄 Running recurring job (interval)...');
  await processRecurringTransactions();
}, 1000 * 60 * 60); // 1 jam

// Juga jalankan sekali saat server start (opsional)
setTimeout(async () => {
  console.log('🚀 Running recurring job on startup...');
  await processRecurringTransactions();
}, 5000); // Jalankan 5 detik setelah server start

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
  console.log(`📅 Recurring job akan berjalan setiap 1 jam`);
});