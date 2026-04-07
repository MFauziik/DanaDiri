const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');


// @desc    Mendapatkan semua transaksi user + filter + search + pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  let filter = {
    user: req.user._id,
  };

  // Filter berdasarkan type (income / expense)
  if (type) {
    filter.type = type;
  }

  // Filter berdasarkan kategori
  if (category) {
    filter.category = category;
  }

  // Search berdasarkan deskripsi
  if (search) {
    filter.description = {
      $regex: search,
      $options: 'i', // case insensitive
    };
  }

  // Filter berdasarkan tanggal
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // 🔥 PAGINATION
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);

  const total = await Transaction.countDocuments(filter);

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    transactions,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    total,
  });
});


// @desc    Membuat transaksi baru
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { amount, type, category, description, date } = req.body;

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


// @desc    Mendapatkan ringkasan keuangan
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
  const { period = '6months' } = req.query;
  const transactions = await Transaction.find({ user: req.user._id });

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpense = {};

  const now = new Date();
  const aggregatedData = [];
  
  // LOGIKA AGREGASI (PERIOD)
  if (period === 'week' || period === 'month') {
    // HARIAN (Daily)
    const days = period === 'week' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      
      aggregatedData.push({
        label,
        income: 0,
        expense: 0,
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        dayNum: d.getDate()
      });
    }

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const data = aggregatedData.find(ad => 
        ad.year === tDate.getFullYear() && 
        ad.monthNum === tDate.getMonth() && 
        ad.dayNum === tDate.getDate()
      );
      if (data) {
        if (t.type === 'income') data.income += t.amount;
        else data.expense += t.amount;
      }
    });

  } else {
    // BULANAN (Monthly)
    const months = period === '6months' ? 6 : 12;
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
      
      aggregatedData.push({
        label,
        income: 0,
        expense: 0,
        year: d.getFullYear(),
        monthNum: d.getMonth()
      });
    }

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const data = aggregatedData.find(ad => 
        ad.year === tDate.getFullYear() && ad.monthNum === tDate.getMonth()
      );
      if (data) {
        if (t.type === 'income') data.income += t.amount;
        else data.expense += t.amount;
      }
    });
  }

  // TOTAL & CATEGORY (Semua transaksi untuk summary dashboard)
  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;

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
    chartData: aggregatedData.map(d => ({
      label: d.label,
      income: d.income,
      expense: d.expense
    }))
  });
});

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};