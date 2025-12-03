import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState } from '../../state-tree/state-tree';


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
