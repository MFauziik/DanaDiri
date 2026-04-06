const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

// @desc    Mendapatkan semua goals user
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ deadline: 1 });
  res.json(goals);
});

// @desc    Membuat goal baru
// @route   POST /api/goals
// @access  Private
const createGoal = asyncHandler(async (req, res) => {
  const { name, targetAmount, deadline, category, notes } = req.body;

  if (!name || !targetAmount || !deadline) {
    res.status(400);
    throw new Error('Field wajib: name, targetAmount, deadline');
  }

  const goal = await Goal.create({
    user: req.user._id,
    name,
    targetAmount,
    deadline,
    category: category || 'Lainnya',
    notes: notes || '',
    currentAmount: 0,
    status: 'active',
  });

  res.status(201).json(goal);
});

// @desc    Mengupdate goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal tidak ditemukan');
  }

  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Tidak diizinkan mengupdate goal ini');
  }

  goal.name = req.body.name ?? goal.name;
  goal.targetAmount = req.body.targetAmount ?? goal.targetAmount;
  goal.deadline = req.body.deadline ?? goal.deadline;
  goal.category = req.body.category ?? goal.category;
  goal.notes = req.body.notes ?? goal.notes;
  goal.currentAmount = req.body.currentAmount ?? goal.currentAmount;

  // kalau user manual ubah status (misal aktifkan kembali), hormati itu
  if (req.body.status) {
    goal.status = req.body.status;
  } else {
    // auto status kalau tidak dikirim dari frontend
    if (goal.currentAmount >= goal.targetAmount) {
      goal.currentAmount = goal.targetAmount;
      goal.status = 'completed';
    } else {
      goal.status = 'active';
    }
  }

  const updatedGoal = await goal.save();

  res.json(updatedGoal);
});

// @desc    Menambah dana ke goal
// @route   PUT /api/goals/:id/add-funds
// @access  Private
const addFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal tidak ditemukan');
  }

  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Tidak diizinkan mengupdate goal ini');
  }

  const numericAmount = Number(amount);

  if (!numericAmount || numericAmount <= 0) {
    res.status(400);
    throw new Error('Jumlah harus lebih dari 0');
  }

  goal.currentAmount += numericAmount;

  if (goal.currentAmount >= goal.targetAmount) {
    goal.currentAmount = goal.targetAmount;
    goal.status = 'completed';
  } else {
    goal.status = 'active';
  }

  await goal.save();
  res.json(goal);
});

// @desc    Menghapus goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal tidak ditemukan');
  }

  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Tidak diizinkan menghapus goal ini');
  }

  await goal.deleteOne();
  res.json({ message: 'Goal berhasil dihapus' });
});

// @desc    Mendapatkan ringkasan goals
// @route   GET /api/goals/summary
// @access  Private
const getGoalsSummary = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ deadline: 1 });

  const activeGoalsList = goals.filter((goal) => goal.status === 'active');
  const completedGoalsList = goals.filter((goal) => goal.status === 'completed');

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  res.json({
    activeGoals: activeGoalsList.length,
    completedGoals: completedGoalsList.length,
    totalTarget,
    totalCurrent,
    totalProgress,
    goals,
  });
});

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  addFunds,
  deleteGoal,
  getGoalsSummary,
};