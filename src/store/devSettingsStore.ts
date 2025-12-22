import { create } from "zustand";
import { persist } from "zustand/middleware";

export const devSettingsStorageKey = "greenmind_dev_settings";

interface IDevSettingsState {
  inspectRequests: boolean;
  enableLogging: boolean;
  showCatalogueFab: boolean;
  setInspectRequests: (v: boolean) => void;
  toggleInspectRequests: () => void;
  setEnableLogging: (v: boolean) => void;
  toggleEnableLogging: () => void;
  setShowCatalogueFab: (v: boolean) => void;
  toggleShowCatalogueFab: () => void;
  reset: () => void;
}

export const useDevSettingsStore = create<IDevSettingsState>()(
  persist(
    (set) => ({
      inspectRequests: false,
      enableLogging: false,
      showCatalogueFab: false,

      setInspectRequests: (v: boolean) => set({ inspectRequests: v }),
      toggleInspectRequests: () => set((s) => ({ inspectRequests: !s.inspectRequests })),

      setEnableLogging: (v: boolean) => set({ enableLogging: v }),
      toggleEnableLogging: () => set((s) => ({ enableLogging: !s.enableLogging })),

      setShowCatalogueFab: (v: boolean) => set({ showCatalogueFab: v }),
      toggleShowCatalogueFab: () => set((s) => ({ showCatalogueFab: !s.showCatalogueFab })),

      reset: () =>
        set({
          inspectRequests: false,
          enableLogging: false,
          showCatalogueFab: false,
        }),
    }),
    {
      name: devSettingsStorageKey,
      version: 1,
      partialize: (s) => ({ inspectRequests: s.inspectRequests, enableLogging: s.enableLogging, showCatalogueFab: s.showCatalogueFab }),
    }
  )
);
