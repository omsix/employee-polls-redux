# Testing Guide

Comprehensive testing guide for the Employee Polls application using Vitest and React Testing Library.

## Testing Strategy

### Testing Philosophy

- **User-centric**: Test components from the user's perspective
- **Accessibility-focused**: Use accessible queries (roles, labels)
- **Integration over unit**: Test component behavior, not implementation
- **Comprehensive coverage**: Test all user interactions and edge cases

### Test Types

1. **Component Tests**: Render and interaction testing
2. **Integration Tests**: Multi-component workflows
3. **Redux Tests**: State management and side effects
4. **Utility Tests**: Pure function testing

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- src/components/dashboard/dashboard.test.tsx

# Run tests matching pattern
npm test -- --grep "login"
```

### Vitest Configuration

Location: `vite.config.ts`

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});
```

## Test Utilities

### renderWithProviders

Custom render function that wraps components with Redux Provider and MemoryRouter.

Location: `src/utils/test-utils.tsx`

```typescript
import { renderWithProviders } from '../../utils/test-utils';

// Basic usage
renderWithProviders(<MyComponent />);

// With preloaded state
renderWithProviders(<MyComponent />, {
  preloadedState: {
    authedUser: { name: 'omarcisse', expiresAt: Date.now() + 60_000, status: 'idle' },
  },
});

// With custom route
renderWithProviders(<MyComponent />, {
  routerInitialEntries: ['/questions/123'],
});

// Access store and user events
const { store, user } = renderWithProviders(<MyComponent />);
```

### Options

- `preloadedState`: Initial Redux state
- `store`: Custom Redux store instance
- `routerInitialEntries`: Router initial location(s)

## Writing Component Tests

### Basic Component Test

```typescript
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import { MyComponent } from './my-component.component';

describe('MyComponent', () => {
  it('renders the component title', () => {
    renderWithProviders(<MyComponent />);
    
    expect(screen.getByText(/my title/i)).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { screen, fireEvent } from '@testing-library/react';

it('handles button click', () => {
  renderWithProviders(<MyComponent />);
  
  const button = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(button);
  
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### Testing with User Events (Recommended)

```typescript
import { screen } from '@testing-library/react';

it('types in input field', async () => {
  const { user } = renderWithProviders(<MyComponent />);
  
  const input = screen.getByLabelText(/username/i);
  await user.type(input, 'testuser');
  
  expect(input).toHaveValue('testuser');
});
```

### Testing Redux State

```typescript
it('updates Redux state on action', () => {
  const { store } = renderWithProviders(<MyComponent />, {
    preloadedState: {
      counter: { value: 0 },
    },
  });
  
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  
  expect(store.getState().counter.value).toBe(1);
});
```

### Testing Async Operations

```typescript
import { screen, waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
  renderWithProviders(<MyComponent />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
  });
});
```

### Testing Navigation

```typescript
import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

it('navigates on button click', () => {
  renderWithProviders(<MyComponent />);
  
  const button = screen.getByRole('button', { name: /go home/i });
  fireEvent.click(button);
  
  expect(mockNavigate).toHaveBeenCalledWith('/');
});
```

## Query Methods

### Recommended Queries (in order of preference)

1. **getByRole**: Most accessible
```typescript
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /username/i })
```

2. **getByLabelText**: Form elements
```typescript
screen.getByLabelText(/password/i)
```

3. **getByPlaceholderText**: When label is not available
```typescript
screen.getByPlaceholderText(/enter email/i)
```

4. **getByText**: Non-interactive elements
```typescript
screen.getByText(/welcome/i)
```

5. **getByTestId**: Last resort
```typescript
screen.getByTestId('custom-element')
```

### Query Variants

- `getBy...`: Throws error if not found (use for elements that should exist)
- `queryBy...`: Returns null if not found (use for checking non-existence)
- `findBy...`: Async, waits for element (use for elements that appear after delay)

## Example Test Files

### Component Test Example

`src/components/dashboard/dashboard.test.tsx`

```typescript
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  const mockQuestions = {
    'q1': {
      id: 'q1',
      author: 'sarahedo',
      timestamp: Date.now(),
      optionOne: { votes: [], text: 'Option 1' },
      optionTwo: { votes: ['omarcisse'], text: 'Option 2' },
    },
  };

  it('renders dashboard tabs', () => {
    renderWithProviders(<DashboardComponent />, {
      preloadedState: {
        authedUser: { name: 'omarcisse', expiresAt: Date.now() + 60_000, status: 'idle' },
        questions: { entities: mockQuestions, status: 'idle' },
      },
    });

    expect(screen.getByText(/new questions/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });
});
```

### Redux Test Example

```typescript
import { waitFor } from '@testing-library/react';

