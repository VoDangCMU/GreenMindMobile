import { create } from "zustand";
import { persist } from "zustand/middleware";

export const storageKey = "greenmind_appstate";

const initialState = {
  ocean: null,
  homeLocation: null,
  nightOutStatus: {
    isNightOut: false,
    lastDetectedTime: null,
    distanceFromHome: null,
    currentLocation: null,
    lastCheckTime: null,
  },
};

function normalizeOceanScores(scores: IOcean): IOcean {
  return {
    O: scores.O < 1.0 ? scores.O * 100 : scores.O,
    C: scores.C < 1.0 ? scores.C * 100 : scores.C,
    E: scores.E < 1.0 ? scores.E * 100 : scores.E,
    A: scores.A < 1.0 ? scores.A * 100 : scores.A,
    N: scores.N < 1.0 ? scores.N * 100 : scores.N,
  };
}

export const useAppStore = create<IAppState>()(
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
    }),
    {
      name: storageKey,
    }
  )
);


