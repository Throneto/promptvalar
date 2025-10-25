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
  Sparkles,
  Share2,
} from 'lucide-react';

// 类型定义
interface Author {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}

interface StructuredPrompt {
  subject?: string;
  action?: string;
  setting?: string;
  shotType?: string;
  lighting?: string;
  composition?: string;
  mood?: string[];
  parameters?: Record<string, any>;
}

interface PromptDetail {
  id: string;
  title: string;
  description?: string;
  promptText: string;
  model: string;
  category?: string;
  style?: string;
  tags: string[];
  previewImageUrl?: string;
  authorId: string;
  isPremium: boolean;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  structured?: StructuredPrompt | null;
  isFavorited: boolean;
}

const PromptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // 获取提示词详情
  useEffect(() => {
    const fetchPromptDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/api/v1/prompts/${id}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('获取提示词详情失败');
        }

        const data = await response.json();
        setPrompt(data.data);
        setIsFavorited(data.data.isFavorited);
      } catch (err: any) {
        setError(err.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPromptDetail();
    }
  }, [id]);

  // 复制提示词
  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = async () => {
    if (!prompt) return;
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/prompts/${id}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('收藏操作失败');
      }

      const data = await response.json();
      setIsFavorited(data.data.isFavorited);

      // 更新收藏数量
      setPrompt((prev) =>
        prev
          ? {
              ...prev,
              favoritesCount: data.data.isFavorited
                ? prev.favoritesCount + 1
                : prev.favoritesCount - 1,
            }
          : null
      );
    } catch (err) {
      console.error('收藏失败:', err);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || '提示词不存在'}</p>
          <Link
            to="/library"
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            返回提示词库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </motion.button>

        {/* 主内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：预览图和作者信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* 预览图 */}
            {prompt.previewImageUrl && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
                <img
                  src={prompt.previewImageUrl}
                  alt={prompt.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* 作者卡片 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-cyan-400" />
                作者信息
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {prompt.author.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{prompt.author.username}</p>
                  {prompt.author.bio && (
                    <p className="text-gray-400 text-sm">{prompt.author.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Eye size={18} />
                    浏览量
                  </span>
                  <span className="text-white font-semibold">{prompt.viewsCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Heart size={18} />
                    收藏数
                  </span>
                  <span className="text-white font-semibold">{prompt.favoritesCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Calendar size={18} />
                    创建时间
                  </span>
                  <span className="text-white text-sm">{formatDate(prompt.createdAt)}</span>
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
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-3">{prompt.title}</h1>
                  {prompt.description && (
                    <p className="text-gray-400 text-lg">{prompt.description}</p>
                  )}
                </div>
                {prompt.isPremium && (
                  <span className="ml-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <Sparkles size={14} />
                    PRO
                  </span>
                )}
              </div>

              {/* 标签和元信息 */}
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                  {prompt.model}
                </span>
                {prompt.style && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                    {prompt.style}
                  </span>
                )}
                {prompt.category && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    {prompt.category}
                  </span>
                )}
              </div>

              {/* 标签列表 */}
              {prompt.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  <Tag size={16} className="text-gray-400" />
                  {prompt.tags.map((tag, index) => (
                    <span key={index} className="text-gray-400 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? '已复制！' : '复制提示词'}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${
                    isFavorited
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                  {isFavorited ? '已收藏' : '收藏'}
                </button>
                <button className="px-6 py-3 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200 flex items-center justify-center">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* 提示词内容 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <h3 className="text-white font-semibold mb-4 text-lg">完整提示词</h3>
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {prompt.promptText}
                </p>
              </div>
            </div>

            {/* 结构化内容（如果有） */}
            {prompt.structured && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <h3 className="text-white font-semibold mb-4 text-lg">结构化组件</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prompt.structured.subject && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">主题 (Subject)</p>
                      <p className="text-white">{prompt.structured.subject}</p>
                    </div>
                  )}
                  {prompt.structured.action && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">动作 (Action)</p>
                      <p className="text-white">{prompt.structured.action}</p>
                    </div>
                  )}
                  {prompt.structured.setting && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">场景 (Setting)</p>
                      <p className="text-white">{prompt.structured.setting}</p>
                    </div>
                  )}
                  {prompt.structured.shotType && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">镜头类型 (Shot Type)</p>
                      <p className="text-white">{prompt.structured.shotType}</p>
                    </div>
                  )}
                  {prompt.structured.lighting && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">光照 (Lighting)</p>
                      <p className="text-white">{prompt.structured.lighting}</p>
                    </div>
                  )}
                  {prompt.structured.composition && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">构图 (Composition)</p>
                      <p className="text-white">{prompt.structured.composition}</p>
                    </div>
                  )}
                  {prompt.structured.mood && prompt.structured.mood.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-gray-400 text-sm mb-2">氛围 (Mood)</p>
                      <div className="flex flex-wrap gap-2">
                        {prompt.structured.mood.map((m, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;

