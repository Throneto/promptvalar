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
    // 检查登录状态
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        setUser(getCurrentUser());
      }
    };

    checkAuth();

    // 监听存储变化（跨标签页同步）
    window.addEventListener('storage', checkAuth);
    
    // 自定义事件监听（同一标签页内）
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  useEffect(() => {
    // 点击外部关闭下拉菜单
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
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new Event('auth-change'));
    
    navigate('/');
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-border dark:border-border-dark sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
            PromptValar
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/studio" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors hidden sm:block"
            >
              Studio
            </Link>
            <Link 
              to="/library" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors hidden sm:block"
            >
              Library
            </Link>

            {/* 主题切换按钮 */}
            <ThemeToggle />

            {isAuth && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {getInitials(user.username)}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium hidden md:block">{user.username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden md:block" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      to="/dashboard/prompts"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FileText className="w-4 h-4" />
                      My Prompts
                    </Link>

                    <Link
                      to="/dashboard/favorites"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Heart className="w-4 h-4" />
                      My Favorites
                    </Link>

                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
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
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  登录
                </Link>
                <Link to="/register" className="btn-primary hidden sm:inline-block">
                  开始使用
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

