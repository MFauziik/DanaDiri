import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const Recurring = ({ user, setUser }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    dayOfMonth: 1
  });

  const fetchData = async () => {
    const res = await api.get('/recurring');
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/recurring', form);
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/recurring/${id}`);
    fetchData();
  };

  return (
    <div className="flex">
      <Sidebar user={user} setUser={setUser} />

      <div className="p-6 flex-1">
        <h1 className="text-xl font-bold mb-4">Recurring Transaksi</h1>

        <form onSubmit={handleSubmit} className="space-y-2 mb-6">
          <input placeholder="Jumlah" onChange={e => setForm({...form, amount: e.target.value})} />
          <input placeholder="Kategori" onChange={e => setForm({...form, category: e.target.value})} />
          <input placeholder="Deskripsi" onChange={e => setForm({...form, description: e.target.value})} />
          <input type="number" placeholder="Tanggal (1-31)" onChange={e => setForm({...form, dayOfMonth: e.target.value})} />

          <select onChange={e => setForm({...form, type: e.target.value})}>
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>

          <button className="bg-blue-600 text-white px-3 py-1">Tambah</button>
        </form>

        {data.map(item => (
          <div key={item._id} className="border p-2 mb-2 flex justify-between">
            <span>{item.description} (Tgl {item.dayOfMonth})</span>
            <button onClick={() => handleDelete(item._id)} className="text-red-500">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recurring;