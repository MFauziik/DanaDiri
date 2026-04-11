import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, forgotPassword } from '../services/auth';
import { ShieldCheck, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // Jika tidak ada email di state, arahkan balik ke forgot password
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Kode OTP harus 6 digit');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await verifyOTP(email, otp);
      
      if (data.success === false) {
        setError(data.message);
        return;
      }

      // Jika valid, lanjut ke reset password
      navigate('/reset-password', { state: { email, otp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Kode OTP salah atau sudah kadaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');
    setMessage('');
    try {
      const data = await forgotPassword(email);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setMessage('Kode OTP baru telah dikirim ke email Anda.');
    } catch (err) {
      setError('Gagal mengirim ulang OTP. Silakan coba lagi.');
    } finally {
      setResending(false);
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
          <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-secondary mb-6 transition-colors">
            <ArrowLeft size={16} />
            Ubah Email
          </Link>
          
          <h2 className="text-xl font-bold text-slate-800 mb-2 font-heading">Verifikasi OTP</h2>
          <p className="text-sm text-slate-500 mb-8">
            Kami telah mengirimkan 6 digit kode OTP ke <span className="font-semibold text-slate-700">{email}</span>.
          </p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm text-center">{message}</div>}

          <form onSubmit={handleSubmit}>
            {/* OTP Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-4 text-center" htmlFor="otp">
                Masukkan Kode OTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck size={18} />
                </div>
                <input
                  type="text"
                  id="otp"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl text-center font-bold tracking-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-secondary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-sm text-secondary hover:text-blue-700 font-semibold inline-flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {resending ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Kirim ulang kode
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
