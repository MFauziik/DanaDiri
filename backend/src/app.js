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

// Middleware
app.use(cors());
app.use(express.json()); // untuk parsing application/json

const path = require('path');

// Static folder untuk uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/insights', insightRoutes);
app.use('/api/budget', budgetRoutes);
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