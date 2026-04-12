const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Validasi konfigurasi email
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Konfigurasi email tidak lengkap!');
    throw new Error('Konfigurasi email (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS) belum disetel.');
  }

  // Buat transporter dengan konfigurasi yang aman untuk Railway
  const transporter = nodemailer.createTransport({
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
    connectionTimeout: 30000, // 30 seconds - lebih cepat untuk Railway
    greetingTimeout: 15000,   // 15 seconds
    socketTimeout: 30000,     // 30 seconds
    maxConnections: 3,        // Kurangi untuk Railway
    maxMessages: 50,          // Kurangi untuk stability
    pool: true,               // Enable connection pooling
    debug: process.env.NODE_ENV === 'development', // Debug mode untuk development
    // Force IPv4 untuk menghindari ENETUNREACH error
    family: 4, // Force IPv4 (4 = IPv4, 6 = IPv6, 0 = both)
    // Additional connection options untuk Railway
    name: 'danadiri.railway.app' // Identify client to SMTP server
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

  // Retry logic untuk connection stability
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to send email to ${options.email}`);
      
      // Verify connection sebelum mengirim email
      await transporter.verify();
      console.log('SMTP connection verified');
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email terkirim via Nodemailer:', info.messageId);
      return info;
      
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // Jika bukan timeout/connection error, jangan retry
      if (error.code !== 'ETIMEDOUT' && error.code !== 'ECONNREFUSED') {
        break;
      }
      
      // Wait sebelum retry (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // Handle final error setelah semua retries
  console.error('All email attempts failed:', lastError);
  
  if (lastError.code === 'ETIMEDOUT' || lastError.code === 'ECONNREFUSED') {
    throw new Error('Koneksi email timeout. Pastikan:\n1. EMAIL_HOST dan EMAIL_PORT benar (smtp.gmail.com:587)\n2. Tidak ada firewall blocking\n3. Railway environment sudah benar');
  } else if (lastError.code === 'EAUTH') {
    throw new Error('Authentication failed. Periksa:\n1. EMAIL_USER benar\n2. EMAIL_PASS adalah App Password (bukan password biasa)\n3. 2FA Gmail sudah aktif');
  } else {
    throw new Error(`Gagal mengirim email: ${lastError.message}`);
  }
};

module.exports = sendEmail;
