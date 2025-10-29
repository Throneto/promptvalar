import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, logout, isAuthenticated } from '../../services/auth.service';
import { User, LogOut, Settings, Heart, FileText, ChevronDown } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

function Header() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        setUser(getCurrentUser());
      }
    };

    checkAuth();

    // Listen to storage changes (cross-tab sync)
    window.addEventListener('storage', checkAuth);
    
    // Custom event listener (within same tab)
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setUser(null);
    setShowDropdown(false);
    
    // Trigger custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
    
    navigate('/');
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            PromptValar
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/studio" 
              className="relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 hidden sm:block font-medium group"
            >
              <span className="relative z-10">Studio</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              to="/library" 
              className="relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 hidden sm:block font-medium group"
            >
              <span className="relative z-10">Library</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>

            {/* Theme toggle button */}
            <ThemeToggle />

            {isAuth && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 ring-2 ring-purple-200 dark:ring-purple-800">
                    {getInitials(user.username)}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium hidden md:block">{user.username}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 hidden md:block transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="w-4 h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      Dashboard
                    </Link>

                    <Link
                      to="/dashboard/prompts"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FileText className="w-4 h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      My Prompts
                    </Link>

                    <Link
                      to="/dashboard/favorites"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Heart className="w-4 h-4 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
                      My Favorites
                    </Link>

                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 w-full group"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary hidden sm:inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

