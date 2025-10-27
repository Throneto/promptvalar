# PromptValar - Project Development Rules
## Comprehensive Development Standards for English-Speaking AI Prompt Platform

---

## 📜 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Naming Conventions](#naming-conventions)
5. [UI/UX Design Rules](#uiux-design-rules)
6. [API Design Standards](#api-design-standards)
7. [Database Standards](#database-standards)
8. [AI Model Integration Rules](#ai-model-integration-rules)
9. [Security Requirements](#security-requirements)
10. [Git Workflow](#git-workflow)
11. [Testing Standards](#testing-standards)
12. [Documentation Requirements](#documentation-requirements)
13. [Performance Standards](#performance-standards)
14. [Accessibility Requirements](#accessibility-requirements)

---

## 🎯 Project Overview

**PromptValar** is an English-language AI prompt engineering platform targeting global users.

### Language Policy

1. **User-Facing Content** (MUST be English):
   - All UI text, labels, buttons, messages
   - User documentation and help content
   - Public API responses and error messages
   - Marketing materials and landing pages

2. **Development Content** (可使用中文):
   - Code comments (中文注释 is ALLOWED and ENCOURAGED for clarity)
   - Configuration files documentation (配置文件说明)
   - Internal chat and communication
   - Git commit messages (can be in Chinese)
   - Developer notes and TODO comments

**Example:**
```typescript
// ✅ GOOD: English UI, Chinese comments for team clarity
export const LoginPage = () => {
  // 用户登录逻辑：验证邮箱格式 -> 检查密码强度 -> 调用API
  const handleLogin = async (email: string, password: string) => {
    // 前端验证
    if (!isValidEmail(email)) {
      return showError('Please enter a valid email address'); // UI message in English
    }
    
    try {
      // 调用登录API
      await authService.login(email, password);
    } catch (error) {
      // 向用户显示英文错误信息
      showError('Login failed. Please check your credentials.');
    }
  };
  
  return (
    <div>
      <h1>Welcome Back</h1>  {/* UI text in English */}
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
};
```

### Core Principles
- **User-First**: Prioritize user experience in all design decisions
- **Performance**: Fast load times, smooth interactions
- **Accessibility**: WCAG 2.1 AA compliance mandatory
- **Security**: Security considerations in every feature
- **Maintainability**: Clean, documented, testable code
- **Clear Communication**: Chinese comments for team, English UI for users

---

## 🔄 Development Workflow

### Deployment Pipeline

**MANDATORY PROCESS**: Follow this exact sequence for all code changes.

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

Step 1: Development
┌──────────────────────────┐
│  Write/Optimize Code     │
│  - Feature development   │
│  - Bug fixes             │
│  - Code optimization     │
└──────────┬───────────────┘
           │
           ▼
Step 2: Git Synchronization
┌──────────────────────────┐
│  Commit to GitHub        │
│  - Stage changes         │
│  - Write commit message  │
│  - Push to repository    │
│  ⚠️  DO NOT AUTO-RUN     │
│  Show command only!      │
└──────────┬───────────────┘
           │
           ▼
Step 3: Deployment
┌──────────────────────────┐
│  Dokploy Auto-Deploy     │
│  - Webhook triggered     │
│  - Build & deploy        │
│  - Service restart       │
└──────────┬───────────────┘
           │
           ▼
Step 4: Testing
┌──────────────────────────┐
│  Manual Testing          │
│  - Test new features     │
│  - Verify bug fixes      │
│  - Check performance     │
└──────────────────────────┘
```

### Git Commit Rules

**IMPORTANT**: When code generation or optimization is complete:

1. **NEVER automatically execute git commands**
2. **ALWAYS provide command suggestions as code blocks**
3. **Let the developer review and execute manually**

**Example:**

```bash
# 提交代码建议（请手动执行）：

# 1. 查看修改的文件
git status

# 2. 添加修改到暂存区
git add .

# 3. 提交修改（使用中文提交信息）
git commit -m "feat(studio): 添加提示词实时预览功能"

# 4. 推送到 GitHub
git push origin main
```

**DO NOT DO THIS:**
```bash
❌ Automatically running: git add . && git commit -m "..." && git push
```

### Flowchart Requirements

**MANDATORY**: For any logic exceeding 3 steps, create a flowchart using Mermaid syntax.

#### When to Use Flowcharts

- ✅ User authentication flow (login → verification → redirect)
- ✅ Payment processing (select plan → payment → confirmation → activation)
- ✅ Prompt generation workflow (input → AI processing → parsing → display)
- ✅ File upload process (validate → upload → process → notify)
- ❌ Simple 2-step actions (click button → show modal)
- ❌ Basic CRUD operations (unless they involve complex business logic)

#### Flowchart Examples

**Example 1: User Registration Flow**

```mermaid
flowchart TD
    Start([用户点击注册]) --> Input[输入邮箱和密码]
    Input --> Validate{验证格式}
    
    Validate -->|格式错误| ShowError1[显示错误信息]
    ShowError1 --> Input
    
    Validate -->|格式正确| CheckExists{检查邮箱是否存在}
    CheckExists -->|已存在| ShowError2[提示邮箱已注册]
    ShowError2 --> Input
    
    CheckExists -->|不存在| HashPassword[密码加密]
    HashPassword --> SaveDB[(保存到数据库)]
    SaveDB --> SendEmail[发送验证邮件]
    SendEmail --> ShowSuccess[显示成功消息]
    ShowSuccess --> End([跳转到登录页])
```

**Example 2: AI Prompt Generation Flow**

```mermaid
flowchart TD
    Start([用户输入想法]) --> SelectModel[选择目标模型]
    SelectModel --> SelectStyle[选择风格]
    SelectStyle --> ClickGenerate[点击生成按钮]
    
    ClickGenerate --> CheckAuth{检查用户认证}
    CheckAuth -->|未登录| ShowLogin[提示登录]
    ShowLogin --> End1([结束])
    
    CheckAuth -->|已登录| CheckLimit{检查生成次数限制}
    CheckLimit -->|超限| ShowUpgrade[提示升级Pro]
    ShowUpgrade --> End2([结束])
    
    CheckLimit -->|未超限| CallAI[调用OpenRouter API]
    CallAI --> ProcessResponse{API响应}
    
    ProcessResponse -->|失败| Retry{重试次数<3?}
    Retry -->|是| CallAI
    Retry -->|否| ShowError[显示错误信息]
    ShowError --> End3([结束])
    
    ProcessResponse -->|成功| ParseStructure[解析提示词结构]
    ParseStructure --> UpdateUI[更新UI显示]
    UpdateUI --> FillEditor[填充结构化编辑器]
    FillEditor --> LogUsage[记录使用日志]
    LogUsage --> End4([生成完成])
```

**Example 3: Subscription Payment Flow**

```mermaid
flowchart TD
    Start([用户选择Pro套餐]) --> CheckLogin{已登录?}
    CheckLogin -->|否| Login[跳转登录]
    Login --> Start
    
    CheckLogin -->|是| CheckExisting{已有订阅?}
    CheckExisting -->|是| ShowManage[显示管理订阅页面]
    ShowManage --> End1([结束])
    
    CheckExisting -->|否| ShowPricing[显示价格详情]
    ShowPricing --> ClickSubscribe[点击订阅按钮]
    ClickSubscribe --> CreateStripeSession[创建Stripe会话]
    
    CreateStripeSession --> RedirectStripe[跳转到Stripe支付页]
    RedirectStripe --> UserPays{用户支付}
    
    UserPays -->|取消| ReturnCancel[返回定价页]
    ReturnCancel --> End2([结束])
    
    UserPays -->|成功| StripeWebhook[Stripe Webhook触发]
    StripeWebhook --> VerifySignature{验证签名}
    
    VerifySignature -->|失败| LogError[记录错误]
    LogError --> End3([结束])
    
    VerifySignature -->|成功| UpdateDB[(更新数据库订阅状态)]
    UpdateDB --> SendConfirmEmail[发送确认邮件]
    SendConfirmEmail --> RedirectSuccess[跳转成功页面]
    RedirectSuccess --> End4([订阅完成])
```

#### Mermaid Syntax Guide

```mermaid
flowchart TD
    A[矩形 - 处理步骤] --> B{菱形 - 判断条件}
    B -->|条件1| C[步骤C]
    B -->|条件2| D[步骤D]
    C --> E([圆角矩形 - 开始/结束])
    D --> F[(圆柱 - 数据库)]
    F --> E
```

**Common Shapes:**
- `[Text]` - Rectangle (process step)
- `{Text}` - Diamond (decision)
- `([Text])` - Rounded (start/end)
- `[(Text)]` - Cylinder (database)
- `((Text))` - Circle
- `>Text]` - Flag

### Development Environment Setup

#### Required Tools

```bash
# 1. 安装 Node.js 18+
node --version  # 应该显示 v18.x.x 或更高

# 2. 安装 pnpm（推荐）或 npm
npm install -g pnpm

# 3. 克隆仓库
git clone https://github.com/your-username/promptvalar.git
cd promptvalar

# 4. 安装依赖
pnpm install

# 5. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要的 API keys

# 6. 启动开发服务器
pnpm dev
```

#### Local Development vs. Production

```
Local Development:
┌─────────────────────────────────┐
│  localhost:3000 (Frontend)      │
│  localhost:5000 (Backend API)   │
│  localhost:5432 (PostgreSQL)    │
│  localhost:6379 (Redis)         │
└─────────────────────────────────┘

Production (Dokploy):
┌─────────────────────────────────┐
│  promptvalar.com (Frontend)     │
│  api.promptvalar.com (Backend)  │
│  Managed PostgreSQL             │
│  Managed Redis                  │
└─────────────────────────────────┘
```

### Dokploy Deployment Configuration

**Important Notes:**

1. **Automatic Deployment**: Dokploy watches the `main` branch
2. **Build Trigger**: Every push to `main` triggers rebuild
3. **Zero Downtime**: Rolling deployment strategy
4. **Environment Variables**: Managed in Dokploy dashboard
5. **Health Checks**: Automatic service health monitoring

**Deployment Checklist:**

Before pushing to `main`:
- [ ] Code passes all linting checks
- [ ] Environment variables are documented
- [ ] Database migrations are included (if any)
- [ ] No hardcoded secrets in code
- [ ] README is updated (if needed)

After Dokploy deployment:
- [ ] Check deployment logs in Dokploy dashboard
- [ ] Verify service is running
- [ ] Test critical user flows
- [ ] Check error monitoring (Sentry)

---

## 💻 Code Standards

### General Rules

1. **Language**: TypeScript is MANDATORY for all new code
2. **No `any` type**: Use proper TypeScript types; use `unknown` if truly dynamic
3. **Strict mode**: Enable TypeScript strict mode in all projects
4. **ESLint + Prettier**: All code MUST pass linting before commit
5. **Comments**: Write comments in Chinese (中文注释) or English; explain WHY, not WHAT
   - **Chinese comments are ENCOURAGED** for team clarity
   - Focus on explaining business logic and complex algorithms
   - Document tricky workarounds or non-obvious solutions

### TypeScript/JavaScript Standards

```typescript
// ✅ GOOD: Clear types, descriptive names, documented with Chinese comments
interface PromptGenerationRequest {
  /** 用户的自然语言想法描述 */
  userIdea: string;
  /** 目标AI模型 (如 'sora', 'veo') */
  targetModel: SupportedModel;
  /** 期望的艺术风格 */
  style: string;
  /** 可选：已认证用户的ID */
  userId?: string;
}

export async function generatePrompt(
  request: PromptGenerationRequest
): Promise<GeneratedPrompt> {
  // 先验证输入参数的合法性
  validatePromptRequest(request);
  
  // 根据目标模型选择最合适的AI引擎
  // Sora需要更详细的镜头描述，Veo需要包含音频元素
  const systemPrompt = getSystemPrompt(request.targetModel);
  
  // 调用OpenRouter API生成提示词
  const generatedText = await generateWithRetry(request.userIdea, systemPrompt);
  
  // 将生成的提示词解析为结构化数据
  // 这样用户可以在编辑器中精细调整各个部分
  const structured = await parsePromptToStructure(generatedText, request.targetModel);
  
  return {
    prompt: generatedText,
    structured,
  };
}

// ❌ BAD: Using 'any', unclear naming, no comments
async function gen(data: any): Promise<any> {
  return await api.post('/generate', data);
}
```

### React/Frontend Standards

```tsx
// ✅ GOOD: Functional component with TypeScript, clear props
interface PromptCardProps {
  prompt: Prompt;
  onFavorite: (promptId: string) => void;
  showAuthor?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onFavorite,
  showAuthor = true,
}) => {
  const handleFavoriteClick = useCallback(() => {
    onFavorite(prompt.id);
  }, [prompt.id, onFavorite]);

  return (
    <div className="prompt-card">
      {/* Component content */}
    </div>
  );
};

// ❌ BAD: Class component, no types, inline handlers
export class Card extends Component {
  render() {
    return (
      <div onClick={() => this.props.onClick()}>
        {this.props.children}
      </div>
    );
  }
}
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input)
│   ├── prompts/        # Prompt-related components
│   └── layout/         # Layout components (Header, Footer)
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── services/           # API and external service calls
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── styles/             # Global styles
```

### Code Style Rules

1. **Indentation**: 2 spaces (not tabs)
2. **Line length**: Max 100 characters
3. **Quotes**: Use single quotes for strings
4. **Semicolons**: Always use semicolons
5. **Arrow functions**: Prefer arrow functions for callbacks
6. **Destructuring**: Use destructuring where appropriate
7. **Async/Await**: Prefer async/await over promise chains

```typescript
// ✅ GOOD
const { username, email } = user;
const prompts = await fetchPrompts();

// ❌ BAD
const username = user.username;
const email = user.email;
fetchPrompts().then(prompts => { /* ... */ });
```

---

## 📛 Naming Conventions

### General Rules

- **English only**: All names must be in English
- **Descriptive**: Names should clearly indicate purpose
- **Avoid abbreviations**: Unless widely recognized (e.g., `id`, `url`, `api`)

### Specific Conventions

| Type | Convention | Example | ❌ Bad Example |
|------|-----------|---------|---------------|
| **Variables** | camelCase | `userName`, `promptText` | `user_name`, `UserName` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_PROMPT_LENGTH`, `API_BASE_URL` | `maxPromptLength` |
| **Functions** | camelCase (verb) | `generatePrompt`, `fetchUserData` | `prompt`, `user` |
| **Classes** | PascalCase | `PromptGenerator`, `UserService` | `promptGenerator` |
| **Interfaces/Types** | PascalCase | `PromptData`, `UserProfile` | `IPromptData`, `TUser` |
| **React Components** | PascalCase | `PromptCard`, `UserDashboard` | `promptCard`, `userDash` |
| **Files (Components)** | PascalCase | `PromptCard.tsx` | `prompt-card.tsx` |
| **Files (Utils)** | camelCase | `apiClient.ts`, `formatDate.ts` | `api-client.ts` |
| **CSS Classes** | kebab-case | `prompt-card`, `user-avatar` | `promptCard`, `UserAvatar` |
| **Database Tables** | snake_case | `users`, `prompts`, `subscriptions` | `Users`, `Prompts` |
| **Database Columns** | snake_case | `created_at`, `user_id` | `createdAt`, `userId` |
| **API Endpoints** | kebab-case | `/api/v1/generate-prompt` | `/api/v1/generatePrompt` |
| **Environment Variables** | UPPER_SNAKE_CASE | `DATABASE_URL`, `OPENROUTER_API_KEY` | `databaseUrl` |

### Boolean Naming

```typescript
// ✅ GOOD: Use is/has/can prefix
const isAuthenticated = true;
const hasSubscription = false;
const canEditPrompt = true;

// ❌ BAD
const authenticated = true;
const subscription = false;
```

### Event Handlers

```typescript
// ✅ GOOD: Use handle prefix
const handleClick = () => { /* ... */ };
const handleSubmit = () => { /* ... */ };
const handlePromptGenerate = () => { /* ... */ };

// ❌ BAD
const onClick = () => { /* ... */ };
const submit = () => { /* ... */ };
```

---

## 🎨 UI/UX Design Rules

### Design Principles

1. **Three-Step Workflow**: Always maintain the 3-card structure (Input → AI Generation → Fine-tuning)
2. **Progressive Disclosure**: Don't overwhelm users; reveal complexity gradually
3. **Immediate Feedback**: Provide visual feedback for all user actions
4. **Consistency**: Use consistent patterns across the platform
5. **Accessibility First**: Design for keyboard navigation and screen readers

### Layout Standards

#### Prompt Studio (Core Interface)

```
MANDATORY STRUCTURE:

┌─────────────────────────────────────────┐
│ Card 1: Start with Your Idea           │
│ - Large textarea (min 3 lines)         │
│ - Model dropdown (required)            │
│ - Style dropdown (required)            │
│ - "✨ Generate" button (primary CTA)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Card 2: AI-Optimized Prompt            │
│ - Generated prompt (readonly)           │
│ - "Copy" button (with success feedback) │
│ - "Regenerate" button (secondary)      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Card 3: Fine-Tune with Structured Editor│
│ - Subject input                         │
│ - Action input                          │
│ - Setting input                         │
│ - Shot Type dropdown                    │
│ - Lighting dropdown                     │
│ - Mood tags (multi-select)             │
│ - Parameters input                      │
│ - Final Preview (auto-updates)         │
│ - "Copy Final Prompt" button           │
└─────────────────────────────────────────┘
```

### Color Palette

```css
/* Primary Colors */
--primary: #6366f1;          /* Indigo - Main brand color */
--primary-dark: #4f46e5;     /* Hover states */
--primary-light: #a5b4fc;    /* Backgrounds */

/* Neutral Colors */
--background: #ffffff;
--surface: #f9fafb;
--text-primary: #111827;
--text-secondary: #6b7280;
--border: #e5e7eb;

/* Semantic Colors */
--success: #10b981;          /* Copy success, saved */
--warning: #f59e0b;          /* Premium features */
--error: #ef4444;            /* Errors, validation */
--info: #3b82f6;             /* Info messages */

/* Model-Specific Badges */
--sora-badge: #7c3aed;       /* Purple */
--veo-badge: #2563eb;        /* Blue */
--nano-badge: #f97316;       /* Orange */
--seedream-badge: #06b6d4;   /* Cyan */
```

### Typography

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Labels */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Headings */
--text-2xl: 1.5rem;    /* 24px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Hero */
```

### Component Standards

#### Buttons

```tsx
// Button hierarchy (in order of visual prominence)
<button className="btn-primary">Generate Prompt</button>    // Primary action
<button className="btn-secondary">Regenerate</button>        // Secondary action
<button className="btn-ghost">Cancel</button>                // Tertiary action
<button className="btn-danger">Delete</button>               // Destructive action

// Size variants
<button className="btn-primary btn-lg">Large</button>
<button className="btn-primary btn-md">Medium (default)</button>
<button className="btn-primary btn-sm">Small</button>

// States: Must support hover, active, disabled, loading
```

#### Input Fields

```tsx
// Standard input with label and validation
<div className="form-group">
  <label htmlFor="subject" className="form-label">
    Subject <span className="text-error">*</span>
  </label>
  <input
    id="subject"
    type="text"
    className="form-input"
    placeholder="e.g., a cat in an astronaut suit"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby="subject-error"
  />
  {hasError && (
    <span id="subject-error" className="form-error">
      Subject is required
    </span>
  )}
</div>
```

#### Cards

```tsx
// Prompt card component structure
<article className="prompt-card">
  <div className="prompt-card-image">
    <img src={prompt.previewUrl} alt={prompt.title} loading="lazy" />
    <span className="badge badge-model">{prompt.model}</span>
  </div>
  <div className="prompt-card-content">
    <h3 className="prompt-card-title">{prompt.title}</h3>
    <p className="prompt-card-description">{prompt.description}</p>
    <div className="prompt-card-meta">
      <span className="meta-views">👁️ {prompt.views}</span>
      <button className="btn-icon" aria-label="Add to favorites">
        ❤️
      </button>
    </div>
  </div>
</article>
```

### Responsive Design

```css
/* Mobile First Approach - Define breakpoints */
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;

/* MANDATORY: Test on these viewports */
/* - Mobile: 375x667 (iPhone SE) */
/* - Tablet: 768x1024 (iPad) */
/* - Desktop: 1920x1080 */

/* Example responsive card grid */
.prompt-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;              /* Mobile: 1 column */
}

@media (min-width: 768px) {
  .prompt-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .prompt-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}
```

### Animation Guidelines

```css
/* Use consistent timing functions */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;
--easing: cubic-bezier(0.4, 0, 0.2, 1);

/* Example: Button hover */
.btn-primary {
  transition: all var(--transition-base) var(--easing);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 2s var(--easing) infinite;
}
```

---

## 🔌 API Design Standards

### RESTful Principles

1. **Use HTTP methods correctly**:
   - `GET`: Retrieve data (no side effects)
   - `POST`: Create new resource
   - `PUT`: Update entire resource
   - `PATCH`: Partial update
   - `DELETE`: Remove resource

2. **URL Structure**:
   ```
   ✅ GOOD: /api/v1/prompts/:id
   ❌ BAD:  /api/v1/getPromptById
   
   ✅ GOOD: /api/v1/users/:userId/prompts
   ❌ BAD:  /api/v1/getUserPrompts?userId=123
   ```

3. **Versioning**: Always include API version (`/api/v1/`)

### Request/Response Standards

#### Request Format

```typescript
// POST /api/v1/ai/generate-prompt
{
  "userIdea": "A cat playing guitar on the moon",
  "targetModel": "sora",
  "style": "cinematic",
  "additionalContext": "Epic, dramatic lighting"
}

// Query parameters for listing
// GET /api/v1/prompts?model=sora&category=video&page=1&limit=20&sort=trending
```

#### Response Format

```typescript
// Success Response (200 OK)
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "prompt": "Generated prompt text...",
    "structured": {
      "subject": "a cat in a detailed astronaut suit",
      "action": "strumming an acoustic guitar",
      // ... more fields
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "processingTime": "1.2s"
  }
}

// Error Response (400 Bad Request)
{
  "success": false,
  "error": {
    "code": "INVALID_MODEL",
    "message": "The specified model 'invalid-model' is not supported",
    "details": {
      "field": "targetModel",
      "supportedModels": ["sora", "veo", "nano_banana", "seedream"]
    }
  }
}

// Paginated List Response (200 OK)
{
  "success": true,
  "data": [
    { /* prompt object */ },
    { /* prompt object */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that creates a resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Validation errors with details |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Temporary downtime, maintenance |

### Authentication

```typescript
// Headers for authenticated requests
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}

// JWT Token Payload Structure
{
  "sub": "user-uuid",           // Subject (user ID)
  "email": "user@example.com",
  "subscription": "pro",        // free | pro
  "iat": 1234567890,            // Issued at
  "exp": 1234568790             // Expiry (15 min for access token)
}
```

### Rate Limiting

```
X-RateLimit-Limit: 100           // Requests allowed per window
X-RateLimit-Remaining: 85        // Requests remaining
X-RateLimit-Reset: 1234567890    // Unix timestamp when limit resets
```

**Limits:**
- Free users: 20 AI generations per 15 minutes
- Pro users: 100 AI generations per 15 minutes
- General API: 100 requests per minute

### Error Messages

```typescript
// MUST be user-friendly and actionable
✅ GOOD: "Your prompt is too long. Please limit it to 500 characters."
❌ BAD:  "ERR_PROMPT_LENGTH_EXCEEDED"

✅ GOOD: "You've reached your free tier limit of 20 prompts per day. Upgrade to Pro for unlimited access."
❌ BAD:  "Rate limit exceeded"
```

---

## 🗄 Database Standards

### General Rules

1. **Always use UUIDs** for primary keys, not auto-increment integers
2. **Include timestamps**: `created_at`, `updated_at` on all tables
3. **Soft deletes**: Add `deleted_at` for important data (users, prompts)
4. **Foreign keys**: ALWAYS define foreign key constraints
5. **Indexes**: Create indexes on frequently queried columns

### Table Naming

```sql
-- ✅ GOOD: plural, snake_case
users
prompts
subscriptions
user_favorites

-- ❌ BAD
User
tbl_prompt
UserFavorite
```

### Column Naming

```sql
-- ✅ GOOD: descriptive, snake_case
user_id
created_at
is_premium
subscription_tier

-- ❌ BAD
uid
created
premium
tier
```

### Data Types

| Use Case | PostgreSQL Type | Example |
|----------|----------------|---------|
| Primary Key | `UUID` | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Short Text | `VARCHAR(n)` | `username VARCHAR(50)` |
| Long Text | `TEXT` | `prompt_text TEXT` |
| Email | `VARCHAR(255)` | `email VARCHAR(255)` |
| Password Hash | `VARCHAR(255)` | `password_hash VARCHAR(255)` |
| Boolean | `BOOLEAN` | `is_premium BOOLEAN DEFAULT false` |
| Integer | `INTEGER` | `views_count INTEGER DEFAULT 0` |
| Decimal | `DECIMAL(10,2)` | `price DECIMAL(10,2)` |
| Timestamp | `TIMESTAMP` | `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| JSON Data | `JSONB` | `parameters JSONB` |
| Array | `TEXT[]` | `tags TEXT[]` |

### Example Table Definition

```sql
CREATE TABLE prompts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core Fields
  title VARCHAR(255) NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  
  -- Categorization
  model VARCHAR(50) NOT NULL CHECK (model IN ('sora', 'veo', 'nano_banana', 'seedream')),
  category VARCHAR(50),
  style VARCHAR(50),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Media
  preview_image_url TEXT,
  
  -- Relationships
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Flags
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  
  -- Metrics
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_prompts_model ON prompts(model);
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_author ON prompts(author_id);
CREATE INDEX idx_prompts_created ON prompts(created_at DESC);
CREATE INDEX idx_prompts_published ON prompts(is_published) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_prompts_search ON prompts USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

### Query Standards

```typescript
// ✅ GOOD: Parameterized queries (prevent SQL injection)
const prompts = await db.query(
  'SELECT * FROM prompts WHERE author_id = $1 AND model = $2',
  [userId, model]
);

// ❌ BAD: String concatenation (SQL injection risk!)
const prompts = await db.query(
  `SELECT * FROM prompts WHERE author_id = '${userId}'`
);

// ✅ GOOD: Limit results for performance
SELECT * FROM prompts 
WHERE is_published = true 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

// ✅ GOOD: Use transactions for multi-step operations
BEGIN;
  INSERT INTO prompts (...) VALUES (...);
  UPDATE users SET prompt_count = prompt_count + 1 WHERE id = ...;
COMMIT;
```

---

## 🤖 AI Model Integration Rules

### Supported Models

Based on project requirements, we support these AI models:

| Model | Type | Primary Use Case | Prompt Style |
|-------|------|-----------------|--------------|
| **Sora** | Video | Cinematic video generation | Structured, story-driven |
| **Veo** | Video + Audio | Video with audio elements | Five-element formula |
| **nano banana** | Image | Fast, creative image generation | Scene narrative |
| **Seedream** | Image | High-fidelity image editing | Precise instructions |

### Prompt Generation Strategy

Each model requires different optimization approaches:

#### 1. Sora (Video Generation) - ⭐ 8要素框架优化版

**核心理念**：将AI定位为"电影导演"，提供"拍摄脚本"式的结构化指令。

**8要素框架**：

1. **Subject（主题）** - 精准定义主角及其特征
2. **Setting（环境）** - 营造氛围（地点、时间、天气）
3. **Action（动作）** - 具体、连续的动作描述
4. **Camera（摄影）** - 镜头类型 + 运动方式
5. **Style（视觉风格）** - 美学定义、色调
6. **Audio（音效）** - 声音描述（增强场景理解）
7. **Timeline（时间轴）** - 多场景规划
8. **Constraints（约束）** - 物理真实性要求

```typescript
interface SoraPromptStructure {
  // 要素1: Subject - 主题
  subject: string; // 例如: "a glossy black Bentley Continental Supersports"
  
  // 要素2: Setting - 环境
  setting: string; // 例如: "narrow alpine mountain road at dusk, dark clouds"
  
  // 要素3: Action - 动作
  action: string; // 例如: "racing down as a roaring avalanche cascades behind it"
  
  // 要素4: Camera - 摄影
  shotType: 'wide shot' | 'close-up' | 'drone view' | 'tracking shot' | 'POV';
  cameraMovement?: 'tracking' | 'dolly in/out' | 'crane' | 'pan' | 'static';
  
  // 要素5: Style - 视觉风格
  style?: string; // 例如: "Ultra-realistic, cinematic"
  lighting: string; // 例如: "cold blue tones with warm headlight glow"
  
  // 要素6: Audio - 音效
  audio?: string; // 例如: "thunderous engine growl and snow spray"
  
  // 要素7: Timeline - 时间轴（多场景视频）
  timeline?: {
    start: number;  // 开始时间（秒）
    end: number;    // 结束时间（秒）
    description: string; // 场景描述
  }[];
  
  // 要素8: Constraints - 约束条件
  constraints?: string; // 例如: "Enforce realistic physics, natural gravity, clean reflections"
  
  // 技术参数
  parameters: {
    duration?: string;      // e.g., "8 seconds"
    resolution?: string;    // e.g., "4K"
    aspectRatio?: string;   // e.g., "16:9"
  };
}

// ⭐ 优化后的Sora提示词模板（导演式编织）
const soraPrompt = `${subject} ${action} in ${setting}. 
${shotType}${cameraMovement ? ' with ' + cameraMovement : ''}. 
${style ? style + ', ' : ''}${lighting}. 
${audio ? audio + '. ' : ''}
${mood.join(', ')} atmosphere. 
${constraints ? constraints + '. ' : ''}
${parameters}`;

// 优秀范例（宾利与雪崩）
const examplePrompt = `A glossy black Bentley Continental Supersports racing down a narrow alpine mountain road at dusk as a roaring avalanche cascades behind it. Wide drone tracking shot transitioning to low bumper cam. Cold blue tones with warm headlight glow cutting through snow spray. Ultra-realistic with cinematic motion blur. Engine growls and snow impacts create visceral atmosphere. Enforce realistic physics, natural gravity, and clean reflections. 8 seconds, 16:9, 4K resolution.`;
```

**Sora关键优化技巧**：
- ✅ 使用强有力的动词描述动作
- ✅ 量化描述：如"8秒"、"4K"、"16:9"
- ✅ 添加物理约束避免扭曲画面
- ✅ 多场景使用timeline规划节奏
- ✅ 颜色要具体：不说"蓝色"，说"cold steel blue"
```

#### 2. Veo (Video with Audio) - ⭐ 五元素公式 + 8要素框架

**Veo特色**：同时生成视频和音频，音频描述能力是其核心优势。

**五元素公式**：`(镜头) + (主体与动作) + (场景) + (风格与光线) + (音频)`

```typescript
interface VeoPromptStructure {
  // 五元素核心
  shotType: string; // 镜头类型
  subject: string;  // 主体
  action: string;   // 动作
  setting: string;  // 场景环境
  style?: string;   // 视觉风格
  lighting: string; // 光线
  
  // ⭐ Veo的特色强项 - 音频元素
  audio?: string; // 综合音频描述
  audioElements?: {
    dialogue?: string;      // 对话内容
    soundEffects?: string;  // 音效（脚步声、风声、水流等）
    musicStyle?: string;    // 背景音乐风格
  };
  
  // 其他8要素
  cameraMovement?: string;
  timeline?: TimelineScene[];
  constraints?: string;
  composition?: string;
  mood?: string[];
}

// ⭐ Veo提示词模板
const veoPrompt = `${shotType} of ${subject} ${action} in ${setting}. 
${style ? style + ', ' : ''}${lighting}. 
${cameraMovement ? 'Camera ' + cameraMovement + '. ' : ''}
Audio: ${audio || formatAudioElements(audioElements)}. 
${mood ? 'Mood: ' + mood.join(', ') + '.' : ''}`;

// 优秀范例（好奇的猫）
const exampleVeoPrompt = `Medium shot of a curious orange tabby cat wearing a tiny blue apron, cautiously approaching a mysterious glowing orb in a cozy cottage kitchen at twilight. Warm golden hour lighting streams through lace curtains. Camera slowly dollies in as the cat reaches out. Audio: soft piano melody with gentle paw taps on wooden floor and subtle magical humming from orb. Photorealistic with Pixar-like charm.`;
```

**Veo关键优化技巧**：
- ⭐ 音频是核心：详细描述对话、音效、配乐
- ✅ 具体化主体：避免"一只猫"，说"橙色短毛猫戴着蓝色围裙"
- ✅ 角色一致性：通过标准化文本描述 + 参考图像
- ✅ 多镜头叙事：使用timeline保持连续性
```

#### 3. nano banana (Image Generation)

```typescript
interface NanoBananaPromptStructure {
  /** Scene-based narrative description */
  sceneNarrative: string;
  
  /** Photography details */
  photographyDetails?: {
    cameraModel?: string;
    lensType?: string;
    lighting?: string;
  };
  
  /** Artistic style */
  style: string;
  
  /** Specific requirements */
  requirements?: string[];
}

// Scene narrative approach for nano banana
const nanoBananaPrompt = `${sceneNarrative}. 
Shot with ${photographyDetails.cameraModel}, ${photographyDetails.lensType}. 
${photographyDetails.lighting} lighting. 
Style: ${style}`;
```

#### 4. Seedream (Image Editing)

```typescript
interface SeedreamPromptStructure {
  /** Base image description */
  baseImage: string;
  
  /** Editing instruction */
  editingInstruction: string;
  
  /** Style requirements */
  styleRequirements: string;
  
  /** Quality specifications */
  qualitySpec: string[];
}

// Precise editing instructions for Seedream
const seedreamPrompt = `${baseImage}. ${editingInstruction}. 
${styleRequirements}. 
Requirements: ${qualitySpec.join(', ')}`;
```

### OpenRouter Integration Standards

```typescript
// src/services/aiService.ts

import OpenAI from 'openai';

// Model selection strategy
const MODEL_STRATEGY = {
  promptGeneration: 'anthropic/claude-3.5-sonnet',  // Best for creative writing
  promptParsing: 'anthropic/claude-3-haiku',        // Fast, cost-effective
  costOptimized: 'google/gemini-pro-1.5',           // Balance of cost and quality
  highVolume: 'meta-llama/llama-3.1-70b-instruct',  // Cheapest for high traffic
};

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL || 'https://promptvalar.com',
    'X-Title': 'PromptValar',
  },
});

// MANDATORY: Implement retry logic
async function generateWithRetry(
  prompt: string,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const completion = await openrouter.chat.completions.create({
        model: MODEL_STRATEGY.promptGeneration,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      return completion.choices[0].message.content || '';
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}

// MANDATORY: Track usage for billing
async function logAIUsage(usage: AIUsageLog) {
  await db.aiUsageLogs.create({
    data: {
      userId: usage.userId,
      model: usage.model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      cost: calculateCost(usage),
      timestamp: new Date(),
    },
  });
}
```

### System Prompts by Model - ⭐ 导演式思维优化版

**核心理念**：将AI定位为"电影导演"，而非"关键词生成器"。

```typescript
// ⭐ Sora专用System Prompt（8要素框架 + 导演式思维）
const SORA_SYSTEM_PROMPT = `你是一位专业的电影导演和Sora视频生成专家。
你的任务是将用户的创意想法转化为高质量的"拍摄脚本"式提示词。

核心理念：你不是在生成关键词，而是在为AI提供一份清晰、具体、结构化的导演指令。

必须遵循的8要素框架：
1. Subject（主题）- 精准定义核心主角，使用丰富的形容词
2. Setting（环境）- 营造氛围：地点、时间、天气
3. Action（动作）- 驱动故事：强有力的动词，连续的动作
4. Camera（摄影）- 引导视觉：景别 + 镜头运动
5. Style（视觉风格）- 定下基调：美学风格、色调
6. Audio（音效）- 增强沉浸感：声音描述
7. Timeline（时间轴）- 构建叙事：多场景时间规划
8. Constraints（约束）- 提升质量：物理约束、避免扭曲

优秀范例：
"A glossy black Bentley Continental Supersports racing down a narrow alpine 
mountain road at dusk as a roaring avalanche cascades behind it. Wide drone 
tracking shot transitioning to low bumper cam. Cold blue tones with warm 
headlight glow. Ultra-realistic with cinematic motion blur. Enforce realistic 
physics and clean reflections."

输出JSON格式，包含prompt（流畅段落）和structured（8要素分解）。`;

// ⭐ Veo专用System Prompt（五元素 + 音频强化）
const VEO_SYSTEM_PROMPT = `你是专业的视频和音频设计专家，精通Google Veo。

Veo的核心优势：同时生成高质量视频和配套音频。

五元素公式：(镜头) + (主体与动作) + (场景) + (风格与光线) + (音频)

⭐ 音频是Veo的特色强项：
- 对话：角色说话的内容或风格
- 音效：环境音、动作音（脚步声、风声、水流）
- 配乐：背景音乐风格（欢快、悲伤、紧张）

示例：
"Medium shot of a curious orange tabby cat wearing a blue apron, approaching 
a glowing orb in a cozy kitchen at twilight. Warm golden hour lighting. 
Camera slowly dollies in. Audio: soft piano melody with gentle paw taps on 
wooden floor and magical humming."

输出必须包含详细的audio字段。`;

// 策略选择器（已实现在 backend/src/config/modelPromptStrategies.ts）
import { getSystemPrompt } from '../config/modelPromptStrategies.js';

// 使用示例
const systemPrompt = getSystemPrompt(targetModel, style);
```

**System Prompt最佳实践**：
1. ✅ 使用Few-shot示例展示理想输出
2. ✅ 强调"描述场景"而非"罗列关键词"
3. ✅ 要求量化描述（8秒、4K、16:9）
4. ✅ 针对模型特点定制指令（Veo强调音频、Sora强调物理约束）
5. ✅ 强制JSON格式输出，确保结构化
```

---

## 🔒 Security Requirements

### Authentication

1. **Password Security**:
   ```typescript
   import bcrypt from 'bcrypt';
   
   // MANDATORY: Use at least 12 rounds
   const SALT_ROUNDS = 12;
   
   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
   ```

2. **JWT Tokens**:
   ```typescript
   // Access Token: Short-lived (15 minutes)
   const accessToken = jwt.sign(
     { sub: user.id, email: user.email, subscription: user.subscriptionTier },
     process.env.JWT_SECRET,
     { expiresIn: '15m' }
   );
   
   // Refresh Token: Long-lived (7 days), stored securely
   const refreshToken = jwt.sign(
     { sub: user.id, tokenType: 'refresh' },
     process.env.JWT_REFRESH_SECRET,
     { expiresIn: '7d' }
   );
   ```

3. **Token Storage**:
   - Access token: `localStorage` (acceptable for public app)
   - Refresh token: `httpOnly` cookie (more secure)

### Input Validation

```typescript
import { z } from 'zod';

// MANDATORY: Validate ALL user input
const PromptGenerationSchema = z.object({
  userIdea: z.string()
    .min(10, 'Idea must be at least 10 characters')
    .max(500, 'Idea must not exceed 500 characters')
    .trim(),
  targetModel: z.enum(['sora', 'veo', 'nano_banana', 'seedream']),
  style: z.string().min(2).max(50),
  userId: z.string().uuid().optional(),
});

// Usage
try {
  const validatedData = PromptGenerationSchema.parse(requestBody);
  // Proceed with validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: error.errors,
      },
    });
  }
}
```

### XSS Prevention

```typescript
import DOMPurify from 'dompurify';

// MANDATORY: Sanitize user-generated content before display
const sanitizedDescription = DOMPurify.sanitize(userDescription);

// React example
<div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
```

### CORS Configuration

```typescript
// backend/src/middleware/cors.ts
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://promptvalar.com', 'https://www.promptvalar.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// AI generation rate limiter
export const aiRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:ai:',
  }),
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: (req) => {
    // Pro users: 100 requests
    // Free users: 20 requests
    return req.user?.subscription === 'pro' ? 100 : 20;
  },
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // 100 requests per minute
  standardHeaders: true,
});
```

### Environment Variables

```bash
# MANDATORY: Never commit .env files to Git

