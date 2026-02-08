# Menu Toolbar Component

The Menu Toolbar is the main navigation bar displayed at the top of the application when a user is authenticated.

## 📍 Location

`src/components/menu-toolbar/menu-toolbar.component.tsx`

## 🎯 Purpose

- Provide top navigation bar with branding
- Display current user information with avatar
- Show remaining session time with live countdown
- Offer navigation menu to main sections
- Enable logout functionality
- Auto-logout when session expires

## 📋 Component Signature

```typescript
const MenuToolbarComponent: React.FunctionComponent = () => {
  // ...
}

export default MenuToolbarComponent;
```

## 🔧 Props

This component accepts no props. All data is retrieved from Redux state and React Router.

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|--------|
| `state.authedUser.name` | Current user's ID |
| `state.authedUser.expiresAt` | Session expiration timestamp |
| `state.remainingSessionTime.seconds` | Remaining seconds until session expires |
| `state.users.entities` | User details (name, avatar) |

### Actions Dispatched

| Action | Purpose |
|--------|---------|--------|
| `logout` | Clear authentication state |
| `updateRemainingTime` | Update countdown seconds |
| `resetRemainingTime` | Clear remaining time on logout |

## 🖼️ UI Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Page Title     [Session: 00:59]    [Avatar with Name]  [≡] │
│                                                             │
│  Menu:                                                      │
│  ┌────────────────┐                                        │
│  │ Dashboard      │                                        │
│  │ New Poll       │                                        │
│  │ Leaderboard    │                                        │
│  │ ────────────── │                                        │
│  │ Logout         │                                        │
│  └────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Navigation Links

| Menu Item | Route | Description |
|-----------|-------|-------------|
| Dashboard | `/` | Main poll view |
| New Poll | `/add` | Create new poll |
| Leaderboard | `/leaderboard` | User rankings |
| Logout | N/A | Clears session, redirects to login |

## 📝 Key Implementation Details

### Menu State

```typescript
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const open = Boolean(anchorEl);

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};
```

### Dynamic Page Title

The title changes based on the current route:

```typescript
const location = useLocation();

const getPageTitle = () => {
  switch (location.pathname) {
    case "/":
      return "Dashboard";
    case "/add":
      return "New Poll";
    case "/leaderboard":
      return "Leaderboard";
    default:
      if (location.pathname.startsWith("/questions/")) {
        return "Poll Details";
      }
      return "Employee Polls";
  }
};
```

### User Avatar with Circular Text

Uses the `CircularText` component to display the user's name around their avatar:

```typescript
<CircularText text={user.name} radius={40} fontSize={10}>
  <Avatar src={user.avatarURL} alt={user.name} />
</CircularText>
```

### Navigation Handler

```typescript
const navigate = useNavigate();

const handleNavigate = (path: string) => {
  handleClose();
  navigate(path);
};
```

### Session Countdown

Displays remaining session time with live updates:

```typescript
const expiresAt = useAppSelector((state) => state.authedUser.expiresAt);
const remainingSeconds = useAppSelector((state) => state.remainingSessionTime.seconds);

const handleLogout = React.useCallback(() => {
  dispatch(logout());
  dispatch(resetRemainingTime());
  localStorage.clear();
  navigate('/login');
}, [dispatch, navigate]);

// Update remaining session time every second
React.useEffect(() => {
  if (!expiresAt) {
    dispatch(resetRemainingTime());
    return;
  }

  const updateTimer = () => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
    dispatch(updateRemainingTime(remaining));

    // Auto logout when session expires
    if (remaining <= 0) {
      handleLogout();
    }
  };

  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);

  return () => clearInterval(intervalId);
}, [expiresAt, dispatch, handleLogout]);

// Format remaining time as MM:SS
const formatTime = (seconds: number | null): string => {
  if (seconds === null || seconds < 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

### Session Display Component

```typescript
{remainingSeconds !== null && (
  <Chip
    label={`Session: ${formatTime(remainingSeconds)}`}
    color={remainingSeconds < 30 ? "error" : "default"}
    size="small"
    sx={{ marginRight: 2 }}
  />
)}
```

**Features:**
- Updates every second
- Displays time in MM:SS format
- Turns red when less than 30 seconds remain
- Automatically logs out user when time expires

## 🎨 Styling

Uses CSS Modules for scoped styling:

```typescript
import styles from "./menu-toolbar.module.css";

<AppBar className={styles["menu-toolbar"]}>
  {/* content */}
</AppBar>
```

## 🧪 Testing

**Test File:** `src/components/menu-toolbar/menu-toolbar.test.tsx`

### Test Cases

1. **Renders Title and User** - Displays app title and user information
2. **Opens Menu** - Menu opens on hamburger click
3. **Navigation - Home** - Clicking Dashboard navigates to `/`
4. **Navigation - Logout** - Logout clears session and redirects

### Example Test

```typescript
it("opens menu when menu button is clicked", async () => {
  renderWithProviders(<MenuToolbarComponent />, {
    preloadedState: {
      authedUser: { name: "testuser", expiresAt: Date.now() + 60000, status: "idle" },
      users: {
        entities: {
          testuser: { id: "testuser", name: "Test User", avatarURL: "/avatar.png" },
        },
        status: "idle",
      },
    },
  });

  const menuButton = screen.getByLabelText(/menu/i);
  fireEvent.click(menuButton);

  await waitFor(() => {
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/new poll/i)).toBeInTheDocument();
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
```

```typescript
it("logs out and navigates to login when Logout menu item is clicked", async () => {
  renderWithProviders(<MenuToolbarComponent />, { preloadedState });

  // Open menu
  fireEvent.click(screen.getByLabelText(/menu/i));

  // Click logout
  await waitFor(() => {
    fireEvent.click(screen.getByText(/logout/i));
  });

  // Verify logout action dispatched and navigation occurred
});
```

## 🔗 Related Components

- **[CircularText](Components-Navigation.md#circular-text)** - User name display around avatar
- **[App](../src/App.tsx)** - Parent that conditionally renders toolbar

## 📚 Dependencies

### External
- `@mui/material` - AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Typography
- `@mui/icons-material` - MenuIcon
- `react-router-dom` - useNavigate, useLocation

### Internal
- `CircularText` - SVG circular text component
- `logout` - Redux action
- `useAppDispatch`, `useAppSelector` - Redux hooks

## 🎯 Features

| Feature | Implementation |
|---------|----------------|
| Responsive Title | Changes based on current route |
| Session Countdown | Live timer showing remaining session time |
| Auto-Logout | Automatically logs out when session expires |
| User Display | Avatar with circular name text |
| Dropdown Menu | MUI Menu with navigation items |
| Session Management | Logout clears localStorage and Redux |

## 📱 Responsive Behavior

The toolbar uses MUI's responsive components:
- `AppBar` provides sticky positioning
- `Toolbar` handles content alignment
- Menu automatically positions relative to anchor
