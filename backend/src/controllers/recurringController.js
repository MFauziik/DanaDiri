const asyncHandler = require('express-async-handler');
const Recurring = require('../models/RecurringTransaction');

// GET
const getRecurring = asyncHandler(async (req, res) => {
  const data = await Recurring.find({ user: req.user._id });
  res.json(data);
});

// CREATE
const createRecurring = asyncHandler(async (req, res) => {
  const recurring = await Recurring.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(recurring);
});

// DELETE
const deleteRecurring = asyncHandler(async (req, res) => {
  await Recurring.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = {
  getRecurring,
  createRecurring,
  deleteRecurring,
};