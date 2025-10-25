import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * 用户表
 * 存储所有注册用户的基本信息和认证数据
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  subscriptionTier: varchar('subscription_tier', { length: 20 }).notNull().default('free'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 提示词表
 * 存储用户创建和发布的AI提示词
 */
export const prompts = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  promptText: text('prompt_text').notNull(),
  model: varchar('model', { length: 50 }).notNull(), // 'sora', 'veo', 'nano_banana', 'seedream'
  category: varchar('category', { length: 50 }),
  style: varchar('style', { length: 50 }),
  tags: text('tags').array().default(sql`ARRAY[]::text[]`),
  previewImageUrl: text('preview_image_url'),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  favoritesCount: integer('favorites_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

/**
 * 结构化提示词表
 * 存储解析后的提示词组件,用于结构化编辑器
 */
export const structuredPrompts = pgTable('structured_prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  promptId: uuid('prompt_id')
    .references(() => prompts.id, { onDelete: 'cascade' })
    .notNull(),
  subject: text('subject'),
  action: text('action'),
  setting: text('setting'),
  shotType: varchar('shot_type', { length: 50 }),
  lighting: varchar('lighting', { length: 100 }),
  composition: text('composition'),
  mood: text('mood').array().default(sql`ARRAY[]::text[]`),
  parameters: jsonb('parameters'), // 存储模型特定参数
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * 收藏表
 * 记录用户收藏的提示词
 */
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  promptId: uuid('prompt_id')
    .references(() => prompts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * 订阅表
 * 管理用户的Pro订阅信息
 */
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  planType: varchar('plan_type', { length: 20 }).notNull(), // 'pro'
  status: varchar('status', { length: 20 }).notNull(), // 'active', 'cancelled', 'expired'
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * AI使用日志表
 * 跟踪AI API调用,用于成本控制和分析
 */
export const aiUsageLogs = pgTable('ai_usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  model: varchar('model', { length: 100 }).notNull(),
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  cost: integer('cost').notNull(), // 以美分为单位
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

/**
 * 提示词生成日志表
 * 记录每次提示词生成的详细信息，用于质量分析和优化
 */
export const promptGenerationLogs = pgTable('prompt_generation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  
  // 输入数据
  inputIdea: text('input_idea').notNull(),
  inputModel: varchar('input_model', { length: 50 }).notNull(),
  inputStyle: varchar('input_style', { length: 50 }),
  
  // 输出数据
  outputPrompt: text('output_prompt').notNull(),
  outputStructured: jsonb('output_structured'),
  
  // 性能指标
  generationTime: integer('generation_time'), // 毫秒
  tokensUsed: integer('tokens_used'),
  aiModelUsed: varchar('ai_model_used', { length: 100 }),
  
  // 用户反馈
  userRating: integer('user_rating'), // 1-5星
  isSuccessful: boolean('is_successful'),
  userFeedback: text('user_feedback'),
  wasCopied: boolean('was_copied').default(false).notNull(),
  wasSaved: boolean('was_saved').default(false).notNull(),
  
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  ratedAt: timestamp('rated_at'),
});

