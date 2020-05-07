import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import userReducer, { userInitialState } from './userSlice';
import questionListReducer, { questionListInitialState } from './questionListSlice';
import questionsReducer, { questionInitialState } from './questionSlice';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    user: userReducer,
    questionList: questionListReducer,
    question: questionsReducer
});

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export const initialState: RootState = {
    router: undefined,
    user: userInitialState,
    questionList: questionListInitialState,
    question: questionInitialState,
} as any;

export default createRootReducer;
