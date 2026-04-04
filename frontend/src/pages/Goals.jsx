import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoalsSummary, createGoal, addFunds, deleteGoal, updateGoal } from '../services/goals';
import { logout } from '../services/auth';
import GoalForm from '../components/GoalForm';
import AddFundsModal from '../components/AddFundsModal';
import Sidebar from '../components/Sidebar';
import { GOAL_STATUS } from '../utils/constants';
import { formatRupiah } from '../utils/currency';

const Goals = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({
    activeGoals: 0,
    completedGoals: 0,
    totalTarget: 0,
    totalCurrent: 0,
    totalProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoalsSummary();
      setGoals(data.goals);
      setSummary({
        activeGoals: data.activeGoals,
        completedGoals: data.completedGoals,
        totalTarget: data.totalTarget,
        totalCurrent: data.totalCurrent,
        totalProgress: data.totalProgress,
      });
    } catch (error) {
      console.error('Gagal mengambil goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      await fetchGoals();
      setShowAddForm(false);
    } catch (error) {
      console.error('Gagal membuat goal:', error);
      alert('Gagal membuat target tabungan');
    }
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      await updateGoal(editingGoal._id, goalData);
      await fetchGoals();
      setEditingGoal(null);
    } catch (error) {
      console.error('Gagal mengupdate goal:', error);
      alert('Gagal mengupdate target tabungan');
    }
  };

  const handleAddFunds = async (amount) => {
    try {
      await addFunds(selectedGoal._id, amount);
      await fetchGoals();
      setShowAddFunds(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Gagal menambah dana:', error);
      alert('Gagal menambah dana');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Yakin ingin menghapus target ini?')) {
      try {
        await deleteGoal(goalId);
        await fetchGoals();
      } catch (error) {
        console.error('Gagal menghapus goal:', error);
        alert('Gagal menghapus target');
      }
    }
  };

  const handleMarkAsComplete = async (goal) => {
    if (window.confirm(`Tandai target "${goal.name}" sebagai selesai?`)) {
      try {
        await updateGoal(goal._id, { status: 'completed' });
        await fetchGoals();
      } catch (error) {
        console.error('Gagal mengupdate status:', error);
        alert('Gagal mengupdate status target');
      }
    }
  };

  const handleReactivateGoal = async (goal) => {
    try {
      await updateGoal(goal._id, { status: 'active' });
      await fetchGoals();
    } catch (error) {
      console.error('Gagal mengaktifkan kembali:', error);
      alert('Gagal mengaktifkan kembali target');
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const calculateDaysLeft = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

      {/* Konten Utama */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Target Tabungan</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Target Baru
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 uppercase">Target Aktif</p>
            <p className="text-3xl font-bold text-blue-600">{summary.activeGoals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 uppercase">Target Selesai</p>
            <p className="text-3xl font-bold text-green-600">{summary.completedGoals}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 uppercase">Total Target</p>
            <p className="text-2xl font-bold text-purple-600">{formatRupiah(summary.totalTarget)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 uppercase">Terkumpul</p>
            <p className="text-2xl font-bold text-yellow-600">{formatRupiah(summary.totalCurrent)}</p>
          </div>
        </div>

        {/* Progress Keseluruhan */}
        {summary.totalTarget > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">Progress Keseluruhan</h2>
              <span className="text-lg font-bold text-blue-600">{summary.totalProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(summary.totalProgress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{formatRupiah(summary.totalCurrent)}</span>
              <span>{formatRupiah(summary.totalTarget)}</span>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua ({goals.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Aktif ({summary.activeGoals})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Selesai ({summary.completedGoals})
          </button>
        </div>

        {/* Form Tambah/Edit Goal */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah Target Baru</h2>
            <GoalForm
              onSubmit={handleCreateGoal}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {editingGoal && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Target</h2>
            <GoalForm
              initialData={editingGoal}
              onSubmit={handleUpdateGoal}
              onCancel={() => setEditingGoal(null)}
            />
          </div>
        )}

        {/* Daftar Goals */}
        {filteredGoals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Target</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Mulai buat target tabungan pertama Anda!' 
                : filter === 'active' 
                  ? 'Tidak ada target aktif saat ini' 
                  : 'Belum ada target yang selesai'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Lihat semua target
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysLeft = calculateDaysLeft(goal.deadline);
              const isOverdue = daysLeft < 0 && goal.status === 'active';
              
              return (
                <div key={goal._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  {/* Header Goal */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          goal.status === 'active' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {GOAL_STATUS[goal.status]}
                        </span>
                        <span className="text-sm text-gray-600">
                          Kategori: {goal.category}
                        </span>
                        {goal.status === 'active' && (
                          <span className={`text-sm font-medium ${
                            isOverdue ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {isOverdue 
                              ? `⏰ Terlambat ${Math.abs(daysLeft)} hari` 
                              : `⏱️ ${daysLeft} hari lagi`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {goal.status === 'active' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedGoal(goal);
                              setShowAddFunds(true);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Tambah Dana
                          </button>
                          <button
                            onClick={() => setEditingGoal(goal)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleMarkAsComplete(goal)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            disabled={goal.currentAmount < goal.targetAmount}
                            title={goal.currentAmount < goal.targetAmount ? 'Target belum tercapai' : ''}
                          >
                            Selesai
                          </button>
                        </>
                      )}
                      {goal.status === 'completed' && (
                        <button
                          onClick={() => handleReactivateGoal(goal)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Aktifkan Kembali
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Progress</span>
                      <span className="font-semibold text-gray-900">
                        {formatRupiah(goal.currentAmount)} / {formatRupiah(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          goal.status === 'completed' || progress >= 100
                            ? 'bg-green-500' 
                            : progress > 75 
                              ? 'bg-yellow-500' 
                              : progress > 50
                                ? 'bg-blue-500'
                                : 'bg-blue-400'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-500">Target Waktu</p>
                      <p className="font-medium">
                        {new Date(goal.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Persentase</p>
                      <p className="font-medium">{progress.toFixed(1)}%</p>
                    </div>
                    {goal.status === 'active' && (
                      <>
                        <div>
                          <p className="text-gray-500">Sisa Target</p>
                          <p className="font-medium text-orange-600">{formatRupiah(remaining)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Rata-rata per hari</p>
                          <p className="font-medium">
                            {daysLeft > 0 
                              ? formatRupiah(Math.ceil(remaining / daysLeft))
                              : '-'
                            }
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Notes */}
                  {goal.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">📝 Catatan:</span> {goal.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Tambah Dana */}
      {showAddFunds && selectedGoal && (
        <AddFundsModal
          goal={selectedGoal}
          onClose={() => {
            setShowAddFunds(false);
            setSelectedGoal(null);
          }}
          onSubmit={handleAddFunds}
        />
      )}
    </div>
  );
};

export default Goals;