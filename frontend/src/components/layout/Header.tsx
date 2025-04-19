import React from 'react';
import { Leaf, LogOut } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenAuthModal?: () => void;
  activePage: 'dashboard' | 'marketplace' | 'projects' | 'news';
  onPageChange: (page: 'dashboard' | 'marketplace' | 'projects' | 'news') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenAuthModal, 
  activePage, 
  onPageChange 
}) => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">GreenLedger</h1>
        </div>

        {/* Navigation (only shown when logged in) */}
        {isLoggedIn && (
          <nav className="hidden md:flex space-x-4">
            <button 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'dashboard' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onPageChange('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'marketplace' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onPageChange('marketplace')}
            >
              Marketplace
            </button>
            <button 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'projects' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onPageChange('projects')}
            >
              Carbon Projects
            </button>
            <button 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'news' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => onPageChange('news')}
            >
              Market News
            </button>
          </nav>
        )}

        {/* Action buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span>Logout</span>
            </Button>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={onOpenAuthModal}
            >
              Login / Register
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;