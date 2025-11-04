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
  setPosition: (position: GeolocationPosition) => void;
  setTracking: (isTracking: boolean) => void;
  setError: (error: string | null) => void;
  clearPosition: () => void;
}

export const useGeolocationStore = create<GeolocationState>((set) => ({
  currentPosition: null,
  isTracking: false,
  lastUpdate: null,
  error: null,
  setPosition: (position) => set({
    currentPosition: position,
    lastUpdate: new Date(),
    error: null
  }),
  setTracking: (isTracking) => set({ isTracking }),
  setError: (error) => set({ error, isTracking: false }),
  clearPosition: () => set({
    currentPosition: null,
    lastUpdate: null,
    error: null
  }),
}));