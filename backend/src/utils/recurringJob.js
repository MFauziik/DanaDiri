const cron = require('node-cron');
const mongoose = require('mongoose');
const Recurring = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction');

// Fungsi untuk mengecek koneksi MongoDB
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Proses semua recurring yang jadwalnya hari ini (belum dijalankan hari ini)
 * Dipakai oleh: cron hourly, cron midnight, startup
 */
const processRecurringTransactions = async (retryCount = 0) => {
  const maxRetries = 3;

  try {
    if (!isDbConnected()) {
      console.log('⚠️ [Recurring Job] Database not connected, waiting...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (retryCount < maxRetries) {
        return processRecurringTransactions(retryCount + 1);
      } else {
        console.error('❌ [Recurring Job] Max retries reached, skipping.');
        return;
      }
    }

    console.log('🔄 [Recurring Job] Checking recurring transactions...');

    const today = new Date();
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const startOfToday = new Date(currentYear, currentMonth - 1, currentDay);
    startOfToday.setHours(0, 0, 0, 0);

    const recurrings = await Recurring.find({
      dayOfMonth: currentDay,
      $or: [
        { lastRun: { $exists: false } },
        { lastRun: { $lt: startOfToday } },
      ],
    });

    if (recurrings.length === 0) {
      console.log('📭 [Recurring Job] No recurring transactions to process today.');
      return;
    }

    console.log(`📋 [Recurring Job] Found ${recurrings.length} recurring(s) to process.`);

    let successCount = 0;
    let failCount = 0;

    for (const recurring of recurrings) {
      try {
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

        recurring.lastRun = today;
        await recurring.save();

        successCount++;
        console.log(`✅ [Recurring Job] Created transaction for recurring: ${recurring._id} - Rp ${recurring.amount}`);
      } catch (err) {
        failCount++;
        console.error(`❌ [Recurring Job] Failed for recurring ${recurring._id}:`, err.message);
      }
    }

    console.log(`✅ [Recurring Job] Done: ${successCount} success, ${failCount} failed.`);
  } catch (error) {
    console.error('❌ [Recurring Job] Unexpected error:', error.message);
    if (retryCount < maxRetries) {
      console.log(`🔄 [Recurring Job] Retry ${retryCount + 1}/${maxRetries} in 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return processRecurringTransactions(retryCount + 1);
    }
  }
};

/**
 * Validasi & proses satu recurring transaksi spesifik setelah create/update.
 *
 * @param {string} recurringId  - ID dari recurring yang akan dicek
 * @param {boolean} forceCheck  - Jika true (update), abaikan lastRun agar
 *                                perubahan dayOfMonth langsung diproses
 */
const processSpecificRecurring = async (recurringId, forceCheck = false) => {
  try {
    if (!isDbConnected()) {
      console.log('⚠️ [Recurring Job] DB not connected, skipping specific check.');
      return;
    }

    const recurring = await Recurring.findById(recurringId);
    if (!recurring) {
      console.log(`⚠️ [Recurring Job] Recurring ${recurringId} not found.`);
      return;
    }

    const today = new Date();
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Cek apakah hari ini cocok dengan jadwal
    if (recurring.dayOfMonth !== currentDay) {
      console.log(
        `ℹ️ [Recurring Job] Recurring ${recurringId} scheduled for day ${recurring.dayOfMonth}, today is ${currentDay}. No action.`
      );
      return;
    }

    const startOfToday = new Date(currentYear, currentMonth - 1, currentDay);
    startOfToday.setHours(0, 0, 0, 0);

    // Cek apakah sudah dijalankan hari ini —
    // skip jika forceCheck=true (update: dayOfMonth baru mungkin sama dengan hari ini)
    if (!forceCheck && recurring.lastRun && recurring.lastRun >= startOfToday) {
      console.log(`ℹ️ [Recurring Job] Recurring ${recurringId} already processed today. (Trigger: add/update)`);
      return;
    }

    // Buat transaksi
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

    recurring.lastRun = today;
    await recurring.save();

    const trigger = forceCheck ? 'update' : 'create';
    console.log(`✅ [Recurring Job] Processed (Trigger: ${trigger}) recurring ${recurringId} - Rp ${recurring.amount}`);
  } catch (error) {
    console.error(`❌ [Recurring Job] Error in processSpecificRecurring(${recurringId}):`, error.message);
  }
};

// ─────────────────────────────────────────────────────────────
// Start all schedulers
// Trigger 1 : setiap tambah/update recurring  → processSpecificRecurring(id, forceCheck)
// Trigger 2 : setiap 1 jam                    → processRecurringTransactions()
// Trigger 3 : jam 00:00 (pergantian hari)     → processRecurringTransactions()
// ─────────────────────────────────────────────────────────────
const startRecurringJob = () => {
  // ── Trigger 2: Setiap jam tepat di menit ke-0 ──
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ [Recurring Job] [Trigger 2] Hourly check...');
    await processRecurringTransactions();
  });

  // ── Trigger 3: Tepat jam 00:00 setiap hari (pergantian hari) ──
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 [Recurring Job] [Trigger 3] Midnight check (00:00)...');
    await processRecurringTransactions();
  });

  // Startup check — berguna saat server restart / cold start
  setTimeout(async () => {
    console.log('🟢 [Recurring Job] [Startup] Initial check on server start...');
    await processRecurringTransactions();
  }, 5000);

  console.log('🚀 [Recurring Job] Scheduler started.');
  console.log('   • Trigger 1 : setiap tambah/update recurring (via controller)');
  console.log('   • Trigger 2 : setiap jam (cron: 0 * * * *)');
  console.log('   • Trigger 3 : jam 00:00 setiap hari (cron: 0 0 * * *)');
};

module.exports = { startRecurringJob, processRecurringTransactions, processSpecificRecurring };