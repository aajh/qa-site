import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import createRootReducer, { RootState } from './slices';

export const history = createBrowserHistory();

// eslint-disable-next-line no-underscore-dangle
const preloadedState = (window as any).__PRELOADED_STATE__;

const store = configureStore({
    reducer: createRootReducer(history),
    middleware: [...getDefaultMiddleware(), routerMiddleware(history)] as const,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
