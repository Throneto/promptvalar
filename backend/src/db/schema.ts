import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
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
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user', 'admin'
  subscriptionTier: varchar('subscription_tier', { length: 20 }).notNull().default('free'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(), // 用于禁用/启用用户
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  usernameIdx: index('users_username_idx').on(table.username),
  roleIdx: index('users_role_idx').on(table.role),
  subscriptionIdx: index('users_subscription_tier_idx').on(table.subscriptionTier),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));

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
}, (table) => ({
  authorIdx: index('prompts_author_id_idx').on(table.authorId),
  modelIdx: index('prompts_model_idx').on(table.model),
  categoryIdx: index('prompts_category_idx').on(table.category),
  isPublishedIdx: index('prompts_is_published_idx').on(table.isPublished),
  viewsCountIdx: index('prompts_views_count_idx').on(table.viewsCount),
  favoritesCountIdx: index('prompts_favorites_count_idx').on(table.favoritesCount),
  createdAtIdx: index('prompts_created_at_idx').on(table.createdAt),
}));

/**
 * 结构化提示词表 (8要素框架)
 * 存储解析后的提示词组件,用于结构化编辑器
 * 基于导演式提示词优化理论的8要素模型：
 * Subject, Setting, Action, Camera, Style, Audio, Timeline, Constraints
 */
export const structuredPrompts = pgTable('structured_prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  promptId: uuid('prompt_id')
    .references(() => prompts.id, { onDelete: 'cascade' })
    .notNull(),
  
  // 核心要素 (1-3)
  subject: text('subject'), // 要素1: 主题 - 主角及其特征
  setting: text('setting'), // 要素2: 环境 - 场景、时间、天气、氛围
  action: text('action'), // 要素3: 动作 - 具体连续的动作描述
  
  // 摄影要素 (4)
  shotType: varchar('shot_type', { length: 50 }), // 要素4a: 镜头类型 - close-up, wide-angle, drone view等
  cameraMovement: varchar('camera_movement', { length: 100 }), // 要素4b: 镜头运动 - tracking, dolly, crane等
  
  // 视觉与音频 (5-6)
  style: text('style'), // 要素5: 视觉风格 - 美学风格、色调、光线
  lighting: varchar('lighting', { length: 100 }), // 光线条件（style的子集，保留兼容性）
  audio: text('audio'), // 要素6: 音效 - 对话、音效、配乐（Veo特别重要）
  
  // 叙事结构 (7)
  timeline: jsonb('timeline'), // 要素7: 时间轴 - [{start: 0, end: 3, description: "..."}]
  
  // 质量控制 (8)
  constraints: text('constraints'), // 要素8: 约束条件 - 物理约束、负面提示词
  
  // 传统字段（保留兼容性）
  composition: text('composition'),
  mood: text('mood').array().default(sql`ARRAY[]::text[]`),
  parameters: jsonb('parameters'), // 存储模型特定参数（duration, resolution, aspectRatio等）
  
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
}, (table) => ({
  userIdx: index('favorites_user_id_idx').on(table.userId),
  promptIdx: index('favorites_prompt_id_idx').on(table.promptId),
  userPromptIdx: index('favorites_user_prompt_idx').on(table.userId, table.promptId),
}));

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
}, (table) => ({
  userIdx: index('subscriptions_user_id_idx').on(table.userId),
  statusIdx: index('subscriptions_status_idx').on(table.status),
  stripeSubIdx: index('subscriptions_stripe_sub_id_idx').on(table.stripeSubscriptionId),
}));

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

/**
 * 管理员操作日志表
 * 记录管理员的所有操作，用于审计和追踪
 */
export const adminActionLogs = pgTable('admin_action_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id')
    .references(() => users.id, { onDelete: 'set null' })
    .notNull(),
  action: varchar('action', { length: 100 }).notNull(), // 操作类型
  targetType: varchar('target_type', { length: 50 }), // 'user', 'prompt', 'subscription'
  targetId: uuid('target_id'), // 操作对象的ID
  details: jsonb('details'), // 操作详情
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

