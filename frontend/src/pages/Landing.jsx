import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// PENTING: Terima prop 'user' di sini!
const Landing = ({ user }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar Khusus Landing */}
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-blue-600">
              DanaDiri
            </div>
            <div className="space-x-4">
              {user ? (
                // Jika user sudah login
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/transactions"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Transaksi
                  </Link>
                  <span className="text-gray-600 px-3 py-2 text-sm">
                    Halo, {user.name}
                  </span>
                </>
              ) : (
                // Jika user belum login
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Kelola Keuangan Pribadi
            <span className="text-blue-600 block mt-2">Dengan Mudah dan Cerdas</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Catat pemasukan dan pengeluaran, lihat laporan keuangan, 
            dan capai tujuan finansial Anda bersama DanaDiri.
          </p>
          <div className="space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block"
              >
                Buka Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block"
              >
                Mulai Sekarang
              </Link>
            )}
            <a
              href="#fitur"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('fitur').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
          
          {/* Gambar Preview */}
          <div className="mt-16 bg-white rounded-xl shadow-2xl p-4 max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-500">
              [Preview Dashboard Aplikasi]
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Mengapa Memilih DanaDiri?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Fitur lengkap yang membantu Anda mengontrol keuangan dengan lebih baik
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-blue-50 rounded-xl p-8 text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pencatatan Mudah</h3>
              <p className="text-gray-600">
                Catat pemasukan dan pengeluaran dengan cepat, kategorisasi otomatis
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-blue-50 rounded-xl p-8 text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Visualisasi Data</h3>
              <p className="text-gray-600">
                Lihat grafik pengeluaran per kategori untuk analisis keuangan
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-blue-50 rounded-xl p-8 text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600">
                Data Anda aman dengan enkripsi dan autentikasi JWT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Apa Kata Pengguna?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            Mereka yang sudah merasakan manfaat DanaDiri
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimoni 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Andi Pratama</h4>
                  <p className="text-gray-600 text-sm">Pengusaha</p>
                </div>
              </div>
              <p className="text-gray-600">
                "DanaDiri membantu saya memantau arus kas bisnis dengan sangat mudah. 
                Fitur kategorinya lengkap dan grafiknya informatif!"
              </p>
            </div>

            {/* Testimoni 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Siti Nurhaliza</h4>
                  <p className="text-gray-600 text-sm">Karyawan</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Akhirnya nemu aplikasi catatan keuangan yang simple dan tidak ribet. 
                Dashboard-nya bagus untuk lihat kemana saja uang saya pergi."
              </p>
            </div>

            {/* Testimoni 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Budi Santoso</h4>
                  <p className="text-gray-600 text-sm">Freelancer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Sebagai freelancer, penting banget punya catatan keuangan yang rapi. 
                DanaDiri solusi tepat!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Mengelola Keuangan dengan Lebih Baik?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Daftar sekarang dan mulai catat keuangan Anda dengan mudah
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
            >
              Buka Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
            >
              Daftar Gratis Sekarang
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DanaDiri</h3>
              <p className="text-gray-400">
                Aplikasi pencatatan keuangan pribadi yang mudah dan lengkap.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Fitur</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Pencatatan Transaksi</li>
                <li>Dashboard & Grafik</li>
                <li>Kategori Lengkap</li>
                <li>Ringkasan Keuangan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tentang Kami</li>
                <li>Blog</li>
                <li>Karir</li>
                <li>Kontak</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>FAQ</li>
                <li>Pusat Bantuan</li>
                <li>Privasi</li>
                <li>Syarat & Ketentuan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DanaDiri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;