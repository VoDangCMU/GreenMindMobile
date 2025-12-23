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

      clearAuth: () => {
        localStorage.clear();
        set({
          ...initialState,
          bypassAuthGate: false, // Explicitly reset bypass on logout
        });
      },

      setBypassAuthGate: (value) =>
        set({
          bypassAuthGate: value,
        }),
    }),
    {
      name: storageKey,
      version: 1,
      // Explicitly include bypassAuthGate in persisted state
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        bypassAuthGate: state.bypassAuthGate,
      }),
    }
  )
);
