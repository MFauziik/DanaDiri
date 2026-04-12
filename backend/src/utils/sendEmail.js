const { Resend } = require('resend');

const sendEmail = async (options) => {
  // Validasi konfigurasi Resend
  if (!process.env.RESEND_API_KEY) {
    console.error(' RESEND_API_KEY tidak ditemukan!');
    throw new Error('RESEND_API_KEY belum disetel di environment variables.');
  }

  // Initialize Resend client
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log(`Sending email via Resend to: ${options.email}`);

  // Resend email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'DanaDiri <onboarding@resend.dev>',
    to: [options.email],
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    console.log('Sending email via Resend API...');
    const { data, error } = await resend.emails.send(mailOptions);
    
    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(`Resend API error: ${error.message}`);
    }
    
    console.log('Email terkirim via Resend:', data.id);
    return data;
    
  } catch (error) {
    console.error('Resend Error:', error);
    
    // Specific error handling untuk Resend
    if (error.message.includes('API_KEY')) {
      throw new Error('Resend API Key invalid. Periksa RESEND_API_KEY di Railway environment variables.');
    } else if (error.message.includes('FROM')) {
      throw new Error('From domain tidak verified. Pastikan domain sudah terdaftar di Resend dashboard.');
    } else if (error.message.includes('RATE_LIMIT')) {
      throw new Error('Rate limit exceeded. Tunggu beberapa saat sebelum mencoba lagi.');
    } else {
      throw new Error(`Gagal mengirim email via Resend: ${error.message}`);
    }
  }
};

module.exports = sendEmail;
