const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Validasi konfigurasi email
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Konfigurasi email tidak lengkap!');
    throw new Error('Konfigurasi email (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS) belum disetel.');
  }

  // Buat transporter dengan konfigurasi yang aman untuk Railway
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true untuk 465, false untuk port lain
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Konfigurasi untuk Railway deployment dan koneksi stability
    tls: {
      rejectUnauthorized: false // Untuk menghindari issues di Railway
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    maxConnections: 5,
    maxMessages: 100,
    pool: true // Enable connection pooling
  });

  const mailOptions = {
    from: {
      name: 'DanaDiri',
      address: process.env.EMAIL_FROM || process.env.EMAIL_USER
    },
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    // Verify connection sebelum mengirim email
    await transporter.verify();
    console.log('SMTP connection verified');
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email terkirim via Nodemailer:', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    
    // Specific error handling untuk Railway
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      throw new Error('Koneksi email timeout. Pastikan konfigurasi SMTP benar dan coba lagi.');
    } else if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Periksa EMAIL_USER dan EMAIL_PASS.');
    } else {
      throw new Error(`Gagal mengirim email: ${error.message}`);
    }
  }
};

module.exports = sendEmail;
