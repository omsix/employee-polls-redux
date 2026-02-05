# Dashboard Component

The Dashboard is the main landing page of the application, displaying polls in a tabbed interface.

## 📍 Location

`src/components/dashboard/dashboard.component.tsx`

## 🎯 Purpose

Provides users with a central view of all polls, organized into:
- **Pending** - Polls the user hasn't voted on yet
- **Completed** - Polls the user has already answered

## 📋 Component Signature

```typescript
export interface DashboardComponentProps { }

export const DashboardComponent: React.FunctionComponent<DashboardComponentProps> = () => {
  // ...
}
```

## 🔧 Props

This component accepts no props. All data is retrieved from Redux state.

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|
| `state.users.entities` | User data for poll authors |
| `state.questions.entities` | All poll questions |

### RTK Query

```typescript
const { data: polls, isLoading: isLoadingPolls } = useBuildPollsQuery({
  questions,
  users
});
```

The `useBuildPollsQuery` hook computes poll data including:
- Vote percentages per option
- Whether the current user has answered
- Expansion state from localStorage

## 🖼️ UI Structure

```
┌─────────────────────────────────────────┐
│  ┌──────────┐  ┌───────────┐            │
│  │ Pending  │  │ Completed │   (Tabs)   │
│  └──────────┘  └───────────┘            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       PollDetailsComponent       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       PollDetailsComponent       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ...                                    │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 Data Flow

```
questions (Redux) ──┐
                    ├──▶ useBuildPollsQuery() ──▶ polls
users (Redux) ──────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    ▼                               ▼
                              answeredPolls                   pendingPolls
                              (filtered)                      (filtered)
                                    │                               │
                                    ▼                               ▼
                          Completed Tab                      Pending Tab
                               │                                   │
                               └───────────┬───────────────────────┘
                                           ▼
                                  PollDetailsComponent
                                      (for each)
```

## 📝 Key Implementation Details

### Tab State Management

```typescript
const [displayPendingPolls, setDisplayPendingPolls] = useState(true);

const toggleDisplay = () => {
  setDisplayPendingPolls(!displayPendingPolls);
};
```

### Poll Filtering

```typescript
if (polls) {
  answeredPolls = Object.values(polls.entities)
    .filter((poll) => poll.answered);
  pendingPolls = Object.values(polls.entities)
    .filter((poll) => !poll.answered);
}
```

### Loading State

```typescript
if (isLoadingPolls) {
  return <div>Loading...</div>;
}
```

### Empty State

```typescript
if (!polls) {
  return <div>No Polls To Display!</div>;
}
```

## 🎨 Styling

Uses CSS Modules for scoped styling:

```typescript
import styles from "./dashboard.module.css";

<div className={styles["dashboard-component"]}>
  <div className={styles["poll-list"]}>
    {/* polls */}
  </div>
</div>
```

## 🧪 Testing

**Test File:** `src/components/dashboard/dashboard.test.tsx`

### Test Cases

1. **Snapshot Test** - Matches snapshot when user is logged in
2. **Tab Switching** - Verifies toggling between Pending and Completed tabs

### Example Test

```typescript
it("switches between pending and completed tabs", () => {
  renderWithProviders(<DashboardComponent />, {
    preloadedState: {
      authedUser: { name: "omarcisse", expiresAt: Date.now() + 60000, status: "idle" },
      users: { entities: mockUsers, status: "idle" },
      questions: { entities: mockQuestions, status: "idle" },
    },
  });

  // Initially on Pending tab
  expect(screen.getByRole("tab", { name: /pending/i })).toHaveAttribute("aria-selected", "true");
  
  // Click Completed tab
  fireEvent.click(screen.getByRole("tab", { name: /completed/i }));
  
  expect(screen.getByRole("tab", { name: /completed/i })).toHaveAttribute("aria-selected", "true");
});
```

## 🔗 Related Components

- **[PollDetailsComponent](Components-Poll-Details.md)** - Rendered for each poll
- **[MenuToolbarComponent](Components-Menu-Toolbar.md)** - Navigation bar above

## 📚 Dependencies

### External
- `@mui/material` - Tabs, Tab, Box components

### Internal
- `PollDetailsComponent` - Poll card rendering
- `useBuildPollsQuery` - RTK Query hook
- `useAppSelector` - Redux state access
