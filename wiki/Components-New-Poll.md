# New Poll Component

The New Poll component provides a form for creating new "Would You Rather" style poll questions.

## 📍 Location

`src/components/new-poll/new-poll.component.tsx`

## 🎯 Purpose

- Provide form interface for creating new polls
- Validate poll options before submission
- Submit new poll to Redux store
- Redirect to dashboard on success

## 📋 Component Signature

```typescript
export interface NewPollComponentProps { }

export const NewPollComponent: React.FunctionComponent<NewPollComponentProps> = () => {
  // ...
}
```

## 🔧 Props

This component accepts no props. All data is managed through local state and Redux.

## 🏪 Redux Integration

### State Used

| Selector | Purpose |
|----------|---------|
| `state.authedUser` | Current user as poll author |

### Actions Dispatched

| Action | Purpose |
|--------|---------|
| `addQuestion` | Create new poll question |
| `addQuestionToUser` | Add question to user's created list |

## 🖼️ UI Structure

```
┌─────────────────────────────────────────┐
│                                         │
│           Create New Poll               │
│                                         │
│  Would you rather...                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Option One                      │   │
│  │ Enter first option...           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Option Two                      │   │
│  │ Enter second option...          │   │
│  └─────────────────────────────────┘   │
│                                         │
│          ┌──────────────┐              │
│          │    Submit    │              │
│          └──────────────┘              │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 Submission Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Fill Form   │────▶│ Click Submit │────▶│ Validate Input  │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                         ┌─────────▼─────────┐
                                         │ Dispatch Actions  │
                                         │                   │
                                         │ 1. addQuestion()  │
                                         │ 2. addQuestionTo  │
                                         │    User()         │
                                         └─────────┬─────────┘
                                                   │
                                         ┌─────────▼─────────┐
                                         │ Navigate to "/"   │
                                         │ (Dashboard)       │
                                         └───────────────────┘
```

## 📝 Key Implementation Details

### Local State

```typescript
const [optionOne, setOptionOne] = useState<string>("");
const [optionTwo, setOptionTwo] = useState<string>("");
```

### Router Navigation

```typescript
const navigate = useNavigate();

// After successful submission
navigate("/");
```

### Form Validation

Submit button is disabled when:
- User is not authenticated
- Option one is empty (after trimming)
- Option two is empty (after trimming)

```typescript
const isDisabled = !authedUser.name 
  || optionOne.trim() === "" 
  || optionTwo.trim() === "";

<Button disabled={isDisabled}>
  Submit
</Button>
```

### Submit Handler

```typescript
const handleSubmit = async () => {
  const trimmedOptionOne = optionOne.trim();
  const trimmedOptionTwo = optionTwo.trim();

  if (trimmedOptionOne && trimmedOptionTwo && authedUser.name) {
    // Create the question
    const result = await dispatch(addQuestion({
      optionOneText: trimmedOptionOne,
      optionTwoText: trimmedOptionTwo,
      author: authedUser.name
    }));

    // Add to user's questions list
    if (addQuestion.fulfilled.match(result)) {
      dispatch(addQuestionToUser({
        authedUser: authedUser.name,
        qid: result.payload.id
      }));
      
      // Redirect to dashboard
      navigate("/");
    }
  }
};
```

### Input Handlers

```typescript
const handleOptionOneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setOptionOne(event.target.value);
};

const handleOptionTwoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setOptionTwo(event.target.value);
};
```

## 🎨 Styling

Uses CSS Modules for scoped styling:

```typescript
import styles from "./new-poll.module.css";

<div className={styles["new-poll-component"]}>
  {/* form content */}
</div>
```

## 🧪 Testing

**Test File:** `src/components/new-poll/new-poll.test.tsx`

### Test Cases

1. **Renders Form** - Displays text fields and submit button
2. **Disabled Without Auth** - Button disabled when not authenticated
3. **Disabled Empty Option One** - Button disabled when first field empty
4. **Disabled Empty Option Two** - Button disabled when second field empty
5. **Enabled When Valid** - Button enabled when both fields filled
6. **Updates Input Values** - Verifies controlled input behavior
7. **Submits Form** - Creates poll and navigates on success
8. **Trims Whitespace** - Handles whitespace-only input

### Example Test

```typescript
it("enables submit button when both options are filled", () => {
  renderWithProviders(<NewPollComponent />, {
    preloadedState: {
      authedUser: { name: "testuser", expiresAt: Date.now() + 60000, status: "idle" },
    },
  });

  const optionOne = screen.getByLabelText(/option one/i);
  const optionTwo = screen.getByLabelText(/option two/i);
  const submitButton = screen.getByRole("button", { name: /submit/i });

  // Initially disabled
  expect(submitButton).toBeDisabled();

  // Fill both fields
  fireEvent.change(optionOne, { target: { value: "Learn React" } });
  fireEvent.change(optionTwo, { target: { value: "Learn Vue" } });

  // Now enabled
  expect(submitButton).not.toBeDisabled();
});
```

```typescript
it("trims whitespace from options before submission", async () => {
  renderWithProviders(<NewPollComponent />, { preloadedState });

  const optionOne = screen.getByLabelText(/option one/i);
  const optionTwo = screen.getByLabelText(/option two/i);

  // Input with whitespace
  fireEvent.change(optionOne, { target: { value: "  Learn React  " } });
  fireEvent.change(optionTwo, { target: { value: "  Learn Vue  " } });

  const submitButton = screen.getByRole("button", { name: /submit/i });
  fireEvent.click(submitButton);

  // Verify trimmed values were submitted
  // ...
});
```

## 🔗 Related Components

- **[MenuToolbarComponent](Components-Menu-Toolbar.md)** - Navigation link to this page
- **[DashboardComponent](Components-Dashboard.md)** - Redirect destination after creation

## 📚 Dependencies

### External
- `@mui/material` - TextField, Button, Box, Typography
- `react-router-dom` - useNavigate

### Internal
- `addQuestion` - Redux async thunk
- `addQuestionToUser` - Redux action
- `useAppDispatch`, `useAppSelector` - Redux hooks

## 📋 Validation Rules

| Field | Validation |
|-------|------------|
| Option One | Required, non-empty after trim |
| Option Two | Required, non-empty after trim |
| Author | Must be authenticated |

## ⚡ Best Practices

1. **Input Trimming** - Whitespace is trimmed before submission
2. **Optimistic Navigation** - Only navigates after successful action
3. **Disabled States** - Clear feedback when form is invalid
4. **Controlled Inputs** - Form state managed in React
