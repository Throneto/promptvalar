import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Check,
  X,
  Crown
} from 'lucide-react';
import { getPrompts, updatePrompt, deletePrompt, type AdminPrompt, type PaginationInfo } from '../services/admin';

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<AdminPrompt[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPrompt, setEditingPrompt] = useState<AdminPrompt | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, [currentPage, searchTerm, modelFilter, publishFilter]);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (searchTerm) params.search = searchTerm;
      if (modelFilter !== 'all') params.model = modelFilter;
      if (publishFilter !== 'all') params.isPublished = publishFilter === 'published';

      const { prompts: promptsData, pagination: paginationData } = await getPrompts(token, params);
      setPrompts(promptsData);
      setPagination(paginationData);
    } catch (err) {
      console.error('加载提示词列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrompt = (prompt: AdminPrompt) => {
    setEditingPrompt(prompt);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPrompt) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await updatePrompt(token, editingPrompt.id, {
        title: editingPrompt.title,
        description: editingPrompt.description,
        isPublished: editingPrompt.isPublished,
        isPremium: editingPrompt.isPremium,
      });

      setShowEditModal(false);
      setEditingPrompt(null);
      loadPrompts();
    } catch (err) {
      console.error('更新提示词失败:', err);
      alert('更新提示词失败');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm('确定要删除此提示词吗？')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await deletePrompt(token, promptId);
      loadPrompts();
    } catch (err) {
      console.error('删除提示词失败:', err);
      alert('删除提示词失败');
    }
  };

  const handleTogglePublish = async (prompt: AdminPrompt) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await updatePrompt(token, prompt.id, {
        isPublished: !prompt.isPublished,
      });

      loadPrompts();
    } catch (err) {
      console.error('更新发布状态失败:', err);
      alert('更新发布状态失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">提示词管理</h1>
          <p className="text-purple-200">审核和管理所有提示词</p>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 搜索框 */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="搜索标题或描述..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* 模型筛选 */}
            <select
              value={modelFilter}
              onChange={(e) => {
                setModelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all" className="bg-slate-800">所有模型</option>
              <option value="sora" className="bg-slate-800">Sora</option>
              <option value="veo" className="bg-slate-800">Veo</option>
              <option value="nano_banana" className="bg-slate-800">Nano Banana</option>
              <option value="seedream" className="bg-slate-800">SeeDream</option>
            </select>

            {/* 发布状态筛选 */}
            <select
              value={publishFilter}
              onChange={(e) => {
                setPublishFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all" className="bg-slate-800">所有状态</option>
              <option value="published" className="bg-slate-800">已发布</option>
              <option value="unpublished" className="bg-slate-800">未发布</option>
            </select>
          </div>
        </motion.div>

        {/* 提示词列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center text-white">加载中...</div>
          ) : prompts.length === 0 ? (
            <div className="p-8 text-center text-purple-200">没有找到提示词</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left py-4 px-6 text-purple-200 font-semibold">标题</th>
                      <th className="text-left py-4 px-6 text-purple-200 font-semibold">模型</th>
                      <th className="text-left py-4 px-6 text-purple-200 font-semibold">作者</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">浏览</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">收藏</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">状态</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">创建时间</th>
                      <th className="text-center py-4 px-6 text-purple-200 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prompts.map((prompt) => (
                      <tr key={prompt.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{prompt.title}</span>
                            {prompt.isPremium && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200">
                            {prompt.model}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-purple-200">{prompt.authorUsername}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-300">
                            <Eye className="w-4 h-4" />
                            <span>{prompt.viewsCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1 text-pink-300">
                            <Heart className="w-4 h-4" />
                            <span>{prompt.favoritesCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleTogglePublish(prompt)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                              prompt.isPublished
                                ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40'
                                : 'bg-red-500/30 text-red-200 hover:bg-red-500/40'
                            }`}
                          >
                            {prompt.isPublished ? (
                              <>
                                <Check className="w-3 h-3" />
                                已发布
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                未发布
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center text-purple-200 text-sm">
                          {new Date(prompt.createdAt).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditPrompt(prompt)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePrompt(prompt.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                              title="删除"
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
                    共 {pagination.total} 个提示词，第 {pagination.page} / {pagination.totalPages} 页
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
      {showEditModal && editingPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-4">编辑提示词</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2">标题</label>
                <input
                  type="text"
                  value={editingPrompt.title}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-purple-200 mb-2">描述</label>
                <textarea
                  value={editingPrompt.description || ''}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-purple-200">
                  <input
                    type="checkbox"
                    checked={editingPrompt.isPublished}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  已发布
                </label>
                <label className="flex items-center gap-2 text-purple-200">
                  <input
                    type="checkbox"
                    checked={editingPrompt.isPremium}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, isPremium: e.target.checked })}
                    className="w-4 h-4"
                  />
                  高级内容
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                <div>
                  <div className="text-purple-200 text-sm mb-1">模型</div>
                  <div className="text-white font-semibold">{editingPrompt.model}</div>
                </div>
                <div>
                  <div className="text-purple-200 text-sm mb-1">浏览量</div>
                  <div className="text-white font-semibold">{editingPrompt.viewsCount}</div>
                </div>
                <div>
                  <div className="text-purple-200 text-sm mb-1">收藏数</div>
                  <div className="text-white font-semibold">{editingPrompt.favoritesCount}</div>
                </div>
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
                  setEditingPrompt(null);
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

