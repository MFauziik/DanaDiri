const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Mendapatkan semua transaksi user
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
  res.json(transactions);
});

// @desc    Membuat transaksi baru
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { amount, type, category, description, date } = req.body;

  // Validasi input
  if (!amount || !type || !category || !date) {
    res.status(400);
    throw new Error('Field wajib: amount, type, category, date');
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    amount,
    type,
    category,
    description,
    date,
  });

  res.status(201).json(transaction);
});

// @desc    Mengupdate transaksi
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaksi tidak ditemukan');
  }

  // Pastikan transaksi milik user yang sedang login
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Tidak diizinkan mengupdate transaksi ini');
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedTransaction);
});

// @desc    Menghapus transaksi
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaksi tidak ditemukan');
  }

  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Tidak diizinkan menghapus transaksi ini');
  }

  await transaction.deleteOne();
  res.json({ message: 'Transaksi berhasil dihapus' });
});

// @desc    Mendapatkan ringkasan keuangan (total income, expense, saldo, dan pengeluaran per kategori)
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpense = {};

  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      // Kelompokkan pengeluaran per kategori
      if (categoryExpense[t.category]) {
        categoryExpense[t.category] += t.amount;
      } else {
        categoryExpense[t.category] = t.amount;
      }
    }
  });

  const balance = totalIncome - totalExpense;

  res.json({
    totalIncome,
    totalExpense,
    balance,
    categoryExpense,
  });
});

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};