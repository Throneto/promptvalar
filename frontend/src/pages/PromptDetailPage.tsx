import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Eye,
  Copy,
  Check,
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Share2,
  Edit,
  Loader2,
} from 'lucide-react';
import { getPromptById, toggleFavorite } from '../services/prompt.service';
import { getCurrentUser, isAuthenticated } from '../services/auth.service';

const PromptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setCurrentUser(user);
    }
  }, []);

  // 获取提示词详情
  useEffect(() => {
    const fetchPromptDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getPromptById(id);
        
        if (response.success && response.data) {
          setPrompt(response.data);
          setIsFavorited(response.data.isFavorited || false);
          
          // 检查是否是作者本人
          if (currentUser && response.data.author) {
            setIsOwner(currentUser.id === response.data.author.id);
          }
        }
      } catch (err: any) {
        console.error('Failed to load prompt:', err);
        setError('加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptDetail();
  }, [id, currentUser]);

  // 复制提示词
  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = async () => {
    if (!prompt || !id) return;
    
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/library/${id}` } });
      return;
    }

    try {
      const response = await toggleFavorite(id);
      
      if (response.success) {
        const newFavoritedState = response.data.isFavorited;
        setIsFavorited(newFavoritedState);

        // 更新收藏数量
        setPrompt((prev: any) =>
          prev
            ? {
                ...prev,
                favoriteCount: newFavoritedState
                  ? prev.favoriteCount + 1
                  : prev.favoriteCount - 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error('收藏失败:', err);
      alert('操作失败，请稍后重试');
    }
  };

  // 编辑提示词
  const handleEdit = () => {
    if (id) {
      navigate(`/studio?edit=${id}`);
    }
  };

  // 分享提示词
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板！');
    } catch (err) {
      console.error('分享失败:', err);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || '提示词不存在'}</p>
          <Link
            to="/library"
            className="text-purple-600 hover:text-purple-700 underline transition-colors"
          >
            返回提示词库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮和编辑按钮 */}
        <div className="mb-6 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </motion.button>

          {isOwner && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit size={18} />
              <span>编辑</span>
            </motion.button>
          )}
        </div>

        {/* 主内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：预览图和作者信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* 预览图 */}
            {prompt.previewImage ? (
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                <img
                  src={prompt.previewImage}
                  alt={prompt.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl overflow-hidden border border-gray-200 shadow-lg h-64 flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {prompt.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* 作者卡片 */}
            {prompt.author && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-purple-600" />
                  作者信息
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {prompt.author.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{prompt.author.username}</p>
                    <p className="text-gray-500 text-sm">{prompt.author.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 统计信息 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Eye size={18} />
                    浏览量
                  </span>
                  <span className="text-gray-900 font-semibold">{prompt.viewCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Heart size={18} />
                    收藏数
                  </span>
                  <span className="text-gray-900 font-semibold">{prompt.favoriteCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Calendar size={18} />
                    创建时间
                  </span>
                  <span className="text-gray-900 text-sm">{formatDate(prompt.createdAt)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：提示词内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* 标题和操作按钮 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{prompt.title}</h1>
                  {prompt.description && (
                    <p className="text-gray-600 text-lg">{prompt.description}</p>
                  )}
                </div>
              </div>

              {/* 标签和元信息 */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {prompt.modelType}
                </span>
                {prompt.style && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    {prompt.style}
                  </span>
                )}
                {prompt.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {prompt.category}
                  </span>
                )}
              </div>

              {/* 标签列表 */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  <Tag size={16} className="text-gray-500" />
                  {prompt.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-gray-600 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? '已复制！' : '复制提示词'}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${
                    isFavorited
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                  {isFavorited ? '已收藏' : '收藏'}
                </button>
                <button 
                  onClick={handleShare}
                  className="px-6 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* 提示词内容 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">完整提示词</h3>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {prompt.content}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;

