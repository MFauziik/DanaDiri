const express = require('express');
const router = express.Router();
const {
  getRecurring,
  createRecurring,
  deleteRecurring
} = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecurring);
router.post('/', protect, createRecurring);
router.delete('/:id', protect, deleteRecurring);

module.exports = router;