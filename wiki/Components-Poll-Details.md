# Poll Details Component

The Poll Details component displays an individual poll card with voting functionality and results.

## 📍 Location

- **Main Component:** `src/components/poll-details/poll-details.component.tsx`
- **Page Wrapper:** `src/components/poll-details/poll-details-page.component.tsx`

## 🎯 Purpose

- Display poll question with author information
- Allow users to vote on unanswered polls
- Show vote results with percentages for answered polls
- Provide expandable/collapsible card interface

## 📋 Component Signatures

### PollDetailsComponent

```typescript
export interface PollDetailsComponentProps {
  poll: Poll;
}

export const PollDetailsComponent: React.FunctionComponent<PollDetailsComponentProps> = ({ poll }) => {
  // ...
}
```

### PollDetailsPageComponent

```typescript
export const PollDetailsPageComponent: React.FunctionComponent = () => {
  // Loads poll from URL params and renders PollDetailsComponent
}
```

## 🔧 Props

### PollDetailsComponent Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `poll` | `Poll` | Yes | Poll data including question, options, and vote info |

### Poll Interface

```typescript
interface Poll {
  question: Question;
  expand: boolean;
  answered: boolean;
  selectedAnswer: "optionOne" | "optionTwo" | undefined;
  optionOne: { voted: number; percentage: string };
  optionTwo: { voted: number; percentage: string };
}
```

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|
| `state.users.entities` | Author information |
| `state.authedUser` | Current user for vote tracking |

### RTK Query

```typescript
const [triggerSetExpanded] = useSetExpandedMutation();
```

### Actions Dispatched

| Action | Purpose |
|--------|---------|
| `addAnswerToQuestion` | Record vote on question |
| `addAnswerToUser` | Update user's answers |
| `setExpanded` | Toggle card expansion (via mutation) |

## 🖼️ UI Structure

### Collapsed State

```
┌─────────────────────────────────────────┐
│  [A]  Option One Text...                │
│       Asked On 01/15/2024               │
└─────────────────────────────────────────┘
```

### Expanded State (Unanswered)

```
┌─────────────────────────────────────────┐
│  [Avatar]  By Author Name               │
│            Asked On 01/15/2024          │
├─────────────────────────────────────────┤
│                                         │
│  Would You Rather                       │
│                                         │
│  ○ Option One?                          │
│  ○ Option Two?                          │
│                                         │
├─────────────────────────────────────────┤
│  [Vote Icon] Vote                       │
└─────────────────────────────────────────┘
```

### Expanded State (Answered)

```
┌─────────────────────────────────────────┐
│  [Avatar]  By Author Name               │
│            Asked On 01/15/2024          │
├─────────────────────────────────────────┤
│                                         │
│  You voted for:                         │
│                                         │
│  1. Option One [2 votes (50%)]         │
│  2. Option Two [2 votes (50%)]          │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 Voting Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Select      │────▶│ Click Vote   │────▶│ Confirm Dialog  │
│ Option      │     │ Button       │     │ Opens           │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                         ┌─────────▼─────────┐
                                         │  Click Confirm    │
                                         └─────────┬─────────┘
                                                   │
                    ┌──────────────────────────────┴──────────────────────────────┐
                    │                    Dispatch Actions                          │
                    │  1. addAnswerToQuestion({ authedUser, qid, answer })        │
                    │  2. addAnswerToUser({ authedUser, qid, answer })            │
                    └─────────────────────────────────────────────────────────────┘
```

## 📝 Key Implementation Details

### Local State

```typescript
const [open, setOpen] = useState(false);  // Dialog open state
const [selectedAnswer, setSelectedAnswer] = useState<'optionOne' | 'optionTwo' | undefined>(
  poll.selectedAnswer
);
```

### Null Check for Author

```typescript
const user = users.entities[poll.question.author];

if (!user) {
  return (
    <Card className={styles["poll-details-component"]}>
      <CardContent>Error: Poll author not found</CardContent>
    </Card>
  );
}
```

### Vote Validation

The vote button is disabled until an option is selected:

```typescript
<IconButton onClick={() => setOpen(!open)} disabled={!selectedAnswer}>
  <HowToVoteIcon /> Vote
</IconButton>
```

### Vote Handler

```typescript
function handleVote(): void {
  if (!selectedAnswer) {
    return;  // Early return if no selection
  }
  
  // Update question votes
  dispatch(addAnswerToQuestion({
    authedUser: authedUser.name!,
    qid: poll.question.id,
    answer: selectedAnswer
  }));

  // Update user answers
  dispatch(addAnswerToUser({
    authedUser: authedUser.name!,
    qid: poll.question.id,
    answer: selectedAnswer
  }));
  
  setOpen(false);
}
```

### Toggle Expansion

```typescript
const toggleExpand = () => {
  triggerSetExpanded({
    pollId: poll.question.id,
    expanded: !poll.expand
  });
};
```

## 🎨 Styling

Uses CSS Modules for scoped styling:

```typescript
import styles from "./poll-details.module.css";

<Card className={styles["poll-details-component"]}>
<Avatar className={styles["poll-details-avatar-img"]}>
<Avatar className={styles["poll-details-avatar-letter"]}>
```

## 🧪 Testing

**Test File:** `src/components/poll-details/poll-details.test.tsx`

### Test Cases

1. **Snapshot Test** - Matches snapshot for specific poll
2. **Unanswered Poll** - Displays radio buttons
3. **Vote Dialog** - Opens confirmation on vote click
4. **Author Display** - Shows author info when expanded
5. **Vote Results** - Displays percentages for answered polls
6. **Vote Submission** - Correctly dispatches actions

### Example Test

```typescript
it("opens vote confirmation dialog when Vote button is clicked", async () => {
  const poll: Poll = {
    question: mockQuestion,
    expand: true,
    answered: false,
    selectedAnswer: undefined,
    optionOne: { voted: 0, percentage: "0%" },
    optionTwo: { voted: 0, percentage: "0%" },
  };

  renderWithProviders(<PollDetailsComponent poll={poll} />, { preloadedState });

  // Select an option first
  const optionOneRadio = screen.getByLabelText(/option one\?/i);
  fireEvent.click(optionOneRadio);

  // Click vote button
  const voteButton = screen.getByText(/Vote/i);
  fireEvent.click(voteButton);

  // Verify dialog appears
  await waitFor(() => {
    expect(screen.getByText(/Vote Confirmation/i)).toBeInTheDocument();
  });
});
```

## 🔗 Related Components

- **[DashboardComponent](Components-Dashboard.md)** - Parent that renders multiple poll cards
- **[PollDetailsPageComponent](#poll-details-page)** - Route wrapper for direct URL access

## 📚 Dependencies

### External
- `@mui/material` - Card, CardHeader, Avatar, Radio, RadioGroup, Dialog, IconButton, Collapse
- `@mui/icons-material` - HowToVoteIcon, CheckIcon, CancelIcon

### Internal
- `useSetExpandedMutation` - RTK Query mutation
- `addAnswerToQuestion`, `addAnswerToUser` - Redux actions
- `useAppDispatch`, `useAppSelector` - Redux hooks
