const { Resend } = require('resend');

const sendEmail = async (options) => {
  // Jika API Key Resend ada, gunakan Resend (Direkomendasikan untuk Production/Railway)
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: 'DanaDiri <onboarding@resend.dev>', // Gunakan onboarding@resend.dev jika belum punya domain sendiri
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('🔥 Resend API Error:', err);
      throw new Error(`Gagal mengirim email via Resend: ${err.message}`);
    }
  } 
  
  // LOGIKA FALLBACK (Optional: Jika ingin tetap bisa pakai SMTP di lokal)
  console.warn('⚠️ RESEND_API_KEY tidak ditemukan, email tidak dapat dikirim di lingkungan cloud.');
  throw new Error('Konfigurasi email (RESEND_API_KEY) belum disetel di Railway.');
};

module.exports = sendEmail;
