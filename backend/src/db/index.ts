import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// 创建PostgreSQL连接
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 创建postgres客户端
const client = postgres(connectionString);

// 创建drizzle数据库实例
export const db = drizzle(client, { schema });

// 导出schema供外部使用
export * from './schema.js';

