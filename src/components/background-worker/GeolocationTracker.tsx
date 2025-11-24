import { useEffect, useRef, useCallback } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import {
  getCurrentPosition,
  isGeolocationAvailable,
  calculateDistance,
} from "@/helpers/geolocationHelper";
import { createLocation } from "@/apis/backend/location";
import { reverseGeocode } from "@/apis/nominatim/reverseGeocode";
import { useAuthStore } from "@/store/authStore";

interface GeolocationTrackerProps {
  timeBetweenTrack?: number;
}

function GeolocationTracker({ timeBetweenTrack = 30000 }: GeolocationTrackerProps) {
  const { setPosition, setError, setTracking } = useGeolocationStore();
  const user = useAuthStore((s) => s.user);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);

  const updatePosition = useCallback(async () => {
    if (!mountedRef.current) return;

    let newUserposition;
    let currentAdress = '';

    try {
      newUserposition = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Lỗi định vị không xác định";
      setError(msg);
      return;
    }

    if (!mountedRef.current) return;

    // Supress backend error validating
    let lengthToPreviousLocation = 0.01;

    const currentStorePosition = useGeolocationStore.getState().currentPosition;
    if (currentStorePosition) {
      const distance = calculateDistance(
        currentStorePosition.latitude,
        currentStorePosition.longitude,
        newUserposition.latitude,
        newUserposition.longitude
      );
      lengthToPreviousLocation = distance * 1000 + 0.01; // convert km to m
    }

    try {
      const addressRes = await reverseGeocode(newUserposition.latitude, newUserposition.longitude);
      if (addressRes && addressRes.display_name) {
        currentAdress = addressRes.display_name;
        useGeolocationStore.getState().setCurrentLocationDisplayName(addressRes.display_name);
      }

    } catch (error) {
      const msg = error instanceof Error ? error.message : "Lỗi không lấy được tên vị trí";
      setError(msg);
    }

    if (!user?.id) return;

    const payload: ILocationCreateParams = {
      name: currentAdress ?? "realtime tracking",
      address: currentAdress ?? "realtime tracking",
      coordinates: { lat: newUserposition.latitude, lng: newUserposition.longitude },
      userId: user.id,
      latitude: newUserposition.latitude,
      longitude: newUserposition.longitude,
      length_to_previous_location: lengthToPreviousLocation,
    };

    createLocation(payload).catch((error) => {
      const msg = error instanceof Error ? error.message : "Lỗi không lưu được vị trí";
      setError(msg);
    });

    setPosition(newUserposition);
  }, [user?.id]);

  useEffect(() => {

    mountedRef.current = true;

    if (!isGeolocationAvailable()) {
      setError("Thiết bị không hỗ trợ định vị.");
      return;
    }
    setTracking(true);

    // chạy ngay lần đầu
    updatePosition();

    // setup interval
    intervalRef.current = setInterval(() => {
      updatePosition();
    }, timeBetweenTrack);

    return () => {
      mountedRef.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setTracking(false);
    };
  }, []);

  return null;
}

export default GeolocationTracker;
