# Tech Stack

Detailed technical dependencies and versions used in the Employee Polls application.

## Frontend Framework

### React 19.1.0
- Modern UI library with concurrent features
- Hooks-based component architecture
- Automatic batching and transitions

### TypeScript 5.8.2
- Static type checking
- Enhanced IDE support
- Interfaces for all data models

## State Management

### Redux Toolkit 2.6.1
- Simplified Redux setup with `configureStore`
- Built-in Immer for immutable updates
- RTK Query for data fetching and caching
- `createSlice` for reducer logic

### Redux Persist
- LocalStorage persistence for state
- User-specific state keys
- Automatic rehydration on app load

## Routing

### React Router 7.9.3
- Declarative routing with `Routes` and `Route`
- Protected routes with `RequireAuth` wrapper
- Navigation hooks (`useNavigate`, `useLocation`)
- Memory router for testing

## UI Components

### Material-UI (MUI) 7.3.5
- Comprehensive component library
- `AppBar`, `Drawer`, `Tabs`, `Card`, `Button`, etc.
- Built-in theming system
- Responsive design utilities

### Emotion
- CSS-in-JS styling solution
- Used by Material-UI
- Dynamic styling with props
- Performance optimized

## Build Tools

### Vite 6.2.4
- Lightning-fast HMR (Hot Module Replacement)
- ESBuild-powered bundling
- Optimized production builds
- Native ES modules in development

### TypeScript Compiler
- Type checking during build
- Declaration file generation
- Strict mode enabled

## Development Tools

### ESLint 9.23.0
- Code quality enforcement
- React and TypeScript rules
- Custom configuration
- Auto-fix capabilities

### Prettier 3.5.3
- Consistent code formatting
- Pre-configured style rules
- Integration with ESLint

## Testing

### Vitest 3.1.1
- Fast unit testing framework
- Vite-native testing
- Compatible with Jest API
- Built-in coverage reporting

### React Testing Library
- Component testing utilities
- User-centric test queries
- Accessibility-focused
- Works with jsdom

### @testing-library/user-event
- User interaction simulation
- Realistic event firing
- Async action support

### jsdom
- Browser environment simulation
- DOM implementation for Node.js
- Used by Vitest for component tests

## Dependency Overview

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@mui/icons-material": "^7.3.5",
    "@mui/material": "^7.3.5",
    "@reduxjs/toolkit": "^2.6.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-redux": "^9.2.1",
    "react-router-dom": "^7.9.3",
    "redux-persist": "^6.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.23.0",
    "jsdom": "^26.0.0",
    "prettier": "^3.5.3",
    "typescript": "~5.8.2",
    "vite": "^6.2.4",
    "vitest": "^3.2.4"
  }
}
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required
- No IE11 support

## Performance Considerations

- Code splitting with React.lazy (if needed)
- Memoization with `useMemo` and `useCallback`
- Redux state normalization
- Vite's optimized bundling
- Tree-shaking of unused code
