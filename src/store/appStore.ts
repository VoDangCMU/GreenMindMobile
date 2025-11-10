import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OceanScores } from "@/apis/backend/ocean";

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
  ocean: OceanScores | null;
  setOcean: (scores: OceanScores) => void;
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
      ocean: null,
      bypassAuthGate: false,
      setOcean: (scores) => {
        // Normalize scores if they're in 0-1 range
        const normalizedScores = {
          O: scores.O < 1.0 ? scores.O * 100 : scores.O,
          C: scores.C < 1.0 ? scores.C * 100 : scores.C,
          E: scores.E < 1.0 ? scores.E * 100 : scores.E,
          A: scores.A < 1.0 ? scores.A * 100 : scores.A,
          N: scores.N < 1.0 ? scores.N * 100 : scores.N,
        };
        set({ ocean: normalizedScores });
      },
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


