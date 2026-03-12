import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-xl font-bold">
            DanaDiri
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="hover:text-blue-200">
              Dashboard
            </Link>
            <Link to="/transactions" className="hover:text-blue-200">
              Transaksi
            </Link>
            <span className="text-sm">Halo, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;