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

export const register = createAsyncThunk<
string,
{
    username: string
    password: string
},
{
    rejectValue: boolean
}
>(
    'user/register',
    async (registrationInformation, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationInformation),
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

    showRegistrationModal: boolean
    registering: boolean
    registrationError: boolean
}

export const userInitialState: UserState = {
    token: null,
    user: null,

    showLoginModal: false,
    loggingIn: false,
    loginError: false,
    wrongPasswordOrUsername: false,

    showRegistrationModal: false,
    registering: false,
    registrationError: false,
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
        showRegistrationModal(state) {
            return {
                ...state,
                showRegistrationModal: true,
                registering: false,
                registrationError: false,
            };
        },
        closeRegistrationModal(state) {
            state.showRegistrationModal = false;
        },
    },
    extraReducers: builder => {
        builder.addCase(login.pending, state => {
            state.loggingIn = true;
            state.loginError = false;
            state.wrongPasswordOrUsername = false;
        });
        builder.addCase(login.fulfilled, (_, { payload: token }) => ({
            ...userInitialState,
            token,
            user: jwt.decode(token) as api.JWTPayload,
        }));
        builder.addCase(login.rejected, (state, { payload }) => {
            state.loggingIn = false;
            state.loginError = !payload;
            state.wrongPasswordOrUsername = payload;
        });

        builder.addCase(register.pending, state => {
            state.registering = true;
            state.registrationError = false;
        });
        builder.addCase(register.fulfilled, (_, { payload: token }) => ({
            ...userInitialState,
            token,
            user: jwt.decode(token) as api.JWTPayload,
        }));
        builder.addCase(register.rejected, state => {
            state.registering = false;
            state.registrationError = true;
        });
    }
});

export const {
    logout,
    showLoginModal,
    closeLoginModal,
    showRegistrationModal,
    closeRegistrationModal,
} = user.actions;

export default user.reducer;
