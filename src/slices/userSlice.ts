import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from '../api/types';

enum LoginError {
    Error,
    WrongUsernameOrPassword,
}
export const login = createAsyncThunk<
api.User,
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
                const user: api.User = await response.json();
                return user;
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
api.User,
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
                const user: api.User = await response.json();
                return user;
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

export const logout = createAsyncThunk<
void,
void,
{}
>(
    'user/logout',
    async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST'
            });
        } catch (error) {
            // Ignore errors
        }
    }
);


export interface UserState {
    user: api.User | null

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

const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
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
        builder.addCase(login.fulfilled, (_, { payload: user }) => ({
            ...userInitialState,
            user,
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
        builder.addCase(register.fulfilled, (_, { payload: user }) => ({
            ...userInitialState,
            user,
        }));
        builder.addCase(register.rejected, (state, { payload }) => {
            state.registering = false;
            state.registrationError = payload === RegistrationError.Error;
            state.usernameInUse = payload === RegistrationError.UsernameInUse;
        });

        builder.addCase(logout.fulfilled, () => userInitialState);
    }
});

export const {
    showLoginModal,
    closeLoginModal,
    showRegistrationModal,
    closeRegistrationModal,
} = userSlice.actions;

export default userSlice.reducer;
