import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserState {
  currentUser: unknown;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.loading = false;
    },
    updateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.profile = null;
      state.loading = false;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
