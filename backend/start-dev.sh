#!/bin/bash
#订阅系统开发服务器启动脚本

cd "$(dirname "$0")"

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

# 启动开发服务器
npm run dev

