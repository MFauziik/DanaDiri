import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  LayoutDashboard,
  ReceiptText,
  Target,
  User,
  LogOut,
  Bell,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  MoreHorizontal,
  PlusCircle,
  Car,
  Plane,
} from 'lucide-react';

import api from '../services/api';
import { formatRupiah } from '../utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryExpense: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const response = await api.get('/transactions/summary');

    setSummary({
      totalIncome: response?.data?.totalIncome || 0,
      totalExpense: response?.data?.totalExpense || 0,
      balance: response?.data?.balance || 0,
      categoryExpense: response?.data?.categoryExpense || {},
    });
  } catch (error) {
    console.error('Gagal mengambil data:', error);

    // fallback biar dashboard tetap muncul walau API error
    setSummary({
      totalIncome: 15000000,
      totalExpense: 8000000,
      balance: 7000000,
      categoryExpense: {
        'Makan & Minum': 1500000,
        Transportasi: 800000,
        'Tagihan & Utilitas': 1200000,
        Hiburan: 400000,
        Lainnya: 300000,
      },
    });
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    navigate('/login');
  };

  // =========================
  // DATA DUMMY AGAR MIRIP FIGMA
  // =========================
  const todayIncome = 500000;
  const todayExpense = 150000;
  const monthlyIncome = summary.totalIncome || 15000000;
  const monthlyExpense = summary.totalExpense || 8000000;

  const categoryExpenseData =
    Object.keys(summary.categoryExpense).length > 0
      ? summary.categoryExpense
      : {
          'Makan & Minum': 1500000,
          Transportasi: 800000,
          'Tagihan & Utilitas': 1200000,
          Hiburan: 400000,
          Lainnya: 300000,
        };

  const totalCategoryExpense = Object.values(categoryExpenseData).reduce(
    (acc, curr) => acc + curr,
    0
  );

 const chartData = {
  labels: ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN'],
  datasets: [
    {
      label: 'Pendapatan',
      data: [4500000, 6500000, 9000000, 7000000, 12000000, 15000000],
      borderColor: '#2563EB',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.02)');
        return gradient;
      },
      tension: 0.45,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: '#2563EB',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      borderWidth: 4,
      fill: true,
    },
    {
      label: 'Pengeluaran',
      data: [2500000, 3500000, 5000000, 4200000, 6000000, 8000000],
      borderColor: '#F43F5E',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
        gradient.addColorStop(1, 'rgba(244, 63, 94, 0.02)');
        return gradient;
      },
      tension: 0.45,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: '#F43F5E',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      borderWidth: 4,
      fill: true,
    },
  ],
};

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 10,
        boxHeight: 10,
        color: '#64748B',
        padding: 20,
        font: {
          size: 12,
          weight: '600',
        },
      },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 14,
      cornerRadius: 14,
      displayColors: true,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${formatRupiah(context.raw)}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#94A3B8',
        font: {
          size: 11,
          weight: '600',
        },
      },
      border: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#94A3B8',
        font: {
          size: 10,
        },
        callback: function (value) {
          if (value >= 1000000) return `${value / 1000000}jt`;
          return value;
        },
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.12)',
        drawTicks: false,
      },
      border: {
        display: false,
      },
    },
  },
};
  const recentTransactions = [
    {
      date: '12 Jun 2024',
      category: 'Makan Siang',
      type: 'Pengeluaran',
      amount: -55000,
      icon: '🍴',
    },
    {
      date: '11 Jun 2024',
      category: 'Gaji Bulanan',
      type: 'Pendapatan',
      amount: 15000000,
      icon: '💼',
    },
    {
      date: '10 Jun 2024',
      category: 'Token Listrik',
      type: 'Pengeluaran',
      amount: -200000,
      icon: '⚡',
    },
  ];

  const savingGoals = [
    {
      name: 'Mobil Baru',
      target: 250000000,
      saved: 112500000,
      percentage: 45,
      remaining: '18 Bulan',
      icon: <Car size={16} className="text-blue-600" />,
      bg: 'bg-blue-50',
      bar: 'bg-blue-600',
    },
    {
      name: 'Liburan Jepang',
      target: 30000000,
      saved: 24000000,
      percentage: 80,
      remaining: '2 Bulan',
      icon: <Plane size={16} className="text-purple-600" />,
      bg: 'bg-purple-50',
      bar: 'bg-purple-600',
    },
  ];
// =========================
// FINANCIAL INSIGHT LOGIC
// =========================
const totalIncome = summary.totalIncome || 5000000;
const totalExpense = summary.totalExpense || 4200000;
const saving = totalIncome - totalExpense;

const savingPercentage =
  totalIncome > 0 ? (saving / totalIncome) * 100 : 0;

const expensePercentage =
  totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const expenseBarWidth = Math.min(expensePercentage, 100);
  const displaySavingPercentage = Math.max(savingPercentage, 0);

