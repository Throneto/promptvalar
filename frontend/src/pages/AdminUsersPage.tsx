import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Edit, 
  Trash2, 
  Key,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Shield,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  UserCircle,
  BookText
} from 'lucide-react';
import { getUsers, updateUser, deleteUser, resetUserPassword, type AdminUser, type PaginationInfo } from '../services/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'generationCount' | 'username'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter, tierFilter, sortBy, sortOrder]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const params: any = {
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder,
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';
      if (tierFilter !== 'all') params.subscriptionTier = tierFilter;

      const { users: usersData, pagination: paginationData } = await getUsers(token, params);
      setUsers(usersData);
      setPagination(paginationData);
    } catch (err) {
      console.error('加载用户列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await updateUser(token, editingUser.id, {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
        subscriptionTier: editingUser.subscriptionTier,
        isActive: editingUser.isActive,
      });

      setShowEditModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error('更新用户失败:', err);
      alert('更新用户失败');
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser || !newPassword) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await resetUserPassword(token, editingUser.id, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setEditingUser(null);
      alert('密码重置成功');
    } catch (err) {
      console.error('重置密码失败:', err);
      alert('重置密码失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要禁用此用户吗？')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await deleteUser(token, userId);
      loadUsers();
    } catch (err) {
      console.error('删除用户失败:', err);
      alert('删除用户失败');
    }
  };

  const handleSort = (field: 'createdAt' | 'generationCount' | 'username') => {
    if (sortBy === field) {
      // 切换排序方向
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 切换到新字段，默认降序
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // 重置到第一页
  };

  const SortIcon = ({ field }: { field: 'createdAt' | 'generationCount' | 'username' }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 inline opacity-50" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 inline text-purple-400" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 inline text-purple-400" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 导航菜单 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              <LayoutDashboard className="w-5 h-5" />
              📊 仪表板
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <UserCircle className="w-5 h-5" />
              👥 用户管理
            </Link>
            <Link
              to="/admin/prompts"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              <BookText className="w-5 h-5" />
              📝 提示词管理
            </Link>
          </div>
        </motion.div>

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">用户管理</h1>
          <p className="text-purple-200">查看和管理所有用户</p>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 搜索框 */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="搜索用户名或邮箱..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* 角色筛选 */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all" className="bg-slate-800">所有角色</option>
              <option value="user" className="bg-slate-800">普通用户</option>
              <option value="admin" className="bg-slate-800">管理员</option>
            </select>

            {/* 状态筛选 */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all" className="bg-slate-800">所有状态</option>
              <option value="active" className="bg-slate-800">活跃</option>
              <option value="inactive" className="bg-slate-800">非活跃</option>
            </select>

            {/* 订阅筛选 */}
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all" className="bg-slate-800">所有订阅</option>
              <option value="free" className="bg-slate-800">免费</option>
              <option value="pro" className="bg-slate-800">Pro</option>
            </select>
          </div>
        </motion.div>

        {/* 用户列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center text-white">加载中...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-purple-200">没有找到用户</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th 
                        className="text-left py-4 px-6 text-purple-200 font-semibold cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('username')}
                      >
                        用户名
                        <SortIcon field="username" />
                      </th>
                      <th className="text-left py-4 px-6 text-purple-200 font-semibold">邮箱</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">角色</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">订阅</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">状态</th>
                      <th 
                        className="text-center py-4 px-6 text-purple-200 font-semibold cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('generationCount')}
                      >
                        生成次数
                        <SortIcon field="generationCount" />
                      </th>
                      <th 
                        className="text-center py-4 px-6 text-purple-200 font-semibold cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('createdAt')}
                      >
                        注册时间
                        <SortIcon field="createdAt" />
                      </th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{user.username}</span>
                            {user.role === 'admin' && (
                              <Shield className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-purple-200">{user.email}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-yellow-500/30 text-yellow-200' : 'bg-gray-500/30 text-gray-200'
                          }`}>
                            {user.role === 'admin' ? '管理员' : '用户'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.subscriptionTier === 'pro' ? 'bg-purple-500/30 text-purple-200' : 'bg-gray-500/30 text-gray-200'
                          }`}>
                            {user.subscriptionTier === 'pro' ? 'Pro' : '免费'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {user.isActive ? (
                            <UserCheck className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <UserX className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/30 text-blue-200">
                            {user.generationCount}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-purple-200 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowPasswordModal(true);
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-400"
                              title="重置密码"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                              title="禁用"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-white/10">
                  <div className="text-purple-200 text-sm">
                    共 {pagination.total} 个用户，第 {pagination.page} / {pagination.totalPages} 页
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className="p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* 编辑模态框 */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-4">编辑用户</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2">用户名</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-purple-200 mb-2">邮箱</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-purple-200 mb-2">角色</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option value="user" className="bg-slate-800 text-white">用户</option>
                  <option value="admin" className="bg-slate-800 text-white">管理员</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-200 mb-2">订阅层级</label>
                <select
                  value={editingUser.subscriptionTier}
                  onChange={(e) => setEditingUser({ ...editingUser, subscriptionTier: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option value="free" className="bg-slate-800 text-white">免费</option>
                  <option value="pro" className="bg-slate-800 text-white">Pro</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-purple-200">
                  <input
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  账户活跃
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 重置密码模态框 */}
      {showPasswordModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-4">重置密码</h2>
            <p className="text-purple-200 mb-4">为用户 <span className="font-semibold">{editingUser.username}</span> 设置新密码</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="输入新密码（至少8位）"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleResetPassword}
                disabled={newPassword.length < 8}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                重置
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setEditingUser(null);
                }}
                className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

