import { create } from 'zustand';

export interface PlantScanResult {
  id: string;
  createdAt: string;
  vegetable_area: number;
  dish_area: number;
  vegetable_ratio_percent: number;
  plant_image_base64: string;
}

interface PlantScanStore {
  scans: PlantScanResult[];
  addScan: (scan: PlantScanResult) => void;
  setScans: (scans: PlantScanResult[]) => void;
}

const usePlantScanStore = create<PlantScanStore>((set) => ({
  scans: [],
  addScan: (scan) => set((state) => ({ scans: [scan, ...state.scans] })),
  setScans: (scans) => set({ scans }),
}));

export default usePlantScanStore;
