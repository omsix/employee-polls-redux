# API Functions

This document describes the mock API functions that simulate backend operations.

## 📍 Location

`src/data/data.ts`

---

## Overview

The application uses mock API functions that simulate asynchronous backend calls with artificial delays. This allows development without a real backend while maintaining realistic async behavior.

```typescript
// All functions return Promises with simulated delays
function _getUsers(): Promise<{ [userId: string]: User }>
function _getQuestions(): Promise<{ [questionId: string]: Question }>
function _saveQuestion(question: NewQuestion): Promise<Question>
function _saveQuestionAnswer(answer: AnswerPayload): Promise<boolean>
```

---

## _getUsers

Fetches all users from the mock database.

### Signature

```typescript
function _getUsers(): Promise<{ [userId: string]: User }>
```

### Returns

A Promise that resolves to an object containing all users, keyed by user ID.

### Security

Passwords are filtered out before returning to prevent client-side exposure.

### Example

```typescript
const users = await _getUsers();
// Returns:
// {
//   "omarcisse": { id: "omarcisse", name: "Omar Cisse", ... },
//   "sarahedo": { id: "sarahedo", name: "Sarah Edo", ... },
//   ...
// }
```

### Implementation

```typescript
export function _getUsers() {
  return new Promise((resolve) => {
    // Filter out passwords before returning
    const sanitizedUsers = Object.entries(users).reduce((acc, [key, user]) => {
      const { password, ...userWithoutPassword } = user;
      acc[key] = userWithoutPassword;
      return acc;
    }, {} as Record<string, any>);
    setTimeout(() => resolve(sanitizedUsers), 1000);
  });
}
```

### Delay

1000ms (1 second)

---

## _getQuestions

Fetches all questions from the mock database.

### Signature

```typescript
function _getQuestions(): Promise<{ [questionId: string]: Question }>
```

### Returns

A Promise that resolves to an object containing all questions, keyed by question ID.

### Example

```typescript
const questions = await _getQuestions();
// Returns:
// {
//   "8xf0y6ziyjabvozdd253nd": { id: "...", author: "sarahedo", ... },
//   "6ni6ok3ym7mf1p33lnez": { id: "...", author: "omarcisse", ... },
//   ...
// }
```

### Implementation

```typescript
export function _getQuestions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...questions }), 1000);
  });
}
```

### Delay

1000ms (1 second)

---

## _saveQuestion

Creates a new question in the mock database.

### Signature

```typescript
function _saveQuestion(question: {
  optionOneText: string;
  optionTwoText: string;
  author: string;
}): Promise<Question>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `optionOneText` | `string` | Text for the first option |
| `optionTwoText` | `string` | Text for the second option |
| `author` | `string` | User ID of the question creator |

### Returns

A Promise that resolves to the newly created Question object with generated `id` and `timestamp`.

### Validation

- All three parameters are required
- Rejects with error message if any are missing
- Returns early after rejection (no double resolution)

### Example

```typescript
const newQuestion = await _saveQuestion({
  optionOneText: "Learn React",
  optionTwoText: "Learn Vue",
  author: "omarcisse"
});
// Returns:
// {
//   id: "abc123xyz...",
//   author: "omarcisse",
//   timestamp: 1707123456789,
//   optionOne: { votes: [], text: "Learn React" },
//   optionTwo: { votes: [], text: "Learn Vue" }
// }
```

### Implementation

```typescript
export function _saveQuestion(question) {
  return new Promise((resolve, reject) => {
    if (!question.optionOneText || !question.optionTwoText || !question.author) {
      reject("Please provide optionOneText, optionTwoText, and author");
      return;  // Important: prevent double resolution
    }

    const formattedQuestion = formatQuestion(question);
    setTimeout(() => {
      questions = {
        ...questions,
        [formattedQuestion.id]: formattedQuestion
      };
      resolve(formattedQuestion);
    }, 1000);
  });
}
```

### Delay

1000ms (1 second)

---

## _saveQuestionAnswer

Records a user's vote on a question.

### Signature

```typescript
function _saveQuestionAnswer(payload: {
  authedUser: string;
  qid: string;
  answer: "optionOne" | "optionTwo";
}): Promise<boolean>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `authedUser` | `string` | User ID of the voter |
| `qid` | `string` | Question ID being voted on |
| `answer` | `"optionOne" \| "optionTwo"` | Which option was selected |

### Returns

A Promise that resolves to `true` on success.

### Side Effects

Updates both:
1. **User's answers** - Adds question ID with selected option
2. **Question's votes** - Adds user ID to selected option's votes array

### Validation

- All three parameters are required
- Rejects with error message if any are missing
- Returns early after rejection

### Example

```typescript
await _saveQuestionAnswer({
  authedUser: "omarcisse",
  qid: "8xf0y6ziyjabvozdd253nd",
  answer: "optionOne"
});
// Returns: true

// Side effects:
// users["omarcisse"].answers["8xf0y6ziyjabvozdd253nd"] = "optionOne"
// questions["8xf0y6ziyjabvozdd253nd"].optionOne.votes.push("omarcisse")
```

### Implementation

```typescript
export function _saveQuestionAnswer({ authedUser, qid, answer }) {
  return new Promise((resolve, reject) => {
    if (!authedUser || !qid || !answer) {
      reject("Please provide authedUser, qid, and answer");
      return;  // Important: prevent double resolution
    }

    setTimeout(() => {
      // Update user's answers
      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          answers: {
            ...users[authedUser].answers,
            [qid]: answer
          }
        }
      };

      // Update question's votes
      questions = {
        ...questions,
        [qid]: {
          ...questions[qid],
          [answer]: {
            ...questions[qid][answer],
            votes: questions[qid][answer].votes.concat([authedUser])
          }
        }
      };

      resolve(true);
    }, 500);
  });
}
```

### Delay

500ms (0.5 seconds)

---

## Helper Functions

### generateUID

Generates a unique identifier for new questions.

```typescript
function generateUID(): string {
  return Math.random().toString(36).substring(2, 15) 
       + Math.random().toString(36).substring(2, 15);
}
```

### formatQuestion

Formats input data into a proper Question object.

```typescript
function formatQuestion({ optionOneText, optionTwoText, author }) {
  return {
    id: generateUID(),
    timestamp: Date.now(),
    author,
    optionOne: {
      votes: [],
      text: optionOneText,
    },
    optionTwo: {
      votes: [],
      text: optionTwoText,
    }
  };
}
```

---

## Usage in Redux

These API functions are called from Redux async thunks:

```typescript
// In questions.ts slice
export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (payload) => {
    const question = await _saveQuestion(payload);
    return question;
  }
);

// In users.ts slice
export const addAnswerToUser = createAsyncThunk(
  "users/addAnswerToUser",
  async (payload) => {
    await _saveQuestionAnswer(payload);
    return payload;
  }
);
```

---

## Error Handling

All functions include validation that rejects with descriptive error messages:

```typescript
try {
  await _saveQuestion({ optionOneText: "", optionTwoText: "test", author: "user" });
} catch (error) {
  console.error(error); // "Please provide optionOneText, optionTwoText, and author"
}
```

---

## Mock Data

The initial mock data includes:

### Users
- `omarcisse` - Omar Cisse
- `sarahedo` - Sarah Edo
- `tylermcginnis` - Tyler McGinnis
- `zoshikanlu` - Zenobia Oshikanlu

### Questions
- 6 pre-existing questions with various votes

---

## Production Considerations

When moving to a real backend, replace these functions with actual API calls:

```typescript
// Instead of mock:
export function _getUsers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...users }), 1000);
  });
}

// Use real API:
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}
```