# Example .env structure
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/promptvalar
REDIS_URL=redis://localhost:6379

# JWT Secrets (use strong random strings)
JWT_SECRET=your-256-bit-secret-here
JWT_REFRESH_SECRET=your-other-256-bit-secret-here

# AI Integration
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_APP_NAME=PromptValar

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_live_...

# CORS
CORS_ORIGIN=https://promptvalar.com

# App
APP_URL=https://promptvalar.com
```

---

## 📋 Git Workflow

### Branch Naming

```bash
# Format: type/description-in-kebab-case

feature/prompt-studio-ui        # New feature
bugfix/fix-auth-redirect        # Bug fix
hotfix/security-patch           # Urgent production fix
refactor/optimize-db-queries    # Code refactoring
docs/update-api-documentation   # Documentation
test/add-prompt-generation-tests # Tests
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (新功能)
- `fix`: Bug fix (修复bug)
- `docs`: Documentation changes (文档更新)
- `style`: Code style (代码格式化)
- `refactor`: Code refactoring (重构)
- `perf`: Performance improvement (性能优化)
- `test`: Add or update tests (测试)
- `chore`: Build process, dependencies (构建/依赖)

**Commit messages can be in Chinese or English:**

```bash
# ✅ GOOD: Chinese commit messages (推荐用于团队内部)
feat(studio): 添加提示词实时预览功能
fix(auth): 修复token刷新死循环问题
docs(api): 更新API速率限制文档
refactor(ai): 将提示词生成逻辑提取到service层
perf(db): 为prompts.created_at字段添加索引优化查询速度

# ✅ GOOD: English commit messages (also acceptable)
feat(studio): add real-time preview for structured editor
fix(auth): resolve token refresh infinite loop
docs(api): update rate limiting documentation
refactor(ai): extract prompt generation logic to service layer
perf(db): add index on prompts.created_at for faster queries

# ❌ BAD: Vague commit messages
❌ 更新代码 / update code
❌ 修复 / fix bug
❌ 修改 / changes
❌ WIP
```

