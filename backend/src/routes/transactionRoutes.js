const express = require('express');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route transaction membutuhkan autentikasi
router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/summary')
  .get(getSummary);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;