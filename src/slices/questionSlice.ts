import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { History } from 'history';

import { RootState } from './index';
import * as api from '../api/types';

export const fetchQuestion = createAsyncThunk<
api.Question,
{
    id: string
    history: History
    redirectOn404?: boolean
},
{
    rejectValue: void
}
>(
    'question/fetch',
    async ({ id, history, redirectOn404 = true }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/questions/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 404 && redirectOn404) {
                history.replace('/404');
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
    question: {
        title: string,
        body: string
    }
    history: History
},
{
    state: RootState,
    rejectValue: void
}
>(
    'question/postQuestion',
    async ({ question, history }, { getState, rejectWithValue }) => {
        try {
            const { user: { user } } = getState();

            if (user === null) {
                return rejectWithValue();
            }

            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(question)
            });

            if (response.ok) {
                const createdQuestion: api.Question = await response.json();

                // Give the reducer time to update
                setTimeout(() => history.push(`/questions/${createdQuestion.id}`), 0);

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
            const { user: { user } } = getState();

            if (user === null) {
                return rejectWithValue();
            }

            const response = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

export const voteAnswer = createAsyncThunk<
{
    questionId: string
    answerId: string
    direction: 1 | -1 | null
},
{
    questionId: string
    answerId: string
    direction: 1 | -1 | null
},
{
    state: RootState
    rejectValue: void
}
>(
    'question/voteAnswer',
    async ({ questionId, answerId, direction }, { getState, rejectWithValue }) => {
        try {
            const { user: { user } } = getState();

            if (user === null) {
                return rejectWithValue();
            }

            const response = await fetch(`/api/questions/${questionId}/answers/${answerId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ direction })
            });

            if (response.ok) {
                return { questionId, answerId, direction };
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
    showExistingQuestion: boolean

    postingQuestion: boolean
    postingQuestionError: boolean

    postingAnswer: boolean
    postingAnswerError: boolean
}

export const questionInitialState: QuestionState = {
    question: null,
    loading: true,
    loadingError: false,
    showExistingQuestion: false,
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
                state.showExistingQuestion = false;
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
            state.showExistingQuestion = false;
            state.loadingError = false;
        });
        builder.addCase(fetchQuestion.rejected, state => {
            state.question = null;
            state.loading = false;
            state.showExistingQuestion = false;
            state.loadingError = true;
        });

        builder.addCase(postQuestion.pending, state => {
            state.postingQuestion = true;
            state.postingQuestionError = false;
        });
        builder.addCase(postQuestion.fulfilled, (state, { payload }) => {
            state.question = payload;
            state.loading = false;
            state.loadingError = false;
            state.showExistingQuestion = true;
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

        builder.addCase(voteAnswer.fulfilled,
            (state, { payload: { questionId, answerId, direction } }) => {
                if (state.question?.id === questionId) {
                    const answer = state.question.answers.find(a => a.id === answerId);
                    if (answer !== undefined) {
                        answer.votes += (direction ?? 0) - (answer.voteDirection ?? 0);
                        answer.voteDirection = direction;
                    }
                }
            });
    }
});

export const {
    showQuestion,
    leavingQuestion
} = question.actions;

export default question.reducer;