### Git Workflow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat(scope): descriptive message"

# 3. Push to remote
git push origin feature/my-feature

# 4. Create Pull Request
# - Use PR template
# - Request code review
# - Link related issues

# 5. After approval, squash and merge
# - Delete branch after merging
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that breaks existing functionality)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Dependent changes merged

## Screenshots (if applicable)

## Related Issues
Closes #123
```

---

## 🧪 Testing Standards

### Test Coverage Requirements

- **Minimum coverage**: 70% overall
- **Critical paths**: 90% (authentication, payment, AI generation)
- **Unit tests**: All business logic functions
- **Integration tests**: All API endpoints
- **E2E tests**: Critical user flows

### Test File Naming

```
src/
├── components/
│   ├── PromptCard.tsx
│   └── PromptCard.test.tsx         # Component tests
├── services/
│   ├── aiService.ts
│   └── aiService.test.ts           # Unit tests
└── __tests__/
    ├── integration/
    │   └── auth.test.ts            # Integration tests
    └── e2e/
        └── prompt-generation.spec.ts # E2E tests
```

### Unit Test Example

```typescript
// aiService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { generatePrompt } from './aiService';

describe('aiService', () => {
  describe('generatePrompt', () => {
    it('should generate prompt for Sora model', async () => {
      const request = {
        userIdea: 'A cat playing guitar',
        targetModel: 'sora' as const,
        style: 'cinematic',
      };
      
      const result = await generatePrompt(request);
      
      expect(result).toBeDefined();
      expect(result.prompt).toContain('cat');
      expect(result.prompt).toContain('guitar');
      expect(result.structured.subject).toBeDefined();
    });
    
    it('should throw error for invalid model', async () => {
      const request = {
        userIdea: 'Test',
        targetModel: 'invalid' as any,
        style: 'test',
      };
      
      await expect(generatePrompt(request)).rejects.toThrow('Invalid model');
    });
  });
});
```

### Integration Test Example

```typescript
// __tests__/integration/prompts.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, getAuthToken } from '../helpers';

