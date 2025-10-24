# PromptValar Backend

Node.js + Express + TypeScript + PostgreSQL backend API.

## Tech Stack

- **Node.js 18+** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Zod** - Schema validation
- **OpenAI SDK** - AI integration (via OpenRouter)

## Project Structure

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── routes/          # Route definitions
├── middleware/      # Express middleware
├── validators/      # Zod schemas
├── db/             # Database config and schema
├── types/          # TypeScript types
└── index.ts        # Application entry
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (with auto-reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Database commands
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:studio     # Open Drizzle Studio
```

## Environment Variables

Create a `.env` file:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/promptvalar
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
OPENROUTER_API_KEY=sk-or-v1-...
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Health Check
- `GET /health` - API health status

## Database Schema

- **users** - User accounts
- **prompts** - AI prompts
- **structured_prompts** - Parsed prompt components
- **favorites** - User favorites
- **subscriptions** - Pro subscriptions
- **ai_usage_logs** - AI API usage tracking

## Code Standards

- Use TypeScript strict mode
- No `any` types
- Async/await for all async operations
- Proper error handling with AppError
- Input validation with Zod
- Follow naming conventions from PROJECT_RULES.md

