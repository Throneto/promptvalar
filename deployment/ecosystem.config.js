// PM2 配置文件 - 1G VPS优化版
// 使用方法: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'promptvalar-backend',
      script: 'dist/index.js',
      cwd: '/var/www/promptvalar/backend',
      instances: 1, // 单核CPU只运行1个实例
      exec_mode: 'fork', // 使用fork模式而不是cluster
      autorestart: true,
      watch: false,
      max_memory_restart: '250M', // 内存超过250M自动重启
      node_args: '--max-old-space-size=256', // 限制Node.js堆内存
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        DATABASE_URL: 'postgresql://promptvalar:throne999000@localhost:5432/promptvalar',
        REDIS_URL: 'redis://localhost:6379',
        JWT_SECRET: '176c85036d5239b43264ec293488e08f3cca1af101ae51dfd556f9efce7efb4b',
        JWT_REFRESH_SECRET: 'e54a1c0b9110ca07e92a1dfc941671873ec74a89ffbfd9570b947369201c12cb',
        OPENROUTER_API_KEY: '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',
        OPENROUTER_APP_NAME: 'PromptValar',
        CORS_ORIGIN: 'https://promptvalar.com',
        APP_URL: 'https://promptvalar.com',
        API_URL: 'https://api.promptvalar.com',
        STRIPE_TEST_MODE: 'true',
        STRIPE_SECRET_KEY: 'sk_test_placeholder',
        STRIPE_WEBHOOK_SECRET: 'whsec_test_placeholder',
        STRIPE_PRO_PRICE_ID: 'price_test_pro',
      },
      error_file: '/var/log/pm2/promptvalar-error.log',
      out_file: '/var/log/pm2/promptvalar-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // 性能优化
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
      
      // 自动重启策略
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // 日志轮转
      log_type: 'json',
      
      // Cron重启（每天凌晨3点重启，释放内存）
      cron_restart: '0 3 * * *',
    },
  ],
};

