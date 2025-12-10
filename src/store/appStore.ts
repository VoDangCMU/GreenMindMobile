import { ensureUserOcean } from "@/apis/backend/v1/ocean";
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

export const useAppStore = create<IAppState>()(
  persist(
    (set) => ({
      ...initialState,
      setOcean: (scores) => {
        set({ ocean: ensureUserOcean(scores) });
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


