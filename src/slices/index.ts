import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import questionListReducer from './questionListSlice';
import questionsReducer from './questionsSlice';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    questionList: questionListReducer,
    questions: questionsReducer
});

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export default createRootReducer;
