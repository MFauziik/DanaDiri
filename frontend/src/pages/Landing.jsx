import Navbar from "../components/Navbar";
import { ArrowRight, TrendingDown, RefreshCcw, ShieldAlert, Zap, LayoutDashboard, FileText, Target, CheckCircle2, Lightbulb, ArrowLeftRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-neutral min-h-screen font-body text-gray-800 overflow-x-hidden">
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-secondary/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Text */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-6 text-sm font-medium text-primary tracking-wide leading-relaxed w-fit">
              <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
              <span className="text-center mx-auto text-center">
                Dipercaya Banyak Pengguna untuk Kelola Keuangan
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold font-heading leading-[1.1] mb-6">
              Atur Uangmu Lebih Pintar & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Capai Tujuan Finansial Lebih Cepat</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              DanaDiri membantu kamu memahami ke mana uangmu pergi, mengontrol pengeluaran, dan membangun kebiasaan finansial yang lebih sehat dengan cara yang simpel dan powerful.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_8px_30px_rgb(45,63,191,0.3)] hover:shadow-[0_8px_30px_rgb(124,77,255,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
                Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={() => document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center">
                Lihat Cara Kerjanya
              </button>
            </div>
          </div>

          {/* Right Image/Dashboard Card */}
          <div className="relative relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white/50 backdrop-blur-sm transform transition-transform duration-700 hover:scale-[1.02]">
              {/* Fake dashboard mockup image */}
              <div className="bg-gray-100 w-full h-[400px] p-4 flex flex-col gap-4">
                {/* Top row */}
                <div className="flex gap-4 h-1/4">
                  <div className="bg-white rounded-xl shadow-sm flex-1 p-4 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 font-medium">Saldo Saat Ini</p>
                    <p className="text-xl font-bold font-heading text-gray-800 mt-1">Rp 12.500.000</p>
                  </div>
                  <div className="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-sm flex-1 p-4 flex flex-col justify-center text-white">
                    <p className="text-xs text-white/80 font-medium">Total Pengeluaran</p>
                    <p className="text-xl font-bold font-heading mt-1">Rp 4.200.000</p>
                  </div>
                </div>
                {/* Chart mockup */}
                <div className="bg-white rounded-xl shadow-sm flex-1 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-semibold text-gray-700">Performa Keuangan</p>
                    <div className="w-16 h-4 bg-gray-100 rounded-full"></div>
                  </div>
                  {/* Fake bars */}
                  <div className="flex items-end gap-2 h-32 pt-4">
                    <div className="bg-blue-100 w-full h-[40%] rounded-t-sm"></div>
                    <div className="bg-primary w-full h-[70%] rounded-t-sm"></div>
                    <div className="bg-blue-100 w-full h-[50%] rounded-t-sm"></div>
                    <div className="bg-secondary w-full h-[90%] rounded-t-sm"></div>
                    <div className="bg-blue-100 w-full h-[60%] rounded-t-sm"></div>
                    <div className="bg-primary w-full h-[100%] rounded-t-sm"></div>
                  </div>
                </div>
              </div>

              {/* Floating Overlay Info */}
              <div className="absolute bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <span className="font-bold flex items-center"><TrendingDown className="w-4 h-4 mr-1" /> 12%</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Pengeluaran Lebih Hemat</p>
                  <p className="text-sm font-bold text-gray-800">Dibanding bulan lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-gray-900">Masih Bingung Mengatur Uang?</h2>
            <p className="text-gray-500 text-lg">Banyak orang mengalami hal yang sama — tapi sekarang kamu bisa mengatasinya dengan mudah.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cards */}
            <div className="bg-neutral/50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Uang Cepat Habis</h3>
              <p className="text-gray-600">Sering merasa uang hilang tanpa tahu ke mana perginya? Saatnya kontrol penuh di tanganmu.</p>
            </div>

            <div className="bg-neutral/50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Tabungan Tidak Bertambah</h3>
              <p className="text-gray-600">Gaji naik tapi saldo tetap segitu? Temukan kebocoran finansialmu sekarang.</p>
            </div>

            <div className="bg-neutral/50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Keuangan Tidak Teratur</h3>
              <p className="text-gray-600">Pemasukan dan pengeluaran berantakan? Kami bantu kamu merapikannya.</p>
            </div>

            {/* Highlighted Card */}
            <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-primary text-white p-8 lg:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
              <div className="relative z-10 max-w-lg mb-8 md:mb-0">
                <div className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Masalah Utama</div>
                <h3 className="text-2xl lg:text-3xl font-bold font-heading mb-4 leading-tight">Uang Masuk, Tapi Tidak Pernah Terasa Cukup</h3>
                <p className="text-gray-300 text-lg">Saatnya hentikan kebiasaan itu dan mulai kendalikan keuanganmu.</p>
              </div>
              <div className="relative z-10">
                <Link to="/register" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg">Mulai Perbaiki Sekarang</Link>
              </div>
              <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[50px]"></div>
            </div>
          </div>
        </div>
      </section>


      {/* 4. FEATURES SECTION */}
      <section className="py-20 bg-neutral" id="fitur">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-gray-900">Solusi Canggih untuk Pengelola Keuangan Visioner</h2>
            <p className="text-gray-500 text-lg">Semua alat yang Anda butuhkan untuk mencapai target terbungkus dalam antarmuka yang cantik.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-300">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900">Dasbor Visual</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Pantau arus kas Anda secara real-time dengan visualisasi data yang memukau dan interaktif.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                  <ArrowLeftRight className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900">Catat Transaksi</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Catat pemasukan dan pengeluaran harian dengan cepat, dikelompokkan dalam kategori pintar.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/10 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-300">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900">Target Finansial</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Tetapkan tujuan menabung, beli barang impian, dan lacak progres Anda hingga tercapai.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/20 group-hover:rotate-6 transition-transform duration-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900">Wawasan Cerdas</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Dapatkan analisis dan saran personal otomatis berdasarkan kebiasaan transaksi Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STEPS SECTION */}
      <section className="py-24 bg-white" id="cara-kerja">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-16 text-gray-900">Tiga Langkah Menuju Kebebasan Finansial</h2>

          <div className="relative max-w-4xl mx-auto">
            {/* Connector Line for Desktop */}
            <div className="hidden md:block absolute top-[20%] left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10 w-[70%]"></div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold font-heading mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">Buat Akun</h3>
                <p className="text-gray-500 text-sm">Daftar secara gratis dalam hitungan detik. Data dienkripsi & aman.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-bold font-heading mb-6 shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">Catat Transaksi</h3>
                <p className="text-gray-500 text-sm">Input data harian dengan cepat dan kelompokkan sesuai kategori.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-bold font-heading mb-6 shadow-lg shadow-tertiary/30 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">Lihat Wawasan</h3>
                <p className="text-gray-500 text-sm">Nikmati dashboard cantik & dapatkan pemahaman mendalam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-12 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-[-50%] left-[-10%] w-64 h-64 border-4 border-white/10 rounded-full"></div>
            <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 border-4 border-white/10 rounded-full"></div>
            <div className="absolute top-[20%] right-[15%] w-32 h-32 border-2 border-white/10 rounded-full"></div>

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold font-heading mb-6">Catat finansial Anda dimulai hari ini.</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">Bergabunglah dengan ribuan pengguna lain yang telah mencatat finansial mereka. Mulai dari langkah kecil, capai target besar.</p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
        <div className="container mx-auto px-6 lg:px-12">

          {/* FOOTER GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">

            {/* BRAND */}
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="text-2xl font-bold font-heading text-primary flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="DanaDiri Logo" className="w-10 h-10 rounded-full shadow-sm drop-shadow-sm" />
                DanaDiri
              </Link>
              <p className="text-gray-500 mb-6 max-w-sm">
                Platform manajemen keuangan modern yang membantu Anda memahami,
                mengontrol, dan mengembangkan kondisi finansial secara berkelanjutan.
              </p>
            </div>

            {/* FITUR */}
            <div>
              <h4 className="font-bold font-heading text-gray-900 mb-4">Fitur</h4>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/transactions" className="text-gray-500 hover:text-primary transition-colors">Transaksi</Link></li>
                <li><Link to="/goals" className="text-gray-500 hover:text-primary transition-colors">Target</Link></li>
                <li><Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Insight</Link></li>
              </ul>
            </div>

            {/* INSIGHT MINI */}
            <div className="col-span-2 md:col-span-2 lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Insight
                    </h4>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    Pengguna yang rutin mencatat transaksi bisa menghemat hingga{" "}
                    <span className="text-primary font-semibold">20%</span> pengeluaran bulanan.
                  </p>
                </div>

                <Link to="/register" className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all">
                  Coba Sekarang <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* FOOTER BOTTOM */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 DanaDiri. Seluruh hak dilindungi.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}