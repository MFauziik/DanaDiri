import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatRupiah } from '../utils/currency';

const BudgetCard = () => {
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [input, setInput] = useState('');

  const fetchBudget = async () => {
    const { data } = await api.get('/budget');
    setBudget(data.budget);
    setSpent(data.spent);
    setRemaining(data.remaining);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleSubmit = async () => {
    await api.post('/budget', { amount: Number(input) });
    setInput('');
    fetchBudget();
  };

  const percentage = budget ? (spent / budget) * 100 : 0;

  return (
    <div className="bg-white p-5 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-3">Budget Bulanan</h2>

      <p>Total Budget: {formatRupiah(budget)}</p>
      <p>Terpakai: {formatRupiah(spent)}</p>
      <p>Sisa: {formatRupiah(remaining)}</p>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-200 h-3 rounded mt-3">
        <div
          className={`h-3 rounded ${
            percentage > 100 ? 'bg-red-600' :
            percentage > 80 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      {/* WARNING */}
      {percentage > 100 && <p className="text-red-600 mt-2">Budget terlampaui!</p>}
      {percentage > 80 && percentage <= 100 && (
        <p className="text-yellow-600 mt-2">Hampir habis!</p>
      )}

      {/* INPUT */}
      <div className="flex gap-2 mt-4">
        <input
          type="number"
          placeholder="Set budget..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;