import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import uiReducer from './slices/ui-slice';

/** A fresh store per request/browser tab — never a module singleton (SSR safety). */
export function makeStore() {
  return configureStore({ reducer: { auth: authReducer, ui: uiReducer } });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
