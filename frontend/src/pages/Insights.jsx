import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const Insights = ({ user, setUser }) => {
  const [data, setData] = useState(null);

const fetchInsights = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    const res = await api.get('/insight', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    setData(res.data);
  } catch (err) {
    console.error(err);
    setData({ error: true });
  }
};  

  useEffect(() => {
    fetchInsights();
  }, []);

if (!data) return <div>Loading...</div>;

if (data.error) {
  return <div className="p-6 text-red-500">Gagal mengambil data insight</div>;
}

  return (
    <div className="flex">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Insight Keuangan</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card title="Pemasukan" value={data.income} color="green" />
          <Card title="Pengeluaran" value={data.expense} color="red" />
          <Card title="Saldo" value={data.balance} color="blue" />
          <Card title="Budget" value={data.budget} color="yellow" />
        </div>

        <div className={`p-4 rounded shadow text-white ${
          data.status === 'OVER' ? 'bg-red-500' :
          data.status === 'WARNING' ? 'bg-yellow-500' :
          'bg-green-500'
        }`}>
          <h2 className="font-bold">{data.status}</h2>
          <p>{data.message}</p>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => {
  const colors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className={`p-4 rounded text-white ${colors[color]}`}>
      <h3>{title}</h3>
      <p className="text-xl font-bold">Rp {value}</p>
    </div>
  );
};

export default Insights;