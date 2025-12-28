
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupApi, signInApi, SignupData, SigninData } from '@/lib/api';
import Cookies from 'js-cookie';


/* ---------- SIGN UP ---------- */
export const signUpUser = createAsyncThunk(
    'auth/signUp',
    async (data: SignupData, { rejectWithValue }) => {
      try {
        return await signupApi(data);
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message ?? 'Signup failed');
      }
    }
);

/* ---------- SIGN IN ---------- */
export const signInUser = createAsyncThunk(
    'auth/signIn',
    async (data: SigninData, { rejectWithValue }) => {
      try {
        const res = await signInApi(data);
        localStorage.setItem('token', res.token);
        return res;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.error ?? 'Login failed');
      }
    }
);

interface AuthState {
 user: { firstName?: string; email: string; profilePic?: string } | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');

      // Clear Cookie for Middleware
      Cookies.remove('token');
    },
    loadToken: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(signUpUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signUpUser.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(signUpUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(signInUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signInUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        })
        .addCase(signInUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  },
});

export const { signOut, loadToken } = authSlice.actions;
export default authSlice.reducer;
