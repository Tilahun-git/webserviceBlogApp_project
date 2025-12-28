
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = 'authToken=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'userRole=; path=/; max-age=0; SameSite=Lax';
      }
    },
    loadToken: (state) => {
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        if (!token) {
          const match = document.cookie.split('; ').find(c => c.startsWith('authToken='));
          token = match ? match.split('=')[1] : null;
        }
      }
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
        const token = action.payload?.token;
        const role = (action.payload?.role ?? action.payload?.user?.role ?? 'user');
        state.token = token ?? null;
        state.isAuthenticated = Boolean(token);
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('token', token);
            document.cookie = `authToken=${token}; path=/; SameSite=Lax`;
          }
          if (role) {
            document.cookie = `userRole=${String(role)}; path=/; SameSite=Lax`;
          }
        }
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { signOut, loadToken } = authSlice.actions;
export default authSlice.reducer;
