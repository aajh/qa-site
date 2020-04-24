import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { push, replace } from 'connected-react-router';

import { AppDispatch } from '../store';
import * as api from '../api-types';

export const fetchQuestion = createAsyncThunk<
api.Question,
{
    id: string,
    redirectOn404?: boolean
},
{
    dispatch: AppDispatch
    rejectValue: string
}
>(
    'questions/fetch',
    async ({ id, redirectOn404 = true }, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`/api/questions/${id}`);
            if (response.status === 404 && redirectOn404) {
                dispatch(replace('/404'));
            }
            if (response.ok) {
                const newQuestion: api.Question = await response.json();
                return newQuestion;
            } else {
                return rejectWithValue(response.status.toString());
            }
        } catch (e) {
            return rejectWithValue(e.toString());
        }
    }
);

export interface NewQuestion {
    title: string,
    author: string,
    body: string
}
export const postQuestion = createAsyncThunk<
api.Question,
NewQuestion,
{
    dispatch: AppDispatch,
    rejectValue: string
}
>(
    'questions/postNew',
    async (question, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(question)
            });

            if (response.ok) {
                const createdQuestion: api.Question = await response.json();

                // Give the reducer time to update
                setTimeout(() => dispatch(push(`/questions/${createdQuestion.id}`)), 0);

                return createdQuestion;
            } else {
                return rejectWithValue(response.status.toString());
            }
        } catch (e) {
            return rejectWithValue(e.toString());
        }
    }
);


interface QuestionsState {
    question: api.Question | null
    loading: boolean
    loadingError: string | null
    questionWasPosted: boolean
    posting: boolean
    postingError: string | null
}

const questionsInitialState: QuestionsState = {
    question: null,
    loading: true,
    loadingError: null,
    questionWasPosted: false,
    posting: false,
    postingError: null,
};

const questions = createSlice({
    name: 'questions',
    initialState: questionsInitialState,
    reducers: {
        showQuestion(state, { payload }: PayloadAction<string>) {
            if (state.question?.id === payload) {
                state.questionWasPosted = false;
            }
        },
        leavingQuestion(state) {
            state.question = null;
            state.loading = true;
            state.loadingError = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchQuestion.pending, state => {
            state.question = null;
            state.loading = true;
            state.loadingError = null;
        });
        builder.addCase(fetchQuestion.fulfilled, (state, { payload }) => {
            state.question = payload;
            state.loading = false;
            state.questionWasPosted = false;
            state.loadingError = null;
        });
        builder.addCase(fetchQuestion.rejected, (state, { payload }) => {
            state.question = null;
            state.loading = false;
            state.questionWasPosted = false;
            state.loadingError = payload;
        });

        builder.addCase(postQuestion.pending, state => {
            state.posting = true;
            state.postingError = null;
        });
        builder.addCase(postQuestion.fulfilled, (state, { payload }) => {
            state.question = payload;
            state.loading = false;
            state.loadingError = null;
            state.questionWasPosted = true;
            state.posting = false;
            state.postingError = null;
        });
        builder.addCase(postQuestion.rejected, (state, { payload }) => {
            state.posting = false;
            state.postingError = payload;
        });
    }
});

export const {
    showQuestion,
    leavingQuestion
} = questions.actions;

export default questions.reducer;
