import { formatRupiah } from '../utils/currency';

const RecurringList = ({ recurrings, onDelete }) => {
  if (recurrings.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Transaksi Berulang
        <span className="text-sm font-normal text-gray-500 ml-2">
          (Otomatis dibuat setiap tanggal yang dipilih)
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurrings.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">
                  {item.description || 'Transaksi Berulang'}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {item.category}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 rounded-full text-xs text-purple-600">
                    Tgl {item.dayOfMonth}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDelete(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p
                className={`text-lg font-bold ${
                  item.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatRupiah(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringList;