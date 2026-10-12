'use client';

import { createContext, useContext } from 'react';

export const FollowModeContext = createContext(false);

export function useFollowMode() {
  return useContext(FollowModeContext);
}
