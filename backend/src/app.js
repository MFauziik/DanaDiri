const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const goalRoutes = require('./routes/goalRoutes');
const insightRoutes = require('./routes/insightRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const recurringRoutes = require('./routes/recurringRoutes');

dotenv.config();

const app = express();

// ✅ CORS — harus sebelum semua route dan error handler
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
// Handle preflight (OPTIONS) requests explicitly untuk semua route
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/insights', insightRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recurring', recurringRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API DanaDiri berjalan...');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;