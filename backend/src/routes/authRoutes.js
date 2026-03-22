const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile // 🔥 tambahkan ini
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// 🔥 ROUTE EDIT PROFILE
router.put('/profile', protect, updateUserProfile);

module.exports = router;