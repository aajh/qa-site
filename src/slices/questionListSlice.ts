import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from '../api/types';

export const fetchQuestionList = createAsyncThunk<
api.QuestionSummary[],
void,
{
    rejectValue: string
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
                return rejectWithValue(response.ok.toString());
            }
        } catch (e) {
            return rejectWithValue(e.toString());
        }
    }
);


interface QuestionListState {
    questionList: api.QuestionSummary[]
    loading: boolean
    error: string | null
}

const initialState: QuestionListState = {
    questionList: [],
    loading: true,
    error: null,
};

const questionList = createSlice({
    name: 'questionList',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchQuestionList.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchQuestionList.fulfilled, (state, { payload }) => {
            state.questionList = payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchQuestionList.rejected, (state, { payload }) => {
            state.questionList = [];
            state.loading = false;
            state.error = payload;
        });
    }
});

export default questionList.reducer;
