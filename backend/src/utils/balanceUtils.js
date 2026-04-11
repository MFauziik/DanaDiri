const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/**
 * Menghitung saldo saat ini untuk user tertentu menggunakan MongoDB Aggregation
 * Metode ini jauh lebih efisien daripada memuat semua transaksi ke memori.
 * @param {string} userId - ID User
 * @returns {Promise<number>} - Total saldo (Income - Expense)
 */
const calculateBalance = async (userId) => {
  const result = await Transaction.aggregate([
    { 
      $match: { 
        user: new mongoose.Types.ObjectId(userId) 
      } 
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { 
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] 
          }
        },
        totalExpense: {
          $sum: { 
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] 
          }
        }
      }
    }
  ]);

  // Jika tidak ada transaksi, saldo adalah 0
  if (result.length === 0) {
    return 0;
  }

  const { totalIncome, totalExpense } = result[0];
  return totalIncome - totalExpense;
};

module.exports = { calculateBalance };