let financialStatus = 'Sehat';
let financialMessage =
  'Keuangan kamu cukup baik, tapi masih bisa lebih hemat 👍';
let statusColor = 'bg-green-100 text-green-700';
let progressColor = 'bg-green-500';
let statusIcon = '🟢';

if (totalExpense > totalIncome) {
  financialStatus = 'Bahaya';
  financialMessage =
    'Pengeluaran kamu melebihi pemasukan! Segera evaluasi keuangan 🚨';
  statusColor = 'bg-red-100 text-red-700';
  progressColor = 'bg-red-500';
  statusIcon = '🔴';
} else if (savingPercentage >= 50) {
  financialStatus = 'Sangat Sehat';
  financialMessage =
    'Keuangan kamu sangat stabil! Kamu berhasil menyisihkan banyak tabungan 💰';
  statusColor = 'bg-emerald-100 text-emerald-700';
  progressColor = 'bg-emerald-500';
  statusIcon = '🟢';
} else if (savingPercentage >= 20 && savingPercentage < 50) {
  financialStatus = 'Sehat';
  financialMessage =
    'Keuangan kamu cukup baik, tapi masih bisa lebih hemat 👍';
  statusColor = 'bg-green-100 text-green-700';
  progressColor = 'bg-green-500';
  statusIcon = '🟢';
} else if (savingPercentage < 20) {
  financialStatus = 'Waspada';
  financialMessage =
    'Pengeluaran kamu mulai tinggi, coba kontrol pengeluaran ⚠️';
  statusColor = 'bg-yellow-100 text-yellow-700';
  progressColor = 'bg-yellow-500';
  statusIcon = '🟡';
}
  const stats = [
    {
      title: 'Pendapatan Hari Ini',
      value: formatRupiah(todayIncome),
      icon: <TrendingUp size={16} className="text-emerald-500" />,
      iconBg: 'bg-emerald-50',
      badge: '+5%',
      badgeColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      title: 'Pengeluaran Hari Ini',
      value: formatRupiah(todayExpense),
      icon: <TrendingDown size={16} className="text-rose-500" />,
      iconBg: 'bg-rose-50',
      badge: '-2%',
      badgeColor: 'text-rose-500 bg-rose-50',
    },
    {
      title: 'Pendapatan Bulanan',
      value: formatRupiah(monthlyIncome),
      icon: <Wallet size={16} className="text-emerald-500" />,
      iconBg: 'bg-emerald-50',
      badge: '+12%',
      badgeColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      title: 'Pengeluaran Bulanan',
      value: formatRupiah(monthlyExpense),
      icon: <ShoppingCart size={16} className="text-rose-500" />,
      iconBg: 'bg-rose-50',
      badge: '-4%',
      badgeColor: 'text-rose-500 bg-rose-50',
    },
  ];

  const menus = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
      path: '/dashboard',
    },
    {
      label: 'Transaksi',
      icon: <ReceiptText size={16} />,
      path: '/transactions',
    },
    {
      label: 'Target Tabungan',
      icon: <Target size={16} />,
      path: '/goals',
    },
    {
      label: 'Profil',
      icon: <User size={16} />,
      path: '/profile',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center">
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 px-10 py-10 text-center">
          <div className="w-12 h-12 border-[3px] border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[250px] min-h-screen bg-white border-r border-slate-200 px-5 py-6 flex-col">

  {/* Logo */}
  <div className="mb-8">
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Logo DanaDiri"
        className="w-11 h-11 object-contain rounded-xl"
      />

      <div>
        <h2 className="text-[20px] font-bold text-slate-800">DanaDiri</h2>
        <p className="text-[11px] text-slate-400">Manajemen Keuangan</p>
      </div>
    </div>
  </div>
        {/* Menu */}
        <nav className="space-y-2">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <button
                key={menu.label}
                onClick={() => navigate(menu.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {menu.icon}
                <span>{menu.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>

        <div className="flex-1" />

        {/* Saran */}
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Saran Keuangan
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Pengeluaran hiburan Anda naik 15% dari bulan lalu. Coba batasi minggu ini.
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
            <div>
              <h1 className="text-[28px] font-bold text-slate-800 leading-tight">
                Dashboard Keuangan
              </h1>
              <p className="text-[13px] text-slate-400 mt-1">
                Selamat datang kembali, Ringkasan aktivitas Anda hari ini.
              </p>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
                <Bell size={17} />
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[12px] font-semibold text-slate-700">
                    {user?.name || 'Budi Santoso'}
                  </p>
                  <p className="text-[10px] text-slate-400">Premium Member</p>
                </div>

                <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-semibold text-xs">
                  {(user?.name || 'Budi Santoso')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                    {item.icon}
                  </div>

                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <p className="text-[12px] text-slate-400 mb-1">{item.title}</p>
                <h3 className="text-[26px] font-bold text-slate-800 leading-none">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
                    {/* FINANCIAL INSIGHT */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-[0_8px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-800">
                  Status Keuangan Kamu
                </h2>
                <p className="text-[12px] text-slate-400 mt-1">
                  Analisis kondisi keuangan berdasarkan pemasukan dan pengeluaran bulan ini
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold w-fit ${statusColor}`}
              >
                <span>{statusIcon}</span>
                {financialStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[11px] text-slate-400 mb-1">Total Pemasukan</p>
                <h3 className="text-[22px] font-bold text-slate-800">
                  {formatRupiah(totalIncome)}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[11px] text-slate-400 mb-1">Total Pengeluaran</p>
                <h3 className="text-[22px] font-bold text-slate-800">
                  {formatRupiah(totalExpense)}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[11px] text-slate-400 mb-1">Tabungan Bulan Ini</p>
                <h3 className="text-[22px] font-bold text-slate-800">
                  {formatRupiah(saving)}
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-medium text-slate-600">
                  Persentase Pengeluaran
                </p>
                <p className="text-[12px] font-semibold text-slate-800">
                  {expensePercentage.toFixed(1)}%
                </p>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressColor} rounded-full transition-all duration-700`}
                  style={{ width: `${expenseBarWidth}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">
                  {statusIcon}
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-slate-800 mb-1">
                    Tabungan Kamu: {displaySavingPercentage.toFixed(1)}%
                  </p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {financialMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CHART + CATEGORY */}
          <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-6 mb-6">
            {/* Chart */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div>
    <h2 className="text-[16px] font-semibold text-slate-800">
      Pendapatan vs Pengeluaran
    </h2>
    <p className="text-[12px] text-slate-400 mt-1">
      Perbandingan arus keuangan selama 6 bulan terakhir
    </p>
  </div>

  <select className="text-[12px] border border-slate-200 rounded-xl px-4 py-2 text-slate-500 bg-slate-50 outline-none">
    <option>6 Bulan Terakhir</option>
  </select>
</div>

              <div className="h-[320px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Kategori */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
              <h2 className="text-[14px] font-semibold text-slate-800 mb-6">
                Pengeluaran per Kategori
              </h2>

              <div className="space-y-5">
                {Object.entries(categoryExpenseData).map(([category, amount]) => {
                  const percentage = totalCategoryExpense
                    ? (amount / totalCategoryExpense) * 100
                    : 0;

                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] text-slate-600">{category}</span>
                        <span className="text-[12px] font-semibold text-slate-800">
                          {formatRupiah(amount)}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  Total Pengeluaran Bulan Ini:{' '}
                  <span className="font-semibold text-slate-700">
                    {formatRupiah(totalCategoryExpense)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-6">
            {/* Transaksi */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
                <h2 className="text-[14px] font-semibold text-slate-800">
                  Transaksi Terbaru
                </h2>

                <button
                  onClick={() => navigate('/transactions')}
                  className="text-[12px] font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-4 font-semibold">Tanggal</th>
                      <th className="px-5 py-4 font-semibold">Kategori</th>
                      <th className="px-5 py-4 font-semibold">Jenis</th>
                      <th className="px-5 py-4 font-semibold">Jumlah (Rp)</th>
                      <th className="px-5 py-4 font-semibold text-right">Tindakan</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentTransactions.map((trx, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="px-5 py-5 text-[12px] text-slate-500 whitespace-pre-line">
                          {trx.date.replace(' ', '\n')}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm">
                              {trx.icon}
                            </div>
                            <span className="text-[13px] font-medium text-slate-700">
                              {trx.category}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`text-[10px] font-semibold px-3 py-1 rounded-full ${
                              trx.type === 'Pendapatan'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {trx.type}
                          </span>
                        </td>

                        <td
                          className={`px-5 py-5 text-[13px] font-semibold ${
                            trx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {trx.amount > 0
                            ? `+${formatRupiah(trx.amount).replace('Rp', 'Rp ')}`
                            : `-${formatRupiah(Math.abs(trx.amount)).replace('Rp', 'Rp ')}`}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <button className="text-slate-400 hover:text-slate-600 transition">
                            <MoreHorizontal size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[14px] font-semibold text-slate-800">
                  Target Tabungan
                </h2>

                <button className="text-blue-600 hover:text-blue-700 transition">
                  <PlusCircle size={17} />
                </button>
              </div>

              <div className="space-y-4">
                {savingGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${goal.bg} flex items-center justify-center`}>
                        {goal.icon}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[13px] font-semibold text-slate-800">
                          {goal.name}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Target: {formatRupiah(goal.target)}
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${goal.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${goal.percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>
                        {formatRupiah(goal.saved)} ({goal.percentage}%)
                      </span>
                      <span>Sisa {goal.remaining}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/goals')}
                className="w-full mt-5 py-3 rounded-2xl border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Kelola Semua Target
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;