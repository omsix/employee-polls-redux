# Development Guide

Complete guide for developing and contributing to the Employee Polls application.

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher recommended
- **npm** or **yarn**: Package manager
- **Git**: Version control

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

4. Open your browser:
```
http://localhost:5173
```

### Mock Authentication

The application uses mock authentication for demonstration. Available users:

- `omarcisse` - Omar Cisse
- `sarahedo` - Sarah Edo
- `tylermcginnis` - Tyler McGinnis
- `mtsamis` - Mike Tsamis

No password validation is implemented (mock data only).

## Available Scripts

### Development

| Script | Command | Description |
|--------|---------|-------------|
| **Start Dev Server** | `npm run dev` | Start Vite dev server with hot reload on port 5173 |
| **Start (Alias)** | `npm start` | Alias for `npm run dev` |

### Build & Preview

| Script | Command | Description |
|--------|---------|-------------|
| **Build** | `npm run build` | Create optimized production build in `dist/` |
| **Preview** | `npm run preview` | Preview production build locally |

### Testing

| Script | Command | Description |
|--------|---------|-------------|
| **Run Tests** | `npm test` | Run all tests once with Vitest |
| **Watch Mode** | `npm run test:watch` | Run tests in watch mode |
| **Coverage** | `npm run test:coverage` | Generate coverage report |

### Code Quality

| Script | Command | Description |
|--------|---------|-------------|
| **Lint** | `npm run lint` | Check code for linting errors |
| **Lint Fix** | `npm run lint:fix` | Auto-fix linting errors |
| **Format** | `npm run format` | Format all code with Prettier |
| **Format Check** | `npm run format:check` | Check if code is formatted |
| **Type Check** | `npm run type-check` | Run TypeScript type checking |

## Development Workflow

### Creating a New Feature

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write code following existing patterns
- Keep components small and focused
- Use TypeScript types throughout

3. **Run code quality checks**
```bash
npm run lint:fix    # Fix linting issues
npm run format      # Format code
npm run type-check  # Check types
```

4. **Write tests**
```bash
npm test           # Run all tests
```

5. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

6. **Submit a pull request**

### Commit Message Guidelines

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or tooling changes

Examples:
```
feat: add user profile page
fix: resolve poll voting bug
docs: update component documentation
```

## Project Configuration

### Vite Configuration

Location: `vite.config.ts`

Key settings:
- React plugin with SWC
- Test configuration for Vitest
- Path aliases (if configured)
- Build optimizations

### TypeScript Configuration

Location: `tsconfig.json`

Key settings:
- Strict mode enabled
- ES2020 target
- React JSX support
- Path mappings

### ESLint Configuration

Location: `eslint.config.js`

Key rules:
- React hooks rules
- TypeScript recommended rules
- Custom project rules

### Prettier Configuration

Location: `.prettierrc` or `package.json`

Key settings:
- 2-space indentation
- Single quotes
- Trailing commas
- Line width: 100 characters

## File Organization

### Component Structure

```
component-name/
├── component-name.component.tsx    # Main component
├── component-name.module.css       # Scoped styles
└── component-name.test.tsx         # Component tests
```

### Naming Conventions

- **Components**: PascalCase with `.component.tsx` suffix
  - Example: `LoginPageComponent.tsx`
- **Utilities**: camelCase with `.ts` suffix
  - Example: `formatDate.ts`
- **Types**: PascalCase interfaces/types
  - Example: `User`, `Question`, `Poll`
- **Redux Slices**: camelCase
  - Example: `authedUser`, `questions`

## Code Style Guidelines

### React Components

```typescript
// Use functional components with TypeScript
export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // Use hooks at the top
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  
  // Event handlers
  const handleClick = () => {
    // logic
  };
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Redux Patterns

```typescript
// Use RTK createSlice
const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    // synchronous actions
  },
  extraReducers: (builder) => {
    // async thunk actions
  },
});
```

### TypeScript Usage

- Always define props interfaces
- Use type inference where possible
- Avoid `any` - use `unknown` if needed
- Define return types for complex functions

## Debugging

### React DevTools

Install browser extension for:
- Component tree inspection
- Props and state debugging
- Performance profiling

### Redux DevTools

Install browser extension for:
- Action history
- State tree inspection
- Time-travel debugging

### Browser DevTools

Use for:
- Network requests
- Console logging
- Breakpoint debugging

## Common Tasks

### Adding a New Component

1. Create component directory in `src/components/`
2. Create component file: `component-name.component.tsx`
3. Create test file: `component-name.test.tsx`
4. Create styles if needed: `component-name.module.css`
5. Export from parent if needed

### Adding a Redux Slice

1. Create slice file in `src/utils/` or appropriate location
2. Define initial state and types
3. Create slice with reducers
4. Add to store configuration in `src/app/store.ts`
5. Create selectors and hooks

### Adding a Route

1. Import component in `src/App.tsx`
2. Add `<Route>` element
3. Wrap with `<RequireAuth>` if protected
4. Update navigation in `MenuToolbarComponent`

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
# Run type checking
npm run type-check

# Check tsconfig.json settings
```

## Contributing

Contributions welcome for:
- Bug fixes
- New features
- Test improvements
- Documentation updates

See workflow above for contribution process.
