# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建TypeScript项目
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 复制package文件并只安装生产依赖
COPY package*.json ./
RUN npm ci --omit=dev

# 从构建阶段复制编译后的文件
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["node", "dist/index.js"]

