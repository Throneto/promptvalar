import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/auth.service';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Starting login...', { email, password: '***' });

    try {
      const result = await login({ email, password });
      console.log('✅ Login successful!', result);
      
      // Verify tokens are saved
      const savedToken = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      console.log('💾 Token saved:', !!savedToken);
      console.log('👤 User data saved:', !!savedUser);
      
      // Navigate to original page or studio page
      const from = (location.state as any)?.from || '/studio';
      console.log('🚀 Preparing to navigate to:', from);
      
      navigate(from, { replace: true });
      console.log('✨ Navigation command executed');
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      console.error('Error details:', err.response?.data);
      
      // 处理错误
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (errorData.error?.code === 'INVALID_CREDENTIALS') {
          setError('Invalid email or password');
        } else if (errorData.error?.code === 'VALIDATION_ERROR') {
          setError('Please enter a valid email and password');
        } else {
          setError(errorData.error?.message || 'Login failed, please try again later');
        }
      } else {
        setError(err.message || 'Network error, please check your connection');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your PromptValar account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-border dark:border-border-dark shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-primary" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-sm text-primary dark:text-primary-light hover:underline transition-colors">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full shadow-lg hover:shadow-xl transition-all" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary dark:text-primary-light hover:underline transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

