# Employee Polls

A React-Redux application for managing employee polls and surveys. This project is part of Udacity's React Nanodegree program, demonstrating advanced state management with Redux Toolkit, React Router, and Material-UI components.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Code Review Findings](#code-review-findings)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

Employee Polls is a polling application that allows employees to create, answer, and view polls. Users can see results, track their participation, and view a leaderboard showing the most active users.

### Key Functionality

- **User Authentication**: Login system with session management
- **Dashboard**: View answered and unanswered polls in separate tabs
- **Create Polls**: Users can create new "Would You Rather" style questions
- **Vote on Polls**: Answer unanswered polls and see real-time results
- **Leaderboard**: Track user participation and rankings
- **Persistent State**: Redux state persisted to localStorage

## ✨ Features

- ✅ User authentication with session expiration
- ✅ Create new polls with two options
- ✅ Vote on unanswered polls
- ✅ View poll results with percentages
- ✅ Dashboard with answered/unanswered tabs
- ✅ Leaderboard showing user stats
- ✅ Responsive Material-UI design
- ✅ State persistence with redux-persist
- ✅ TypeScript for type safety
- ✅ Comprehensive test coverage with Vitest

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **TypeScript 5.8.2** - Type safety
- **Redux Toolkit 2.6.1** - State management
- **React Router 7.9.3** - Routing
- **Material-UI 7.3.5** - Component library
- **Emotion** - CSS-in-JS styling

### Build & Development
- **Vite 6.2.4** - Build tool and dev server
- **Vitest 3.1.1** - Testing framework
- **ESLint 9.23.0** - Code linting
- **Prettier 3.5.3** - Code formatting

### Testing
- **@testing-library/react** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM implementation for tests

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd employee-polls-redux
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Login

The application uses mock authentication. You can log in with any of these users:
- `omarcisse`
- `sarahedo`
- `tylermcginnis`
- `mtsamis`

No password validation is implemented (mock data only).

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests once |
| `npm run lint` | Check code for linting errors |
| `npm run lint:fix` | Fix auto-fixable linting errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |

## 📁 Project Structure

```
employee-polls-redux/
├── src/
│   ├── app/                    # Redux store configuration
│   │   ├── createAppSlice.ts   # Slice factory helper
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── loggerMiddleware.ts # Custom middleware
│   │   ├── main-routes.tsx     # Route definitions
│   │   └── store.ts            # Store setup with persistence
│   ├── components/             # React components
│   │   ├── circular-text/      # Circular text animation
│   │   ├── dashboard/          # Main dashboard view
│   │   ├── leader-board/       # User rankings
│   │   ├── login-page/         # Authentication
│   │   ├── menu-toolbar/       # Navigation menu
│   │   ├── nav-bar/            # Top navigation
│   │   ├── new-poll/           # Poll creation form
│   │   ├── not-found/          # 404 page
│   │   └── poll-details/       # Individual poll view
│   ├── data/                   # Mock data
│   │   └── data.ts             # Users and questions
│   ├── state-tree/             # TypeScript models
│   │   ├── model.ts            # Data interfaces
│   │   └── state-tree.ts       # State shape
│   ├── utils/                  # Utilities and slices
│   │   ├── login/              # Auth logic
│   │   ├── polls/              # Poll utilities
│   │   └── questions/          # Question management
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Application entry point
├── public/                     # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── eslint.config.js            # ESLint rules
└── package.json                # Dependencies

```

## 🔍 Code Review Findings

A comprehensive code review was performed. Here are the critical issues identified:

### High Severity Issues

1. **Critical Data Inconsistency** (src/data/data.ts)
   - User answers don't match question vote arrays for question `6ni6ok3ym7mf1p33lnez`
   - Users claim to vote for optionOne but are listed in optionTwo votes
   - **Impact**: Incorrect UI display and vote count discrepancies

2. **Vote Submission Without Selection** (poll-details.component.tsx:43-52)
   - Vote button can submit undefined values
   - No validation ensures user selected an option
   - **Impact**: Potential errors or invalid votes

3. **Route Component Mismatch** (main-routes.tsx:13)
   - Route `/questions/:id` renders component without required `poll` prop
   - **Impact**: Runtime errors when accessing the route

### Medium Severity Issues

4. **Session Expiry Check** (App.tsx:23-27)
   - Only runs when `expiresAt` changes, not continuously
   - Users can continue with expired sessions
   - **Recommendation**: Add periodic expiry checks

5. **Missing useEffect Dependency** (App.tsx:15-21)
   - `dispatch` used but not in dependency array
   - Violates exhaustive-deps rule

6. **Missing Error Handling** (data.ts:181-213)
   - No validation for invalid question/user IDs in `_saveQuestionAnswer`
   - Can cause undefined behavior with invalid inputs

### Low Severity Issues

7. **Division by Zero Potential** (pollsAPI.ts:47,64,68)
   - Percentage calculation doesn't handle empty users object
   - Could produce NaN in edge cases

8. **Plaintext Passwords in Mock Data** (data.ts)
   - Mock data includes password fields that aren't used
   - Could mislead developers or cause issues if used with real data

## 🧪 Testing

The project includes comprehensive test coverage using Vitest and React Testing Library.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Files

- Component tests: `*.test.tsx` files co-located with components
- Test utilities: `src/utils/test-utils.tsx`
- Setup: `src/setupTests.ts`

### Example Test Components
- ✅ App.test.tsx
- ✅ dashboard.test.tsx
- ✅ login-page.test.tsx
- ✅ poll-details.test.tsx
- ✅ new-poll.test.tsx
- ✅ leader-board.test.tsx

## 🤝 Contributing

This is an educational project for Udacity's React Nanodegree. Contributions are welcome for:

1. Fixing identified code review issues
2. Adding new features
3. Improving test coverage
4. Documentation enhancements

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint:fix`
4. Run tests: `npm test`
5. Format code: `npm run format`
6. Submit a pull request

## 📝 License

This project is part of Udacity's React Nanodegree program.

## 🙏 Acknowledgments

- Udacity React Nanodegree Program
- Redux Toolkit documentation
- Material-UI component library
- React Testing Library

---

**Note**: This application uses mock data and authentication for demonstration purposes. It is not intended for production use without proper backend integration and security measures.
