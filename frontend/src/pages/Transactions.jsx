import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionModal from '../components/TransactionModal';
import RecurringModal from '../components/RecurringModal';
import api from '../services/api';
import {
  getRecurring,
  createRecurring,
  deleteRecurring,
} from '../services/recurring';
import { formatRupiah } from '../utils/currency';

const Transactions = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [recurrings, setRecurrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // FILTER UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsRes, recurringsRes] = await Promise.all([
        api.get('/transactions'),
        getRecurring(),
      ]);

      let transactionsData = [];
      if (Array.isArray(transactionsRes.data)) {
        transactionsData = transactionsRes.data;
      } else if (
        transactionsRes.data &&
        Array.isArray(transactionsRes.data.data)
      ) {
        transactionsData = transactionsRes.data.data;
      } else if (
        transactionsRes.data &&
        Array.isArray(transactionsRes.data.transactions)
      ) {
        transactionsData = transactionsRes.data.transactions;
      }

      setTransactions(transactionsData || []);
      setRecurrings(Array.isArray(recurringsRes) ? recurringsRes : []);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
      setError(error.response?.data?.message || 'Gagal mengambil data');
      setTransactions([]);
      setRecurrings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      await api.post('/transactions', formData);
      await fetchAllData();
      setShowForm(false);
    } catch (error) {
      console.error('Gagal menambah transaksi:', error);
      alert(error.response?.data?.message || 'Gagal menambah transaksi');
    }
  };

  const handleUpdateTransaction = async (formData) => {
    try {
      await api.put(`/transactions/${editingTransaction._id}`, formData);
      await fetchAllData();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Gagal mengupdate transaksi:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate transaksi');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      try {
        await api.delete(`/transactions/${id}`);
        await fetchAllData();
      } catch (error) {
        console.error('Gagal menghapus transaksi:', error);
        alert('Gagal menghapus transaksi');
      }
    }
  };

  const handleAddRecurring = async (formData) => {
    try {
      await createRecurring(formData);
      await fetchAllData();
      setShowRecurringForm(false);
      alert('Transaksi berulang berhasil ditambahkan!');
    } catch (error) {
      console.error('Gagal menambah transaksi berulang:', error);
      alert(
        error.response?.data?.message ||
          'Gagal menambah transaksi berulang'
      );
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (window.confirm('Yakin ingin menghapus transaksi berulang ini?')) {
      try {
        await deleteRecurring(id);
        await fetchAllData();
      } catch (error) {
        console.error('Gagal menghapus transaksi berulang:', error);
        alert('Gagal menghapus transaksi berulang');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { datePart, timePart };
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [transactions]);

  const remainingBudget = totalIncome - totalExpense;

  const uniqueCategories = [
    ...new Set(transactions.map((t) => t.category).filter(Boolean)),
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        !searchTerm ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const transactionDate = transaction.date
        ? new Date(transaction.date)
        : null;
      const transactionMonth = transactionDate
        ? `${transactionDate.getFullYear()}-${String(
            transactionDate.getMonth() + 1
          ).padStart(2, '0')}`
        : '';

      const matchesMonth =
        !selectedMonth || transactionMonth === selectedMonth;

      const matchesCategory =
        !selectedCategory || transaction.category === selectedCategory;

      const matchesType = !selectedType || transaction.type === selectedType;

      return (
        matchesSearch && matchesMonth && matchesCategory && matchesType
      );
    });
  }, [
    transactions,
    searchTerm,
    selectedMonth,
    selectedCategory,
    selectedType,
  ]);

  const getRecurringIcon = (category = '') => {
    const lower = category.toLowerCase();

    if (lower.includes('gaji')) return '💵';
    if (lower.includes('internet') || lower.includes('wifi')) return '📶';
    if (lower.includes('asuransi')) return '🛡️';
    if (lower.includes('listrik')) return '⚡';
    if (lower.includes('air')) return '💧';
    if (lower.includes('makan')) return '🍽️';
    if (lower.includes('transport')) return '🚗';
    return '💳';
  };

  const getCategoryIcon = (category = '') => {
    const lower = category.toLowerCase();

    if (lower.includes('makan')) return '🍽️';
    if (lower.includes('bonus')) return '🏠';
    if (lower.includes('service')) return '🚘';
    if (lower.includes('asuransi')) return '🛡️';
    if (lower.includes('gaji')) return '💵';
    return '📁';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex flex-col md:flex-row">
        <Sidebar user={user} setUser={setUser} />
        <main className="flex-1 p-6 md:p-8">
          <div className="bg-white border border-red-100 rounded-3xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-3xl">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">
              Gagal Memuat Data
            </h3>
            <p className="text-red-500 mb-5">{error}</p>
            <button
              onClick={fetchAllData}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col md:flex-row">
      <Sidebar user={user} setUser={setUser} />

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-[#1f2a44] leading-tight">
                Riwayat Transaksi
              </h1>
              <p className="text-[#8b95a7] text-sm mt-1">
                Pantau semua pemasukan dan pengeluaran Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowRecurringForm(true)}
                className="h-12 px-5 rounded-xl border border-[#2f6df6] text-[#2f6df6] bg-white hover:bg-blue-50 transition font-semibold text-sm shadow-sm flex items-center justify-center gap-2"
              >
                <span className="text-lg">📄</span>
                Tambah Transaksi Berulang
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="h-12 px-5 rounded-xl bg-[#2f6df6] hover:bg-[#245ce0] text-white transition font-semibold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span className="text-lg">＋</span>
                Tambah Transaksi
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#edf1f7]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#eaf8f0] flex items-center justify-center text-xl">
                    ↓
                  </div>
                  <div>
                    <p className="text-xs text-[#8b95a7] font-medium">
                      Total Pemasukan
                    </p>
                    <h3 className="text-[24px] font-bold text-[#12b76a] mt-1">
                      {formatRupiah(totalIncome)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-[4px] bg-[#e9f7ef] rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-[#12b76a] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#edf1f7]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#fff0f3] flex items-center justify-center text-xl">
                    ↑
                  </div>
                  <div>
                    <p className="text-xs text-[#8b95a7] font-medium">
                      Total Pengeluaran
                    </p>
                    <h3 className="text-[24px] font-bold text-[#ff4d6d] mt-1">
                      {formatRupiah(totalExpense)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-[4px] bg-[#ffe7ec] rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-[#ff4d6d] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#edf1f7]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#eef4ff] flex items-center justify-center text-xl">
                    🏦
                  </div>
                  <div>
                    <p className="text-xs text-[#8b95a7] font-medium">
                      Sisa Anggaran
                    </p>
                    <h3 className="text-[24px] font-bold text-[#2f6df6] mt-1">
                      {formatRupiah(remainingBudget)}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-[4px] bg-[#e8efff] rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-[#2f6df6] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* RECURRING SECTION */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#2f6df6] text-lg">✦</span>
              <h2 className="text-[18px] font-bold text-[#1f2a44]">
                Transaksi Berulang
              </h2>
            </div>

            {recurrings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#edf1f7] p-6 text-center text-[#8b95a7] shadow-sm">
                Belum ada transaksi berulang.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recurrings.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-[#f4f7ff] flex items-center justify-center text-xl">
                        {getRecurringIcon(item.category || item.description)}
                      </div>

                      <button
                        onClick={() => handleDeleteRecurring(item._id)}
                        className="text-[#b0b7c3] hover:text-red-500 transition text-lg"
                        title="Hapus"
                      >
                        ⋮
                      </button>
                    </div>

                    <h3 className="text-[17px] font-semibold text-[#1f2a44] capitalize mb-3 line-clamp-1">
                      {item.description || item.category || 'Transaksi Berulang'}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-5">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                          item.type === 'income'
                            ? 'bg-[#eaf8f0] text-[#12b76a]'
                            : 'bg-[#fff0f3] text-[#ff4d6d]'
                        }`}
                      >
                        {item.type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}
                      </span>

                      <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#f2f4f7] text-[#667085] capitalize">
                        {item.category || 'Umum'}
                      </span>

                      <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#eef4ff] text-[#2f6df6]">
                        Tgl {item.dayOfMonth || item.day || 1}
                      </span>
                    </div>

                    <p className="text-[28px] font-bold text-[#1f2a44] tracking-tight">
                      {formatRupiah(item.amount || 0)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TABLE + FILTER */}
          <div className="bg-white rounded-[24px] border border-[#edf1f7] shadow-sm overflow-hidden">
            {/* FILTER BAR */}
            <div className="p-4 md:p-5 border-b border-[#edf1f7]">
              <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <div className="relative w-full md:max-w-[260px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3] text-sm">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Cari transaksi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#f7f8fc] border border-transparent focus:border-[#2f6df6] focus:bg-white outline-none text-sm text-[#344054]"
                    />
                  </div>

                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-[#f7f8fc] border border-transparent focus:border-[#2f6df6] focus:bg-white outline-none text-sm text-[#344054] min-w-[170px]"
                  >
                    <option value="">Semua Tanggal</option>
                    <option value="2023-10">Oktober 2023</option>
                    <option value="2023-11">November 2023</option>
                    <option value="2023-12">Desember 2023</option>
                    <option value="2024-01">Januari 2024</option>
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-[#f7f8fc] border border-transparent focus:border-[#2f6df6] focus:bg-white outline-none text-sm text-[#344054] min-w-[150px]"
                  >
                    <option value="">Kategori</option>
                    {uniqueCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-[#f7f8fc] border border-transparent focus:border-[#2f6df6] focus:bg-white outline-none text-sm text-[#344054] min-w-[130px]"
                  >
                    <option value="">Jenis</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>

                <p className="text-sm text-[#98a2b3] whitespace-nowrap">
                  Menampilkan {filteredTransactions.length} transaksi
                </p>
              </div>
            </div>

            {/* TABLE */}
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-[#344054] mb-2">
                  Belum Ada Transaksi
                </h3>
                <p className="text-[#8b95a7] mb-5">
                  Mulai catat pemasukan dan pengeluaran Anda.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#2f6df6] hover:bg-[#245ce0] text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Tambah Transaksi Pertama
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Jenis
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Jumlah
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      const shortDate = formatShortDate(transaction.date);

                      return (
                        <tr
                          key={transaction._id}
                          className="border-t border-[#edf1f7] hover:bg-[#fafbff] transition"
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-[#1f2a44]">
                              {shortDate.datePart}
                            </div>
                            <div className="text-xs text-[#98a2b3] mt-1">
                              {shortDate.timePart} WIB
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#f4f7ff] flex items-center justify-center text-base">
                                {getCategoryIcon(transaction.category)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[#1f2a44]">
                                  {transaction.category || '-'}
                                </div>
                                <div className="text-xs text-[#98a2b3] mt-1">
                                  {transaction.description || '-'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
                                transaction.type === 'income'
                                  ? 'bg-[#eaf8f0] text-[#12b76a]'
                                  : 'bg-[#fff0f3] text-[#ff4d6d]'
                              }`}
                            >
                              <span className="text-[8px]">●</span>
                              {transaction.type === 'income'
                                ? 'Pemasukan'
                                : 'Pengeluaran'}
                            </span>
                          </td>

                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold">
                            <span
                              className={
                                transaction.type === 'income'
                                  ? 'text-[#12b76a]'
                                  : 'text-[#ff4d6d]'
                              }
                            >
                              {transaction.type === 'income' ? '+' : '-'}
                              {formatRupiah(transaction.amount || 0)}
                            </span>
                          </td>

                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingTransaction(transaction)}
                                className="text-[#2f6df6] hover:text-[#245ce0] text-sm font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTransaction(transaction._id)
                                }
                                className="text-[#ff4d6d] hover:text-red-600 text-sm font-semibold"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* PAGINATION VISUAL */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-[#edf1f7]">
                  <p className="text-sm text-[#98a2b3]">Halaman 1 dari 1</p>

                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-xl border border-[#e4e7ec] text-[#98a2b3] bg-white">
                      ‹
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-[#2f6df6] text-white font-semibold">
                      1
                    </button>
                    <button className="w-9 h-9 rounded-xl border border-[#e4e7ec] text-[#667085] bg-white">
                      2
                    </button>
                    <button className="w-9 h-9 rounded-xl border border-[#e4e7ec] text-[#667085] bg-white">
                      3
                    </button>
                    <button className="w-9 h-9 rounded-xl border border-[#e4e7ec] text-[#667085] bg-white">
                      ›
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TRANSACTION MODAL */}
      <TransactionModal
        initialData={editingTransaction || {}}
        isOpen={showForm || !!editingTransaction}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={
          editingTransaction
            ? handleUpdateTransaction
            : handleAddTransaction
        }
      />

      {/* RECURRING MODAL */}
      <RecurringModal
        isOpen={showRecurringForm}
        onClose={() => setShowRecurringForm(false)}
        onSubmit={handleAddRecurring}
      />
    </div>
  );
};

export default Transactions;