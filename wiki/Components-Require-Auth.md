# RequireAuth Component

The RequireAuth component is a route protection wrapper that ensures users are authenticated before accessing protected routes.

## 📍 Location

`src/components/require-auth/require-auth.component.tsx`

## 🎯 Purpose

- Protect routes from unauthenticated access
- Redirect unauthenticated users to login page
- Preserve attempted URL for post-login redirect
- Provide declarative route protection pattern

## 📋 Component Signature

```typescript
interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // ...
}
```

## 🔧 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Components to render if authenticated |

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|
| `state.authedUser.name` | Check if user is authenticated |

### Actions Dispatched

None - this is a purely presentational wrapper.

## 📝 Implementation

### Core Logic

```typescript
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const authedUser = useAppSelector((state) => state.authedUser.name);
  const location = useLocation();

  if (!authedUser) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};
```

### Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              RequireAuth Component                      │
│                                                         │
│  1. Check if authedUser exists                         │
│     ├── YES → Render children                          │
│     │                                                   │
│     └── NO → Redirect to /login                        │
│              with current path in state                │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Usage Pattern

### In Route Definitions

```typescript
<Routes>
  {/* Public route */}
  <Route path="/login" element={<LoginPageComponent />} />
  
  {/* Protected route */}
  <Route
    path="/"
    element={
      <RequireAuth>
        <MenuToolbarComponent />
        <DashboardComponent />
      </RequireAuth>
    }
  />
  
  {/* Another protected route */}
  <Route
    path="/add"
    element={
      <RequireAuth>
        <MenuToolbarComponent />
        <NewPollComponent />
      </RequireAuth>
    }
  />
</Routes>
```

### Current Protected Routes

All routes except `/login` and `/404` are wrapped with `RequireAuth`:

| Route | Components |
|-------|------------|
| `/` | MenuToolbar + Dashboard |
| `/questions/:id` | MenuToolbar + PollDetailsPage |
| `/add` | MenuToolbar + NewPoll |
| `/leaderboard` | MenuToolbar + LeaderBoard |

## 🔐 Authentication Flow

### Unauthenticated User Tries to Access Protected Route

```
1. User navigates to /add
   ↓
2. RequireAuth checks authedUser.name
   ↓
3. No user found → Navigate to /login
   ↓
4. Pass current path (/add) in state
   ↓
5. LoginPageComponent renders
   ↓
6. User logs in
   ↓
7. LoginPageComponent reads state.path
   ↓
8. Redirects to /add (original destination)
```

### Authenticated User Access

```
1. User navigates to /add
   ↓
2. RequireAuth checks authedUser.name
   ↓
3. User found → Render children
   ↓
4. MenuToolbar + NewPoll components render
```

## 📚 Dependencies

### External
- `react-router-dom` - Navigate, useLocation
- `react` - ReactNode type

### Internal
- `useAppSelector` - Redux hook for state access

## 🎯 Design Pattern

This component follows the **Higher-Order Component (HOC)** pattern recommended by React Router for route protection:

- **Declarative**: Protection is visible in route definitions
- **Composable**: Easy to wrap multiple components
- **Reusable**: Single component protects all routes
- **Stateless**: No internal state, pure wrapper

## 🔗 Related Components

- **[LoginPageComponent](Components-Login-Page.md)** - Handles redirect after authentication
- **[App](../src/App.tsx)** - Defines protected routes
- **[MenuToolbarComponent](Components-Menu-Toolbar.md)** - Rendered in all protected routes

## ⚙️ Configuration

No configuration needed. The component automatically:
- Reads authentication state from Redux
- Captures current location
- Redirects with preserved path

## 🧪 Testing

When testing components wrapped in `RequireAuth`, use `renderWithProviders` with preloaded auth state:

```typescript
it("redirects to login when not authenticated", () => {
  renderWithProviders(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <div>Dashboard</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        authedUser: { name: null, expiresAt: null, status: "idle" },
      },
    }
  );

  expect(screen.getByText("Login Page")).toBeInTheDocument();
});
```

## 🚀 Best Practices

1. **Always wrap protected components**: Don't rely on conditional rendering in App.tsx
2. **Include MenuToolbar**: All protected routes should include the toolbar for consistency
3. **Test both states**: Verify behavior for authenticated and unauthenticated users
4. **Preserve navigation state**: The component automatically preserves the attempted path

## 📖 References

- [React Router Protected Routes Tutorial](https://fireship.dev/react-router-tutorial#protected-routes)
- [React Router v6 Documentation](https://reactrouter.com/docs/en/v6)
