import { useState } from 'react';
import { formatNumber, parseRupiah, formatRupiah } from '../utils/currency';

const AddFundsModal = ({ goal, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    
    // Format untuk display
    setDisplayAmount(formatNumber(parseRupiah(rawValue)));
    
    // Simpan nilai number
    setAmount(parseRupiah(rawValue));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const numAmount = amount;
    
    if (!amount || numAmount <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }

    if (goal.currentAmount + numAmount > goal.targetAmount) {
      if (!window.confirm(`Jumlah melebihi target sebesar Rp ${(goal.currentAmount + numAmount - goal.targetAmount).toLocaleString()}. Lanjutkan? (Kelebihan akan disimpan sebagai pencapaian)`)) {
        return;
      }
    }

    onSubmit(numAmount);
  };

  const remaining = goal.targetAmount - goal.currentAmount;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Tambah Dana ke {goal.name}
          </h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress saat ini</span>
              <span className="font-semibold">
                {formatRupiah(goal.currentAmount)} / {formatRupiah(goal.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Sisa: {formatRupiah(remaining)}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Jumlah yang Ditambahkan (Rp)
              </label>
              <input
                type="text"
                value={displayAmount}
                onChange={handleAmountChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Rp 0"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
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