describe('POST /api/v1/prompts', () => {
  let authToken: string;
  
  beforeAll(async () => {
    const user = await createTestUser();
    authToken = await getAuthToken(user.id);
  });
  
  it('should create a new prompt', async () => {
    const response = await request(app)
      .post('/api/v1/prompts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Prompt',
        promptText: 'A cinematic shot of...',
        model: 'sora',
        category: 'video',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
  });
  
  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/v1/prompts')
      .send({ title: 'Test' });
    
    expect(response.status).toBe(401);
  });
});
```

### E2E Test Example

```typescript
// __tests__/e2e/prompt-generation.spec.ts
import { test, expect } from '@playwright/test';

test('should generate prompt from idea', async ({ page }) => {
  // Navigate to Prompt Studio
  await page.goto('/studio');
  
  // Fill in the idea
  await page.fill('[data-testid="idea-input"]', 'A cat playing guitar on the moon');
  
  // Select model
  await page.selectOption('[data-testid="model-select"]', 'sora');
  
  // Select style
  await page.selectOption('[data-testid="style-select"]', 'cinematic');
  
  // Click generate
  await page.click('[data-testid="generate-button"]');
  
  // Wait for result
  await page.waitForSelector('[data-testid="generated-prompt"]');
  
  // Verify prompt is generated
  const promptText = await page.textContent('[data-testid="generated-prompt"]');
  expect(promptText).toContain('cat');
  expect(promptText).toContain('guitar');
  
  // Verify structured editor is populated
  const subject = await page.inputValue('[data-testid="subject-input"]');
  expect(subject).toBeTruthy();
});
```

---

## 📚 Documentation Requirements

### Code Comments

```typescript
// ✅ GOOD: Explain WHY, not WHAT
// We use exponential backoff to avoid overwhelming the API during high traffic
await retry(apiCall, { maxRetries: 3, backoff: 'exponential' });

