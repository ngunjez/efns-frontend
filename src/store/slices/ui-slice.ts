import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
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
