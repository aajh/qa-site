import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { push, replace } from 'connected-react-router';

import { AppDispatch } from '../store';
import { RootState } from './index';
import * as api from '../api/types';

export const fetchQuestion = createAsyncThunk<
api.Question,
{
    id: string,
    redirectOn404?: boolean
},
{
    dispatch: AppDispatch
    rejectValue: void
}
>(
    'question/fetch',
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
                return rejectWithValue();
            }
        } catch (e) {
            return rejectWithValue();
        }
    }
);

export const postQuestion = createAsyncThunk<
api.Question,
{
    title: string,
    body: string
},
{
    dispatch: AppDispatch,
    state: RootState,
    rejectValue: void
}
>(
    'question/postQuestion',
    async (question, { dispatch, getState, rejectWithValue }) => {
        try {
            const { user: { token } } = getState();

            if (token === null) {
                return rejectWithValue();
            }

            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(question)
            });

            if (response.ok) {
                const createdQuestion: api.Question = await response.json();

                // Give the reducer time to update
                setTimeout(() => dispatch(push(`/questions/${createdQuestion.id}`)), 0);

                return createdQuestion;
            } else {
                return rejectWithValue();
            }
        } catch (e) {
            return rejectWithValue();
        }
    }
);

export const postAnswer = createAsyncThunk<
{
    answer: api.Answer
    questionId: string
},
{
    answer: {
        author: string
        body: string
    }
    questionId: string
},
{
    state: RootState
    rejectValue: void
}
>(
    'question/postAnswer',
    async ({ answer, questionId }, { getState, rejectWithValue }) => {
        try {
            const { user: { token } } = getState();

            if (token === null) {
                return rejectWithValue();
            }

            const response = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(answer)
            });

            if (response.ok) {
                const createdAnswer: api.Answer = await response.json();
                return { answer: createdAnswer, questionId };
            } else {
                return rejectWithValue();
            }
        } catch (e) {
            return rejectWithValue();
        }
    }
);


interface QuestionState {
    question: api.Question | null
    loading: boolean
    loadingError: boolean

    questionWasPosted: boolean
    postingQuestion: boolean
    postingQuestionError: boolean

    postingAnswer: boolean
    postingAnswerError: boolean
}

const questionInitialState: QuestionState = {
    question: null,
    loading: true,
    loadingError: false,
    questionWasPosted: false,
    postingQuestion: false,
    postingQuestionError: false,
    postingAnswer: false,
    postingAnswerError: false
};

const question = createSlice({
    name: 'question',
    initialState: questionInitialState,
    reducers: {
        showQuestion(state, { payload }: PayloadAction<string>) {
            if (state.question?.id === payload) {
                state.questionWasPosted = false;
            }
        },
        leavingQuestion(state) {
            state.question = null;
            state.loading = true;
            state.loadingError = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchQuestion.pending, state => {
            state.question = null;
            state.loading = true;
            state.loadingError = false;
        });
        builder.addCase(fetchQuestion.fulfilled, (state, { payload }) => {
            state.question = payload;
            state.loading = false;
            state.questionWasPosted = false;
            state.loadingError = false;
        });
        builder.addCase(fetchQuestion.rejected, state => {
            state.question = null;
            state.loading = false;
            state.questionWasPosted = false;
            state.loadingError = true;
        });

        builder.addCase(postQuestion.pending, state => {
            state.postingQuestion = true;
            state.postingQuestionError = false;
        });
        builder.addCase(postQuestion.fulfilled, (state, { payload }) => {
            state.question = payload;
            state.loading = false;
            state.loadingError = null;
            state.questionWasPosted = true;
            state.postingQuestion = false;
            state.postingQuestionError = false;
        });
        builder.addCase(postQuestion.rejected, state => {
            state.postingQuestion = false;
            state.postingQuestionError = true;
        });

        builder.addCase(postAnswer.pending, state => {
            state.postingAnswer = true;
            state.postingAnswerError = false;
        });
        builder.addCase(postAnswer.fulfilled, (state, { payload }) => {
            if (state.question?.id === payload.questionId) {
                state.question.answers.push(payload.answer);
            }
            state.postingAnswer = false;
            state.postingAnswerError = false;
        });
        builder.addCase(postAnswer.rejected, state => {
            state.postingAnswer = false;
            state.postingAnswerError = true;
        });
    }
});

export const {
    showQuestion,
    leavingQuestion
} = question.actions;

export default question.reducer;
