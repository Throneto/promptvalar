import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('请输入有效的邮箱地址');
      setSubscribeStatus('error');
      return;
    }

    setSubscribeStatus('loading');
    
    // 这里可以连接到实际的订阅API
    setTimeout(() => {
      setSubscribeStatus('success');
      setMessage('订阅成功！感谢您的支持！');
      setEmail('');
      
      setTimeout(() => {
        setSubscribeStatus('idle');
        setMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">订阅我们的新闻通讯</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              获取最新的AI提示词技巧、产品更新和独家优惠
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={subscribeStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading' ? '订阅中...' : '订阅'}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-sm ${subscribeStatus === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">PromptValar</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              专业的AI提示词工程平台，为内容创作者提供强大工具。
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Throneto/promptvalar" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://twitter.com/promptvalar" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/studio" className="hover:text-primary transition-colors">
                  Prompt Studio
                </a>
              </li>
              <li>
                <a href="/library" className="hover:text-primary transition-colors">
                  Prompt Library
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-primary transition-colors">
                  定价方案
                </a>
              </li>
              <li>
                <a href="/api" className="hover:text-primary transition-colors">
                  API 接口
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">资源</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/docs" className="hover:text-primary transition-colors">
                  文档中心
                </a>
              </li>
              <li>
                <a href="/guides" className="hover:text-primary transition-colors">
                  使用指南
                </a>
              </li>
              <li>
                <a href="/tutorials" className="hover:text-primary transition-colors">
                  视频教程
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-primary transition-colors">
                  常见问题
                </a>
              </li>
              <li>
                <a href="/changelog" className="hover:text-primary transition-colors">
                  更新日志
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">社区</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="https://discord.gg/promptvalar" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Discord 社区
                </a>
              </li>
              <li>
                <a href="https://github.com/Throneto/promptvalar" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-primary transition-colors">
                  用户分享
                </a>
              </li>
              <li>
                <a href="/showcase" className="hover:text-primary transition-colors">
                  作品展示
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">公司</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  关于我们
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary transition-colors">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary transition-colors">
                  服务条款
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-primary transition-colors">
                  退款政策
                </a>
              </li>
              <li>
                <a href="mailto:support@promptvalar.com" className="hover:text-primary transition-colors">
                  联系支持
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 PromptValar. 保留所有权利。</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-primary transition-colors">隐私</a>
              <a href="/terms" className="hover:text-primary transition-colors">条款</a>
              <a href="/refund-policy" className="hover:text-primary transition-colors">退款</a>
              <a href="/sitemap" className="hover:text-primary transition-colors">网站地图</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

