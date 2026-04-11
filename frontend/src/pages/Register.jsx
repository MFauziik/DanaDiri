import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';

const Register = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await register(name, email, phone, password);
      
      if (userData.success === false) {
        setError(userData.message);
        return;
      }

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FE] font-sans p-4 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-[420px] flex flex-col items-center py-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="DanaDiri Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl font-bold font-heading text-slate-800">DanaDiri</h1>
          </div>
          <p className="text-sm text-slate-500">Kelola finansial Anda dengan lebih bijak</p>
        </div>

        {/* Card */}
        <div className="bg-white w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-2 font-heading">Mulai Perjalanan Anda</h2>
          <p className="text-sm text-slate-500 mb-6">Lengkapi data di bawah untuk membuat akun baru</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Nama Lengkap */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-secondary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
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

            {/* Nomor Telepon */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="phone">
                Nomor Telepon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567xxx"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-secondary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                Kata Sandi
              </label>
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
                  minLength="6"
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
              className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 group mb-6"
            >
              Daftar
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Footer Link Inside Card */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-semibold text-secondary hover:text-blue-700 transition">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
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

export default Register;