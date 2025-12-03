import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionsState } from '../../state-tree/state-tree';

const initialState: QuestionsState = {};

export const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        receiveQuestions: (_, action: PayloadAction<QuestionsState>) => {
            return action.payload;
        },
    },
});

export const { receiveQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;