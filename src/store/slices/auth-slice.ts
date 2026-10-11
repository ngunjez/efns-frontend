import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StaffUser } from '@/types/auth';

interface AuthState {
  user: StaffUser | null;
  locked: boolean;
}

const initialState: AuthState = { user: null, locked: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<StaffUser>) {
      state.user = action.payload;
      state.locked = false;
    },
    signedOut() {
      return initialState;
    },
    locked(state) {
      state.locked = true;
    },
    unlocked(state) {
      state.locked = false;
    },
  },
});

export const { signedIn, signedOut, locked, unlocked } = authSlice.actions;
export default authSlice.reducer;
