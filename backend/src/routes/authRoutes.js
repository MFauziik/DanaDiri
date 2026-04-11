const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const multer = require('multer');

// Gunakan memoryStorage — tidak ada akses file system, aman di Railway
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'));
    }
  }
});

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// 🔥 ROUTE EDIT PROFILE WITH UPLOAD
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

// 🔥 ROUTE FORGOT PASSWORD
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;