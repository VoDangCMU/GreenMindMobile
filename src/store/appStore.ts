import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OceanScores } from "@/apis/backend/ocean";

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  gender?: string;
  location?: string;
}

export interface HomeLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface NightOutStatus {
  isNightOut: boolean;
  lastDetectedTime: string | null;
  distanceFromHome: number | null;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  lastCheckTime?: string | null;
}

export interface AppState {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  ocean: OceanScores | null;
  homeLocation: HomeLocation | null;
  nightOutStatus: NightOutStatus;
  bypassAuthGate: boolean;
  // Actions
  setOcean: (scores: OceanScores) => void;
  setHomeLocation: (location: HomeLocation) => void;
  setNightOutStatus: (status: Partial<NightOutStatus>) => void;
  setBypassAuthGate: (value: boolean) => void;
  setAuth: (data: {
    access_token: string;
    refresh_token: string;
    user: User | null;
  }) => void;
  clearAuth: () => void;
}

export const storageKey = "greenmind_auth";

const initialState = {
  access_token: null,
  refresh_token: null,
  user: null,
  ocean: null,
  homeLocation: null,
  nightOutStatus: {
    isNightOut: false,
    lastDetectedTime: null,
    distanceFromHome: null,
    currentLocation: null,
    lastCheckTime: null,
  },
  bypassAuthGate: false,
};

function normalizeOceanScores(scores: OceanScores): OceanScores {
  return {
    O: scores.O < 1.0 ? scores.O * 100 : scores.O,
    C: scores.C < 1.0 ? scores.C * 100 : scores.C,
    E: scores.E < 1.0 ? scores.E * 100 : scores.E,
    A: scores.A < 1.0 ? scores.A * 100 : scores.A,
    N: scores.N < 1.0 ? scores.N * 100 : scores.N,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setOcean: (scores) => {
        set({ ocean: normalizeOceanScores(scores) });
      },
      setHomeLocation: (location) => set({ homeLocation: location }),
      setNightOutStatus: (status) => set((state) => ({
        nightOutStatus: { ...state.nightOutStatus, ...status }
      })),
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


