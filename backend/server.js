const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./src/config/database');

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Routes
    app.use('/api/auth', require('./src/routes/authRoutes'));
    app.use('/api/goals', require('./src/routes/goalRoutes'));
    app.use('/api/transactions', require('./src/routes/transactionRoutes'));
    app.use('/api/budgets', require('./src/routes/budgetRoutes'));
    app.use('/api/recurring', require('./src/routes/recurringRoutes'));
    app.use('/api/insights', require('./src/routes/insightRoutes'));

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal start server:', error.message);
    process.exit(1);
  }
};

startServer();