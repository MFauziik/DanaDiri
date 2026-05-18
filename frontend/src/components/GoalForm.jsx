import { useState } from 'react';
import { GOAL_CATEGORIES } from '../utils/constants';
import { formatNumber, parseRupiah } from '../utils/currency';

const GoalForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    targetAmount: initialData.targetAmount || '',
    deadline: initialData.deadline ? initialData.deadline.slice(0, 10) : '',
    category: initialData.category || GOAL_CATEGORIES[0],
    notes: initialData.notes || '',
  });

  // State untuk display amount dengan format
  const [displayAmount, setDisplayAmount] = useState(
    initialData.targetAmount ? formatNumber(initialData.targetAmount) : ''
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    
    // Format untuk display
    setDisplayAmount(formatNumber(parseRupiah(rawValue)));
    
    // Simpan nilai number di state
    setFormData((prev) => ({
      ...prev,
      targetAmount: parseRupiah(rawValue)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (formData.targetAmount <= 0) {
      alert('Jumlah target harus lebih dari 0');
      return;
    }

    // Set deadline di penghujung hari jam 23:59 (Waktu Lokal) untuk membenahi Bug Jam 7
    let finalDeadline = formData.deadline;
    if (formData.deadline) {
      const dDate = new Date(formData.deadline);
      dDate.setHours(23, 59, 59);
      finalDeadline = dDate.toISOString();
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        targetAmount: formData.targetAmount, // Sudah dalam bentuk number
        deadline: finalDeadline
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Nama Target
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Contoh: Liburan ke Bali"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetAmount">
          Jumlah Target (Rp)
        </label>
        <input
          type="text"
          id="targetAmount"
          name="targetAmount"
          value={displayAmount}
          onChange={handleAmountChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Rp 0"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Contoh: 15.000.000 (untuk 15 juta)
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
          Target Waktu
        </label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {GOAL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
          Catatan (opsional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="3"
          placeholder="Tambahkan catatan..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Target'}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;