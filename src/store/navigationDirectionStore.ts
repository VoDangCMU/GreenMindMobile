// src/store/navigationDirectionStore.ts
import { create } from "zustand";

type Direction = "forward" | "back";

interface NavState {
  direction: Direction;
  setDirection: (dir: Direction) => void;
}

export const useNavigationDirection = create<NavState>((set) => ({
  direction: "forward",
  setDirection: (dir) => set({ direction: dir }),
}));
