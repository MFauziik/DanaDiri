const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// SET / UPDATE BUDGET
exports.setBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let budget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        amount,
        month,
        year,
      });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BUDGET + TOTAL EXPENSE
exports.getBudget = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    // total pengeluaran bulan ini
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalExpense = expenses[0]?.total || 0;

    res.json({
      budget: budget ? budget.amount : 0,
      spent: totalExpense,
      remaining: (budget?.amount || 0) - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};