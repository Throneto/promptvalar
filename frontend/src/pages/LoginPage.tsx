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

    console.log('🔐 开始登录...', { email, password: '***' });

    try {
      const result = await login({ email, password });
      console.log('✅ 登录成功！', result);
      
      // 验证token是否保存
      const savedToken = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      console.log('💾 Token已保存:', !!savedToken);
      console.log('👤 用户数据已保存:', !!savedUser);
      
      // 登录成功，跳转到原始页面或工作室页面
      const from = (location.state as any)?.from || '/studio';
      console.log('🚀 准备跳转到:', from);
      
      navigate(from, { replace: true });
      console.log('✨ 跳转命令已执行');
    } catch (err: any) {
      console.error('❌ 登录失败:', err);
      console.error('错误详情:', err.response?.data);
      
      // 处理错误
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (errorData.error?.code === 'INVALID_CREDENTIALS') {
          setError('邮箱或密码错误');
        } else if (errorData.error?.code === 'VALIDATION_ERROR') {
          setError('请输入有效的邮箱和密码');
        } else {
          setError(errorData.error?.message || '登录失败，请稍后重试');
        }
      } else {
        setError(err.message || '网络错误，请检查连接');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your PromptValar account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
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
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full" 
            disabled={loading}
          >
            {loading ? '登录中...' : 'Sign In'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

