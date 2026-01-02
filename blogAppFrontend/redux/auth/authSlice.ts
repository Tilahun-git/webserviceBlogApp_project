
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupApi, signInApi, SignupData, SigninData } from '@/lib/api';

/* ---------- SIGN UP ---------- */
export const signUpUser = createAsyncThunk(
    'auth/signUp',
    async (data: SignupData, { rejectWithValue }) => {
      try {
        const response = await signupApi(data);
        return response.data.data;
      } catch (err: any) {
        if (err.message === 'SSL_CERTIFICATE_ERROR') {
          return rejectWithValue('SSL Certificate Error: Please visit https://localhost:8080 in your browser and accept the security certificate, then try again.');
        }
        const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
        return rejectWithValue(errorMessage);
      }
    }
);

/* ---------- SIGN IN ---------- */
export const signInUser = createAsyncThunk(
    'auth/sign-in',
    async (data: SigninData, { rejectWithValue }) => {
      try {
        const response = await signInApi(data);
        const token = response.data.data?.token;
        const roleName = response.data.data?.roleName; 
        
        if (token) {
          localStorage.setItem('token', token);
        }
        
      return {token,roleName}; 
      } catch (err: any) {
        if (err.message === 'SSL_CERTIFICATE_ERROR') {
          return rejectWithValue('SSL Certificate Error: Please visit https://localhost:8080 in your browser and accept the security certificate, then try again.');
        }
        const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Login failed! Please try with valid credintials';
        return rejectWithValue(errorMessage);
      }
    }
);

interface AuthState {
  user: { firstName?: string; email: string; profilePic?: string } | null;
  isAuthenticated: boolean;
  token: string | null;
  roleName:string|null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  roleName:null,
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
      }
    },
    loadToken: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
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
        state.error = null;
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
        state.error = null;
        state.token = action.payload?.token ?? null;
          state.roleName = action.payload?.roleName ?? null; 
        state.isAuthenticated = Boolean(state.token);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { signOut, loadToken, clearError } = authSlice.actions;
export default authSlice.reducer;
