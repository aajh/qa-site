import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';

import * as api from '../api/types';

export const login = createAsyncThunk<
string,
{
    username: string
    password: string
},
{
    rejectValue: boolean
}
>(
    'user/login',
    async (loginInformation, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInformation),
            });
            if (response.ok) {
                const { token }: api.Login = await response.json();
                return token;
            } else {
                return rejectWithValue(response.status === 401);
            }
        } catch (error) {
            return rejectWithValue(false);
        }
    }
);


export interface UserState {
    token: string | null
    user: api.JWTPayload | null

    showLoginModal: boolean
    loggingIn: boolean
    loginError: boolean
    wrongPasswordOrUsername: boolean
}

export const userInitialState: UserState = {
    token: null,
    user: null,
    showLoginModal: false,
    loggingIn: false,
    loginError: false,
    wrongPasswordOrUsername: false,
};

const user = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
        logout() {
            return userInitialState;
        },
        showLoginModal(state) {
            return {
                ...state,
                showLoginModal: true,
                loginError: false,
                wrongPasswordOrUsername: false,
            };
        },
        closeLoginModal(state) {
            state.showLoginModal = false;
        },
    },
    extraReducers: builder => {
        builder.addCase(login.pending, state => {
            state.loggingIn = true;
            state.loginError = false;
            state.wrongPasswordOrUsername = false;
        });
        builder.addCase(login.fulfilled, (_, { payload: token }) => ({
            token,
            user: jwt.decode(token) as api.JWTPayload,
            showLoginModal: false,
            loggingIn: false,
            loginError: false,
            wrongPasswordOrUsername: false,
        }));
        builder.addCase(login.rejected, (state, { payload }) => {
            state.loggingIn = false;
            state.loginError = !payload;
            state.wrongPasswordOrUsername = payload;
        });
    }
});

export const {
    logout,
    showLoginModal,
    closeLoginModal,
} = user.actions;

export default user.reducer;
