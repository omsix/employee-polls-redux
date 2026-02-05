# Data Models

This document describes the TypeScript interfaces used throughout the Employee Polls application.

## 📍 Location

`src/state-tree/model.ts`

---

## User Model

Represents a user in the system.

```typescript
interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: { [questionId: string]: "optionOne" | "optionTwo" };
  questions: string[];  // IDs of questions created by this user
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (username) |
| `name` | `string` | Display name |
| `avatarURL` | `string` | Path to avatar image |
| `answers` | `object` | Map of question IDs to user's vote |
| `questions` | `string[]` | Array of question IDs created by user |

### Example

```json
{
  "id": "omarcisse",
  "name": "Omar Cisse",
  "avatarURL": "/avatars/omarcisse.png",
  "answers": {
    "8xf0y6ziyjabvozdd253nd": "optionOne",
    "6ni6ok3ym7mf1p33lnez": "optionTwo"
  },
  "questions": ["8xf0y6ziyjabvozdd253nd", "am8ehyc8byjqgar0jgpub9"]
}
```

---

## Question Model

Represents a poll question with two options.

```typescript
interface Question {
  id: string;
  author: string;  // User ID who created the question
  timestamp: number;  // Unix timestamp in milliseconds
  optionOne: Option;
  optionTwo: Option;
}

interface Option {
  votes: string[];  // Array of user IDs who voted for this option
  text: string;     // The option text
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `author` | `string` | User ID of the creator |
| `timestamp` | `number` | Creation time (Unix ms) |
| `optionOne` | `Option` | First choice |
| `optionTwo` | `Option` | Second choice |

### Option Properties

| Property | Type | Description |
|----------|------|-------------|
| `votes` | `string[]` | User IDs who voted for this |
| `text` | `string` | Option description |

### Example

```json
{
  "id": "8xf0y6ziyjabvozdd253nd",
  "author": "sarahedo",
  "timestamp": 1467166872634,
  "optionOne": {
    "votes": ["sarahedo"],
    "text": "Build our new application with Javascript"
  },
  "optionTwo": {
    "votes": ["tylermcginnis"],
    "text": "Build our new application with Typescript"
  }
}
```

---

## Poll Model

A computed model that combines Question data with UI state and vote statistics.

```typescript
interface Poll {
  question: Question;
  expand: boolean;
  answered: boolean;
  selectedAnswer: "optionOne" | "optionTwo" | undefined;
  optionOne: PollOption;
  optionTwo: PollOption;
}

interface PollOption {
  voted: number;      // Number of votes
  percentage: string; // Vote percentage as string (e.g., "50%")
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `question` | `Question` | The underlying question |
| `expand` | `boolean` | UI state: card expanded? |
| `answered` | `boolean` | Has current user voted? |
| `selectedAnswer` | `string \| undefined` | User's vote if answered |
| `optionOne` | `PollOption` | First option with stats |
| `optionTwo` | `PollOption` | Second option with stats |

### Example

```json
{
  "question": { /* Question object */ },
  "expand": false,
  "answered": true,
  "selectedAnswer": "optionOne",
  "optionOne": {
    "voted": 2,
    "percentage": "50%"
  },
  "optionTwo": {
    "voted": 2,
    "percentage": "50%"
  }
}
```

---

## State Models

Located in `src/state-tree/state-tree.ts`

### AuthedUserState

```typescript
interface AuthedUserState {
  name: string | null;
  expiresAt: number | null;
  status: "idle" | "loading" | "failed";
}
```

### UsersState

```typescript
interface UsersState {
  entities: { [userId: string]: User };
  status: "idle" | "loading" | "failed";
}
```

### QuestionsState

```typescript
interface QuestionsState {
  entities: { [questionId: string]: Question };
  status: "idle" | "loading" | "failed";
}
```

### PollsState

```typescript
interface PollsState {
  entities: { [questionId: string]: Poll };
  status: "idle" | "loading" | "failed";
}
```

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                           User                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id: "omarcisse"                                          │   │
│  │ answers: { "q1": "optionOne", "q2": "optionTwo" }       │   │
│  │ questions: ["q1"]                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │                                    │
          │ creates                            │ votes on
          ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Question                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id: "q1"                                                 │   │
│  │ author: "omarcisse"                                      │   │
│  │ optionOne: { votes: ["omarcisse"], text: "..." }        │   │
│  │ optionTwo: { votes: ["sarahedo"], text: "..." }         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          │ computed from
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                           Poll                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ question: { /* Question object */ }                      │   │
│  │ answered: true                                           │   │
│  │ optionOne: { voted: 1, percentage: "50%" }              │   │
│  │ optionTwo: { voted: 1, percentage: "50%" }              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Type Guards

Useful type guards for runtime checking:

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "answers" in obj &&
    "questions" in obj
  );
}

function isQuestion(obj: unknown): obj is Question {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "author" in obj &&
    "optionOne" in obj &&
    "optionTwo" in obj
  );
}
```

---

## Normalization Pattern

The application uses a normalized state structure with entities stored by ID:

```typescript
// Instead of arrays:
const users = [user1, user2, user3];

// Use object lookup:
const users = {
  [user1.id]: user1,
  [user2.id]: user2,
  [user3.id]: user3,
};
```

### Benefits

1. **O(1) Lookup** - Direct access by ID
2. **Easy Updates** - Update single entity without array operations
3. **No Duplicates** - IDs are unique keys
4. **Referential Integrity** - Store IDs instead of nested objects
