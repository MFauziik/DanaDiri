const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(200).json({ 
      success: false, 
      message: 'Semua field harus diisi' 
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(200).json({ 
      success: false, 
      message: 'Email sudah terdaftar' 
    });
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Data user tidak valid');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({ 
      success: false, 
      message: 'Email dan password harus diisi' 
    });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
      success: true
    });
  } else {
    return res.status(200).json({ 
      success: false, 
      message: 'Email atau password salah' 
    });
  }
});

// @desc    Get profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User tidak ditemukan');
  }
});

// @desc    Update profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // Handle foto profil — upload ke Cloudinary jika ada file
    if (req.file) {
      const publicId = `user-${req.user._id}-${Date.now()}`;
      const imageUrl = await uploadToCloudinary(
        req.file.buffer,
        'danadiri/profiles',
        publicId
      );
      user.profilePicture = imageUrl;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User tidak ditemukan');
  }
});

// @desc    Lupa password - Kirim OTP ke email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User dengan email tersebut tidak ditemukan');
  }

  // Generate 6 digit OTP random
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Simpan OTP dan expiry (10 menit)
  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const message = `Kode OTP Anda untuk reset password adalah: ${otp}. Kode ini berlaku selama 10 menit.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Password - DanaDiri',
      message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4F46E5;">Reset Password DanaDiri</h2>
          <p>Halo ${user.name},</p>
          <p>Kami menerima permintaan untuk meriset password akun Anda. Gunakan kode OTP di bawah ini untuk melanjutkan:</p>
          <div style="background: #F3F4F6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1F2937; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Kode ini berlaku selama 10 menit. Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #9CA3AF;">Tim DanaDiri</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP telah dikirim ke email' });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email tidak dapat dikirim');
  }
});

// @desc    Verifikasi OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(200).json({ 
      success: false, 
      message: 'OTP tidak valid atau sudah kadaluwarsa' 
    });
  }

  res.status(200).json({ message: 'OTP valid', success: true });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(200).json({ 
      success: false, 
      message: 'OTP tidak valid atau sudah kadaluwarsa' 
    });
  }

  // Set password baru
  user.password = password;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password berhasil diperbarui' });
});

// ✅ EXPORT HARUS DI PALING BAWAH
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
};