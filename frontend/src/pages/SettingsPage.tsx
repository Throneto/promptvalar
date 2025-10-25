import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth.service';
import { User, Lock, Save, Trash2, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
    }
  }, []);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      // TODO: 实现更新用户资料的API调用
      // await updateProfile({ username, email });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // 更新localStorage中的用户信息
      const updatedUser = { ...user, username, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Update failed, please try again later' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // 验证密码
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      // TODO: 实现修改密码的API调用
      // await changePassword({ currentPassword, newPassword });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to change password, please check your current password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and all data will be permanently deleted.')) {
      if (confirm('Final confirmation: Do you really want to delete your account?')) {
        // TODO: 实现删除账号的API调用
        alert('Account deletion feature coming soon');
      }
    }
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </motion.div>

        {/* 消息提示 */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {message.text}
            </p>
          </motion.div>
        )}

        {/* 个人资料 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <User className="w-6 h-6 text-purple-600" />
            Profile Information
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* 修改密码 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-purple-600" />
            Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-sm text-gray-500 mt-1">At least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* 危险区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-200"
        >
          <h2 className="text-2xl font-semibold text-red-600 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Log Out</h3>
                <p className="text-sm text-gray-600">
                  Sign out from your account and return to homepage
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Delete Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all related data. This action cannot be undone
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;

