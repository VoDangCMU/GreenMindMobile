import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

/**
 * Geolocation Helper - Unified API for Web and Mobile
 */

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

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: 1;
  POSITION_UNAVAILABLE: 2;
  TIMEOUT: 3;
}

/**
 * Get current geolocation position
 */
export async function getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
  try {
    if (Capacitor.isNativePlatform()) {
      const position = await Geolocation.getCurrentPosition(options);
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };
    } else {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          }),
          (error) => reject(new Error(getErrorMessage(error.code))),
          options
        );
      });
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to get location');
  }
}

/**
 * Watch position changes (Disabled due to type issues)
 */

/**
 * Check if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
  return Capacitor.isNativePlatform() || !!navigator.geolocation;
}

/**
 * Request permissions
 */
export async function requestPermissions(): Promise<{ granted: boolean }> {
  if (Capacitor.isNativePlatform()) {
    return { granted: true };
  } else {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return { granted: result.state === 'granted' };
    } catch {
      return { granted: false };
    }
  }
}

/**
 * Calculate distance between two points
 */

export type kilometer = number;
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): kilometer {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getErrorMessage(code: number): string {
  switch (code) {
    case 1: return 'Location access denied';
    case 2: return 'Location unavailable';
    case 3: return 'Location request timeout';
    default: return 'Unknown location error';
  }
}