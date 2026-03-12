const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Semua field harus diisi');
  }

  // Cek apakah user sudah ada
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email sudah terdaftar');
  }

  // Buat user baru
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
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

  // Validasi input
  if (!email || !password) {
    res.status(400);
    throw new Error('Email dan password harus diisi');
  }

  // Cari user berdasarkan email
  const user = await User.findOne({ email });

  // Cek password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email atau password salah');
  }
});

// @desc    Mendapatkan profil user
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User tidak ditemukan');
  }
});

module.exports = { registerUser, loginUser, getUserProfile };