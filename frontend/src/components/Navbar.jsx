import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mencegah scroll layar utama ketika menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-heading text-primary flex items-center gap-2 group">
          <img src="/logo.png" alt="DanaDiri Logo" className="w-10 h-10 group-hover:transition-transform shadow-sm rounded-full drop-shadow-md" />
          <span className="group-hover:opacity-80 transition-opacity">DanaDiri</span>
        </Link>

        {/* Menu (Desktop) */}
        <div className="hidden md:flex space-x-2 items-center font-medium">
          <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative px-5 py-2 text-gray-600 group transition-colors cursor-pointer font-semibold">
            <span className="absolute inset-0 bg-primary/10 rounded-xl scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
            <span className="relative z-10 group-hover:text-primary transition-colors duration-300">Beranda</span>
          </a>
          <a onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })} className="relative px-5 py-2 text-gray-600 group transition-colors cursor-pointer font-semibold">
            <span className="absolute inset-0 bg-primary/10 rounded-xl scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
            <span className="relative z-10 group-hover:text-primary transition-colors duration-300">Fitur</span>
          </a>
          <a onClick={() => document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' })} className="relative px-5 py-2 text-gray-600 group transition-colors cursor-pointer font-semibold">
            <span className="absolute inset-0 bg-primary/10 rounded-xl scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out z-0"></span>
            <span className="relative z-10 group-hover:text-primary transition-colors duration-300">Cara Kerja</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-primary hover:bg-secondary text-white px-7 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(45,63,191,0.4)] hover:shadow-[0_8px_30px_rgba(124,77,255,0.6)] hover:-translate-y-1 active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 font-bold hover:text-primary transition-all px-5 py-2.5 rounded-xl hover:bg-primary/10 active:scale-95"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-secondary text-white px-7 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(45,63,191,0.4)] hover:shadow-[0_8px_30px_rgba(124,77,255,0.6)] hover:-translate-y-1 active:scale-95"
              >
                Mulai Sekarang
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none z-50 relative p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100 py-6 border-b" : "max-h-0 opacity-0 py-0 border-transparent pointer-events-none"
        }`}
        style={{ height: '100vh' }}
      >
        <div className="flex flex-col px-6 space-y-6">
          <a onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-gray-800 hover:text-primary text-xl font-bold py-2 flex items-center justify-between border-b border-gray-100">
            Beranda
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          <a onClick={() => { setIsMobileMenuOpen(false); document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-800 hover:text-primary text-xl font-bold py-2 flex items-center justify-between border-b border-gray-100">
            Fitur
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          <a onClick={() => { setIsMobileMenuOpen(false); document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-800 hover:text-primary text-xl font-bold py-2 flex items-center justify-between border-b border-gray-100">
            Cara Kerja
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
          
          <div className="pt-8 flex flex-col gap-4">
            {user ? (
              <Link to="/dashboard" className="text-center bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-[0_8px_30px_rgb(45,63,191,0.3)] hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-center text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 font-bold py-4 rounded-xl text-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                <Link to="/register" className="text-center bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-[0_8px_30px_rgb(45,63,191,0.3)] hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mulai Sekarang</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;