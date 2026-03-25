const express = require('express');
const router = express.Router();
const {
  getRecurring,
  createRecurring,
  deleteRecurring,
} = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

// GET all recurring transactions
router.get('/', protect, getRecurring);

// POST create new recurring transaction
router.post('/', protect, createRecurring);

// DELETE recurring transaction
router.delete('/:id', protect, deleteRecurring);

module.exports = router;  