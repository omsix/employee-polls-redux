# Redux State Management

This document explains how Redux is used to manage application state in the Employee Polls project.

## 🏪 Store Configuration

The Redux store is configured in `src/app/store.ts` using Redux Toolkit.

### Store Setup

```typescript
// src/app/store.ts
import { combineSlices, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineSlices({
  [pollsApi.reducerPath]: pollsApi.reducer,
  authedUser: authedUserReducer,
  users: usersReducer,
  questions: questionsReducer,
  remainingSessionTime: remainingSessionTimeReducer,
});

// Listener middleware for cache invalidation
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setAuthedUser.fulfilled,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(pollsApi.util.invalidateTags(['Polls']));
  },
});

listenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(pollsApi.util.invalidateTags(['Polls']));
  },
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(pollsApi.middleware)
      .prepend(listenerMiddleware.middleware)
      .concat(loggerMiddleware),
});
```

### Key Features

| Feature | Implementation |
|---------|----------------|
| **State Persistence** | Redux Persist stores `authedUser` in localStorage |
| **Type Safety** | Full TypeScript support with `RootState` and `AppDispatch` |
| **Middleware** | RTK Query + Custom Logger + Persistence handlers |
| **Dev Tools** | Redux DevTools integration (automatic in dev mode) |

---

## 📊 State Tree Structure

```
RootState
├── authedUser           # Current logged-in user
│   ├── name: string | null
│   ├── expiresAt: number | null
│   └── status: "idle" | "loading" | "failed"
│
├── remainingSessionTime # Session countdown timer
│   └── seconds: number | null
│
├── users                # All users in the system
│   ├── entities: { [userId]: User }
│   └── status: "idle" | "loading" | "failed"
│
├── questions            # All poll questions
│   ├── entities: { [questionId]: Question }
│   └── status: "idle" | "loading" | "failed"
│
└── pollsApi             # RTK Query cache (computed polls)
    └── queries
        └── buildPolls
            └── { entities: { [questionId]: Poll }, status }
```

---

## 🧩 Redux Slices

### 1. AuthedUser Slice

**File:** `src/utils/login/authedUser.ts`

**Purpose:** Manages the currently authenticated user session.

```typescript
interface AuthedUserState {
  name: string | null;
  expiresAt: number | null;
  status: "idle" | "loading" | "failed";
}
```

**Actions:**

| Action | Type | Description |
|--------|------|-------------|
| `setAuthedUser` | Async Thunk | Authenticates user, sets 60-min session |
| `logout` | Reducer | Clears auth state and localStorage |

**Usage:**
```typescript
// Login
dispatch(setAuthedUser("omarcisse"));

// Logout
dispatch(logout());

// Select current user
const { name, expiresAt } = useAppSelector(state => state.authedUser);
```

---

### 2. RemainingSessionTime Slice

**File:** `src/utils/login/remainingSessionTime.ts`

**Purpose:** Manages the session countdown timer displayed in the menu toolbar.

```typescript
interface RemainingSessionTimeState {
  seconds: number | null;
}
```

**Actions:**

| Action | Type | Description |
|--------|------|-------------|
| `updateRemainingTime` | Reducer | Updates remaining seconds |
| `resetRemainingTime` | Reducer | Clears remaining time (on logout) |

**Usage:**
```typescript
// Update countdown
dispatch(updateRemainingTime(59));

// Reset on logout
dispatch(resetRemainingTime());

// Select remaining time
const remainingSeconds = useAppSelector(state => state.remainingSessionTime.seconds);
```

**Integration:**
The Menu Toolbar component uses a `useEffect` hook to:
- Calculate remaining time every second
- Update Redux state via `updateRemainingTime`
- Automatically logout user when time reaches 0

---

### 3. Users Slice

**File:** `src/utils/login/users.ts`

**Purpose:** Stores all user entities and manages user data updates.

```typescript
interface UsersState {
  entities: { [userId: string]: User };
  status: "idle" | "loading" | "failed";
}
```

**Actions:**

| Action | Type | Description |
|--------|------|-------------|
| `receiveUsers` | Reducer | Loads all users into state |
| `addAnswerToUser` | Async Thunk | Records user's vote on a question |
| `addQuestionToUser` | Reducer | Adds created question to user's list |

**Usage:**
```typescript
// Load users
dispatch(receiveUsers(usersData));

// Record a vote
dispatch(addAnswerToUser({
  authedUser: "omarcisse",
  qid: "question123",
  answer: "optionOne"
}));

// Select all users
const users = useAppSelector(state => state.users.entities);
```

---

### 4. Questions Slice

**File:** `src/utils/questions/questions.ts`

**Purpose:** Manages poll questions and voting data.

```typescript
interface QuestionsState {
  entities: { [questionId: string]: Question };
  status: "idle" | "loading" | "failed";
}
```

**Actions:**

| Action | Type | Description |
|--------|------|-------------|
| `receiveQuestions` | Reducer | Loads all questions into state |
| `addQuestion` | Async Thunk | Creates a new poll question |
| `addAnswerToQuestion` | Async Thunk | Records a vote on a question |

**Selectors:**
- `selectQuestions` - All questions
- `selectQuestionById` - Single question by ID
- `selectQuestionsStatus` - Loading status

