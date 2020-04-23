import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import createRootReducer, { RootState } from './slices';

export const history = createBrowserHistory();

const store = configureStore({
    reducer: createRootReducer(history),
    middleware: [...getDefaultMiddleware(), routerMiddleware(history)]
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
