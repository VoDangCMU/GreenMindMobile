import { create } from "zustand";

const initialState = {
  currentPosition: null,
  isTracking: false,
  lastUpdate: null,
  error: null,
  positionHistory: [],
};

export const useGeolocationStore = create<IGeolocationState>((set) => ({
  ...initialState,
  setPosition: (position) => set((state) => ({
    currentPosition: position,
    lastUpdate: new Date(),
    error: null,
    positionHistory: [position, ...state.positionHistory].slice(0, 50), // Keep last 50 positions
  })),
  setCurrentLocationDisplayName: (displayName: string) => set({
    currentPositionDisplayName: displayName,
  }),
  setTracking: (isTracking) => set({ isTracking }),
  setError: (error) => set({ error, isTracking: false }),
  clearPosition: () => set({
    currentPosition: null,
    lastUpdate: null,
    error: null
  }),
  clearHistory: () => set({ positionHistory: [] }),
}));