import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptRatingProps {
  logId: string;
  onRated?: () => void;
}

export const PromptRating: React.FC<PromptRatingProps> = ({ logId, onRated }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const handleRate = async (value: number) => {
    setRating(value);
    setShowFeedback(true);
  };
  
  const submitFeedback = async () => {
    if (!logId) {
      console.error('No logId provided');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/feedback/generations/${logId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          isSuccessful: rating >= 3,
          feedback: feedback || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('提交反馈失败');
      }
      
      setSubmitted(true);
      onRated?.();
      
      // 3秒后隐藏
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    } catch (error) {
      console.error('提交反馈失败:', error);
      alert('提交反馈失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };
  
  const skipFeedback = async () => {
    // 只提交评分，不提交文字反馈
    setSubmitting(true);
    
    try {
      await fetch(`http://localhost:5000/api/v1/feedback/generations/${logId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          isSuccessful: rating >= 3,
        }),
      });
      
      setSubmitted(true);
      onRated?.();
      
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    } catch (error) {
      console.error('提交评分失败:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 已提交状态
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/30 rounded-lg"
      >
        <ThumbsUp size={24} className="text-green-400" />
        <div>
          <p className="text-green-400 font-semibold">感谢您的反馈！</p>
          <p className="text-green-300 text-sm">您的意见将帮助我们改进提示词质量</p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 星级评分 */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-cyan-400" />
            <span className="text-white font-medium">这个提示词质量如何？</span>
          </div>
          
          {rating > 0 && !showFeedback && (
            <button
              onClick={() => setShowFeedback(true)}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              添加评论
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* 星星 */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleRate(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                disabled={submitting}
                className="transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star
                  size={32}
                  fill={(hover || rating) >= value ? '#fbbf24' : 'none'}
                  className={`transition-all ${
                    (hover || rating) >= value ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {/* 评分文字 */}
          {rating > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-yellow-400 font-semibold text-lg"
            >
              {rating === 5 && '🎉 完美!'}
              {rating === 4 && '👍 很好!'}
              {rating === 3 && '😊 还行'}
              {rating === 2 && '😐 一般'}
              {rating === 1 && '😞 需要改进'}
            </motion.span>
          )}
        </div>
      </div>
      
      {/* 反馈输入框 */}
      <AnimatePresence>
        {showFeedback && !submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 space-y-4"
          >
            <div className="flex items-start justify-between">
              <p className="text-gray-400 text-sm">
                {rating >= 4
                  ? '太好了！能告诉我们您最喜欢的是什么吗？'
                  : rating === 3
                  ? '您觉得有什么地方可以改进吗？'
                  : '我们很想知道如何改进，请告诉我们您的想法。'}
              </p>
              <button
                onClick={() => setShowFeedback(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="您的反馈将帮助我们优化提示词策略（可选）..."
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none transition-all"
              rows={4}
              disabled={submitting}
            />
            
            <div className="flex gap-3">
              <button
                onClick={submitFeedback}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '提交反馈'}
              </button>
              <button
                onClick={skipFeedback}
                disabled={submitting}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                跳过
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

