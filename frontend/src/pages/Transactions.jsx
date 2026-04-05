import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import Sidebar from '../components/Sidebar';
import RecurringList from '../components/RecurringList';
import TransactionModal from '../components/TransactionModal';
import RecurringModal from '../components/RecurringModal';
import { getRecurring, createRecurring, deleteRecurring } from '../services/recurring';
import { formatRupiah } from '../utils/currency';

const Transactions = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [recurrings, setRecurrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

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

      // Handle transactions response
      let transactionsData = [];
      if (Array.isArray(transactionsRes.data)) {
        transactionsData = transactionsRes.data;
      } else if (transactionsRes.data && Array.isArray(transactionsRes.data.data)) {
        transactionsData = transactionsRes.data.data;
      } else if (transactionsRes.data && Array.isArray(transactionsRes.data.transactions)) {
        transactionsData = transactionsRes.data.transactions;
      }
      setTransactions(transactionsData);

      // Handle recurrings response
      setRecurrings(recurringsRes);
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
      alert(error.response?.data?.message || 'Gagal menambah transaksi berulang');
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
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <Sidebar user={user} setUser={setUser} />
        <main className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar user={user} setUser={setUser} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Daftar Transaksi
              {transactions.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({transactions.length} transaksi)
                </span>
              )}
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Transaksi Baru
              </button>
              <button
                onClick={() => setShowRecurringForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {showRecurringForm ? 'Batal' : 'Transaksi Berulang'}
              </button>
            </div>
          </div>

          {/* Daftar Transaksi Berulang */}
          <RecurringList recurrings={recurrings} onDelete={handleDeleteRecurring} />


          {/* Daftar Transaksi */}
          {!Array.isArray(transactions) || transactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Transaksi
              </h3>
              <p className="text-gray-500 mb-4">
                Mulai catat pemasukan dan pengeluaran Anda!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Tambah Transaksi Pertama
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={
                              transaction.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {formatRupiah(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => setEditingTransaction(transaction)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        initialData={editingTransaction || {}}
        isOpen={showForm || !!editingTransaction}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
      />

      {/* Recurring Modal */}
      <RecurringModal
        isOpen={showRecurringForm}
        onClose={() => setShowRecurringForm(false)}
        onSubmit={handleAddRecurring}
      />
    </div>
  );
};

export default Transactions;