// Calculate cost using tier-specific pricing
// Pro users get 20% discount on all AI generations
const cost = calculateCost(tokens, userTier);

// ❌ BAD: Stating the obvious
// Loop through users
for (const user of users) {
  // Set active to true
  user.active = true;
}
```

### JSDoc for Functions

```typescript
/**
 * Generates an optimized prompt for the specified AI model
 * 
 * @param request - The prompt generation request containing user idea and preferences
 * @param request.userIdea - User's natural language description
 * @param request.targetModel - Target AI model (sora, veo, nano_banana, seedream)
 * @param request.style - Desired artistic style
 * @param options - Optional configuration
 * @param options.temperature - AI creativity level (0-1, default: 0.7)
 * @returns Promise resolving to generated prompt with structured components
 * @throws {ValidationError} If input parameters are invalid
 * @throws {RateLimitError} If user has exceeded rate limit
 * 
 * @example
 * ```typescript
 * const result = await generatePrompt({
 *   userIdea: 'A cat on the moon',
 *   targetModel: 'sora',
 *   style: 'cinematic'
 * });
 * console.log(result.prompt);
 * ```
 */
export async function generatePrompt(
  request: PromptGenerationRequest,
  options?: GenerationOptions
): Promise<GeneratedPrompt> {
  // Implementation...
}
```

### README Structure

Every major directory should have a README.md:

```markdown
# Component/Module Name

