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

  const budgetData = await Budget.findOne({ user: userId });
  const budget = budgetData ? budgetData.amount : 0;

  let status = 'AMAN';
  let message = 'Pengeluaran kamu masih terkendali 👍';

  if (budget > 0) {
    if (expense > budget) {
      status = 'OVER';
      message = '⚠️ Pengeluaran melebihi budget!';
    } else if (expense > budget * 0.8) {
      status = 'WARNING';
      message = '⚠️ Hampir mencapai batas budget';
    }
  }

  res.json({
    income,
    expense,
    balance,
    budget,
    status,
    message,
  });
});

module.exports = { getInsights };