# Project Structure

This document outlines the organization of the Employee Polls codebase.

## 📁 Directory Tree

```
employee-polls-redux/
├── src/
│   ├── app/                        # Redux & App Configuration
│   │   ├── createAppSlice.ts       # Custom slice factory with async thunk support
│   │   ├── hooks.ts                # Typed Redux hooks (useAppDispatch, useAppSelector)
│   │   ├── loggerMiddleware.ts     # Custom Redux middleware for logging
│   │   ├── main-routes.tsx         # (Legacy) React Router route definitions - see App.tsx
│   │   └── store.ts                # Redux store configuration with persistence
│   │
│   ├── components/                 # React UI Components
│   │   ├── circular-text/          # SVG circular text utility component
│   │   ├── dashboard/              # Main dashboard with poll tabs
│   │   ├── leader-board/           # User rankings page
│   │   ├── login-page/             # Authentication UI
│   │   ├── menu-toolbar/           # Top navigation bar
│   │   ├── nav-bar/                # Simple logout navigation
│   │   ├── new-poll/               # Poll creation form
│   │   ├── not-found/              # 404 error page
│   │   ├── poll-details/           # Individual poll view & voting
│   │   └── require-auth/           # Protected route wrapper component
│   │
│   ├── data/                       # Data Layer
│   │   └── data.ts                 # Mock data & API simulation functions
│   │
│   ├── state-tree/                 # TypeScript Definitions
│   │   ├── model.ts                # Entity interfaces (User, Question, Poll)
│   │   └── state-tree.ts           # State shape interfaces
│   │
│   ├── utils/                      # Redux Slices & Utilities
│   │   ├── login/                  # Auth-related slices
│   │   │   ├── authedUser.ts       # Authentication slice
│   │   │   ├── remainingSessionTime.ts # Session countdown timer slice
│   │   │   └── users.ts            # Users slice
│   │   ├── polls/                  # Poll utilities
│   │   │   └── pollsAPI.ts         # RTK Query API for polls
│   │   └── questions/              # Questions slice
│   │       └── questions.ts        # Questions management
│   │
│   ├── App.tsx                     # Root component with route definitions
│   ├── App.css                     # Global styles
│   ├── main.tsx                    # Application entry point
│   └── setupTests.ts               # Test configuration
│
├── public/                         # Static Assets
│   └── avatars/                    # User avatar images
│
├── wiki/                           # Project Documentation
│
├── vite.config.ts                  # Vite build configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.js                # ESLint rules
└── package.json                    # Dependencies & scripts
```

## 🏗️ Architecture Layers

### 1. Presentation Layer (`src/components/`)
React components responsible for UI rendering. Each component typically includes:
- `*.component.tsx` - Main component file
- `*.module.css` - Scoped CSS modules
- `*.test.tsx` - Unit tests
- `__snapshots__/` - Jest/Vitest snapshots

### 2. State Management Layer (`src/utils/`, `src/app/`)
Redux Toolkit slices and store configuration:
- **Slices**: Define state shape, reducers, and actions
- **Store**: Combines slices, configures middleware and persistence
- **Hooks**: Type-safe Redux hooks

### 3. Data Layer (`src/data/`)
Mock backend simulation:
- Simulated API calls with delays
- In-memory data storage
- CRUD operations for users and questions

### 4. Type Definitions (`src/state-tree/`)
TypeScript interfaces for type safety:
- Entity models (User, Question, Poll)
- State shape definitions
- Option types for questions

## 📦 Component Organization

Each component folder follows a consistent pattern:

```
component-name/
├── component-name.component.tsx    # Main component
├── component-name.module.css       # Scoped styles
├── component-name.test.tsx         # Unit tests
├── __snapshots__/                  # Test snapshots
│   └── component-name.test.tsx.snap
└── index.ts                        # (optional) Barrel export
```

## 🔌 Import Aliases

The project uses absolute imports from `src/`:

```typescript
// Instead of relative imports
import { useAppSelector } from '../../app/hooks';

// Use absolute imports
import { useAppSelector } from 'src/app/hooks';
```

## 📝 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase with suffix | `DashboardComponent` |
| Files | kebab-case | `poll-details.component.tsx` |
| CSS Modules | kebab-case | `poll-details.module.css` |
| Redux Slices | camelCase | `authedUserSlice` |
| Actions | camelCase verbs | `setAuthedUser`, `logout` |
| Selectors | `select` prefix | `selectAuthedUser` |
| Hooks | `use` prefix | `useAppDispatch` |
