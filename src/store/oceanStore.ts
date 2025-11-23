import { create } from "zustand";

export const storageKey = "greenmind_ocean";

const initialState = {
	ocean: {
		O: 50.0,
		C: 50.0,
		E: 50.0,
		A: 50.0,
		N: 50.0,
	},
};

export const useOceanStore = create<IOceanState>()(
	(set) => ({
		...initialState,
		setOcean: (scores: IOcean) => set({ ocean: scores }),
	})
)