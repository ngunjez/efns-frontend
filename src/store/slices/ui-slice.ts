import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  /** Mobile navigation drawer. */
  sidebarOpen: boolean;
  /** Desktop sidebar collapsed to give tables the full width. */
  sidebarCollapsed: boolean;
}

const initialState: UiState = { sidebarOpen: false, sidebarCollapsed: false };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    sidebarOpenChanged(state, action: { payload: boolean }) {
      state.sidebarOpen = action.payload;
    },
    sidebarCollapseToggled(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { sidebarOpenChanged, sidebarCollapseToggled } = uiSlice.actions;
export default uiSlice.reducer;
