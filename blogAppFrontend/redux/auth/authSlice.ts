import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.loading = false;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut } = authSlice.actions;
export default authSlice.reducer;
