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
                return rejectWithValue(response.status.toString());
            }
        } catch (e) {
            return rejectWithValue(e.toString());
        }
    }
);

export const postQuestion = createAsyncThunk<
api.Question,
{
    title: string,
    author: string,
    body: string
},
{
    dispatch: AppDispatch,
    rejectValue: string
}
>(
    'question/postNew',
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
    rejectValue: string
}
>(
    'question/postAnswer',
    async ({ answer, questionId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answer)
            });

            if (response.ok) {
                const createdAnswer: api.Answer = await response.json();
                return { answer: createdAnswer, questionId };
            } else {
                return rejectWithValue(response.status.toString());
            }
        } catch (e) {
            return rejectWithValue(e.toString());
        }
    }
);


interface QuestionState {
    question: api.Question | null
    loading: boolean
    loadingError: string | null

    questionWasPosted: boolean
    postingQuestion: boolean
    postingQuestionError: string | null

    postingAnswer: boolean
    postingAnswerError: string | null
}

const questionInitialState: QuestionState = {
    question: null,
    loading: true,
    loadingError: null,
    questionWasPosted: false,
    postingQuestion: false,
    postingQuestionError: null,
    postingAnswer: false,
    postingAnswerError: null
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
            state.postingQuestion = true;
            state.postingQuestionError = null;
        });
        builder.addCase(postQuestion.fulfilled, (state, { payload }) => {
            state.question = payload;
            state.loading = false;
            state.loadingError = null;
            state.questionWasPosted = true;
            state.postingQuestion = false;
            state.postingQuestionError = null;
        });
        builder.addCase(postQuestion.rejected, (state, { payload }) => {
            state.postingQuestion = false;
            state.postingQuestionError = payload;
        });

        builder.addCase(postAnswer.pending, state => {
            state.postingAnswer = true;
            state.postingAnswerError = null;
        });
        builder.addCase(postAnswer.fulfilled, (state, { payload }) => {
            if (state.question?.id === payload.questionId) {
                state.question.answers.push(payload.answer);
            }
            state.postingAnswer = false;
            state.postingAnswerError = null;
        });
        builder.addCase(postAnswer.rejected, (state, { payload }) => {
            state.postingAnswer = false;
            state.postingAnswerError = payload;
        });
    }
});

export const {
    showQuestion,
    leavingQuestion
} = question.actions;

export default question.reducer;
