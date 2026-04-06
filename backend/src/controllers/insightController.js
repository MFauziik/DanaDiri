const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const getInsights = asyncHandler(async (req, res) => {

  if (!req.user) {
    return res.status(401).json({ message: 'User tidak terautentikasi' });
  }

  const userId = req.user._id;

  const transactions = await Transaction.find({ user: userId });

  let income = 0;
  let expense = 0;

  transactions.forEach((trx) => {
    if (trx.type === 'income') income += trx.amount;
    else expense += trx.amount;
  });

  const balance = income - expense;
  const savingPercentage = income > 0 ? (balance / income) * 100 : 0;

  let status = 'Sangat Sehat';
  let message = 'Keuangan kamu sangat stabil! Kamu berhasil menyisihkan banyak tabungan 💰';

  if (expense >= income && income > 0) {
    status = 'Bahaya';
    message = 'Pengeluaran kamu melebihi pemasukan! Segera evaluasi keuangan 🚨';
  } else if (income === 0 && expense > 0) {
    status = 'Bahaya';
    message = 'Kamu belum memiliki pemasukan tapi sudah ada pengeluaran! 🚨';
  } else if (income === 0 && expense === 0) {
    status = 'Cukup';
    message = 'Belum ada aktivitas keuangan bulan ini. Yuk, catat transaksi pertamamu! ✨';
  } else if (savingPercentage < 20) {
    status = 'Waspada';
    message = 'Pengeluaran kamu mulai tinggi, coba kontrol pengeluaran ⚠️';
  } else if (savingPercentage < 50) {
    status = 'Sehat';
    message = 'Keuangan kamu cukup baik, tapi masih bisa lebih hemat 👍';
  }

  const budgetData = await Budget.findOne({ user: userId });
  const budget = budgetData ? budgetData.amount : 0;

  res.json({
    income,
    expense,
    balance,
    budget,
    status,
    message,
    savingPercentage,
  });
});

module.exports = { getInsights };