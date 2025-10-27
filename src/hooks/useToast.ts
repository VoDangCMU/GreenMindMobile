import { useCallback } from 'react';
import { Toast } from '@/lib/toast';

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
  const success = useCallback((message: string) => {
    Toast.success(message);
  }, []);

  const error = useCallback((message: string) => {
    Toast.error(message);
  }, []);

  const info = useCallback((message: string) => {
    Toast.info(message);
  }, []);

  const warning = useCallback((message: string) => {
    Toast.warning(message);
  }, []);

  const show = useCallback((message: string) => {
    Toast.show(message);
  }, []);

  return {
    success,
    error,
    info,
    warning,
    show,
  };
}