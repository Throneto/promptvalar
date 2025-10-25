import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ username, email, password });
      // 注册成功，跳转到工作室页面
      navigate('/studio');
    } catch (err) {
      // 处理错误
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (errorData.error?.code === 'USERNAME_EXISTS') {
          setError('用户名已被占用');
        } else if (errorData.error?.code === 'EMAIL_EXISTS') {
          setError('邮箱已被注册');
        } else if (errorData.error?.code === 'VALIDATION_ERROR') {
          // 显示验证错误
          const errors = errorData.error.details?.errors;
          if (errors && errors.length > 0) {
            setError(errors[0].message);
          } else {
            setError('输入数据无效，请检查格式');
          }
        } else {
          setError(errorData.error?.message || '注册失败，请稍后重试');
        }
      } else {
        setError('网络错误，请检查连接');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">Start mastering AI prompts today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full" 
            disabled={loading}
          >
            {loading ? '创建中...' : 'Create Account'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