Brief description of purpose and responsibilities.

## Usage

```typescript
// Code example
```

## API

### Functions/Components

- `functionName(params)`: Description
- `ComponentName`: Description

## Dependencies

List of key dependencies and why they're used.

## Testing

How to run tests for this module.

## Notes

Any important implementation details or gotchas.
```

---

## ⚡ Performance Standards

### Frontend Performance

1. **Lighthouse Scores** (Minimum):
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 90+
   - SEO: 95+

2. **Core Web Vitals**:
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

3. **Bundle Size**:
   - Initial JS bundle: < 200KB (gzipped)
   - Total page weight: < 1MB

### Optimization Techniques

```typescript
// ✅ Code splitting with React.lazy
const PromptLibrary = React.lazy(() => import('./pages/PromptLibrary'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));

// ✅ Image optimization
<img
  src="/images/prompt-preview.webp"
  alt="Prompt preview"
  loading="lazy"
  width={400}
  height={300}
/>

// ✅ Memoization for expensive computations
const structuredPrompt = useMemo(() => {
  return parsePromptToStructure(generatedPrompt);
}, [generatedPrompt]);

// ✅ Debounce user input
const debouncedSearch = useMemo(
  () => debounce((query: string) => fetchResults(query), 300),
  []
);
```

### Backend Performance

```typescript
// ✅ Database connection pooling
const pool = new Pool({
  max: 20,  // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Implement caching
const getCachedPrompts = async (key: string) => {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const prompts = await db.prompts.findMany();
  
  // Cache for 5 minutes
  await redis.setex(key, 300, JSON.stringify(prompts));
  
  return prompts;
};

// ✅ Batch database operations
const prompts = await db.prompts.findMany({
  where: { id: { in: promptIds } },
  include: {
    author: {
      select: { username: true, avatar: true }  // Only select needed fields
    }
  },
  take: 20,  // Limit results
});
```

---

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance

All UI components MUST meet WCAG 2.1 Level AA standards.

### Semantic HTML

```tsx
// ✅ GOOD: Semantic, accessible
<main>
  <h1>Prompt Studio</h1>
  <section aria-labelledby="step-1">
    <h2 id="step-1">Start with Your Idea</h2>
    <label htmlFor="idea-input">Describe your idea</label>
    <textarea
      id="idea-input"
      aria-required="true"
      aria-describedby="idea-hint"
    />
    <span id="idea-hint">Enter at least 10 characters</span>
  </section>
</main>

// ❌ BAD: Non-semantic, inaccessible
<div>
  <div>Prompt Studio</div>
  <div>
    <div>Start with Your Idea</div>
    <textarea placeholder="Describe your idea" />
  </div>
</div>
```

### Keyboard Navigation

```tsx
// ✅ All interactive elements must be keyboard accessible
<button
  onClick={handleGenerate}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleGenerate();
    }
  }}
  aria-label="Generate prompt"
