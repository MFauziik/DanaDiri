const express = require('express');
const {
  getGoals,
  createGoal,
  updateGoal,
  addFunds,
  deleteGoal,
  getGoalsSummary,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route goal membutuhkan autentikasi
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/summary')
  .get(getGoalsSummary);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.route('/:id/add-funds')
  .put(addFunds);

module.exports = router;