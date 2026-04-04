import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Receipt,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../services/auth";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", path: "/transactions", icon: Receipt },
  { name: "Target Tabungan", path: "/goals", icon: Target },
  { name: "Profil", path: "/profile", icon: User },
];

const Sidebar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [randomAdvice, setRandomAdvice] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const advices = [
      "Pengeluaran hiburan Anda naik 15% dari bulan lalu. Coba batasi minggu ini.",
      "Sisihkan setidaknya 20% dari pendapatan Anda di awal bulan untuk ditabung rutin.",
      "Catat uang keluar sekecil apa pun untuk mengetahui bocor halus di keuangan Anda.",
      "Hindari belanja impulsif. Tunggu 24 jam sebelum Anda membeli barang non-esensial.",
      "Coba lunasi tagihan/cicilan tepat waktu untuk menghindari tumpukan denda.",
      "Banyak langganan aplikasi/digital yang tidak terpakai? Segera batalkan dan hemat uang Anda.",
      "Siapkan Dana Darurat perlahan, rutinkan alokasi kecil setiap menerimanya pendapatan."
    ];
    const randomIndex = Math.floor(Math.random() * advices.length);
    setRandomAdvice(advices[randomIndex]);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="DanaDiri Logo" className="w-8 h-8 object-contain rounded-md" />
          <h1 className="font-bold font-heading text-slate-800 text-lg">DanaDiri</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-1 text-slate-500 hover:bg-slate-50 rounded-md">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Container */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-[100dvh] w-[260px] bg-white transform transition-transform duration-300 ease-in-out border-r border-slate-100/80
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex-shrink-0 flex flex-col font-sans
        `}
      >
        {/* Close button mobile */}
        <div className="md:hidden flex justify-end p-4 absolute top-0 right-0">
          <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-md">
            <X size={20} />
          </button>
        </div>

        {/* Logo Section */}
        <div className="px-6 py-8 flex flex-row items-center gap-3">
          <img src="/logo.png" alt="DanaDiri Logo" className="w-10 h-10 object-contain rounded-lg" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-heading text-slate-800 leading-none mb-1">DanaDiri</h1>
            <p className="text-[11px] text-slate-500 font-medium">Manajemen Keuangan</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="px-4 space-y-1.5 pb-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-[11px] rounded-[10px] text-[14px] font-semibold transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-[#EEF2FF] text-blue-600"
                      : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-700"
                  }`}
                >
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} 
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider Line */}
          <div className="px-4 py-2">
            <div className="w-full h-px bg-slate-100"></div>
          </div>

          {/* Keluar Button */}
          <div className="px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-[11px] rounded-[10px] text-[14px] font-semibold text-[#f43f5e] hover:bg-rose-50 transition-colors group"
            >
              <LogOut size={20} strokeWidth={2} className="text-[#f43f5e]/80 group-hover:text-[#f43f5e]" />
              <span>Keluar</span>
            </button>
          </div>
          
          {/* Push down the bottom card */}
          <div className="flex-1"></div>

          {/* Saran Keuangan Card */}
          <div className="p-5 w-full mt-8">
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-[14px] p-4 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-2 font-heading">
                Saran Keuangan
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                {randomAdvice}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;