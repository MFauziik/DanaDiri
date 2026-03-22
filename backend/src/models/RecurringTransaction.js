const mongoose = require('mongoose');

const recurringSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: Number,
  type: {
    type: String,
    enum: ['income', 'expense'],
  },
  category: String,
  description: String,

  // 🔥 jadwal
  dayOfMonth: Number, // contoh: 1, 10, 25

  lastRun: Date, // biar ga double
}, { timestamps: true });

module.exports = mongoose.model('RecurringTransaction', recurringSchema);