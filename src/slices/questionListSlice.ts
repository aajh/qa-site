import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from '../api/types';

export const fetchQuestionList = createAsyncThunk<
api.QuestionSummary[],
void,
{
    rejectValue: void
}
>(
    'questionList/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/questions');
            if (response.ok) {
                const newQuestionList: api.QuestionSummary[] = await response.json();
                return newQuestionList;
            } else {
                return rejectWithValue();
            }
        } catch (e) {
            return rejectWithValue();
        }
    }
);


interface QuestionListState {
    questionList: api.QuestionSummary[]
    loading: boolean
    error: boolean
}

export const questionListInitialState: QuestionListState = {
    questionList: [],
    loading: true,
    error: false,
};

const questionList = createSlice({
    name: 'questionList',
    initialState: questionListInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchQuestionList.pending, state => {
            state.loading = true;
            state.error = false;
        });
        builder.addCase(fetchQuestionList.fulfilled, (state, { payload }) => {
            state.questionList = payload;
            state.loading = false;
            state.error = false;
        });
        builder.addCase(fetchQuestionList.rejected, state => {
            state.questionList = [];
            state.loading = false;
            state.error = true;
        });
    }
});

export default questionList.reducer;
