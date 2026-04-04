import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { formatRupiah } from '../utils/currency';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  
  // State untuk data transaksi
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryExpense: {},
  });
  
  // State untuk budget
  const [budgetData, setBudgetData] = useState({
    budget: 0,
    spent: 0,
    remaining: 0,
  });
  
  // State untuk insights
  const [insights, setInsights] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    budget: 0,
    status: 'AMAN',
    message: '',
  });
  
  const [budgetAmount, setBudgetAmount] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingBudget, setSavingBudget] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    setLoading(true);
    
    // Ambil data transaksi summary
    const response = await api.get('/transactions/summary');
    setSummary(response.data);
    
    // Ambil data budget
    try {
      const budgetRes = await api.get('/budget');
      setBudgetData(budgetRes.data);
      if (budgetRes.data.budget > 0) {
        setBudgetAmount(budgetRes.data.budget.toString());
      }
    } catch (error) {
      console.error('Gagal mengambil budget:', error);
      console.error('Error detail:', error.response?.status, error.response?.data);
      // Jika endpoint belum ada, tampilkan pesan default
      setBudgetData({ budget: 0, spent: 0, remaining: 0 });
    }
    
    // Ambil data insights
    try {
      const insightsRes = await api.get('/insights');
      console.log('Insights response:', insightsRes.data); // Debug
      setInsights(insightsRes.data);
    } catch (error) {
      console.error('Gagal mengambil insights:', error);
      console.error('Error detail:', error.response?.status, error.response?.data);
      // Jika endpoint belum ada, tampilkan pesan default
      setInsights({
        income: summary.totalIncome || 0,
        expense: summary.totalExpense || 0,
        balance: summary.balance || 0,
        budget: 0,
        status: 'AMAN',
        message: 'Belum ada data wawasan. Tambahkan transaksi untuk melihat wawasan.',
      });
    }
    
  } catch (error) {
    console.error('Gagal mengambil data transaksi:', error);
  } finally {
    setLoading(false);
  }
};

  // Handle simpan budget
  const handleSetBudget = async (e) => {
    e.preventDefault();
    const amount = parseFloat(budgetAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Masukkan jumlah budget yang valid');
      return;
    }

    try {
      setSavingBudget(true);
      await api.post('/budget', { amount });
      await fetchData();
      setShowBudgetForm(false);
      alert('Budget berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan budget:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan budget');
    } finally {
      setSavingBudget(false);
    }
  };

  // Data untuk pie chart
  const pieData = {
    labels: Object.keys(summary.categoryExpense),
    datasets: [
      {
        label: 'Pengeluaran per Kategori',
        data: Object.values(summary.categoryExpense),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#E7E9ED', '#76A346', '#C45850',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Pengeluaran per Kategori' },
    },
  };

  // Hitung progress budget
  const budgetProgress = budgetData.budget > 0 
    ? (budgetData.spent / budgetData.budget) * 100 
    : 0;

  const getBudgetProgressColor = () => {
    if (budgetProgress >= 100) return 'bg-red-500';
    if (budgetProgress >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = () => {
    switch (insights.status) {
      case 'AMAN': return 'text-green-600 bg-green-50 border-green-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'OVER': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar user={user} setUser={setUser} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Keuangan</h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* 3 Kartu Ringkasan Utama */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {formatRupiah(summary.totalIncome)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {formatRupiah(summary.totalExpense)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase">Saldo</p>
                  <p className={`text-2xl font-bold mt-2 ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatRupiah(summary.balance)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Budget Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">💰 Anggaran Bulanan</h2>
                {!showBudgetForm && (
                  <button
                    onClick={() => setShowBudgetForm(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {budgetData.budget > 0 ? 'Ubah' : 'Atur Anggaran'}
                  </button>
                )}
              </div>

              {showBudgetForm ? (
                <form onSubmit={handleSetBudget} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Jumlah Anggaran (Rp)
                    </label>
                    <input
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan jumlah anggaran"
                      min="0"
                      step="1000"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={savingBudget}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingBudget ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBudgetForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {budgetData.budget > 0 ? (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600">Anggaran</p>
                          <p className="text-lg font-bold text-blue-600">{formatRupiah(budgetData.budget)}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600">Pengeluaran</p>
                          <p className="text-lg font-bold text-red-600">{formatRupiah(budgetData.spent)}</p>
                        </div>
                        <div className={`rounded-lg p-3 text-center ${budgetData.remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className="text-xs text-gray-600">Sisa</p>
                          <p className={`text-lg font-bold ${budgetData.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatRupiah(budgetData.remaining)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Penggunaan</span>
                          <span className="font-semibold">{budgetProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getBudgetProgressColor()}`}
                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {budgetProgress >= 80 && (
                        <p className={`text-sm mt-2 ${budgetProgress >= 100 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {budgetProgress >= 100 
                            ? '⚠️ Anggaran telah terlampaui! Periksa kembali pengeluaran Anda.' 
                            : `⚠️ Perhatian! Sudah mencapai ${budgetProgress.toFixed(1)}% dari anggaran`}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Belum ada anggaran untuk bulan ini. Klik "Atur Anggaran" untuk mulai.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Insights Section */}
            <div className={`rounded-xl shadow-md p-6 border ${getStatusColor()}`}>
              <h2 className="text-xl font-bold mb-4">📊 Wawasan Keuangan</h2>
              
              <div className="flex items-start space-x-4 mb-4">
                {insights.status === 'AMAN' && (
                  <svg className="w-12 h-12 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
                {insights.status === 'WARNING' && (
                  <svg className="w-12 h-12 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
                {insights.status === 'OVER' && (
                  <svg className="w-12 h-12 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
                <div>
                  <p className="font-medium">{insights.message}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Pemasukan</p>
                  <p className="font-semibold text-green-600">{formatRupiah(insights.income)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pengeluaran</p>
                  <p className="font-semibold text-red-600">{formatRupiah(insights.expense)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Saldo</p>
                  <p className={`font-semibold ${insights.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatRupiah(insights.balance)}
                  </p>
                </div>
              </div>
              
              {insights.budget > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>Anggaran Bulan Ini</span>
                    <span className="font-semibold">{formatRupiah(insights.budget)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grafik Pie */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analisis Pengeluaran</h2>
            {Object.keys(summary.categoryExpense).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="max-w-md mx-auto">
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Rincian per Kategori</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {Object.entries(summary.categoryExpense).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="font-semibold text-gray-900">{formatRupiah(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p className="text-gray-500 text-lg">Belum ada data pengeluaran</p>
                <p className="text-gray-400 mt-2">Mulai catat transaksi pengeluaran Anda!</p>
                <button
                  onClick={() => navigate('/transactions')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Tambah Transaksi
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;