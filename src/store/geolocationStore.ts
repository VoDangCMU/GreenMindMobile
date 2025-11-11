import { create } from "zustand";

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface GeolocationState {
  currentPosition: GeolocationPosition | null;
  isTracking: boolean;
  lastUpdate: Date | null;
  error: string | null;
  positionHistory: GeolocationPosition[];
  // Actions
  setPosition: (position: GeolocationPosition) => void;
  setTracking: (isTracking: boolean) => void;
  setError: (error: string | null) => void;
  clearPosition: () => void;
  clearHistory: () => void;
}

const initialState = {
  currentPosition: null,
  isTracking: false,
  lastUpdate: null,
  error: null,
  positionHistory: [],
};

export const useGeolocationStore = create<GeolocationState>((set) => ({
  ...initialState,
  setPosition: (position) => set((state) => ({
    currentPosition: position,
    lastUpdate: new Date(),
    error: null,
    positionHistory: [position, ...state.positionHistory].slice(0, 50), // Keep last 50 positions
  })),
  setTracking: (isTracking) => set({ isTracking }),
  setError: (error) => set({ error, isTracking: false }),
  clearPosition: () => set({
    currentPosition: null,
    lastUpdate: null,
    error: null
  }),
  clearHistory: () => set({ positionHistory: [] }),
}));