>
  Generate
</button>

// ✅ Focus management
useEffect(() => {
  if (modalOpen) {
    // Focus first input when modal opens
    inputRef.current?.focus();
  }
}, [modalOpen]);
```

### ARIA Labels

```tsx
// ✅ Descriptive labels for screen readers
<button aria-label="Add to favorites">
  ❤️
</button>

<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>

// ✅ Loading states
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Generating prompt...' : 'Ready'}
</div>
```

### Color Contrast

```css
/* MANDATORY: Minimum contrast ratios */
/* Normal text: 4.5:1 */
/* Large text (18pt+): 3:1 */
/* UI components: 3:1 */

/* ✅ GOOD: High contrast */
.text-primary {
  color: #111827;  /* Almost black */
  background: #ffffff;  /* White */
  /* Contrast ratio: 17:1 */
}

/* ❌ BAD: Low contrast */
.text-gray {
  color: #d1d5db;  /* Light gray */
  background: #ffffff;  /* White */
  /* Contrast ratio: 1.8:1 - FAILS */
}
```

---

## 🎬 Final Checklist

Before deploying any feature, ensure:

### Code Quality
- [ ] TypeScript types are properly defined (no `any`)
- [ ] ESLint shows no errors or warnings
- [ ] Code is formatted with Prettier
- [ ] All imports are organized and unused imports removed
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests for critical flows
- [ ] Manual testing completed
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Tested on multiple devices (mobile, tablet, desktop)

### Performance
- [ ] Lighthouse scores meet minimum requirements
- [ ] Images are optimized (WebP format, lazy loading)
- [ ] Code splitting implemented for large pages
- [ ] Bundle size is within limits
- [ ] API responses are cached where appropriate

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (tested with NVDA/JAWS)
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels are present where needed
- [ ] Focus states are visible

### Security
- [ ] Input validation is implemented
- [ ] Authentication is properly secured
- [ ] XSS protection is in place
- [ ] CORS is properly configured
- [ ] Environment variables are used (no hardcoded secrets)
- [ ] Rate limiting is active

### Documentation
- [ ] README updated (if applicable)
- [ ] API documentation updated
- [ ] Code comments explain complex logic
- [ ] JSDoc for public functions
- [ ] CHANGELOG updated

### Git
- [ ] Commit messages follow convention
- [ ] Branch name follows convention
- [ ] Pull request template filled out
- [ ] Code review completed
- [ ] No merge conflicts

---

## 📞 Support and Questions

For questions about these rules:
1. Check existing documentation
2. Ask in team Slack channel
3. Create GitHub Discussion for clarification

**Remember**: These rules exist to ensure code quality, maintainability, and consistency. When in doubt, follow the rules. If you believe a rule should be changed, propose it for team discussion.

---

## 🎯 Key Reminders

### Critical Development Rules (必读)

1. **Language Policy** 🌐
   - ✅ **User-facing content**: MUST be English (UI, error messages, documentation)
   - ✅ **Code comments**: Chinese (中文) is ENCOURAGED for team clarity
   - ✅ **Git commits**: Chinese or English both acceptable
   - ✅ **Configuration files**: Can use Chinese documentation

2. **Flowchart Requirement** 📊
   - ⚠️ **MANDATORY for logic > 3 steps**
   - Use Mermaid syntax for all flowcharts
   - Include in documentation and code comments for complex features
   - Examples: Authentication flow, payment process, AI generation workflow

3. **Git Commit Rules** 🚫
   - ⚠️ **NEVER auto-execute git commands**
   - Always provide commands as code suggestions
   - Let developer review and execute manually
   - Format:
   ```bash
   # 提交代码建议（请手动执行）：
   git add .
   git commit -m "feat(scope): 功能描述"
   git push origin main
   ```

4. **Deployment Process** 🚀
   - **Step 1**: Write/optimize code
   - **Step 2**: Commit to GitHub (manual execution only)
   - **Step 3**: Dokploy auto-deployment
   - **Step 4**: Manual testing and verification
   - ⚠️ Remember: Code → GitHub → Dokploy → Test

5. **Code Quality Standards** ✨
   - TypeScript strict mode mandatory
   - No `any` types
   - Chinese comments encouraged
   - All tests must pass before commit
   - ESLint + Prettier compliance required

### Quick Reference

```typescript
// Example: Complete code with all standards applied

