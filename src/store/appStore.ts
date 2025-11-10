import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      bypassAuthGate: false,
      setAuth: async (data) => {
        set({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user,
        });
      },
      clearAuth: () => {
        set({ access_token: null, refresh_token: null, user: null });
      },
      setBypassAuthGate: (value: boolean) => {
        set({ bypassAuthGate: value });
      },
    }),
    {
      name: storageKey,
    }
  )
);


