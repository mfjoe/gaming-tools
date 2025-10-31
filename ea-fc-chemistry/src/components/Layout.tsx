import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useMobileDetect } from '../hooks/useMobileDetect';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useMobileDetect();
  const location = useLocation();

  const navigation = [
    { name: '⚽ Squad Builder', href: '/squad-builder' },
    { name: '🧩 SBC Solver', href: '/sbc-solver' },
    { name: '📈 Evolutions', href: '/evolution-planner' },
    { name: '💾 My Squads', href: '/my-squads' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-ea-blue-600 to-ea-green-600 text-white shadow-lg relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold bg-gradient-to-br from-ea-blue-600 to-ea-green-600 bg-clip-text text-transparent">
                  FC
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">EA FC 25</h1>
                <p className="text-xs text-blue-100">Squad Builder</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors font-semibold ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-ea-blue-500 to-ea-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="font-bold text-white">Gaming Tools</span>
            </div>
            <p className="text-sm">&copy; 2025 Gaming Tools. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-2">
              Not affiliated with EA Sports or FIFA. For educational purposes only.
            </p>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <Link
                to="/privacy"
                className="hover:text-ea-blue-400 transition-colors"
              >
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-ea-blue-400 transition-colors">
                Terms
              </Link>
              <Link
                to="/contact"
                className="hover:text-ea-blue-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
