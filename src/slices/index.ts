import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import userReducer from './userSlice';
import questionListReducer from './questionListSlice';
import questionsReducer from './questionSlice';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    user: userReducer,
    questionList: questionListReducer,
    question: questionsReducer
});

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export default createRootReducer;
