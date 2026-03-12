const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const goalRoutes = require('./routes/goalRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // untuk parsing application/json

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API DanaDiri berjalan...');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;