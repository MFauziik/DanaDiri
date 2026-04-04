import { useState, useRef, useEffect } from 'react';
import { Camera, Lock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { updateProfile } from '../services/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture ? `${API_BASE_URL}${user.profilePicture}` : '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.profilePicture) {
        setPreview(`${API_BASE_URL}${user.profilePicture}`);
      }
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setMessage({ type: 'error', text: 'Ukuran file melampaui batas maksimal 5MB.' });
        return;
      }
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);

    if (password) {
      formData.append('password', password);
    }

    if (profilePic) {
      formData.append('profilePicture', profilePic);
    }

    try {
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setPassword(''); // clear password if set
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal memperbarui profil.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex">
      <Sidebar user={user} setUser={setUser} />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-slate-900 mb-1 font-heading">Pengaturan Profil</h1>
            <p className="text-sm text-slate-500">
              Kelola informasi pribadi, keamanan, dan preferensi akun DanaDiri Anda.
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Kartu Informasi Pengguna */}
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Informasi Pengguna</h2>
              </div>

              <div className="p-6">
                {/* Foto Profil */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative cursor-pointer group" onClick={handleImageClick}>
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md relative">
                      {preview ? (
                        <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-blue-500">{name?.charAt(0)?.toUpperCase()}</span>
                      )}

                      {/* Overlay On Hover */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                      </div>
                    </div>
                    {/* Badge Edit Indicator */}
                    <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-slate-100 z-10 transition-transform group-hover:scale-110">
                      <Camera size={14} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Foto Profil</h3>
                    <p className="text-xs text-slate-500">PNG atau JPG, maksimal 5MB.</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Nomor Telepon
                    </label>
                    <div className="flex">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder="81234567890"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Keamanan */}
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Keamanan</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <Lock size={20} className="text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Kata Sandi</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Atur ulang kata sandi anda (opsional)</p>
                    </div>
                  </div>
                  <div className="w-1/3">
                    <input
                      type="password"
                      placeholder="Masukkan password baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#1d4ed8] text-white font-semibold rounded-xl text-sm hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
