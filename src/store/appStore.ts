import { create } from "zustand";
import { useLocalStorage } from "usehooks-ts";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  gender?: string;
  location?: string;
}

export interface AppState {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  bypassAuthGate: boolean;
  setBypassAuthGate: (value: boolean) => void;
  setAuth: (data: {
    access_token: string;
    refresh_token: string;
    user: User | null;
  }) => void;
  clearAuth: () => void;
}

export const storageKey = "greenmind_auth";

export const useAppStore = create<AppState>((set) => {
  // useLocalStorage hook must be used inside a React component, so we provide helpers for components
  let initial: Partial<AppState> = {};
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
    bypassAuthGate: false,
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
    setBypassAuthGate: (value: boolean) => {
      set({ bypassAuthGate: value }); 
    }
  };
});

// Optional: React hook for components to get/set auth state with useLocalStorage
export function useAuthLocalStorage() {
  return useLocalStorage<AppState | null>(storageKey, null);
}
