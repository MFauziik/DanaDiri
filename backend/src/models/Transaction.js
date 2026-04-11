const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Jumlah harus diisi'],
      min: [0, 'Jumlah tidak boleh negatif'],
    },
    type: {
      type: String,
      required: [true, 'Tipe transaksi harus diisi'],
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: [true, 'Kategori harus diisi'],
      enum: [
        'Makanan',
        'Transportasi',
        'Belanja',
        'Hiburan',
        'Kesehatan',
        'Tagihan',
        'Gaji',
        'Investasi',
        'Tabungan',
        'Lainnya',
      ],
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Tanggal harus diisi'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;