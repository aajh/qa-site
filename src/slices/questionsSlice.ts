import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';

import { AppThunk } from '../store';
import * as api from '../api-types';

interface QuestionsState {
    questionsById: Record<string, api.Question>
    error: string | null
}

const questionsInitialState: QuestionsState = {
    questionsById: {},
    error: null
};

const questions = createSlice({
    name: 'questions',
    initialState: questionsInitialState,
    reducers: {
        getQuestionSuccess(state, { payload }: PayloadAction<api.Question>) {
            state.questionsById[payload.id] = payload;
            state.error = null;
        },
        getQuestionFailure(state, { payload }: PayloadAction<string>) {
            state.error = payload;
        }
    }
});

export const {
    getQuestionSuccess,
    getQuestionFailure
} = questions.actions;

export default questions.reducer;

export function fetchQuestion(id: string, redirectOn404 = true): AppThunk {
    return async dispatch => {
        try {
            const response = await fetch(`/api/questions/${id}`);
            if (response.status === 404) {
                if (redirectOn404) {
                    dispatch(push('/404'));
                }
            }
            if (response.ok) {
                const newQuestion: api.Question = await response.json();
                dispatch(getQuestionSuccess(newQuestion));
            } else {
                dispatch(getQuestionFailure(response.status.toString()));
            }
        } catch (e) {
            dispatch(getQuestionFailure(e.toString()));
        }
    };
}

export interface NewQuestion {
    title: string,
    author: string,
    body: string
}
export function postNewQuestion(question: NewQuestion, redirect = true): AppThunk {
    return async dispatch => {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(question)
        });

        if (response.ok) {
            const createdQuestion: api.Question = await response.json();
            dispatch(getQuestionSuccess(createdQuestion));

            if (redirect) {
                dispatch(push(`/questions/${createdQuestion.id}`));
            }
        }
    };
}
