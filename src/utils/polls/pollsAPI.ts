import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { _getQuestions, _getUsers } from "../../data/data";
import { Poll, Question, User } from "../../state-tree/model";
import { PollsState } from "../../state-tree/state-tree";

type PollsUiState = Record<string, { expand: boolean }>;
const POLLS_UI_STATE_STORAGE_KEY_PREFIX = "pollsUiState";

/**
 * Retrieves the persisted UI state for polls from localStorage.
 * Returns the expand/collapse state for each poll, indexed by poll ID.
 * Returns an empty object if no data exists or if parsing fails.
 * Uses a user-specific key to maintain separate UI state per user.
 * 
 * @param authedUser - The authenticated user ID to retrieve state for
 * @returns PollsUiState object mapping poll IDs to their UI state
 */
function readPollsUiState(authedUser: string | null): PollsUiState {
  if (!authedUser) return {};
  try {
    const storageKey = `${POLLS_UI_STATE_STORAGE_KEY_PREFIX}_${authedUser}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as PollsUiState;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Persists the UI state for polls to localStorage.
 * Uses a user-specific key to maintain separate UI state per user.
 * 
 * @param authedUser - The authenticated user ID to save state for
 * @param state - The PollsUiState to persist
 */
function writePollsUiState(authedUser: string | null, state: PollsUiState) {
  if (!authedUser) return;
  try {
    const storageKey = `${POLLS_UI_STATE_STORAGE_KEY_PREFIX}_${authedUser}`;
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// The questions
export const fetchQuestions: () => Promise<{ [key: string]: Question }> = () =>
  _getQuestions() as Promise<{ [key: string]: Question }>;

// The users
export const fetchUsers: () => Promise<{ [key: string]: User }> = () =>
  _getUsers() as Promise<{ [key: string]: User }>;

/**
 * Builds a PollsState from questions and users,
 * filtering according to a predicate (answered or not).
 */
function calculatePercentage(votes: number, total: number): string {
  return total > 0 ? `${Math.round((votes / total) * 100)}%` : '0%';
}

/**
 * Transforms raw questions and users data into a PollsState with enriched poll information.
 * For each question, determines if the authenticated user has answered it, calculates vote
 * percentages based on total users, and restores UI state (expand/collapse) from localStorage.
 * Polls are sorted by timestamp in descending order (newest first).
 * 
 * @param questions - Dictionary of questions indexed by question ID
 * @param users - Dictionary of users indexed by user ID
 * @param initialState - Optional existing poll state to merge with new data
 * @returns Promise resolving to PollsState with entities and status
 */
async function loadPolls(questions: { [key: string]: Question }, users: { [key: string]: User },
  initialState?: { [key: string]: Poll }
): Promise<PollsState> {
  const authedUser: string | null = localStorage.getItem('authedUser');
  const totalUsers = Object.values(users).length;
  const pollsUiState = readPollsUiState(authedUser);

  const polls: Poll[] = Object.values(questions)
    .map((question) => {
      const optionOneVotes = question.optionOne.votes.length;
      const optionTwoVotes = question.optionTwo.votes.length;
      const poll = initialState?.[question.id];
      const persistedExpand = pollsUiState?.[question.id]?.expand;
      const isAnswered = authedUser ? (question.optionOne.votes.includes(authedUser) || question.optionTwo.votes.includes(authedUser)) : false;
      const selectedAnswer = authedUser ? (question.optionOne.votes.includes(authedUser) ? 'optionOne' : (question.optionTwo.votes.includes(authedUser) ? 'optionTwo' : undefined)) as 'optionOne' | 'optionTwo' | undefined : undefined;
      
      if (poll) {
        return Object.assign(poll, {
          question,
          expand: persistedExpand ?? poll.expand,
          answered: isAnswered,
          selectedAnswer,
          optionOne: {
            voted: optionOneVotes,
            percentage: calculatePercentage(optionOneVotes, totalUsers),
          },
          optionTwo: {
            voted: optionTwoVotes,
            percentage: calculatePercentage(optionTwoVotes, totalUsers),
          },
        });
      }
      return {
        question,
        expand: persistedExpand ?? false,
        answered: isAnswered,
        selectedAnswer,
        optionOne: {
          voted: optionOneVotes,
          percentage: calculatePercentage(optionOneVotes, totalUsers),
        },
        optionTwo: {
          voted: optionTwoVotes,
          percentage: calculatePercentage(optionTwoVotes, totalUsers),
        },
      };
    })
    .sort((a, b) => b.question.timestamp - a.question.timestamp);

  const pollsEntities = polls.reduce((acc, poll) => {
    acc[poll.question.id] = poll;
    return acc;
  }, {} as PollsState["entities"]);

  return {
    entities: pollsEntities,
    status: "idle",
  };
}

/**
 * RTK Query slice that builds poll state from questions and users.
 * Defined with createApi, reducerPath: "pollsApi".
 * Provides buildPolls query invoking loadPolls to compute PollsState.
 * Exported hook useBuildPollsQuery, endpoint buildPolls, and middleware for store integration.
 */
const pollsApi = createApi({
  reducerPath: "pollsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // not needed here since we call local functions
  tagTypes: ["Polls"],
  endpoints: (builder) => ({
    buildPolls: builder.query<PollsState, { questions: { [key: string]: Question }, users: { [key: string]: User }, initialState?: { [key: string]: Poll } }>({
      async queryFn({ questions, users, initialState }) {
        try {
          return { data: await loadPolls(questions, users, initialState) };
        } catch (err: any) {
          return { error: err };
        }
      },
      providesTags: ["Polls"],
    }),
    setExpanded: builder.mutation<void, { pollId: string, expanded: boolean }>({
      queryFn({ pollId, expanded }: { pollId: string, expanded: boolean }) {
        const authedUser = localStorage.getItem('authedUser');
        const pollsUiState = readPollsUiState(authedUser);
        writePollsUiState(authedUser, {
          ...pollsUiState,
          [pollId]: {
            ...(pollsUiState[pollId] ?? { expand: false }),
            expand: expanded,
          },
        });
        return { data: undefined };
      },
      invalidatesTags: ["Polls"],
    }),
  }),

});

/**
 * Hook generated by RTK Query to fetch and build poll state.
 * Calls loadPolls with provided questions and users.
 * Returns { data: PollsState, isLoading } as seen in DashboardComponent.
 * Exported from src/utils/polls/pollsAPI.ts alongside buildPolls endpoint.
 */
export const { useBuildPollsQuery, useSetExpandedMutation } = pollsApi;
export const { buildPolls, setExpanded } = pollsApi.endpoints;
export default pollsApi;