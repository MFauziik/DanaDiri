import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionModal from '../components/TransactionModal';
import RecurringModal from '../components/RecurringModal';
import api from '../services/api';
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} from '../services/recurring';
import { formatRupiah } from '../utils/currency';
import CategoryIcon from '../components/CategoryIcon';
import { exportToPDF, exportToExcel } from '../utils/export';
import { FileText, FileSpreadsheet } from 'lucide-react';

const CATEGORY_OPTIONS = ['Makanan', 'Transportasi', 'Belanja', 'Hiburan', 'Kesehatan', 'Tagihan', 'Gaji', 'Investasi', 'Tabungan', 'Lainnya'];

const generateLast12Months = () => {
  const list = [];
  const d = new Date();
  for(let i=0; i<12; i++) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    list.push(`${yyyy}-${mm}`);
    d.setMonth(d.getMonth() - 1);
  }
  return list;
};
const MONTH_OPTIONS = generateLast12Months();
const Transactions = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [recurrings, setRecurrings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [summaryIncome, setSummaryIncome] = useState(0);
  const [summaryExpense, setSummaryExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // FILTER UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm, selectedMonth, selectedCategory, selectedType]);

  useEffect(() => {
    fetchRecurrings();
  }, []);

  const fetchRecurrings = async () => {
    try {
      const recurringsRes = await getRecurring();
      setRecurrings(Array.isArray(recurringsRes) ? recurringsRes : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedMonth) params.month = selectedMonth;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedType) params.type = selectedType;

      const { data } = await api.get('/transactions', { params });

      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      setTotalPages(data.pages || 1);
      setTotalTransactions(data.total || 0);
      setSummaryIncome(data.summaryIncome || 0);
      setSummaryExpense(data.summaryExpense || 0);
      
    } catch (error) {
      console.error('Gagal mengambil data:', error);
      setError(error.response?.data?.message || 'Gagal mengambil data');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      const { data } = await api.post('/transactions', formData);
      
      if (data.success === false) {
        alert(data.message);
        return;
      }

      await fetchTransactions();
        await fetchRecurrings();
      setShowForm(false);
    } catch (error) {
      console.error('Gagal menambah transaksi:', error);
      alert(error.response?.data?.message || 'Gagal menambah transaksi');
    }
  };

  const handleUpdateTransaction = async (formData) => {
    try {
      const { data } = await api.put(`/transactions/${editingTransaction._id}`, formData);
      
      if (data.success === false) {
        alert(data.message);
        return;
      }

      await fetchTransactions();
        await fetchRecurrings();
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
        await fetchTransactions();
        await fetchRecurrings();
      } catch (error) {
        console.error('Gagal menghapus transaksi:', error);
        alert('Gagal menghapus transaksi');
      }
    }
  };

  const handleAddRecurring = async (formData) => {
    try {
      await createRecurring(formData);
      await fetchTransactions();
        await fetchRecurrings();
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

  const handleUpdateRecurring = async (formData) => {
    try {
      await updateRecurring(editingRecurring._id, formData);
      await fetchTransactions();
        await fetchRecurrings();
      setEditingRecurring(null);
      alert('Transaksi berulang berhasil diupdate!');
    } catch (error) {
      console.error('Gagal mengupdate transaksi berulang:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate transaksi berulang');
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (window.confirm('Yakin ingin menghapus transaksi berulang ini?')) {
      try {
        await deleteRecurring(id);
        await fetchTransactions();
        await fetchRecurrings();
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

  const remainingBudget = summaryIncome - summaryExpense;

  const formatMonthLabel = (yyyyMM) => {
    const [year, month] = yyyyMM.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
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
const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrev = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handlePageClick = (page) => {
  setCurrentPage(page);
};
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
              <h1 className="text-3xl md:text-4xl font-bold text-[#1f2a44] leading-tight">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z" />
</svg>
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
                    <h3 className="text-2xl font-bold text-[#12b76a] mt-1">
                      {formatRupiah(summaryIncome)}
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
                    <h3 className="text-2xl font-bold text-[#ff4d6d] mt-1">
                      {formatRupiah(summaryExpense)}
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-6 9 6M4 10h16v10H4zM10 14h4" />
</svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b95a7] font-medium">
                      Sisa Anggaran
                    </p>
                    <h3 className="text-2xl font-bold text-[#2f6df6] mt-1">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#2f6df6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
</svg>
              <h2 className="text-lg font-bold text-[#1f2a44]">
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
                        <CategoryIcon category={item.category || item.description} size={20} className="text-blue-500" />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditingRecurring(item)}
                          className="text-[#2f6df6] hover:text-[#245ce0] transition text-sm font-semibold"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecurring(item._id)}
                          className="text-[#ff4d6d] hover:text-red-500 transition text-sm font-semibold"
                          title="Hapus"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>

                    <h3 className="text-[17px] font-semibold text-[#1f2a44] capitalize mb-3 line-clamp-1">
                      {item.description || item.category || 'Transaksi Berulang'}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          item.type === 'income'
                            ? 'bg-[#eaf8f0] text-[#12b76a]'
                            : 'bg-[#fff0f3] text-[#ff4d6d]'
                        }`}
                      >
                        {item.type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}
                      </span>

                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#f2f4f7] text-[#667085] capitalize">
                        {item.category || 'Umum'}
                      </span>

                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#eef4ff] text-[#2f6df6]">
                        Tgl {item.dayOfMonth || item.day || 1}
                      </span>
                    </div>

                    <p className="text-3xl font-bold text-[#1f2a44] tracking-tight">
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#98a2b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z" />
</svg>
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
                    {MONTH_OPTIONS.map((monthStr, index) => (
                      <option key={index} value={monthStr}>
                        {formatMonthLabel(monthStr)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-[#f7f8fc] border border-transparent focus:border-[#2f6df6] focus:bg-white outline-none text-sm text-[#344054] min-w-[150px]"
                  >
                    <option value="">Kategori</option>
                    {CATEGORY_OPTIONS.map((category, index) => (
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

                <div className="flex items-center gap-3">
                  <p className="text-sm text-[#98a2b3] whitespace-nowrap hidden sm:block">
                    Menampilkan {totalTransactions} transaksi
                  </p>
                  <button
                    onClick={() => exportToPDF(transactions)}
                    className="h-11 px-4 rounded-xl bg-[#fff0f3] hover:bg-[#ffe7ec] text-[#ff4d6d] font-semibold text-sm transition flex items-center gap-2 border border-[#ffe7ec]"
                    title="Ekspor ke PDF"
                  >
                    <FileText size={18} />
                    PDF
                  </button>
                  <button
                    onClick={() => exportToExcel(transactions)}
                    className="h-11 px-4 rounded-xl bg-[#eaf8f0] hover:bg-[#e9f7ef] text-[#12b76a] font-semibold text-sm transition flex items-center gap-2 border border-[#e9f7ef]"
                    title="Ekspor ke Excel"
                  >
                    <FileSpreadsheet size={18} />
                    Excel
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE */}
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                
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
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Jenis
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Jumlah
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#98a2b3]">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                   {transactions.map((transaction) => {
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
                                <CategoryIcon category={transaction.category} size={18} className="text-blue-500" />
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
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
                 <p className="text-sm text-[#98a2b3]">
  Halaman {currentPage} dari {totalPages}
</p>

                  <div className="flex items-center gap-2">
  {/* PREV */}
  <button
    onClick={handlePrev}
    disabled={currentPage === 1}
    className="w-9 h-9 rounded-xl border border-[#e4e7ec] text-[#667085] bg-white disabled:opacity-50"
  >
    ‹
  </button>

  {/* ANGKA OTOMATIS */}
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => handlePageClick(page)}
      className={`w-9 h-9 rounded-xl font-semibold ${
        currentPage === page
          ? 'bg-[#2f6df6] text-white'
          : 'border border-[#e4e7ec] text-[#667085] bg-white'
      }`}
    >
      {page}
    </button>
  ))}

  {/* NEXT */}
  <button
    onClick={handleNext}
    disabled={currentPage === totalPages}
    className="w-9 h-9 rounded-xl border border-[#e4e7ec] text-[#667085] bg-white disabled:opacity-50"
  >
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

      <RecurringModal
        initialData={editingRecurring || {}}
        isOpen={showRecurringForm || !!editingRecurring}
        onClose={() => {
          setShowRecurringForm(false);
          setEditingRecurring(null);
        }}
        onSubmit={
          editingRecurring
            ? handleUpdateRecurring
            : handleAddRecurring
        }
      />
    </div>
  );
};

export default Transactions;