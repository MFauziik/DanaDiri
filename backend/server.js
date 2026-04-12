const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./src/config/database');
const { startRecurringJob } = require('./src/utils/recurringJob');

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

const startServer = async () => {
  try {
    await connectDB();

    // Jalankan scheduler untuk transaksi berulang
    startRecurringJob();

    const app = express();

    // Default Health Check (bypasses CORS)
    app.get('/', (req, res) => {
      res.status(200).send('DanaDiri API is running!');
    });

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

    // Bind ke 0.0.0.0 sangat penting untuk Docker/Railway deployment
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal start server:', error.message);
    process.exit(1);
  }
};

startServer();