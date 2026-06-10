import { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { formatNumber, parseRupiah } from '../utils/currency';
import { 
  Calendar, ChevronDown, Lightbulb, Wallet, Briefcase, Home, 
  Banknote, Coffee, Zap, Droplets, Phone, Building, PiggyBank, 
  Car, ShoppingBag, Gamepad2, HeartPulse, Receipt, MoreHorizontal,
  CupSoda, Wifi, HandCoins, Handshake, Gift
} from 'lucide-react';

const categoryIcons = {
  'Penghasilan': Wallet,
  'Investasi': Briefcase,
  'Jual Tanah': Home,
  'Kos-kosan': Home,
  'Tunjangan': Banknote,
  'Gaji': Wallet,
  'Uang Saku': HandCoins,
  'Bisnis': Handshake,
  'Bonus': Banknote,
  'Hadiah': Gift,
  'Pencairan Dana': Banknote,
  'Jajan': Coffee,
  'Minuman': CupSoda,
  'Tabungan': PiggyBank,
  'Tagihan Listrik': Zap,
  'Tagihan Air': Droplets,
  'Internet': Wifi,
  'Tagihan Telepon': Phone,
  'SPP': Building,
  'Makanan': Coffee,
  'Transportasi': Car,
  'Belanja': ShoppingBag,
  'Hiburan': Gamepad2,
  'Kesehatan': HeartPulse,
  'Tagihan': Receipt,
  'Lainnya': MoreHorizontal,
};

const TransactionForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState(initialData.type || 'expense');
  
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    type: initialData.type || 'expense',
    category: initialData.category || EXPENSE_CATEGORIES[0],
    description: initialData.description || '',
    date: initialData.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    tax: initialData.tax || (initialData._id ? 0 : (initialData.type === 'income' ? 0 : 11)),
  });

  const [displayAmount, setDisplayAmount] = useState(
    initialData.amount ? formatNumber(initialData.amount) : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Tab change specifically to update categories list
  const handleTabChange = (type) => {
    setActiveTab(type);
    setFormData((prev) => ({ 
      ...prev, 
      type,
      category: type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
      tax: prev.tax === 0 || prev.tax === 11 ? (type === 'expense' ? 11 : 0) : prev.tax
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      alert('Jumlah harus lebih dari 0');
      return;
    }

    let finalAmount = formData.amount;
    const taxRate = parseFloat(formData.tax) || 0;
    
    if (taxRate > 0) {
      const taxAmount = (finalAmount * taxRate) / 100;
      if (activeTab === 'expense') {
        finalAmount += taxAmount;
      } else {
        finalAmount -= taxAmount;
      }
    }
    
    // Menggabungkan tanggal yang dipilih dengan waktu saat ini di lokal
    const selectedDate = new Date(formData.date);
    const now = new Date();
    
    // Setel jam, menit, detik mengikuti waktu saat ini
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, amount: finalAmount, date: selectedDate.toISOString() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full h-14 px-5 bg-[#f8faff] border border-[#f0f3f9] rounded-2xl text-[#1f2937] font-medium outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300";
  const labelClass = "block text-xs font-extrabold text-[#9ca3af] tracking-widest uppercase mb-3 px-1";

  const currentCategories = activeTab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Toggle */}
      <div className="p-1.5 bg-gray-100/80 rounded-2xl flex relative h-14 border border-gray-200/50 shadow-inner">
        <div 
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out z-0"
          style={{ left: activeTab === 'expense' ? '6px' : 'calc(50%)' }}
        ></div>
        <button
          type="button"
          onClick={() => handleTabChange('expense')}
          className={`flex-1 flex items-center justify-center text-[13px] font-extrabold z-10 transition-colors duration-300 ${activeTab === 'expense' ? 'text-red-500' : 'text-gray-400'}`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('income')}
          className={`flex-1 flex items-center justify-center text-[13px] font-extrabold z-10 transition-colors duration-300 ${activeTab === 'income' ? 'text-emerald-500' : 'text-gray-400'}`}
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
                className={`${inputClass} !text-xl !font-black text-gray-800 ${displayAmount ? 'pl-14' : ''}`}
                required
              />
              {displayAmount && <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-lg">Rp</span>}
        </div>
      </div>

      {/* Date and Tax Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tanggal</label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`${inputClass} appearance-none pr-12 text-sm font-bold text-gray-600`}
              required
            />
            <Calendar size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className={labelClass}>
            {activeTab === 'expense' ? 'Pajak (PPN %)' : 'Pajak (PPh %)'}
          </label>
          <div className="relative">
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              className={`${inputClass} pr-12 font-bold text-gray-600`}
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            {activeTab === 'expense' 
              ? 'Pajak akan ditambahkan pada total pengeluaran.' 
              : 'Pajak akan dikurangkan dari total pemasukan.'}
          </p>
        </div>
      </div>

      {/* Category Grid Selection */}
      <div>
        <label className={labelClass}>Pilih Kategori</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-52 overflow-y-auto scrollbar-hide p-1 pb-4">
          {currentCategories.map((cat) => {
            const Icon = categoryIcons[cat] || MoreHorizontal;
            const isSelected = formData.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-[18px] transition-all duration-200 border-2
                  ${isSelected 
                    ? (activeTab === 'expense' ? 'bg-red-50/50 border-red-300 shadow-sm' : 'bg-emerald-50/50 border-emerald-300 shadow-sm') 
                    : 'bg-[#f8faff] border-transparent hover:bg-gray-100'}
                `}
              >
                <div className={`p-2 rounded-xl transition-colors ${isSelected ? (activeTab === 'expense' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600') : 'bg-white text-gray-400 shadow-sm'}`}>
                   <Icon size={22} className="stroke-[2.5]" />
                </div>
                <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? (activeTab === 'expense' ? 'text-red-700' : 'text-emerald-700') : 'text-gray-500'}`}>{cat}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className={labelClass}>Catatan Tambahan</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tulis detail transaksi di sini (bila perlu)..."
          className={`${inputClass} !h-24 py-4 resize-none`}
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
            {activeTab === 'expense' 
              ? "Masukkan persentase pajak (seperti PPN 11%) yang akan ditambahkan pada total transaksi Anda."
              : "Masukkan persentase pajak (seperti PPh) yang akan memotong jumlah pendapatan bersih Anda."}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-6 py-4 rounded-2xl transition-all"
        >
          Batalkan
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto text-white px-10 py-4 flex-1 sm:flex-none rounded-2xl font-black text-sm shadow-lg transition active:scale-[0.98] ${
            activeTab === 'expense' 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-200 text-red-50' 
            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 text-emerald-50'
          } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;