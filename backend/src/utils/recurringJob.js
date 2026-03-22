const Recurring = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction');

const runRecurring = async () => {
  const today = new Date();
  const day = today.getDate();

  const recurringList = await Recurring.find();

  for (let item of recurringList) {
    // 🔥 cek tanggal
    if (item.dayOfMonth === day) {

      // 🔥 biar ga double
      const alreadyRun =
        item.lastRun &&
        new Date(item.lastRun).toDateString() === today.toDateString();

      if (alreadyRun) continue;

      // 🔥 buat transaksi otomatis
      await Transaction.create({
        user: item.user,
        amount: item.amount,
        type: item.type,
        category: item.category,
        description: item.description + ' (Auto)',
        date: new Date(),
      });

      item.lastRun = today;
      await item.save();

      console.log('Recurring executed:', item.description);
    }
  }
};

module.exports = runRecurring;