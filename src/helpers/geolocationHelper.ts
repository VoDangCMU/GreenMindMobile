import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

/**
 * Unified Geolocation Helper (Web + Native)
 */

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

let lastPosition: GeolocationPosition | null = null;
let webWatchId: number | null = null;
let nativeStarted = false;

/* =========================
   START TRACKING
========================= */
export async function startTracking(
  onLocation?: (pos: GeolocationPosition) => void
) {
  // 🌐 WEB
  if (Capacitor.getPlatform() === "web") {
    if (!navigator.geolocation) {
      throw new Error("Geolocation not supported");
    }

    webWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        lastPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        };

        onLocation?.(lastPosition);
      },
      (err) => {
        console.error("Web geolocation error", err);
      },
      { enableHighAccuracy: true }
    );

    return;
  }

  // 📱 NATIVE (Capgo)
  if (nativeStarted) return;

  await BackgroundGeolocation.start(
    {
      requestPermissions: true,
      stale: false,
      distanceFilter: 0.05,
    },
    (location, error) => {
      if (error) {
        console.error("BG Geolocation error", error);
        return;
      }

      if (!location) {
        return;
      }

      lastPosition = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        altitude: location.altitude,
        heading: null,
        speed: location.speed,
        timestamp: Date.now(),
      };

      onLocation?.(lastPosition);
    }
  );

  nativeStarted = true;
}

/* =========================
   STOP TRACKING
========================= */
export async function stopTracking() {
  if (Capacitor.getPlatform() === "web") {
    if (webWatchId !== null) {
      navigator.geolocation.clearWatch(webWatchId);
      webWatchId = null;
    }
    return;
  }

  if (nativeStarted) {
    await BackgroundGeolocation.stop();
    nativeStarted = false;
  }
}

/* =========================
   GET LAST POSITION
========================= */
export function getLastKnownPosition(): GeolocationPosition | null {
  return lastPosition;
}

/* =========================
   UTILS
========================= */

export function isGeolocationAvailable(): boolean {
  return Capacitor.isNativePlatform() || !!navigator.geolocation;
}

export type kilometer = number;
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): kilometer {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}
