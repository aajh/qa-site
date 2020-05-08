import { combineReducers } from '@reduxjs/toolkit';

import userReducer, { userInitialState } from './userSlice';
import questionListReducer, { questionListInitialState } from './questionListSlice';
import questionsReducer, { questionInitialState } from './questionSlice';

const rootReducer = combineReducers({
    user: userReducer,
    questionList: questionListReducer,
    question: questionsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export const initialState: RootState = {
    user: userInitialState,
    questionList: questionListInitialState,
    question: questionInitialState,
};

export default rootReducer;
