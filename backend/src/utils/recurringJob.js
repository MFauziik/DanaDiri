const cron = require('node-cron');
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
      console.log('⚠️ [Recurring Job] Database not connected, waiting for connection...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (retryCount < maxRetries) {
        return processRecurringTransactions(retryCount + 1);
      } else {
        console.error('❌ [Recurring Job] Max retries reached, skipping recurring job');
        return;
      }
    }
    
    console.log('🔄 [Recurring Job] Checking recurring transactions...');
    
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
      console.log('📭 [Recurring Job] No recurring transactions to process today');
      return;
    }
    
    console.log(`📋 [Recurring Job] Found ${recurrings.length} recurring transactions to process`);
    
    // Loop setiap recurring dan buat transaksi
    let successCount = 0;
    let failCount = 0;
    
    for (const recurring of recurrings) {
      try {
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
        console.log(`✅ [Recurring Job] Created transaction for recurring: ${recurring._id} - Rp ${recurring.amount}`);
        
      } catch (error) {
        failCount++;
        console.error(`❌ [Recurring Job] Failed to process recurring ${recurring._id}:`, error.message);
      }
    }
    
    console.log(`✅ [Recurring Job] Processing completed: ${successCount} success, ${failCount} failed`);
    
  } catch (error) {
    console.error('❌ [Recurring Job] Error processing recurring transactions:', error.message);
    
    // Retry jika masih ada kesempatan
    if (retryCount < maxRetries) {
      console.log(`🔄 [Recurring Job] Retrying in 5 seconds... (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return processRecurringTransactions(retryCount + 1);
    }
  }
};

// Start scheduler
const startRecurringJob = () => {
  // Jalankan setiap jam untuk mengecek apakah ada yang perlu diproses hari ini
  // Menit ke-1 setiap jam
  cron.schedule('1 * * * *', async () => {
    console.log('⏰ [Recurring Job] Running hourly check...');
    await processRecurringTransactions();
  });

  // Jalankan juga saat startup (opsional, tapi berguna untuk dev)
  setTimeout(async () => {
    console.log('⏰ [Recurring Job] Running initial startup check...');
    await processRecurringTransactions();
  }, 5000);
  
  console.log('🚀 [Recurring Job] Scheduler started (Hourly check + Daily at 00:01 logic)');
};

module.exports = { startRecurringJob, processRecurringTransactions };


module.exports = { startRecurringJob, processRecurringTransactions };