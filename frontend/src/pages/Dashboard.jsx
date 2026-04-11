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
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  MoreHorizontal,
  PlusCircle,
  Target, // Added Target back
  Car,
  Plane,
} from 'lucide-react';

import api from '../services/api';
import { formatRupiah } from '../utils/currency';
import Sidebar from '../components/Sidebar';
import CategoryIcon from '../components/CategoryIcon';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryExpense: {},
    chartData: [], // Nama diubah dari monthlyData agar lebih generic
  });
  const [chartPeriod, setChartPeriod] = useState('6months');
  const [insight, setInsight] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    budget: 0,
    status: 'AMAN',
    message: 'Memuat data insight...',
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(chartPeriod);
  }, [chartPeriod]);

  const fetchData = async (period = '6months') => {
    try {
      const [summaryRes, transactionsRes, goalsRes, insightRes] = await Promise.all([
        api.get(`/transactions/summary?period=${period}`),
        api.get('/transactions?limit=5'),
        api.get('/goals/summary'),
        api.get('/insights'),
      ]);

      setSummary({
        totalIncome: summaryRes?.data?.totalIncome || 0,
        totalExpense: summaryRes?.data?.totalExpense || 0,
        balance: summaryRes?.data?.balance || 0,
        categoryExpense: summaryRes?.data?.categoryExpense || {},
        chartData: summaryRes?.data?.chartData || [],
      });

      setInsight({
        income: insightRes?.data?.income || 0,
        expense: insightRes?.data?.expense || 0,
        balance: insightRes?.data?.balance || 0,
        budget: insightRes?.data?.budget || 0,
        status: insightRes?.data?.status || 'AMAN',
        message: insightRes?.data?.message || 'Data belum tersedia',
      });

      setRecentTransactions(transactionsRes?.data?.transactions || []);
      setSavingGoals(goalsRes?.data?.goals || []);

    } catch (error) {
      console.error('Gagal mengambil data:', error);

      // fallback biar dashboard tetap muncul walau API error
      setSummary({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryExpense: {},
        chartData: [],
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
  const todayIncome = 0; 
  const todayExpense = 0;
  const monthlyIncome = summary.totalIncome;
  const monthlyExpense = summary.totalExpense;

  const categoryExpenseData = summary.categoryExpense || {};

  const totalCategoryExpense = Object.values(categoryExpenseData).reduce(
    (acc, curr) => acc + curr,
    0
  );

  const chartData = {
    labels: summary.chartData.length > 0 
      ? summary.chartData.map(d => d.label) 
      : ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN'],
    datasets: [
      {
        label: 'Pendapatan',
        data: summary.chartData.length > 0 
          ? summary.chartData.map(d => d.income) 
          : [0, 0, 0, 0, 0, 0],
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
        data: summary.chartData.length > 0 
          ? summary.chartData.map(d => d.expense) 
          : [0, 0, 0, 0, 0, 0],
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
  // Goals removed dummy, using state savingGoals
// =========================
// FINANCIAL INSIGHT LOGIC
// =========================
// =========================
// FINANCIAL INSIGHT LOGIC (Backend Driven)
// =========================
const totalIncomeInsight = insight.income;
const totalExpenseInsight = insight.expense;
const savingInsight = insight.balance;

// Hitung persentase berdasarkan budget jika tersedia, fallback ke pendapatan
const divisor = insight.budget > 0 ? insight.budget : (totalIncomeInsight > 0 ? totalIncomeInsight : 1);
const expensePercentage = (totalExpenseInsight / divisor) * 100;
const savingPercentage = totalIncomeInsight > 0 ? (savingInsight / totalIncomeInsight) * 100 : 0;

const expenseBarWidth = Math.min(expensePercentage, 100);
const displaySavingPercentage = Math.max(savingPercentage, 0);

let statusColor = 'bg-emerald-100 text-emerald-700';
let progressColor = 'bg-emerald-500';
let statusIcon = '🟢';

if (insight.status === 'Bahaya') {
  statusColor = 'bg-rose-100 text-rose-700';
  progressColor = 'bg-rose-500';
  statusIcon = '🔴';
} else if (insight.status === 'Waspada' || insight.status === 'WARNING') {
  statusColor = 'bg-amber-100 text-amber-700';
  progressColor = 'bg-amber-500';
  statusIcon = '🟡';
} else if (insight.status === 'Sehat') {
  statusColor = 'bg-blue-100 text-blue-700';
  progressColor = 'bg-blue-500';
  statusIcon = '🔵';
} else if (insight.status === 'Sangat Sehat' || insight.status === 'AMAN') {
  statusColor = 'bg-emerald-100 text-emerald-700';
  progressColor = 'bg-emerald-500';
  statusIcon = '🟢';
} else if (insight.status === 'Cukup') {
  statusColor = 'bg-slate-100 text-slate-700';
  progressColor = 'bg-slate-500';
  statusIcon = '⚪';
}
  const stats = [
    {
      title: 'Total Saldo Anda',
      value: formatRupiah(summary.balance),
      icon: <Wallet size={16} className="text-blue-600" />,
      iconBg: 'bg-blue-50',
      badge: 'Aktif',
      badgeColor: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pendapatan Bulanan',
      value: formatRupiah(monthlyIncome),
      icon: <TrendingUp size={16} className="text-emerald-500" />,
      iconBg: 'bg-emerald-50',
    },
    {
      title: 'Pengeluaran Bulanan',
      value: formatRupiah(monthlyExpense),
      icon: <ShoppingCart size={16} className="text-rose-500" />,
      iconBg: 'bg-rose-50',
    },
  ];

  // menus removed, using Sidebar component

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar user={user} setUser={setUser} />

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                Dashboard Keuangan
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Selamat datang kembali, Ringkasan aktivitas Anda hari ini.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-700">
                    {user?.name || 'User'}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs overflow-hidden border border-slate-200">
                  {user?.profilePicture ? (
                    <img 
                      src={`${API_BASE_URL}${user.profilePicture}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    (user?.name || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                    {item.icon}
                  </div>

                  {item.badge && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-1">{item.title}</p>
                <h3 className="text-3xl font-bold text-slate-800 leading-none">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>
                    {/* FINANCIAL INSIGHT */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-[0_8px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Status Keuangan Kamu
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Analisis kondisi keuangan berdasarkan pemasukan dan pengeluaran bulan ini
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold w-fit ${statusColor}`}
              >
                <span>{statusIcon}</span>
                {insight.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Total Pemasukan</p>
                <h3 className="text-xl font-bold text-slate-800">
                  {formatRupiah(totalIncomeInsight)}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Total Pengeluaran</p>
                <h3 className="text-xl font-bold text-slate-800">
                  {formatRupiah(totalExpenseInsight)}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Tabungan Bulan Ini</p>
                <h3 className="text-xl font-bold text-slate-800">
                  {formatRupiah(savingInsight)}
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  Persentase Pengeluaran
                </p>
                <p className="text-xs font-semibold text-slate-800">
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
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Analisis Keuangan
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {insight.message}
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
    <h2 className="text-base font-semibold text-slate-800">
      Arus Keuangan
    </h2>
    <p className="text-xs text-slate-400 mt-1">
      {chartPeriod === 'week' ? 'Breakdown harian 7 hari terakhir' : 
       chartPeriod === 'month' ? 'Breakdown harian 30 hari terakhir' : 
       chartPeriod === 'year' ? 'Tren bulanan tahun ini' : 
       'Tren bulanan 6 bulan terakhir'}
    </p>
  </div>

  <select 
    value={chartPeriod}
    onChange={(e) => setChartPeriod(e.target.value)}
    className="text-xs border border-slate-200 rounded-xl px-4 py-2 text-slate-500 bg-slate-50 outline-none cursor-pointer hover:bg-slate-100 transition"
  >
    <option value="week">Minggu Ini</option>
    <option value="month">Bulan Ini</option>
    <option value="6months">6 Bulan Terakhir</option>
    <option value="year">Tahun Ini</option>
  </select>
</div>

              <div className="h-[320px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Kategori */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
              <h2 className="text-sm font-semibold text-slate-800 mb-6">
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
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={category} className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs text-slate-600">{category}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800">
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
                <p className="text-xs text-slate-400">
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
                <h2 className="text-sm font-semibold text-slate-800">
                  Transaksi Terbaru
                </h2>

                <button
                  onClick={() => navigate('/transactions')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-4 font-bold">Tanggal</th>
                      <th className="px-6 py-4 font-bold">Kategori</th>
                      <th className="px-6 py-4 font-bold">Jenis</th>
                      <th className="px-6 py-4 font-bold text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {recentTransactions.map((trx, index) => (
                      <tr
                        key={trx._id || index}
                        className="group hover:bg-slate-50/80 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-600">
                            {new Date(trx.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                              <CategoryIcon category={trx.category} className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                              {trx.category}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight ${
                              trx.type === 'income'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>

                        <td
                          className={`px-6 py-4 text-sm font-bold text-right ${
                            trx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {trx.type === 'income'
                            ? `+ ${formatRupiah(trx.amount).replace('Rp', 'Rp')}`
                            : `- ${formatRupiah(Math.abs(trx.amount)).replace('Rp', 'Rp')}`}
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
                <h2 className="text-sm font-semibold text-slate-800">
                  Target Tabungan
                </h2>

                <button className="text-blue-600 hover:text-blue-700 transition">
                  <PlusCircle size={17} />
                </button>
              </div>

              <div className="space-y-4">
                {savingGoals.map((goal, index) => {
                  const percentage = goal.targetAmount > 0 
                    ? Math.round((goal.currentAmount / goal.targetAmount) * 100) 
                    : 0;
                  
                  return (
                    <div
                      key={goal._id || index}
                      className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center`}>
                          <CategoryIcon category={goal.category} className="text-blue-600" size={18} />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-800">
                            {goal.name}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Target: {formatRupiah(goal.targetAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500">
                          Progress
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {percentage}%
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

              <button
                onClick={() => navigate('/goals')}
                className="w-full mt-5 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
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