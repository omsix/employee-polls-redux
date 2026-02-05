# Employee Polls Wiki

Welcome to the Employee Polls project wiki! This documentation provides a comprehensive overview of the application architecture, components, and state management.

## 📚 Table of Contents

### Architecture
- [Project Structure](Project-Structure.md)
- [Redux State Management](Redux-State-Management.md)

### Components
- [Components Overview](Components-Overview.md)
- [Dashboard](Components-Dashboard.md)
- [Login Page](Components-Login-Page.md)
- [Poll Details](Components-Poll-Details.md)
- [New Poll](Components-New-Poll.md)
- [Leader Board](Components-Leader-Board.md)
- [Menu Toolbar](Components-Menu-Toolbar.md)
- [Navigation Components](Components-Navigation.md)

### Data Layer
- [Data Models](Data-Models.md)
- [API Functions](API-Functions.md)

---

## 🎯 Quick Overview

Employee Polls is a React-Redux application that allows employees to:
- **Create polls** with "Would You Rather" style questions
- **Vote on polls** and see real-time results
- **Track participation** via a leaderboard
- **Manage sessions** with automatic expiry

### Tech Stack
| Layer | Technology |
|-------|------------|
| UI Framework | React 19.1.0 |
| State Management | Redux Toolkit 2.6.1 |
| Data Fetching | RTK Query |
| Routing | React Router 7.9.3 |
| UI Components | Material-UI 7.3.5 |
| Type Safety | TypeScript 5.8.2 |
| Build Tool | Vite 6.2.4 |
| Testing | Vitest + React Testing Library |

### Application Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Login Page    │────▶│    Dashboard     │────▶│   Poll Details  │
│  (User Select)  │     │ (Tabs: Pending/  │     │  (Vote/Results) │
└─────────────────┘     │   Completed)     │     └─────────────────┘
                        └──────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
              ┌──────────┐ ┌────────┐ ┌──────────┐
              │ New Poll │ │ Leader │ │  Logout  │
              │  (Create)│ │ Board  │ │          │
              └──────────┘ └────────┘ └──────────┘
```

---

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd employee-polls-redux
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

---

## 📁 Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Redux store, hooks, routes |
| `src/components/` | React UI components |
| `src/data/` | Mock data and API functions |
| `src/state-tree/` | TypeScript interfaces and state types |
| `src/utils/` | Redux slices and utilities |

---

## 🔗 Related Links

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material-UI Documentation](https://mui.com/)
- [Vitest Documentation](https://vitest.dev/)
