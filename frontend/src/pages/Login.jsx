import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
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
          <p className="text-sm text-slate-500">Kelola finansial Anda dengan lebih bijak</p>
        </div>

        {/* Card */}
        <div className="bg-white w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-6">
          <h2 className="text-[22px] font-bold text-slate-800 mb-2 font-heading">Selamat Datang Kembali</h2>
          <p className="text-sm text-slate-500 mb-8">Silakan masuk untuk mengakses dashboard Anda</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
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

            {/* Password */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                  Kata Sandi
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-secondary hover:text-blue-700 transition">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-secondary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 group"
            >
              Masuk
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mb-12">
          <p className="text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-secondary hover:text-blue-700 transition">
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Text bottom */}
        <div className="flex flex-col items-center text-xs text-slate-400 mt-auto pb-4">
          <div className="flex gap-4 mb-2 font-medium">
            <Link to="#" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</Link>
            <Link to="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</Link>
            <Link to="#" className="hover:text-slate-600 transition-colors">Pusat Bantuan</Link>
          </div>
          <p>© 2024 DANADIRI. TERDAFTAR DI OJK.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;