const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./src/config/database');
const { startRecurringJob } = require('./src/utils/recurringJob');

const startServer = async () => {
  try {
    await connectDB();

    // Jalankan scheduler untuk transaksi berulang
    startRecurringJob();

    const app = express();

    const corsOptions = {
      origin: [
        'https://danadiri.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));
    // Handle preflight (OPTIONS) requests explicitly for all routes
    app.options('*', cors(corsOptions));
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