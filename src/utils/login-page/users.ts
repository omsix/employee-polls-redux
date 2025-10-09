import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>; // questionId -> selectedOption
  questions: string[]; // array of question IDs created by the user
}

export interface UsersState {
  [userId: string]: User;
}

const initialState: UsersState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    receiveUsers: (_, action: PayloadAction<UsersState>) => {
      return action.payload;
    },
    addAnswerToUser: (
      state,
      action: PayloadAction<{ authedUser: string; qid: string; answer: string }>
    ) => {
      const { authedUser, qid, answer } = action.payload;
      if (state[authedUser]) {
        state[authedUser].answers[qid] = answer;
      }
    },
    addQuestionToUser: (
      state,
      action: PayloadAction<{ author: string; qid: string }>
    ) => {
      const { author, qid } = action.payload;
      if (state[author]) {
        state[author].questions.push(qid);
      }
    },
  },
});

export const { receiveUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;
export default usersSlice.reducer;
