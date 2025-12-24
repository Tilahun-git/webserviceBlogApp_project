import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupApi, signInApi, SignupData, SigninData } from '@/lib/api';

/* ---------- SIGN UP ---------- */
export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (data: SignupData, { rejectWithValue }) => {
    try {
        return await signupApi(data);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const e = err as { response?: { data?: { message?: string } } };
          return rejectWithValue(e.response?.data?.message ?? 'Signup failed');
        }
        return rejectWithValue('Signup failed');
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
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const e = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(e.response?.data?.message ?? 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

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
    signOut: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
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
      /* SIGN UP */
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

      /* SIGN IN */
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
