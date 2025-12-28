import { PayloadAction } from '@reduxjs/toolkit';
import { UsersState } from '../../state-tree/state-tree';
import { createAppSlice } from '../../app/createAppSlice';
import { _saveQuestionAnswer } from '../../data/data';


const initialState: UsersState = { entities: {}, status: "idle" };

const usersSlice = createAppSlice({
  name: 'users',
  initialState,
  reducers: create => ({
    receiveUsers: create.reducer((state, action: PayloadAction<UsersState['entities']>) => {
      state.entities = action.payload;
      state.status = 'idle';
    }),
    addAnswerToUser: create.asyncThunk(async ({ authedUser, qid, answer}: { authedUser: string; qid: string; answer: string }) => {
      await _saveQuestionAnswer({ authedUser, qid, answer });
      return { authedUser, qid, answer };
    },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          const { authedUser, qid, answer } = action.payload;
          // Update state after successful vote
          state.entities[authedUser].answers[qid] = answer;
          return state;
        },
        rejected: state => {
          state.status = "failed"
        }
      }),
    addQuestionToUser: create.reducer((state,
      action: PayloadAction<{ author: string; qid: string }>
    ) => {
      const { author, qid } = action.payload;
      if (state.entities[author]) {
        state.entities[author].questions.push(qid);
      }
    })
  })
});

export const { receiveUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;
export default usersSlice.reducer;
