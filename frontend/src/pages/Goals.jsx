import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGoalsSummary,
  createGoal,
  addFunds,
  deleteGoal,
  updateGoal,
} from '../services/goals';
import { logout } from '../services/auth';
import AddFundsModal from '../components/AddFundsModal';
import Sidebar from '../components/Sidebar';
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
  const [filter, setFilter] = useState('all');

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const [showTargetModal, setShowTargetModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Umum',
    notes: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoalsSummary();
      setGoals(data.goals || []);
      setSummary({
        activeGoals: data.activeGoals || 0,
        completedGoals: data.completedGoals || 0,
        totalTarget: data.totalTarget || 0,
        totalCurrent: data.totalCurrent || 0,
        totalProgress: data.totalProgress || 0,
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

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'Umum',
      notes: '',
    });
    setShowTargetModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name || '',
      targetAmount: goal.targetAmount || '',
      currentAmount: goal.currentAmount || '',
      deadline: goal.deadline
        ? new Date(goal.deadline).toISOString().split('T')[0]
        : '',
      category: goal.category || 'Umum',
      notes: goal.notes || '',
    });
    setShowTargetModal(true);
  };

  const closeTargetModal = () => {
    setShowTargetModal(false);
    setEditingGoal(null);
  };

  const handleCreateGoal = async () => {
    try {
      if (!formData.name || !formData.targetAmount || !formData.deadline) {
        alert('Nama target, jumlah target, dan tanggal target wajib diisi.');
        return;
      }

      setSubmitting(true);

      const payload = {
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount || 0),
        deadline: formData.deadline,
        category: formData.category || 'Umum',
        notes: formData.notes || '',
      };

      await createGoal(payload);
      await fetchGoals();
      closeTargetModal();
    } catch (error) {
      console.error('Gagal membuat goal:', error);
      alert('Gagal membuat target tabungan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateGoal = async () => {
    try {
      if (!editingGoal) return;

      setSubmitting(true);

      const payload = {
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount || 0),
        deadline: formData.deadline,
        category: formData.category || 'Umum',
        notes: formData.notes || '',
      };

      await updateGoal(editingGoal._id, payload);
      await fetchGoals();
      closeTargetModal();
    } catch (error) {
      console.error('Gagal mengupdate goal:', error);
      alert('Gagal mengupdate target tabungan');
    } finally {
      setSubmitting(false);
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

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const getMonthYear = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    });
  };

  const getMonthsLeft = (deadline) => {
    if (!deadline) return '-';
    const now = new Date();
    const target = new Date(deadline);
    const months =
      (target.getFullYear() - now.getFullYear()) * 12 +
      (target.getMonth() - now.getMonth());
    return months <= 0 ? '0 Bulan' : `${months} Bulan`;
  };

  const getRecommendedMonthly = (goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const now = new Date();
    const target = new Date(goal.deadline);

    const months =
      (target.getFullYear() - now.getFullYear()) * 12 +
      (target.getMonth() - now.getMonth());

    if (months <= 0) return remaining > 0 ? remaining : 0;
    return Math.ceil(remaining / months);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col md:flex-row">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#18233f] leading-tight">
              Target Tabungan
            </h1>
            <p className="text-sm text-[#7b879f] mt-1">
              Pantau kemajuan tabungan Anda untuk masa depan yang lebih baik.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 w-fit"
          >
            <span className="text-lg">⊕</span>
            Tambah Target Baru
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-[#e6ebf2] p-5 shadow-sm">
            <p className="text-sm text-[#7b879f] mb-2">Total Tabungan</p>
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#2563eb]">
              {formatRupiah(summary.totalCurrent)}
            </h3>
            <p className="text-xs text-[#9aa4b2] mt-2">Total Dana yang dikumpulkan</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6ebf2] p-5 shadow-sm">
            <p className="text-sm text-[#7b879f] mb-2">Sisa Target Keseluruhan</p>
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#18233f]">
              {formatRupiah(Math.max(summary.totalTarget - summary.totalCurrent, 0))}
            </h3>
            <p className="text-xs text-[#9aa4b2] mt-2">Dari total target yang dibutuhkan</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6ebf2] p-5 shadow-sm">
            <p className="text-sm text-[#7b879f] mb-2">Total Target</p>
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#18233f]">
              {goals.length}
            </h3>
            <p className="text-xs text-[#9aa4b2] mt-2">Jumlah target yang dibuat</p>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[#2563eb] text-lg">⚑</span>
          <h2 className="text-[24px] font-bold text-[#18233f]">Target Aktif</h2>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: `Semua (${goals.length})` },
            { key: 'active', label: `Aktif (${summary.activeGoals})` },
            { key: 'completed', label: `Selesai (${summary.completedGoals})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-[#2563eb] text-white shadow-md'
                  : 'bg-white text-[#445067] border border-[#e7ebf2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Goals */}
        {filteredGoals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e6ebf2] p-12 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-[#18233f] mb-3">Belum Ada Target</h3>
            <p className="text-[#7b879f] mb-6">
              {filter === 'all'
                ? 'Mulai buat target tabungan pertama Anda.'
                : filter === 'active'
                ? 'Tidak ada target aktif saat ini.'
                : 'Belum ada target yang selesai.'}
            </p>
            <button
              onClick={openCreateModal}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-semibold"
            >
              Tambah Target Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start">
            {filteredGoals.map((goal) => {
              const progress = Math.min(
                ((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100,
                100
              );

              return (
                <div
                  key={goal._id}
                  className="bg-white rounded-[24px] border border-[#dce6f2] shadow-sm px-4 py-4 w-full max-w-[320px]"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-extrabold tracking-[1.8px] text-[#2563eb] uppercase mb-1">
                        DANADIRI
                      </p>
                      <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1f2937] leading-snug">
                        {goal.name}
                      </h3>
                    </div>

                    <button
  onClick={() => openEditModal(goal)}
  className="w-10 h-10 rounded-[14px] bg-[#eef5ff] text-[#2563eb] flex items-center justify-center hover:bg-[#e2eeff] transition"
  title="Edit target"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v18M5 4h10l-2 4 2 4H5"
    />
  </svg>
</button>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <div className="flex items-end flex-wrap gap-1">
                      <span className="text-[18px] sm:text-[20px] font-extrabold text-[#18233f]">
                        {formatRupiah(goal.currentAmount || 0)}
                      </span>
                      <span className="text-[11px] text-[#9aa4b2] mb-[2px]">
                        dari {formatRupiah(goal.targetAmount || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-[#2563eb]">
                        Progress
                      </span>
                      <span className="text-[11px] font-bold text-[#2563eb]">
                        {progress.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full h-[8px] bg-[#dbeafe] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-[#f5f7fb] rounded-[14px] py-3 px-2 text-center">
                      <p className="text-[9px] font-extrabold tracking-wide text-[#7b879f] uppercase">
                        Setoran
                      </p>
                      <p className="text-[12px] sm:text-[13px] font-bold text-[#1f2937] mt-1">
                        {formatRupiah(getRecommendedMonthly(goal))}
                      </p>
                    </div>

                    <div className="bg-[#f5f7fb] rounded-[14px] py-3 px-2 text-center">
                      <p className="text-[9px] font-extrabold tracking-wide text-[#7b879f] uppercase">
                        Target
                      </p>
                      <p className="text-[12px] sm:text-[13px] font-bold text-[#1f2937] mt-1">
                        {getMonthYear(goal.deadline)}
                      </p>
                    </div>

                    <div className="bg-[#f5f7fb] rounded-[14px] py-3 px-2 text-center">
                      <p className="text-[9px] font-extrabold tracking-wide text-[#7b879f] uppercase">
                        Sisa
                      </p>
                      <p className="text-[12px] sm:text-[13px] font-bold text-[#1f2937] mt-1">
                        {getMonthsLeft(goal.deadline)}
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowAddFunds(true);
                      }}
                      className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3.5 rounded-[14px] font-semibold shadow-md transition"
                    >
                      ＋ Tambah Progress
                    </button>

                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="px-4 bg-[#f3f6fb] hover:bg-[#e8eef8] text-[#5c6b82] rounded-[14px] font-semibold transition"
                    >
                      Hapus
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-[10px] text-[#7ea3d7]">
                    Update terakhir: Hari ini,{' '}
                    {new Date().toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WIB
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL TAMBAH / EDIT TARGET */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[3px] flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-[430px] bg-white rounded-[26px] shadow-[0_20px_60px_rgba(15,23,42,0.18)] px-6 py-6 md:px-7 md:py-7 relative animate-[fadeIn_.2s_ease] max-h-[92vh] overflow-y-auto">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#eef4ff] flex items-center justify-center text-[#2563eb] text-lg shadow-sm">
                ◎
              </div>
            </div>

            {/* Title */}
            <h2 className="text-[28px] md:text-[30px] font-extrabold text-[#18233f] text-center leading-tight">
              {editingGoal ? 'Edit Target' : 'Buat Target Baru'}
            </h2>
            <p className="text-center text-[#6f7b91] text-sm mt-2 mb-5">
              Mulai langkah kecil untuk impian besar Anda hari ini.
            </p>

            {/* Form */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-[14px] font-bold text-[#18233f] mb-2">
                  Nama Target
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Beli Laptop Baru"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full h-[52px] rounded-[14px] border border-[#dfe6ef] bg-[#f5f7fb] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[14px] font-bold text-[#18233f] mb-2">
                    Jumlah Target
                  </label>
                  <div className="flex items-center h-[52px] rounded-[14px] border border-[#dfe6ef] bg-[#f5f7fb] px-4">
                    <span className="text-[#18233f] mr-3 font-medium">Rp</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAmount: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none text-[15px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#18233f] mb-2">
                    Jumlah Awal
                  </label>
                  <div className="flex items-center h-[52px] rounded-[14px] border border-[#dfe6ef] bg-[#f5f7fb] px-4">
                    <span className="text-[#18233f] mr-3 font-medium">Rp</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.currentAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentAmount: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none text-[15px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#18233f] mb-2">
                  Tanggal Target
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full h-[52px] rounded-[14px] border border-[#dfe6ef] bg-[#f5f7fb] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#18233f] mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Liburan"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-[52px] rounded-[14px] border border-[#dfe6ef] bg-[#f5f7fb] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div className="bg-[#f4f7fc] border border-[#e3eaf4] rounded-[16px] p-4 mt-1">
                <p className="text-sm font-bold text-[#2563eb] mb-1">
                  💡 Tips Tabungan
                </p>
                <p className="text-sm text-[#5f6b82] leading-relaxed">
                  Sistem akan menghitung otomatis berapa jumlah yang harus
                  disisihkan setiap bulannya berdasarkan tanggal target yang Anda
                  tentukan.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}
                  disabled={submitting}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white h-[52px] rounded-[14px] font-bold shadow-md transition"
                >
                  {submitting
                    ? 'Menyimpan...'
                    : editingGoal
                    ? 'Simpan Perubahan'
                    : 'Buat Target Sekarang'}
                </button>

                <button
                  onClick={closeTargetModal}
                  className="w-full bg-[#f1f4f8] hover:bg-[#e6ebf2] text-[#445067] h-[52px] rounded-[14px] font-bold transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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