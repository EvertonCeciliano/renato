import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                Restaurant Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Menu
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Orders
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 