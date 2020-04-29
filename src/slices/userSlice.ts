import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';

import * as api from '../api/types';

enum LoginError {
    Error,
    WrongUsernameOrPassword,
}
export const login = createAsyncThunk<
string,
{
    username: string
    password: string
},
{
    rejectValue: LoginError
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
                return rejectWithValue(
                    response.status === 401
                        ? LoginError.WrongUsernameOrPassword
                        : LoginError.Error
                );
            }
        } catch (error) {
            return rejectWithValue(LoginError.Error);
        }
    }
);

enum RegistrationError {
    Error,
    UsernameInUse,
}
export const register = createAsyncThunk<
string,
{
    username: string
    password: string
},
{
    rejectValue: RegistrationError
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
                return rejectWithValue(
                    response.status === 403
                        ? RegistrationError.UsernameInUse
                        : RegistrationError.Error
                );
            }
        } catch (error) {
            return rejectWithValue(RegistrationError.Error);
        }
    }
);


export interface UserState {
    token: string | null
    user: api.JWTPayload | null

    showLoginModal: boolean
    loggingIn: boolean
    loginError: boolean
    wrongUsernameOrPassword: boolean

    showRegistrationModal: boolean
    registering: boolean
    registrationError: boolean
    usernameInUse: boolean
}

export const userInitialState: UserState = {
    token: null,
    user: null,

    showLoginModal: false,
    loggingIn: false,
    loginError: false,
    wrongUsernameOrPassword: false,

    showRegistrationModal: false,
    registering: false,
    registrationError: false,
    usernameInUse: false,
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
                usernameInUse: false,
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
            state.wrongUsernameOrPassword = false;
        });
        builder.addCase(login.fulfilled, (_, { payload: token }) => ({
            ...userInitialState,
            token,
            user: jwt.decode(token) as api.JWTPayload,
        }));
        builder.addCase(login.rejected, (state, { payload }) => {
            state.loggingIn = false;
            state.loginError = payload === LoginError.Error;
            state.wrongUsernameOrPassword = payload === LoginError.WrongUsernameOrPassword;
        });

        builder.addCase(register.pending, state => {
            state.registering = true;
            state.registrationError = false;
            state.usernameInUse = false;
        });
        builder.addCase(register.fulfilled, (_, { payload: token }) => ({
            ...userInitialState,
            token,
            user: jwt.decode(token) as api.JWTPayload,
        }));
        builder.addCase(register.rejected, (state, { payload }) => {
            state.registering = false;
            state.registrationError = payload === RegistrationError.Error;
            state.usernameInUse = payload === RegistrationError.UsernameInUse;
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
