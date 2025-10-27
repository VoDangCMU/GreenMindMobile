import { Capacitor } from '@capacitor/core';
import { Toast as CapacitorToast } from '@capacitor/toast';
import { toast as sonnerToast } from 'sonner';

/**
 * Unified Toast System for Capacitor Apps
 *
 * This module provides a platform-aware toast notification system that:
 * - Uses Capacitor's native Toast plugin on iOS/Android for native experience
 * - Falls back to Sonner's web toast on browser platforms
 *
 * Usage:
 * ```typescript
 * import { Toast } from '@/lib/toast';
 *
 * // Static methods
 * Toast.success('Operation completed!');
 * Toast.error('Something went wrong!');
 * Toast.info('Here's some information');
 * Toast.warning('Warning message');
 * Toast.show('Basic message');
 *
 * // Or use the hook in React components
 * import { useToast } from '@/hooks/useToast';
 *
 * const { success, error, info, warning, show } = useToast();
 * success('Success message!');
 * ```
 */

export interface ToastOptions {
  message: string;
  duration?: 'short' | 'long';
  position?: 'top' | 'center' | 'bottom';
}

export class Toast {
  /**
   * Show a success toast
   */
  static success(message: string, options?: Omit<ToastOptions, 'message'>) {
    if (Capacitor.isNativePlatform()) {
      CapacitorToast.show({
        text: message,
        duration: options?.duration === 'long' ? 'long' : 'short',
        position: options?.position || 'bottom',
      });
    } else {
      sonnerToast.success(message);
    }
  }

  /**
   * Show an error toast
   */
  static error(message: string, options?: Omit<ToastOptions, 'message'>) {
    if (Capacitor.isNativePlatform()) {
      CapacitorToast.show({
        text: message,
        duration: options?.duration === 'long' ? 'long' : 'short',
        position: options?.position || 'bottom',
      });
    } else {
      sonnerToast.error(message);
    }
  }

  /**
   * Show an info toast
   */
  static info(message: string, options?: Omit<ToastOptions, 'message'>) {
    if (Capacitor.isNativePlatform()) {
      CapacitorToast.show({
        text: message,
        duration: options?.duration === 'long' ? 'long' : 'short',
        position: options?.position || 'bottom',
      });
    } else {
      sonnerToast.info(message);
    }
  }

  /**
   * Show a warning toast
   */
  static warning(message: string, options?: Omit<ToastOptions, 'message'>) {
    if (Capacitor.isNativePlatform()) {
      CapacitorToast.show({
        text: message,
        duration: options?.duration === 'long' ? 'long' : 'short',
        position: options?.position || 'bottom',
      });
    } else {
      sonnerToast.warning(message);
    }
  }

  /**
   * Show a basic toast (neutral)
   */
  static show(message: string, options?: ToastOptions) {
    if (Capacitor.isNativePlatform()) {
      CapacitorToast.show({
        text: message,
        duration: options?.duration === 'long' ? 'long' : 'short',
        position: options?.position || 'bottom',
      });
    } else {
      sonnerToast(message);
    }
  }
}

// Export individual functions for convenience
export const showToast = Toast.show;
export const showSuccessToast = Toast.success;
export const showErrorToast = Toast.error;
export const showInfoToast = Toast.info;
export const showWarningToast = Toast.warning;