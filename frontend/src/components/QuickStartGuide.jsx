import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  PlusCircle,
  Tags,
  BarChart3,
  Zap,
  ChevronRight,
  Lightbulb,
  Receipt,
  Target,
  Download,
  LayoutDashboard,
} from 'lucide-react';

const GUIDE_KEY = 'danadiri_guide_dismissed';

const guides = [
  {
    id: 'add-transaction',
    icon: PlusCircle,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Tambah Transaksi',
    description: 'Catat setiap pemasukan dan pengeluaran harianmu. Klik tombol "+ Transaksi" di halaman Transaksi.',
    path: '/transactions',
    cta: 'Tambah Sekarang',
  },
  {
    id: 'view-category',
    icon: Tags,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Pilih Kategori',
    description: 'Setiap transaksi punya kategori seperti Makanan, Transportasi, Gaji, dll. Kategori membantu analisis keuanganmu.',
    path: '/transactions',
    cta: 'Lihat Kategori',
  },
  {
    id: 'view-report',
    icon: BarChart3,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Lihat Laporan',
    description: 'Pantau grafik arus keuanganmu di dashboard. Bandingkan pemasukan vs pengeluaran per bulan.',
    path: '/dashboard',
    cta: 'Lihat Grafik',
  },
  {
    id: 'set-goals',
    icon: Target,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Buat Target Tabungan',
    description: 'Tentukan target keuanganmu seperti liburan, kendaraan, atau dana darurat. Pantau progressnya!',
    path: '/goals',
    cta: 'Buat Target',
  },
];

const featureHints = [
  { icon: Receipt, label: 'Tambah Transaksi', hint: 'Catat pemasukan & pengeluaran' },
  { icon: Target, label: 'Tambah Tabungan', hint: 'Buat target tabungan baru' },
  { icon: Download, label: 'Export Data', hint: 'Download laporan ke Excel/PDF' },
  { icon: LayoutDashboard, label: 'Dashboard', hint: 'Lihat ringkasan keuanganmu' },
];

const QuickStartGuide = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(GUIDE_KEY) === 'true';
    } catch { return false; }
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(GUIDE_KEY, 'true');
    setIsDismissed(true);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] mb-6 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Lightbulb size={17} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Mulai dari Sini</h2>
            <p className="text-xs text-slate-400">Panduan cepat untuk memulai</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
          aria-label="Tutup panduan"
        >
          <X size={16} />
        </button>
      </div>

      {/* Guide Cards */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.id}
                onClick={() => navigate(guide.path)}
                className="group flex items-start gap-3.5 p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200 text-left animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className={`w-9 h-9 rounded-xl ${guide.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={17} className={guide.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                      {guide.title}
                    </h3>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Hints */}
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Tombol & Fitur Utama
          </p>
          <div className="flex flex-wrap gap-2">
            {featureHints.map((hint) => {
              const Icon = hint.icon;
              return (
                <div
                  key={hint.label}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 group"
                >
                  <Icon size={13} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">{hint.label}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">— {hint.hint}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;
