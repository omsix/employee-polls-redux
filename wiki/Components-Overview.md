# Components Overview

This document provides a comprehensive overview of all React components in the Employee Polls application.

## 📋 Component Inventory

| Component | Purpose | Redux Connected |
|-----------|---------|-----------------|
| [Dashboard](#dashboard) | Main view with poll tabs | ✅ Yes |
| [LoginPage](#login-page) | User authentication | ✅ Yes |
| [RequireAuth](#require-auth) | Protected route wrapper | ✅ Yes |
| [PollDetails](#poll-details) | Individual poll card | ✅ Yes |
| [PollDetailsPage](#poll-details-page) | Poll route wrapper | ✅ Yes |
| [NewPoll](#new-poll) | Create new poll form | ✅ Yes |
| [LeaderBoard](#leader-board) | User rankings | ✅ Yes |
| [MenuToolbar](#menu-toolbar) | Top navigation bar | ✅ Yes |
| [NavBar](#nav-bar) | Simple logout nav | ✅ Yes |
| [NotFound](#not-found) | 404 error page | ❌ No |
| [CircularText](#circular-text) | SVG text utility | ❌ No |

---

## Component Details

### Dashboard

**File:** `src/components/dashboard/dashboard.component.tsx`

The main landing page displaying polls in a tabbed interface.

```typescript
export const DashboardComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Tabbed interface separating "Pending" and "Completed" polls
- Polls sorted by timestamp (newest first)
- Loading state handling
- Renders `PollDetailsComponent` for each poll

**Redux Usage:**
- `state.users.entities` - User data for poll authors
- `state.questions.entities` - All poll questions
- `useBuildPollsQuery()` - Computed poll data with percentages

**UI Components:** MUI Tabs, Tab, Box

---

### Login Page

**File:** `src/components/login-page/login-page.component.tsx`

Authentication entry point with user selection dropdown.

```typescript
export const LoginPageComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Dropdown to select from available users
- Fetches questions on successful login
- Sets 1-minute session duration (for Udacity review)
- Disabled state until user selected
- Redirects to original requested path after login

**Redux Usage:**
- `state.users.entities` - Available users for dropdown
- Dispatches `receiveQuestions()` - Load questions
- Dispatches `setAuthedUser()` - Authenticate user

**Routing:**
- Uses `useLocation()` to capture redirect path from state
- Uses `useNavigate()` to redirect after successful authentication
- Redirects to `state?.path` or `/` (dashboard) after login

**UI Components:** MUI Select, MenuItem, Button, FormControl

---

### Require Auth

**File:** `src/components/require-auth/require-auth.component.tsx`

Protected route wrapper component that ensures user authentication.

```typescript
interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => { ... }
```

**Features:**
- Wraps protected route components
- Redirects unauthenticated users to `/login`
- Preserves attempted path for post-login redirect
- Renders children only if user is authenticated

**Redux Usage:**
- `state.authedUser.name` - Check authentication status

**Implementation Pattern:**
```typescript
<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <MenuToolbarComponent />
      <DashboardComponent />
    </RequireAuth>
  }
/>
```

**Routing:**
- Uses `useLocation()` to capture current path
- Passes path as state to login redirect
- Uses `<Navigate>` component for redirects

---

### Poll Details

**File:** `src/components/poll-details/poll-details.component.tsx`

Individual poll card with voting functionality.

```typescript
interface PollDetailsComponentProps {
  poll: Poll;
}

export const PollDetailsComponent: React.FunctionComponent<PollDetailsComponentProps> = ({ poll }) => { ... }
```

**Features:**
- Expandable/collapsible card
- Radio buttons for unanswered polls
- Vote results with percentages for answered polls
- Confirmation dialog before submitting
- Author avatar and timestamp display

**Redux Usage:**
- `state.users.entities` - Author information
- `state.authedUser` - Current user for vote tracking
- `useSetExpandedMutation()` - Toggle expansion
- Dispatches `addAnswerToQuestion()`, `addAnswerToUser()`

**UI Components:** MUI Card, CardHeader, Avatar, Radio, RadioGroup, Dialog, IconButton

---

### Poll Details Page

**File:** `src/components/poll-details/poll-details-page.component.tsx`

Route wrapper that loads poll data from URL parameters.

```typescript
export const PollDetailsPageComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Extracts poll ID from URL (`/questions/:id`)
- Redirects to 404 if poll not found
- Loading state handling
- Wraps `PollDetailsComponent`

**Redux Usage:**
- `state.users.entities` - User data
- `state.questions.entities` - Questions data
- `useBuildPollsQuery()` - Computed polls

---

### New Poll

**File:** `src/components/new-poll/new-poll.component.tsx`

Form for creating new poll questions.

```typescript
export const NewPollComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Two text fields for poll options
- Input validation (both required, trimmed)
- Redirects to dashboard on success
- Submit button disabled until valid

**Redux Usage:**
- `state.authedUser` - Current user as author
- Dispatches `addQuestion()` - Create question
- Dispatches `addQuestionToUser()` - Update user's questions

**UI Components:** MUI TextField, Button, Box

---

### Leader Board

**File:** `src/components/leader-board/leader-board.component.tsx`

User rankings based on poll participation.

```typescript
export const LeaderBoardComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Calculates score: questions asked + questions answered
- Sorted by score (descending)
- Displays avatar, name, and stats per user
- Empty state message

**Redux Usage:**
- `state.users.entities` - All user data

**Score Calculation:**
```typescript
const score = Object.keys(user.answers).length + user.questions.length;
```

**UI Components:** MUI Card, CardContent, Avatar, Typography

---

### Menu Toolbar

**File:** `src/components/menu-toolbar/menu-toolbar.component.tsx`

Top navigation bar with hamburger menu.

```typescript
const MenuToolbarComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Dynamic page title based on current route
- Dropdown menu with navigation links
- User avatar with circular text name
- Logout functionality

**Navigation Links:**
| Label | Route |
|-------|-------|
| Dashboard | `/` |
| New Poll | `/add` |
| Leaderboard | `/leaderboard` |

**Redux Usage:**
- `state.authedUser.name` - Current user name
- `state.users.entities` - User avatar
- Dispatches `logout()` - Sign out

**UI Components:** MUI AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar

---

### Nav Bar

**File:** `src/components/nav-bar/nav-bar.component.tsx`

Minimal navigation component with logout button.

```typescript
export const NavBarComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Single logout button
- Lightweight alternative navigation

**Redux Usage:**
- Dispatches `logout()` - Sign out

**UI Components:** MUI Button

---

### Not Found

**File:** `src/components/not-found/not-found.component.tsx`

404 error page with interactive effects.

```typescript
export const NotFoundComponent: React.FunctionComponent = () => { ... }
```

**Features:**
- Displays "404" with error message
- Interactive "torch" effect following mouse
- Pure CSS animations
- No Redux connection

**Redux Usage:** None

---

### Circular Text

**File:** `src/components/circular-text/circular-text.component.tsx`

Utility component for rendering text in a circular SVG path.

```typescript
interface CircularTextProps {
  text: string;
  radius?: number;      // default: 75
  fontSize?: number;    // default: 14
  fontWeight?: string | number; // default: "bold"
  color?: string;       // default: CSS variable
  children?: ReactNode; // Center content
}

export const CircularText: React.FunctionComponent<CircularTextProps> = ({ ... }) => { ... }
```

**Features:**
- SVG-based circular text path
- Customizable radius, font, color
- Renders children in center (e.g., Avatar)
- Unique path IDs to prevent collisions

**Redux Usage:** None (pure presentational)

**Used In:** MenuToolbar (user name around avatar)

---

## 🔗 Component Relationships

```
App (Routes)
├── /login → LoginPageComponent
│
├── / → RequireAuth
│       ├── MenuToolbarComponent
│       │   └── CircularText (with Avatar)
│       └── DashboardComponent
│           └── PollDetailsComponent (multiple)
│
├── /questions/:id → RequireAuth
│                    ├── MenuToolbarComponent
│                    └── PollDetailsPageComponent
│                        └── PollDetailsComponent
│
├── /add → RequireAuth
│          ├── MenuToolbarComponent
│          └── NewPollComponent
│
├── /leaderboard → RequireAuth
│                  ├── MenuToolbarComponent
│                  └── LeaderBoardComponent
│
└── /404 → MenuToolbarComponent + NotFoundComponent
```

**Note:** All routes except `/login` and `/404` are protected with the `RequireAuth` wrapper.

---

## 📁 Component File Structure

Each component follows this pattern:

```
component-name/
├── component-name.component.tsx    # Main component
├── component-name.module.css       # Scoped styles (optional)
├── component-name.test.tsx         # Unit tests
└── __snapshots__/                  # Test snapshots
    └── component-name.test.tsx.snap
```

**Note:** Some components like `RequireAuth` may not have CSS modules if they are purely functional wrappers.

---

## 🎨 Styling Approach

- **CSS Modules:** Scoped styles per component
- **Material-UI:** Pre-built components with theming
- **Inline Styles:** Minimal, only for dynamic values

```typescript
// CSS Modules usage
import styles from "./component.module.css";

<div className={styles["component-class"]}>
```
