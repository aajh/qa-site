import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import jwt from 'jsonwebtoken';

import createRootReducer, { RootState } from './slices';
import { UserState, userInitialState } from './slices/userSlice';
import * as api from './api/types';

export const history = createBrowserHistory();

let loadedUserState: UserState | undefined;
try {
    const token = localStorage.getItem('token');
    if (token !== null) {
        const decodedToken = jwt.decode(token) as api.JWTPayload;
        if (api.checkTokenIsValid(decodedToken)) {
            loadedUserState = {
                ...userInitialState,
                token,
                user: decodedToken,
            };
        }
    }
} catch {
    // Ignore error
}

const store = configureStore({
    reducer: createRootReducer(history),
    middleware: [...getDefaultMiddleware(), routerMiddleware(history)] as const,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: {
        user: loadedUserState
    }
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
