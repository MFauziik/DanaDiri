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

    // Logging middleware untuk debug Railway
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });

    // Default Health Check (bypasses CORS)
    app.get('/', (req, res) => {
      res.status(200).send('DanaDiri API is running!');
    });

    const corsOptions = {
      origin: [
        'https://danadiri.vercel.app',
        'https://danadiri-production-02e8.up.railway.app',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        /\.vercel\.app$/ // Mengizinkan semua subdomain Vercel
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));
    // Handle preflight (OPTIONS) requests explicitly
    app.options('*', cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

    // Debug rute — pastikan rute login terdaftar eksplisit
    const { loginUser } = require('./src/controllers/authController');
    app.post('/api/auth/login', loginUser);

    // Routes
    app.use('/api/auth', require('./src/routes/authRoutes'));
    app.use('/api/goals', require('./src/routes/goalRoutes'));
    app.use('/api/transactions', require('./src/routes/transactionRoutes'));
    app.use('/api/budgets', require('./src/routes/budgetRoutes'));
    app.use('/api/recurring', require('./src/routes/recurringRoutes'));
    app.use('/api/insights', require('./src/routes/insightRoutes'));

    // Error Handlers
    app.use(notFound);
    app.use(errorHandler);

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