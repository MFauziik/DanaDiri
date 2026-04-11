import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/constants';
import { formatNumber, parseRupiah } from '../utils/currency';
import { Calendar, ChevronDown, Lightbulb } from 'lucide-react';

const TransactionForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    type: initialData.type || 'expense',
    category: initialData.category || CATEGORIES[0],
    description: initialData.description || '',
    date: initialData.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
  });

  const [displayAmount, setDisplayAmount] = useState(
    initialData.amount ? formatNumber(initialData.amount) : ''
  );

  const [activeTab, setActiveTab] = useState(formData.type);

  const handleTabChange = (type) => {
    setActiveTab(type);
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    setDisplayAmount(formatNumber(parseRupiah(rawValue)));
    setFormData((prev) => ({
      ...prev,
      amount: parseRupiah(rawValue)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      alert('Jumlah harus lebih dari 0');
      return;
    }

    onSubmit(formData);
  };

  const inputClass = "w-full h-14 px-5 bg-[#f8faff] border border-[#f0f3f9] rounded-2xl text-[#1f2937] font-medium outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300";
  const labelClass = "block text-xs font-extrabold text-[#9ca3af] tracking-widest uppercase mb-3 px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Toggle */}
      <div className="p-1 bg-gray-100 rounded-2xl flex relative h-12">
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0"
          style={{ left: activeTab === 'expense' ? '4px' : 'calc(50%)' }}
        ></div>
        <button
          type="button"
          onClick={() => handleTabChange('expense')}
          className={`flex-1 flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${activeTab === 'expense' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('income')}
          className={`flex-1 flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${activeTab === 'income' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          Pemasukan
        </button>
      </div>

      {/* Amount Input */}
      <div>
        <label className={labelClass}>Jumlah</label>
        <div className="relative">
             <input
                type="text"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="Rp 0"
                className={`${inputClass} !text-lg !font-bold ${displayAmount ? 'pl-12' : ''}`}
                required
              />
              {displayAmount && <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>}
        </div>
      </div>

      {/* Date and Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tanggal</label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`${inputClass} appearance-none pr-12`}
              required
            />
            <Calendar size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${inputClass} appearance-none pr-12`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className={labelClass}>Catatan (Opsional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tambahkan deskripsi tambahan di sini..."
          className={`${inputClass} h-28 py-4 resize-none`}
        ></textarea>
      </div>

      {/* Tips Box */}
      <div className="bg-[#f0f4ff] border border-[#e0e7ff] rounded-2xl p-4 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-white border border-[#e0e7ff] flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
          <Lightbulb size={20} />
        </div>
        <div>
          <p className="text-xs text-[#42526e] leading-relaxed">
            <span className="font-bold text-blue-600 block mb-1">Tips Keuangan:</span>
            Gunakan kategori yang spesifik agar laporan bulanan Anda lebih akurat dan mudah dianalisis.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-10 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-all uppercase tracking-wider"
        >
          Batalkan
        </button>
        <button
          type="submit"
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-10 py-4 rounded-[20px] font-bold text-sm shadow-lg shadow-indigo-100 transition active:scale-[0.98]"
        >
          Simpan Transaksi
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;