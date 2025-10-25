import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyFavorites, toggleFavorite, type Prompt } from '../services/prompt.service';
import { Heart, Eye, Calendar, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MyFavoritesPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, [page]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyFavorites({ page, limit: 12 });
      
      if (response.success && response.data) {
        setPrompts(response.data.prompts);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err: any) {
      console.error('Failed to load favorites:', err);
      setError('加载收藏失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (promptId: string) => {
    try {
      setRemovingId(promptId);
      await toggleFavorite(promptId);
      
      // 从列表中移除
      setPrompts(prompts.filter(p => p.id !== promptId));
    } catch (err: any) {
      console.error('Failed to remove favorite:', err);
      alert('取消收藏失败，请稍后重试');
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
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
          <p className="text-gray-600">加载收藏中...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">我的收藏</h1>
          <p className="text-gray-600">
            您已收藏了 <span className="font-semibold text-purple-600">{prompts.length}</span> 个提示词
          </p>
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
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">还没有收藏</h3>
            <p className="text-gray-500 mb-8">快去提示词库发现优质内容吧！</p>
            <Link to="/library" className="btn-primary inline-flex items-center gap-2">
              <Heart className="w-5 h-5" />
              浏览提示词库
            </Link>
          </motion.div>
        ) : (
          <>
            {/* 收藏列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {prompts.map((prompt, index) => (
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
                        <div className="h-48 overflow-hidden">
                          <img
                            src={prompt.previewImage}
                            alt={prompt.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-white text-5xl font-bold">
                            {prompt.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* 内容 */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                            {prompt.title}
                          </h3>
                          
                          <button
                            onClick={() => handleRemoveFavorite(prompt.id)}
                            disabled={removingId === prompt.id}
                            className="ml-2 p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                            title="取消收藏"
                          >
                            {removingId === prompt.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>

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
                              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                              {prompt.favoriteCount}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(prompt.createdAt)}
                          </span>
                        </div>

                        {/* 查看按钮 */}
                        <Link
                          to={`/library/${prompt.id}`}
                          className="block w-full text-center py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                  上一页
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
                  下一页
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyFavoritesPage;

