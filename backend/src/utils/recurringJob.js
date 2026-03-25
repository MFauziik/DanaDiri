const cron = require('node-cron');
const Recurring = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction');

// Fungsi untuk menjalankan recurring transactions
const processRecurringTransactions = async () => {
  try {
    console.log('🔄 Checking recurring transactions...');
    
    const today = new Date();
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    // Cari recurring transaction yang dayOfMonth sama dengan tanggal hari ini
    // DAN belum dijalankan hari ini (lastRun < hari ini)
    const recurrings = await Recurring.find({
      dayOfMonth: currentDay,
      $or: [
        { lastRun: { $exists: false } },
        { 
          lastRun: { 
            $lt: new Date(currentYear, currentMonth - 1, currentDay) 
          } 
        }
      ]
    });
    
    if (recurrings.length === 0) {
      console.log('📭 No recurring transactions to process today');
      return;
    }
    
    console.log(`📋 Found ${recurrings.length} recurring transactions to process`);
    
    // Loop setiap recurring dan buat transaksi
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
        
        console.log(`✅ Created transaction for recurring: ${recurring._id} - Rp ${recurring.amount}`);
      } catch (error) {
        console.error(`❌ Failed to process recurring ${recurring._id}:`, error.message);
      }
    }
    
    console.log('✅ Recurring transactions processing completed');
    
  } catch (error) {
    console.error('❌ Error processing recurring transactions:', error);
  }
};

// Start scheduler - berjalan setiap hari jam 00:01
const startRecurringJob = () => {
  // Jalankan setiap hari jam 00:01
  cron.schedule('1 0 * * *', async () => {
    console.log('⏰ Running recurring transactions job...');
    await processRecurringTransactions();
  });
  
  console.log('🚀 Recurring job scheduler started - akan berjalan setiap hari jam 00:01');
};

module.exports = { startRecurringJob, processRecurringTransactions };