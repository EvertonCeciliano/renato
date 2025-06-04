import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar Apple Style */}
      <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 tracking-tight select-none">🍏</span>
            <span className="text-lg font-semibold text-gray-800 select-none">Apple Manager</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className={`transition-colors font-medium px-2 py-1 rounded-full ${isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>Menu</Link>
            <Link to="/orders" className={`transition-colors font-medium px-2 py-1 rounded-full ${isActive('/orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>Orders</Link>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
}