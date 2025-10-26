import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyPrompts, deletePrompt, type Prompt } from '../services/prompt.service';
import { Edit, Trash2, Eye, Heart, Calendar, Loader2, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MyPromptsPage() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadMyPrompts();
  }, [page, searchQuery, sortBy, sortOrder]);

  const loadMyPrompts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 获取当前用户创建的提示词
      const response = await getMyPrompts({ 
        page, 
        limit: 12,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });
      
      if (response.success && response.data) {
        setPrompts(response.data.prompts);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err: any) {
      console.error('Failed to load prompts:', err);
      setError('Failed to load prompts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(promptId);
      const response = await deletePrompt(promptId);
      
      if (response.success) {
        // Remove from list
        setPrompts(prompts.filter(p => p.id !== promptId));
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down';
        notification.textContent = '✓ Deleted successfully!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (err: any) {
      console.error('Failed to delete prompt:', err);
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down';
      notification.textContent = '✗ Failed to delete. Please try again.';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (promptId: string) => {
    // Navigate to edit page
    navigate(`/studio?edit=${promptId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Prompts</h1>
            <p className="text-gray-600">
              You have created <span className="font-semibold text-purple-600">{prompts.length}</span> prompts
            </p>
            </div>
            
            <Link
              to="/studio"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Prompt
            </Link>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 排序选择 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder as 'asc' | 'desc');
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="viewsCount-desc">Most Viewed</option>
              <option value="favoritesCount-desc">Most Favorited</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* 空状态 */}
        {!loading && prompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Prompts Created Yet</h3>
            <p className="text-gray-500 mb-8">Use AI Studio to create your first prompt!</p>
            <Link to="/studio" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Get Started
            </Link>
          </motion.div>
        ) : (
          <>
            {/* 提示词列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {Array.isArray(prompts) ? prompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow group">
                      {/* 预览图 */}
                      {prompt.previewImage ? (
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={prompt.previewImage}
                            alt={prompt.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          
                          {/* 操作按钮叠加层 */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleEdit(prompt.id)}
                              className="p-3 bg-white rounded-full hover:bg-purple-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5 text-purple-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(prompt.id)}
                              disabled={deletingId === prompt.id}
                              className="p-3 bg-white rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === prompt.id ? (
                                <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative">
                          <span className="text-white text-5xl font-bold">
                            {prompt.title.charAt(0).toUpperCase()}
                          </span>
                          
                          {/* 操作按钮叠加层 */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleEdit(prompt.id)}
                              className="p-3 bg-white rounded-full hover:bg-purple-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5 text-purple-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(prompt.id)}
                              disabled={deletingId === prompt.id}
                              className="p-3 bg-white rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === prompt.id ? (
                                <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 内容 */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                          {prompt.title}
                        </h3>

                        {prompt.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {prompt.description}
                          </p>
                        )}

                        {/* 标签 */}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {prompt.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {prompt.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{prompt.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* 统计信息 */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {prompt.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {prompt.favoriteCount}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(prompt.updatedAt)}
                          </span>
                        </div>

                        {/* 操作按钮 */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleEdit(prompt.id)}
                            className="py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <Link
                            to={`/library/${prompt.id}`}
                            className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium text-center flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : null}
              </AnimatePresence>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex justify-center gap-2"
              >
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyPromptsPage;

