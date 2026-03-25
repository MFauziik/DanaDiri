const mongoose = require('mongoose');
const Recurring = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction');

// Fungsi untuk mengecek koneksi MongoDB
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Fungsi untuk menjalankan recurring transactions dengan retry
const processRecurringTransactions = async (retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    // Cek koneksi database
    if (!isDbConnected()) {
      console.log('⚠️ Database not connected, waiting for connection...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (retryCount < maxRetries) {
        return processRecurringTransactions(retryCount + 1);
      } else {
        console.error('❌ Max retries reached, skipping recurring job');
        return;
      }
    }
    
    console.log('🔄 Checking recurring transactions...');
    
    const today = new Date();
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    // Set waktu ke awal hari untuk lastRun comparison
    const startOfToday = new Date(currentYear, currentMonth - 1, currentDay);
    startOfToday.setHours(0, 0, 0, 0);
    
    // Cari recurring transaction yang dayOfMonth sama dengan tanggal hari ini
    // DAN belum dijalankan hari ini (lastRun < hari ini)
    const recurrings = await Recurring.find({
      dayOfMonth: currentDay,
      $or: [
        { lastRun: { $exists: false } },
        { lastRun: { $lt: startOfToday } }
      ]
    });
    
    if (recurrings.length === 0) {
      console.log('📭 No recurring transactions to process today');
      return;
    }
    
    console.log(`📋 Found ${recurrings.length} recurring transactions to process`);
    
    // Loop setiap recurring dan buat transaksi
    let successCount = 0;
    let failCount = 0;
    
    for (const recurring of recurrings) {
      try {
        // Cek koneksi lagi sebelum setiap operasi
        if (!isDbConnected()) {
          console.log('⚠️ Database disconnected, waiting...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Buat transaksi baru
        const transaction = new Transaction({
          user: recurring.user,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          description: recurring.description 
            ? `[Auto] ${recurring.description}` 
            : `[Auto] Transaksi berulang tanggal ${currentDay}`,
          date: today,
        });
        
        await transaction.save();
        
        // Update lastRun
        recurring.lastRun = today;
        await recurring.save();
        
        successCount++;
        console.log(`✅ Created transaction for recurring: ${recurring._id} - Rp ${recurring.amount}`);
        
      } catch (error) {
        failCount++;
        console.error(`❌ Failed to process recurring ${recurring._id}:`, error.message);
      }
    }
    
    console.log(`✅ Recurring transactions processing completed: ${successCount} success, ${failCount} failed`);
    
  } catch (error) {
    console.error('❌ Error processing recurring transactions:', error.message);
    
    // Retry jika masih ada kesempatan
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying in 5 seconds... (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return processRecurringTransactions(retryCount + 1);
    }
  }
};

// Start scheduler
const startRecurringJob = () => {
  // Jalankan setiap 6 jam (bisa disesuaikan)
  const interval = setInterval(async () => {
    console.log('⏰ Running recurring transactions job...');
    await processRecurringTransactions();
  }, 1000 * 60 * 60 * 6); // 6 jam
  
  // Juga jalankan setiap hari jam 00:01 untuk memastikan
  const scheduleNextRun = () => {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(0, 1, 0, 0); // 00:01:00
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilNext = nextRun - now;
    
    setTimeout(async () => {
      console.log('⏰ Running daily recurring job...');
      await processRecurringTransactions();
      scheduleNextRun(); // Schedule next daily run
    }, timeUntilNext);
  };
  
  scheduleNextRun();
  
  console.log('🚀 Recurring job scheduler started');
  console.log('   - Daily job at 00:01');
  console.log('   - Interval job every 6 hours');
  
  // Cleanup interval on process exit
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('📴 Recurring job stopped');
    process.exit();
  });
};

module.exports = { startRecurringJob, processRecurringTransactions };