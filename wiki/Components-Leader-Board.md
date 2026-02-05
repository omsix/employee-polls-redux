# Leader Board Component

The Leader Board displays user rankings based on their poll participation activity.

## 📍 Location

`src/components/leader-board/leader-board.component.tsx`

## 🎯 Purpose

- Rank users by poll participation score
- Display individual user statistics
- Encourage engagement through gamification

## 📋 Component Signature

```typescript
export interface LeaderBoardComponentProps { }

export const LeaderBoardComponent: React.FunctionComponent<LeaderBoardComponentProps> = () => {
  // ...
}
```

## 🔧 Props

This component accepts no props. All data is retrieved from Redux state.

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|
| `state.users.entities` | All user data for ranking |

## 🖼️ UI Structure

```
┌─────────────────────────────────────────┐
│            Leader Board                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar]  User Name              │   │
│  │                                  │   │
│  │  Questions Asked: 3              │   │
│  │  Questions Answered: 5           │   │
│  │  Score: 8                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar]  User Name              │   │
│  │                                  │   │
│  │  Questions Asked: 2              │   │
│  │  Questions Answered: 4           │   │
│  │  Score: 6                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ...                                    │
│                                         │
└─────────────────────────────────────────┘
```

## 📊 Score Calculation

The score is calculated as the sum of:
- **Questions Asked** - Number of polls created by the user
- **Questions Answered** - Number of polls the user has voted on

```typescript
const score = Object.keys(user.answers).length + user.questions.length;
```

### Example

| Metric | Count |
|--------|-------|
| Questions Asked | 3 |
| Questions Answered | 5 |
| **Total Score** | **8** |

## 🔄 Data Flow

```
users (Redux) ──▶ Object.values() ──▶ map(calculateScore) ──▶ sort(byScore) ──▶ render
```

## 📝 Key Implementation Details

### User Transformation

```typescript
const usersArray = Object.values(users.entities).map(user => ({
  ...user,
  questionsAsked: user.questions.length,
  questionsAnswered: Object.keys(user.answers).length,
  score: Object.keys(user.answers).length + user.questions.length,
}));
```

### Sorting

Users are sorted by score in descending order (highest first):

```typescript
const sortedUsers = usersArray.sort((a, b) => b.score - a.score);
```

### Empty State

```typescript
if (sortedUsers.length === 0) {
  return <div>No users to display</div>;
}
```

### User Card Rendering

```typescript
{sortedUsers.map((user) => (
  <Card key={user.id}>
    <CardContent>
      <Avatar src={user.avatarURL} />
      <Typography variant="h6">{user.name}</Typography>
      <Typography>Questions Asked: {user.questionsAsked}</Typography>
      <Typography>Questions Answered: {user.questionsAnswered}</Typography>
      <Typography variant="h5">Score: {user.score}</Typography>
    </CardContent>
  </Card>
))}
```

## 🎨 Styling

Uses CSS Modules for scoped styling:

```typescript
import styles from "./leader-board.module.css";

<div className={styles["leader-board-component"]}>
  {/* content */}
</div>
```

## 🧪 Testing

**Test File:** `src/components/leader-board/leader-board.test.tsx`

### Test Cases

1. **Empty State** - Displays message when no users
2. **Sorted Order** - Users sorted by score descending
3. **Score Calculation** - Correct score for each user
4. **Avatar Rendering** - Avatars displayed for all users

### Example Test

```typescript
it("displays users sorted by score in descending order", () => {
  const mockUsers = {
    user1: { id: "user1", name: "User One", answers: { q1: "optionOne" }, questions: [] },
    user2: { id: "user2", name: "User Two", answers: {}, questions: ["q1", "q2", "q3"] },
    user3: { id: "user3", name: "User Three", answers: { q1: "optionOne", q2: "optionTwo" }, questions: ["q1"] },
  };

  renderWithProviders(<LeaderBoardComponent />, {
    preloadedState: {
      users: { entities: mockUsers, status: "idle" },
    },
  });

  const userNames = screen.getAllByRole("heading", { level: 6 })
    .map(el => el.textContent);

  // user3 (score: 3), user2 (score: 3), user1 (score: 1)
  // Tied scores maintain original order
  expect(userNames[0]).toBe("User Three"); // or User Two (tie)
});
```

```typescript
it("displays correct score calculations for each user", () => {
  const mockUsers = {
    testuser: {
      id: "testuser",
      name: "Test User",
      answers: { q1: "optionOne", q2: "optionTwo" }, // 2 answers
      questions: ["q3"], // 1 question
    },
  };

  renderWithProviders(<LeaderBoardComponent />, {
    preloadedState: {
      users: { entities: mockUsers, status: "idle" },
    },
  });

  expect(screen.getByText(/Questions Asked: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Questions Answered: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/Score: 3/i)).toBeInTheDocument();
});
```

## 🔗 Related Components

- **[MenuToolbarComponent](Components-Menu-Toolbar.md)** - Navigation link to leaderboard
- **[DashboardComponent](Components-Dashboard.md)** - Alternative main view

## 📚 Dependencies

### External
- `@mui/material` - Card, CardContent, Avatar, Typography

### Internal
- `useAppSelector` - Redux state access

## 🎮 Gamification Elements

The leaderboard encourages user engagement through:

| Element | Purpose |
|---------|---------|
| Ranking | Creates competition |
| Visible Scores | Provides clear goals |
| Activity Metrics | Shows how to improve |
| Avatars | Personal identification |

## 💡 Future Enhancements

Potential improvements for the leaderboard:

1. **Badges** - Award badges for milestones
2. **Trends** - Show ranking changes over time
3. **Filters** - Filter by time period (weekly, monthly)
4. **Pagination** - Handle large user lists
5. **Animations** - Rank change animations