it('dispatches action and updates store', async () => {
  const { store } = renderWithProviders(<LoginPageComponent />);
  
  const userSelect = screen.getByLabelText(/user/i);
  fireEvent.change(userSelect, { target: { value: 'omarcisse' } });
  
  const loginButton = screen.getByRole('button', { name: /login/i });
  fireEvent.click(loginButton);
  
  await waitFor(() => {
    expect(store.getState().authedUser.name).toBe('omarcisse');
  });
});
```

## Mocking

### Mocking API Calls

```typescript
import { vi } from 'vitest';
import * as dataAPI from '../../data/data';

it('calls API on form submit', async () => {
  const saveSpy = vi.spyOn(dataAPI, '_saveQuestion').mockResolvedValue({
    id: 'new-id',
    author: 'omarcisse',
    timestamp: Date.now(),
    optionOne: { votes: [], text: 'Option 1' },
    optionTwo: { votes: [], text: 'Option 2' },
  });

  renderWithProviders(<NewPollComponent />);
  
  // Fill form and submit...
  
  await waitFor(() => {
    expect(saveSpy).toHaveBeenCalledWith({
      optionOneText: 'Option 1',
      optionTwoText: 'Option 2',
      author: 'omarcisse',
    });
  });
});
```

### Mocking Modules

```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
```

## Test Coverage

### Viewing Coverage

```bash
npm run test:coverage
```

Coverage report generated in `coverage/` directory.

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### What to Test

✅ **Test**:
- User interactions (clicks, typing, form submissions)
- Component rendering with different props/state
- Conditional rendering
- Redux state updates
- Navigation
- Error handling
- Edge cases

❌ **Don't Test**:
- Implementation details (internal state, private methods)
- Third-party libraries (MUI, React Router)
- Styling (unless critical to functionality)

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('example test', () => {
  // Arrange: Set up test data and render
  renderWithProviders(<MyComponent />);
  
  // Act: Perform user action
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  // Assert: Check expected outcome
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
it('displays error message when login fails');

// ❌ Bad
it('test login');
```

### 3. Test User Behavior, Not Implementation

```typescript
// ✅ Good: Tests what user sees
expect(screen.getByText(/logged in as omarcisse/i)).toBeInTheDocument();

// ❌ Bad: Tests internal state
expect(component.state.user).toBe('omarcisse');
```

### 4. Avoid Test Interdependence

Each test should be independent and not rely on other tests.

### 5. Clean Up After Tests

```typescript
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
```

## Debugging Tests

### View Rendered Output

```typescript
import { screen } from '@testing-library/react';

// Print entire document
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));
```

### Common Issues

**Issue**: Element not found
```typescript
// Solution: Use findBy for async elements
const element = await screen.findByText(/loading complete/i);
```

**Issue**: Testing Library query returns multiple elements
```typescript
// Solution: Use getAllBy or more specific query
const buttons = screen.getAllByRole('button');
expect(buttons).toHaveLength(2);
```

**Issue**: Act warnings
```typescript
// Solution: Wrap state updates in waitFor
await waitFor(() => {
  expect(screen.getByText(/updated/i)).toBeInTheDocument();
});
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before deployment

Ensure all tests pass before merging code.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
