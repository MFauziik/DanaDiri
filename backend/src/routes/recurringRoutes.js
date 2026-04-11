const express = require('express');
const router = express.Router();
const {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

// GET all recurring transactions
router.get('/', protect, getRecurring);

// POST create new recurring transaction
router.post('/', protect, createRecurring);

// PUT update recurring transaction
router.put('/:id', protect, updateRecurring);

// DELETE recurring transaction
router.delete('/:id', protect, deleteRecurring);

module.exports = router;  