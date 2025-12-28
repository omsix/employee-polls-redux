
import { PayloadAction } from '@reduxjs/toolkit';
import { QuestionsState } from '../../state-tree/state-tree';
import { _saveQuestionAnswer } from '../../data/data';
import { createAppSlice } from '../../app/createAppSlice';

const initialState: QuestionsState = {
    entities: {},
    status: "idle"
};
/**
 * Redux slice managing the questions state with async answer handling.
Created via createAppSlice with name 'questions'.
Provides receiveQuestions reducer and addAnswerToQuestion async thunk.
Exposes selectors: selectQuestions, selectQuestionById, selectQuestionsStatus.
 */
export const questionsSlice = createAppSlice({
    name: 'questions',
    initialState,
    reducers: create => ({
        receiveQuestions: create.reducer((_, action: PayloadAction<QuestionsState>) => {
            return action.payload;
        }),
        addAnswerToQuestion: create.asyncThunk(
            async ({ authedUser, qid, answer }: { authedUser: string; qid: string; answer: string }) => {
                await _saveQuestionAnswer({
                    authedUser,
                    qid: qid,
                    answer: answer
                });
                return { authedUser, qid, answer };
            },
            {
                fulfilled: (state, action) => {
                    console.group("fulfilled addAnswerToQuestion");
                    console.log("action", action);
                    console.log("state", state);
                    const { authedUser, qid, answer } = action.payload;
                    state.entities[qid][answer as "optionOne" | "optionTwo"].votes.push(authedUser);
                    state.status = "idle";
                    console.log("mutated state", state);
                    console.groupEnd();
                    return state;
                }
            }
        )
    }),
    selectors: {
        selectQuestions: (state: QuestionsState) => state.entities,
        selectQuestionById: (state: QuestionsState, questionId: string) => state.entities[questionId],
        selectQuestionsStatus: (state: QuestionsState) => state.status,
    }
});

export const { receiveQuestions, addAnswerToQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;
