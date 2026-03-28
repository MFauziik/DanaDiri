import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Repeat,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../services/auth";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", path: "/transactions", icon: Repeat },
  { name: "Target", path: "/goals", icon: Target },
  { name: "Profile", path: "/profile", icon: User },
];

const Sidebar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 bg-white border-b">
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="ml-4 font-semibold text-blue-600">DanaDiri</h1>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:shadow-sm md:border-r
        `}
      >
        {/* Close button mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="h-full flex flex-col justify-between">
          {/* Top Section */}
          <div>
            {/* Logo */}
            <div className="px-6 py-6">
              <h1 className="text-xl font-semibold text-blue-600">
                DanaDiri
              </h1>
            </div>

            {/* Menu */}
            <nav className="px-3 space-y-1">
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
                    className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                    )}

                    <Icon size={18} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t">
            {/* User */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;