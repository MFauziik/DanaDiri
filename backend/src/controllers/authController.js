const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
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
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
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
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
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
      createdAt: updatedUser.createdAt,
      token: generateToken(updatedUser._id),
      success: true
    });
  } else {
    res.status(404);
    throw new Error('User tidak ditemukan');
  }
});

// ✅ EXPORT HARUS DI PALING BAWAH
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};