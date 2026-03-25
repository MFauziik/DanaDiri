const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Recurring = require('../models/RecurringTransaction');

// GET
const getRecurring = asyncHandler(async (req, res) => {
  // Pastikan koneksi database aktif
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database sedang tidak tersedia' });
  }
  
  const data = await Recurring.find({ user: req.user._id });
  res.json(data);
});

// CREATE
const createRecurring = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database sedang tidak tersedia' });
  }
  
  const recurring = await Recurring.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(recurring);
});

// DELETE
const deleteRecurring = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database sedang tidak tersedia' });
  }
  
  await Recurring.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = {
  getRecurring,
  createRecurring,
  deleteRecurring,
};