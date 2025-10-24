# PromptValar Frontend

React + TypeScript + Vite + Tailwind CSS frontend application.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management (to be implemented)
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Layout.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_APP_NAME=PromptValar
```

## Code Standards

- Use TypeScript strict mode
- No `any` types
- Functional components only
- Use hooks for state management
- Follow naming conventions from PROJECT_RULES.md