**Usage:**
```typescript
// Create a new poll
dispatch(addQuestion({
  optionOneText: "Learn React",
  optionTwoText: "Learn Vue",
  author: "omarcisse"
}));

// Record a vote
dispatch(addAnswerToQuestion({
  authedUser: "omarcisse",
  qid: "question123",
  answer: "optionOne"
}));
```

---

## 🔄 RTK Query API

**File:** `src/utils/polls/pollsAPI.ts`

RTK Query is used to compute derived poll state from questions and users.

### Endpoints

#### `buildPolls` (Query)
Computes poll data including vote percentages and answered status.

```typescript
const { data: polls, isLoading } = useBuildPollsQuery({
  questions,
  users
});
```

**Returns:**
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

#### `setExpanded` (Mutation)
Toggles poll card expansion state (persisted to localStorage).

```typescript
const [triggerSetExpanded] = useSetExpandedMutation();

triggerSetExpanded({
  pollId: "question123",
  expanded: true
});
```

### Cache Invalidation

```typescript
tagTypes: ["Polls"]

// Query provides tag
providesTags: ["Polls"]

// Mutation invalidates tag
invalidatesTags: ["Polls"]
```

**Automatic Invalidation:**
The listener middleware automatically invalidates the Polls cache on user switch:
- When a user logs in (`setAuthedUser.fulfilled`)
- When a user logs out (`logout`)

This ensures each user sees their own poll data without stale cache from previous users.

**User-Specific Storage:**
Poll UI state (expand/collapse preferences) is stored in localStorage with user-specific keys:
```typescript
// Storage key format: pollsUiState_{userId}
// Example: pollsUiState_omarcisse
```

---

## 🎣 Custom Hooks

**File:** `src/app/hooks.ts`

Type-safe hooks for Redux operations:

```typescript
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Typed dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector hook
export const useAppSelector = useSelector.withTypes<RootState>();
```

**Usage:**
```typescript
// In components
const dispatch = useAppDispatch();
const users = useAppSelector(state => state.users.entities);
```

---

## 🔧 Middleware

### Listener Middleware (Cache Invalidation)

**Purpose:** Automatically invalidates the Polls cache when users switch (login/logout).

**Implementation:**
```typescript
const listenerMiddleware = createListenerMiddleware();

// Invalidate polls cache when user logs in
listenerMiddleware.startListening({
  actionCreator: setAuthedUser.fulfilled,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(pollsApi.util.invalidateTags(['Polls']));
  },
});

// Invalidate polls cache when user logs out
listenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(pollsApi.util.invalidateTags(['Polls']));
  },
});
```

**Why It's Needed:**
- Each user has their own answered/unanswered poll states
- Poll UI state (expand/collapse) is stored per user in localStorage
- Cache invalidation ensures fresh data is fetched for the new user
- Prevents stale data from previous user sessions

**Triggered On:**
- `setAuthedUser.fulfilled` - User logs in
- `logout` - User logs out

---

### Logger Middleware

**File:** `src/app/loggerMiddleware.ts`

Custom middleware that logs actions and state changes (disabled in test environment).

```typescript
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log("Dispatching:", action);
  const result = next(action);
  console.log("Next State:", store.getState());
  console.groupEnd();
  return result;
};
```

### Redux Persist Middleware

Handles persistence actions without serialization warnings:

```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  })
```

---

## 💾 State Persistence

Only the `authedUser` slice is persisted to localStorage:

```typescript
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authedUser"], // Only persist auth state
};
```

**Persisted Data:**
- User name
- Session expiry timestamp
- Auth status

**Not Persisted:**
- Users list (reloaded on app start)
- Questions (reloaded on login)
- Polls cache (recomputed)

---

## 📈 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Component                                │
│                                                                  │
│   useAppSelector(state => state.users)                          │
│   useAppDispatch() ──▶ dispatch(addQuestion(...))               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Redux Store                                 │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │  authedUser  │    users     │  questions   │   pollsApi   │ │
│  │    Slice     │    Slice     │    Slice     │  RTK Query   │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    ▼                   ▼                        │
│              ┌──────────┐       ┌──────────────┐               │
│              │ Persist  │       │   Logger     │               │
│              │Middleware│       │  Middleware  │               │
│              └──────────┘       └──────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│                                                                  │
│   _getUsers()  _getQuestions()  _saveQuestion()                 │
│   _saveQuestionAnswer()                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Redux

### Testing Components with Redux

Use `renderWithProviders` utility for components that need Redux:

```typescript
import { renderWithProviders } from "../../utils/test-utils";

it("renders with preloaded state", () => {
  renderWithProviders(<MyComponent />, {
    preloadedState: {
      authedUser: { name: "testuser", expiresAt: Date.now() + 60000, status: "idle" },
      users: { entities: mockUsers, status: "idle" },
    },
  });
});
```

### Testing Slices

```typescript
import { authedUserSlice, logout } from "./authedUser";

it("handles logout", () => {
  const initialState = { name: "user", expiresAt: 123, status: "idle" };
  const result = authedUserSlice.reducer(initialState, logout());
  expect(result.name).toBeNull();
});
```
