import { useState } from 'react';
import { formatNumber, parseRupiah, formatRupiah } from '../utils/currency';
import { Plus, X, Sparkles } from 'lucide-react';

const AddFundsModal = ({ goal, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    setDisplayAmount(formatNumber(parseRupiah(rawValue)));
    setAmount(parseRupiah(rawValue));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = amount;
    if (!amount || numAmount <= 0) {
      setError('Masukkan jumlah yang valid');
      return;
    }
    if (goal.currentAmount + numAmount > goal.targetAmount) {
      if (!window.confirm(`Jumlah melebihi target sebesar Rp ${(goal.currentAmount + numAmount - goal.targetAmount).toLocaleString()}. Lanjutkan?`)) {
        return;
      }
    }
    onSubmit(numAmount);
  };

  const remaining = goal.targetAmount - goal.currentAmount;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center px-4">
      <div className="w-full max-w-[500px] bg-white rounded-[24px] shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease]">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1e293b]">
            Tambah Dana ke Target {goal.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">Progress saat ini:</span>
              <span className="text-sm font-bold text-[#1e293b]">
                {formatRupiah(goal.currentAmount)} / {formatRupiah(goal.targetAmount)}
              </span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-[10px] mb-3">
              <div 
                className="bg-[#2563eb] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-400">{Math.round(progress)}% Tercapai</span>
              <span className="text-[#2563eb]">Sisa: {formatRupiah(remaining > 0 ? remaining : 0)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1e293b] mb-3">
                Jumlah yang Ditambahkan (Rp)
              </label>
              <div className="relative">
                <div className={`flex items-center h-[64px] rounded-xl border-2 ${error ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-[#f8fafc]'} px-5 transition-all focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50`}>
                  <span className="text-lg font-bold text-gray-400 mr-2">Rp</span>
                  <input
                    type="text"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    className="w-full bg-transparent outline-none text-xl font-bold text-[#1e293b] placeholder:text-gray-300"
                    placeholder="0"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{error}</p>}
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Dana akan dipindahkan dari <span className="font-bold">Saldo Utama</span> Anda. Pastikan saldo mencukupi untuk menghindari kegagalan transaksi.
              </p>
            </div>

            {/* Tips Box */}
            <div className="bg-[#f0f7ff] rounded-2xl p-4 flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                <Sparkles size={20} fill="currentColor" stroke="none" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2563eb] mb-1">Tips Menabung</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {amount > 0 
                    ? `Menambah ${formatRupiah(amount)} hari ini akan membuat progres Anda menjadi ${Math.round(((goal.currentAmount + amount) / goal.targetAmount) * 100)}%!`
                    : "Menabung secara rutin setiap hari atau minggu sangat membantu Anda mencapai impian besar dengan lebih cepat."}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-6 pt-2 border-t border-gray-100 mt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition active:scale-[0.98]"
              >
                <Plus size={18} strokeWidth={3} />
                Tambah Dana
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;