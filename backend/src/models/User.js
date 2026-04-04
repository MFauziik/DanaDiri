const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Nomor telepon harus diisi'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

// Enkripsi password sebelum disimpan
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method untuk membandingkan password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;