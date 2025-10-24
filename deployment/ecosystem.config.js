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

