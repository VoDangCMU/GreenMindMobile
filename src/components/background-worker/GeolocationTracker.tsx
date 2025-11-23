import { useEffect, useRef, useCallback } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import {
  getCurrentPosition,
  isGeolocationAvailable,
  calculateDistance,
} from "@/helpers/geolocationHelper";
import { createLocation } from "@/apis/backend/location";
import { useAuthStore } from "@/store/authStore";

interface GeolocationTrackerProps {
  timeBetweenTrack?: number;
  logging?: boolean;
}

function GeolocationTracker({ timeBetweenTrack = 30000, logging = false }: GeolocationTrackerProps) {
  const { setPosition, setError, setTracking } = useGeolocationStore();
  const user = useAuthStore((s) => s.user);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);

  const updatePosition = useCallback(async () => {
    if (!mountedRef.current) {
      if (logging) console.warn("⚠️ [Update] Component unmounted, skip update");
      return;
    }

    if (logging) console.log("🔄 [Update] Getting current position...");

    try {
      const newPos = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      if (!mountedRef.current) {
        if (logging) console.warn("⚠️ [Update] Component unmounted after fetch");
        return;
      }

      let lengthToPreviousLocation = 0.1;
      const currentStorePosition = useGeolocationStore.getState().currentPosition;
      if (currentStorePosition) {
        const distance = calculateDistance(
          currentStorePosition.latitude,
          currentStorePosition.longitude,
          newPos.latitude,
          newPos.longitude
        );
        lengthToPreviousLocation = distance * 1000 + 0.1; // convert km to m
        if (logging) console.log(`📍 [Update] Moved ${distance.toFixed(4)} km since last update (${lengthToPreviousLocation.toFixed(2)} m)`);
      } else {
        if (logging) console.log("🆕 [Update] First position recorded");
      }

      console.log(user)
      // Call backend location API for realtime tracking
      if (user?.id) {
        const payload: ILocationCreateParams = {
          name: "realtime tracking",
          address: "realtime tracking",
          coordinates: { lat: newPos.latitude, lng: newPos.longitude },
          userId: user.id,
          latitude: newPos.latitude,
          longitude: newPos.longitude,
          length_to_previous_location: lengthToPreviousLocation,
        };
        
        if (logging) console.log("[LocationAPI] Sending payload:", payload);
        
        createLocation(payload).catch((err) => {
          if (logging) console.error("[LocationAPI] Failed to create location:", err);
        });
      }

      if (logging) console.log("✅ [Update] Setting new position:", newPos);
      setPosition(newPos);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Lỗi định vị không xác định";
      if (logging) console.error("❌ [Update] Failed to get position:", msg);
      setError(msg);
    }
  }, [logging, setPosition, setError, user?.id]);

  useEffect(() => {
    if (logging) console.log("🟢 [Effect] GeolocationTracker mounted");

    mountedRef.current = true;

    if (!isGeolocationAvailable()) {
      if (logging) console.warn("❌ [Init] Geolocation not available");
      setError("Thiết bị không hỗ trợ định vị.");
      return;
    }

    if (logging) console.log("⚙️ [Init] Start tracking...");
    setTracking(true);

    // chạy ngay lần đầu
    updatePosition();

    // setup interval
    if (logging) console.log(`⏱️ [Init] Setting interval: ${timeBetweenTrack}ms`);
    intervalRef.current = setInterval(() => {
      if (logging) console.log("🕒 [Interval] Triggered updatePosition()");
      updatePosition();
    }, timeBetweenTrack);

    return () => {
      if (logging) console.log("🧹 [Cleanup] Cleaning up GeolocationTracker...");
      mountedRef.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if (logging) console.log("🛑 [Cleanup] Cleared interval");
      } else {
        if (logging) console.warn("⚠️ [Cleanup] No interval to clear");
      }

      setTracking(false);
    };
  }, [logging]);

  return null;
}

export default GeolocationTracker;
