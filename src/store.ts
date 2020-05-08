import { Dispatch, AnyAction } from 'redux';
import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import rootReducer, { RootState } from './slices';

export default function createStore(preloadedState: RootState) {
    return configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware()] as const,
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState
    });
}

export type AppDispatch = Dispatch<AnyAction>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
