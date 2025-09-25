import { create } from "zustand";
import { useLocalStorage } from "usehooks-ts";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  setAuth: (data: {
    access_token: string;
    refresh_token: string;
    user: User;
  }) => void;
  clearAuth: () => void;
}

const storageKey = "greenmind_auth";

export const useAppStore = create<AuthState>((set, get) => {
  // useLocalStorage hook must be used inside a React component, so we provide helpers for components
  let initial: Partial<AuthState> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) initial = JSON.parse(raw);
    } catch {}
  }
  return {
    access_token: initial.access_token ?? null,
    refresh_token: initial.refresh_token ?? null,
    user: initial.user ?? null,
    setAuth: (data) => {
      set(data);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    },
    clearAuth: () => {
      set({ access_token: null, refresh_token: null, user: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    },
  };
});

// Optional: React hook for components to get/set auth state with useLocalStorage
export function useAuthLocalStorage() {
  return useLocalStorage<AuthState | null>(storageKey, null);
}
