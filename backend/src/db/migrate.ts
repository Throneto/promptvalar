import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 用于迁移的连接
const migrationClient = postgres(connectionString, { max: 1 });
const db = drizzle(migrationClient);

async function main() {
  console.log('🔄 Running database migrations...');
  
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('✅ Migrations completed successfully');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

