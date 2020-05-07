import { Dispatch, AnyAction } from 'redux';
import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';

import createRootReducer, { RootState } from './slices';

const isServer = !(
    typeof window !== 'undefined'
    && window.document
    && window.document.createElement
);

export default function createStoreAndHistory(preloadedState: RootState, url: string = '/') {
    const history = isServer
        ? createMemoryHistory({
            initialEntries: [url]
        })
        : createBrowserHistory();

    const store = configureStore({
        reducer: createRootReducer(history),
        middleware: [...getDefaultMiddleware(), routerMiddleware(history)] as const,
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState
    });

    return {
        store,
        history
    };
}

export type AppDispatch = Dispatch<AnyAction>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
