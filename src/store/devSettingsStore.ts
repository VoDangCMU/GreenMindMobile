import { create } from "zustand";
import { persist } from "zustand/middleware";
import servers from "@/apis/instances/servers";

export const devSettingsStorageKey = "greenmind_dev_settings";

interface IDevSettingsState {
  inspectRequests: boolean;
  enableLogging: boolean;
  showCatalogueFab: boolean;
  axiosLogging: boolean;
  backendUrl: string;
  aiUrl: string;
  disableErrorToasts: boolean;
  disableWarningToasts: boolean;
  disableInfoToasts: boolean;
  setInspectRequests: (v: boolean) => void;
  toggleInspectRequests: () => void;
  setEnableLogging: (v: boolean) => void;
  toggleEnableLogging: () => void;
  setShowCatalogueFab: (v: boolean) => void;
  toggleShowCatalogueFab: () => void;
  setAxiosLogging: (v: boolean) => void;
  toggleAxiosLogging: () => void;
  setBackendUrl: (v: string) => void;
  setAiUrl: (v: string) => void;
  toggleDisableErrorToasts: () => void;
  toggleDisableWarningToasts: () => void;
  toggleDisableInfoToasts: () => void;
  reset: () => void;
}

export const useDevSettingsStore = create<IDevSettingsState>()(
  persist(
    (set) => ({
      inspectRequests: false,
      enableLogging: false,
      showCatalogueFab: false,
      axiosLogging: false,
      backendUrl: servers.VPS_HOST,
      aiUrl: servers.AI_HOST, // Keep AI host as is, or change if needed. User only asked for backend.
      disableErrorToasts: true,
      disableWarningToasts: true,
      disableInfoToasts: false,

      setInspectRequests: (v: boolean) => set({ inspectRequests: v }),
      toggleInspectRequests: () => set((s) => ({ inspectRequests: !s.inspectRequests })),

      setEnableLogging: (v: boolean) => set({ enableLogging: v }),
      toggleEnableLogging: () => set((s) => ({ enableLogging: !s.enableLogging })),

      setShowCatalogueFab: (v: boolean) => set({ showCatalogueFab: v }),
      toggleShowCatalogueFab: () => set((s) => ({ showCatalogueFab: !s.showCatalogueFab })),

      setAxiosLogging: (v: boolean) => set({ axiosLogging: v }),
      toggleAxiosLogging: () => set((s) => ({ axiosLogging: !s.axiosLogging })),

      setBackendUrl: (v: string) => set({ backendUrl: v }),
      setAiUrl: (v: string) => set({ aiUrl: v }),

      toggleDisableErrorToasts: () => set((s) => ({ disableErrorToasts: !s.disableErrorToasts })),
      toggleDisableWarningToasts: () => set((s) => ({ disableWarningToasts: !s.disableWarningToasts })),
      toggleDisableInfoToasts: () => set((s) => ({ disableInfoToasts: !s.disableInfoToasts })),

      reset: () =>
        set({
          inspectRequests: false,
          enableLogging: false,
          showCatalogueFab: false,
          axiosLogging: false,
          backendUrl: servers.VPS_HOST,
          aiUrl: servers.AI_HOST,
          disableErrorToasts: true,
          disableWarningToasts: true,
          disableInfoToasts: false,
        }),
    }),
    {
      name: devSettingsStorageKey,
      version: 1,
      partialize: (s) => ({
        inspectRequests: s.inspectRequests, enableLogging: s.enableLogging, showCatalogueFab: s.showCatalogueFab, axiosLogging: s.axiosLogging, backendUrl: s.backendUrl, aiUrl: s.aiUrl, disableErrorToasts: s.disableErrorToasts,
        disableWarningToasts: s.disableWarningToasts,
        disableInfoToasts: s.disableInfoToasts,
      }),
    }
  )
);
