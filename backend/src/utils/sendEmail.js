const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Menambahkan timeout untuk mencegah "hang" di Railway
    connectionTimeout: 10000, // 10 detik
    greetingTimeout: 5000,
    socketTimeout: 15000,
    pool: true, // Re-use koneksi
  });

  const mailOptions = {
    from: `"DanaDiri" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
