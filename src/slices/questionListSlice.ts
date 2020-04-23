import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from '../store';
import * as api from '../api-types';

interface QuestionListState {
    questionList: api.QuestionSummary[]
    error: string | null
}

const initialState: QuestionListState = {
    questionList: [],
    error: null
};

const questionList = createSlice({
    name: 'questionList',
    initialState,
    reducers: {
        getQuestionListSuccess(state, { payload }: PayloadAction<api.QuestionSummary[]>) {
            state.questionList = payload;
            state.error = null;
        },
        getQuestionListFailed(state, { payload }: PayloadAction<string>) {
            state.questionList = [];
            state.error = payload;
        }
    }
});

export const {
    getQuestionListSuccess,
    getQuestionListFailed
} = questionList.actions;

export default questionList.reducer;

export function fetchQuestionList(): AppThunk {
    return async dispatch => {
        try {
            const response = await fetch('/api/questions');
            if (response.ok) {
                const newQuestionList: api.QuestionSummary[] = await response.json();
                dispatch(getQuestionListSuccess(newQuestionList));
            } else {
                dispatch(getQuestionListFailed(response.ok.toString()));
            }
        } catch (e) {
            dispatch(getQuestionListFailed(e.toString()));
        }
    };
}
