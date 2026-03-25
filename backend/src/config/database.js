const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Opsi untuk menjaga koneksi tetap hidup
      maxPoolSize: 10, // Maksimal koneksi dalam pool
      minPoolSize: 2,  // Minimal koneksi dalam pool
      socketTimeoutMS: 45000, // Timeout socket 45 detik
      connectTimeoutMS: 10000, // Timeout koneksi 10 detik
      serverSelectionTimeoutMS: 5000, // Timeout server selection
      heartbeatFrequencyMS: 10000, // Kirim ping setiap 10 detik
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Event listener untuk koneksi
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected, attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Jangan exit process, biarkan mencoba reconnect
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;