const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Recurring = require('../models/RecurringTransaction');
const { processSpecificRecurring } = require('../utils/recurringJob');

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

  // ── Trigger 1 (create): cek langsung apakah hari ini adalah jadwalnya ──
  setImmediate(() => processSpecificRecurring(recurring._id, false));

  res.status(201).json(recurring);
});

// UPDATE
const updateRecurring = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database sedang tidak tersedia' });
  }

  const recurring = await Recurring.findById(req.params.id);

  if (!recurring) {
    res.status(404);
    throw new Error('Recurring transaction not found');
  }

  // Make sure the logged in user matches the recurring transaction user
  if (recurring.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedRecurring = await Recurring.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // ── Trigger 1 (update): forceCheck=true agar perubahan dayOfMonth
  //    ke hari ini tetap diproses meski lastRun sudah ada hari ini ──
  setImmediate(() => processSpecificRecurring(updatedRecurring._id, true));

  res.json(updatedRecurring);
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
  updateRecurring,
  deleteRecurring,
};