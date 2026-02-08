# Login Page Component

The Login Page is the authentication entry point where users select their identity to access the application.

## 📍 Location

`src/components/login-page/login-page.component.tsx`

## 🎯 Purpose

- Display available users for selection
- Authenticate the selected user
- Load initial application data (questions)
- Establish user session with expiry

## 📋 Component Signature

```typescript
export interface LoginPageComponentProps { }

export const LoginPageComponent: React.FunctionComponent<LoginPageComponentProps> = () => {
  // ...
}
```

## 🔧 Props

This component accepts no props. User data is retrieved from Redux state.

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|
| `state.users.entities` | Available users for dropdown |

### Actions Dispatched

| Action | Purpose |
|--------|---------|
| `receiveQuestions(questions)` | Load all questions into state |
| `setAuthedUser(userId)` | Set authenticated user with session |

## 🖼️ UI Structure

```
┌─────────────────────────────────────────┐
│                                         │
│            Employee Polls               │
│                                         │
│     ┌───────────────────────────┐      │
│     │   Select User ▼           │      │
│     │   ┌─────────────────────┐ │      │
│     │   │ omarcisse           │ │      │
│     │   │ sarahedo            │ │      │
│     │   │ tylermcginnis       │ │      │
│     │   │ zoshikanlu          │ │      │
│     │   └─────────────────────┘ │      │
│     └───────────────────────────┘      │
│                                         │
│          ┌──────────────┐              │
│          │    Login     │              │
│          └──────────────┘              │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 Authentication Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ User Select │────▶│ Login Click  │────▶│ Fetch Questions │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                                   ▼
                    ┌─────────────────────────────────────────┐
                    │           Dispatch Actions               │
                    │  1. receiveQuestions(questions)         │
                    │  2. setAuthedUser(selectedUser)         │
                    └─────────────────────────────────────────┘
                                                   │
                                                   ▼
                    ┌─────────────────────────────────────────┐
                    │         Redirect to Dashboard            │
                    │    (handled by App.tsx conditional)      │
                    └─────────────────────────────────────────┘
```

## 📝 Key Implementation Details

### Local State

```typescript
const [selectedUser, setSelectedUser] = useState<string | null>(null);
```

### User Selection Handler

```typescript
const handleChange = (event: SelectChangeEvent) => {
  setSelectedUser(event.target.value as string);
};
```

### Login Handler

```typescript
const handleLogin = async () => {
  if (selectedUser) {
    // Fetch questions from API
    const questions = await getQuestions();
    dispatch(receiveQuestions(questions.entities));
    
    // Set authenticated user (creates 60-minute session)
    dispatch(setAuthedUser(selectedUser));
  }
};
```

### Disabled State

The login button is disabled until a user is selected:

```typescript
<Button
  onClick={handleLogin}
  disabled={!selectedUser}
  variant="contained"
>
  Login
</Button>
```

## 🔐 Session Management

When `setAuthedUser` is dispatched, the authedUser slice creates a session:

```typescript
// In authedUser.ts
setAuthedUser.fulfilled: (state, action) => {
  state.name = action.payload;
  state.expiresAt = Date.now() + 60 * 1000; // 1 minute
  state.status = "idle";
}
```

> **Note:** The session expires after 1 minute for Udacity review purposes. In a production environment, this would typically be set to a longer duration (e.g., 60 minutes).

## 🎨 Styling

Uses CSS Modules for scoped styling:

```typescript
import styles from "./login-page.module.css";

<div className={styles["login-page-component"]}>
  {/* content */}
</div>
```

## 🧪 Testing

**Test File:** `src/components/login-page/login-page.test.tsx`

### Test Cases

1. **Login Flow** - Verifies user selection and login dispatch
2. **Session Expiry** - Verifies session is set to expire after 1 minute

### Example Test: Login Flow

```typescript
it("triggers handleLogin when omarcisse is selected and Login button is clicked", async () => {
  renderWithProviders(<LoginPageComponent />, {
    preloadedState: {
      users: { entities: mockUsers, status: "idle" },
    },
  });

  // Open select dropdown
  const select = screen.getByRole("combobox");
  fireEvent.mouseDown(select);

  // Select user
  const option = screen.getByRole("option", { name: /omar cisse/i });
  fireEvent.click(option);

  // Click login
  const loginButton = screen.getByRole("button", { name: /login/i });
  fireEvent.click(loginButton);

  // Verify actions dispatched
  await waitFor(() => {
    // Assert state changes
  });
});
```

### Example Test: Session Expiry

```typescript
it("sets session to expire after 1 minute when user logs in", async () => {
  // Use fake timers with shouldAdvanceTime to allow async operations to complete
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const currentTime = Date.now();
  vi.setSystemTime(currentTime);

  // ... render and login flow ...

  await waitFor(() => {
    const state = store.getState();
    expect(state.authedUser.name).toBe("omarcisse");
    expect(state.authedUser.expiresAt).toBeDefined();
    // Allow for small timing variance due to async operations
    expect(state.authedUser.expiresAt).toBeGreaterThanOrEqual(currentTime + 60 * 1000);
    expect(state.authedUser.expiresAt).toBeLessThanOrEqual(currentTime + 60 * 1000 + 1000);
  });

  vi.useRealTimers();
});
```

### Testing Notes

When testing session expiry with fake timers:
- Use `vi.useFakeTimers({ shouldAdvanceTime: true })` to allow async operations (like `waitFor` and `findByText`) to complete while fake timers are active
- Use range assertions instead of exact equality to account for timing variance during async operations

## 🔗 Related Components

- **[App](../src/App.tsx)** - Conditionally renders LoginPage when not authenticated
- **[DashboardComponent](Components-Dashboard.md)** - Destination after login

## 📚 Dependencies

### External
- `@mui/material` - Select, MenuItem, Button, FormControl, InputLabel

### Internal
- `getQuestions` - API function from `loginAPI.ts`
- `receiveQuestions` - Redux action
- `setAuthedUser` - Redux async thunk
- `useAppDispatch`, `useAppSelector` - Redux hooks

## ⚠️ Security Note

This login page uses mock authentication without password verification. In a production environment:
- Implement proper authentication (OAuth, JWT, etc.)
- Never store passwords in client-side state
- Use HTTPS for all authentication requests
- Implement CSRF protection
