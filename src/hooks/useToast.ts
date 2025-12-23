import { useCallback } from 'react';
import { Toast } from '@/lib/toast';
import { useDevSettingsStore } from "@/store/devSettingsStore";

export interface UseToastReturn {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  show: (message: string) => void;
}

/**
 * Hook for showing toasts with platform-specific implementations
 * Uses Capacitor Toast on native platforms, Sonner on web
 */
export function useToast(): UseToastReturn {
  const disableErrorToasts = useDevSettingsStore((s) => s.disableErrorToasts);
  const disableWarningToasts = useDevSettingsStore((s) => s.disableWarningToasts);
  const disableInfoToasts = useDevSettingsStore((s) => s.disableInfoToasts);

  const success = useCallback((message: string) => {
    if (disableInfoToasts) return;
    Toast.success(message);
  }, [disableInfoToasts]);

  const error = useCallback((message: string) => {
    if (disableErrorToasts) return;
    Toast.error(message);
  }, [disableErrorToasts]);

  const info = useCallback((message: string) => {
    if (disableInfoToasts) return;
    Toast.info(message);
  }, [disableInfoToasts]);

  const warning = useCallback((message: string) => {
    if (disableWarningToasts) return;
    Toast.warning(message);
  }, [disableWarningToasts]);

  const show = useCallback((message: string) => {
    if (disableInfoToasts) return;
    Toast.show(message);
  }, [disableInfoToasts]);

  return {
    success,
    error,
    info,
    warning,
    show,
  };
}