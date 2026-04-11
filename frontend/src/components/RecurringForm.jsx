import { useState } from 'react';
import { CATEGORIES, TRANSACTION_TYPES, DAYS } from '../utils/constants';
import { formatNumber, parseRupiah } from '../utils/currency';
import { ChevronDown } from 'lucide-react';

const RecurringForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    type: initialData.type || 'expense',
    category: initialData.category || CATEGORIES[0],
    description: initialData.description || '',
    dayOfMonth: initialData.dayOfMonth || '1',
  });

  const [displayAmount, setDisplayAmount] = useState(
    initialData.amount ? formatNumber(initialData.amount) : ''
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    setDisplayAmount(formatNumber(parseRupiah(rawValue)));
    setFormData((prev) => ({
      ...prev,
      amount: parseRupiah(rawValue),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }
    onSubmit({
      ...formData,
      amount: amount,
      dayOfMonth: parseInt(formData.dayOfMonth),
    });
  };

  const labelClass = "block text-xs font-extrabold text-[#9ca3af] tracking-widest uppercase mb-2.5 px-1";
  const inputClass = "w-full h-12 px-4 bg-[#f8faff] border border-[#f0f3f9] rounded-xl text-[#1f2937] font-medium outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300 appearance-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Jumlah (RP)</label>
        <input
          type="text"
          name="amount"
          value={displayAmount}
          onChange={handleAmountChange}
          className={inputClass}
          placeholder="Masukkan jumlah"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tipe</label>
          <div className="relative">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
            >
              {TRANSACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tanggal (Per Bulan)</label>
          <div className="relative">
            <select
              name="dayOfMonth"
              value={formData.dayOfMonth}
              onChange={handleChange}
              className={inputClass}
            >
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  Tanggal {day.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 ml-1">
            Setiap tanggal berapa transaksi ini dibuat?
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Kategori</label>
        <div className="relative">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Deskripsi (Opsional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Contoh: Gaji, Tagihan Listrik, dll"
          className={`${inputClass} h-28 py-4 resize-none`}
        ></textarea>
      </div>

      <div className="flex items-center justify-end gap-10 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-all uppercase tracking-wider"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-10 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition active:scale-[0.98]"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default RecurringForm;