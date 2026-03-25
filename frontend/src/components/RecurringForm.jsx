import { useState } from 'react';
import { CATEGORIES, TRANSACTION_TYPES, DAYS } from '../utils/constants';
import { formatNumber, parseRupiah } from '../utils/currency';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Jumlah (Rp)
          </label>
          <input
            type="text"
            name="amount"
            value={displayAmount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Masukkan jumlah"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipe
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {TRANSACTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tanggal (per bulan)
          </label>
          <select
            name="dayOfMonth"
            value={formData.dayOfMonth}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {DAYS.map((day) => (
              <option key={day.value} value={day.value}>
                Tanggal {day.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Setiap tanggal berapa transaksi ini dibuat?
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Deskripsi (opsional)
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Contoh: Gaji, Tagihan Listrik, dll"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default RecurringForm;