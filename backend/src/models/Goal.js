const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Nama target harus diisi'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Jumlah target harus diisi'],
      min: [1, 'Jumlah target minimal 1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Jumlah tidak boleh negatif'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline harus diisi'],
    },
    category: {
      type: String,
      enum: [
        'Liburan',
        'Kendaraan',
        'Rumah',
        'Pendidikan',
        'Dana Darurat',
        'Pensiun',
        'Investasi',
        'Lainnya',
      ],
      default: 'Lainnya',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;