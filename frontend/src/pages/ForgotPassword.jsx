import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/auth';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      // Simpan email di state navigation untuk digunakan di halaman verifikasi
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim OTP. Pastikan email terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FE] font-sans p-4 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="DanaDiri Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl font-bold font-heading text-slate-800">DanaDiri</h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-secondary mb-6 transition-colors">
            <ArrowLeft size={16} />
            Kembali ke Login
          </Link>
          
          <h2 className="text-[22px] font-bold text-slate-800 mb-2 font-heading">Lupa Kata Sandi?</h2>
          <p className="text-sm text-slate-500 mb-8">Masukkan email Anda dan kami akan mengirimkan kode OTP untuk meriset kata sandi Anda.</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-secondary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Mengirim...' : 'Kirim OTP'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