/**
 * 生成针对特定AI模型优化的提示词
 * Generate optimized prompt for specific AI model
 */
export async function generateOptimizedPrompt(
  request: PromptRequest
): Promise<GeneratedPrompt> {
  // 1. 验证输入参数
  // Validate input to prevent malformed requests
  const validated = PromptSchema.parse(request);
  
  // 2. 检查用户权限和速率限制
  // Pro用户无限制，免费用户每15分钟20次
  await checkRateLimit(validated.userId, validated.subscription);
  
  // 3. 选择合适的AI模型
  // 根据用户套餐选择：Pro用户使用Claude Sonnet，免费用户使用Haiku
  const aiModel = selectModelForUser(validated.subscription);
  
  // 4. 调用AI生成提示词
  // 使用重试机制确保可靠性
  const result = await generateWithRetry(aiModel, validated);
  
  // 5. 记录使用情况用于计费
  await logUsage(validated.userId, result.tokens, result.cost);
  
  return result;
}
```

### Configuration File Example

```yaml
# dokploy.yml - Deployment configuration
# 部署配置文件

name: promptvalar
services:
  frontend:
    # 前端服务配置
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      # API地址
      VITE_API_BASE_URL: ${API_URL}
  
  backend:
    # 后端API服务
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      # 数据库连接
      DATABASE_URL: ${DATABASE_URL}
      # OpenRouter API密钥
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
```

---

**Last Updated**: January 2025
**Version**: 1.1.0
**Maintained By**: PromptValar Development Team

**Changelog**:
- v1.1.0 (2025-01): Added language policy, flowchart requirements, deployment rules
- v1.0.0 (2025-01): Initial release

