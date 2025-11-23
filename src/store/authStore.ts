import { create } from "zustand";
import { persist } from "zustand/middleware";

export const storageKey = "greenmind_auth";

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  bypassAuthGate: false,
};

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setTokens: (tokens) =>
        set({
          tokens,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          ...initialState,
        }),

      setBypassAuthGate: (value) =>
        set({
          bypassAuthGate: value,
        }),
    }),
    {
      name: storageKey,
      version: 1,
    }
  )
);
