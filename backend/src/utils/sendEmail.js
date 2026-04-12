const { Resend } = require('resend');

const sendEmail = async (options) => {
  // Gunakan RESEND_API_KEY dari environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY tidak ditemukan di environment variables!');
    throw new Error('Konfigurasi email (RESEND_API_KEY) belum disetel di Railway.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'DanaDiri <onboarding@resend.dev>', // Nama pengirim tetap DanaDiri
      to: options.email,
      subject: options.subject,
      reply_to: 'capstonedanadiri@gmail.com', // Jika user balas email, masuk ke Gmail Anda
      text: options.message,
      html: options.html,
    });

    if (error) {
      console.error('🔥 Resend Error details:', error);
      throw new Error(error.message);
    }

    console.log('✅ Email terkirim via Resend:', data.id);
    return data;
  } catch (err) {
    console.error('🔥 Resend API Error:', err);
    throw new Error(`Gagal mengirim email: ${err.message}`);
  }
};

module.exports = sendEmail;
