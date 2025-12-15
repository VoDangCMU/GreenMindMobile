import { useEffect, useRef, useCallback } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import {
  isGeolocationAvailable,
  calculateDistance,
  stopTracking,
  startTracking,
  getLastKnownPosition,
} from "@/helpers/geolocationHelper";
import { createLocation, } from "@/apis/backend/v1/location";
import { reverseGeocode } from "@/apis/nominatim/reverseGeocode";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/v2/locationStore";
import { Geolocation } from '@capacitor/geolocation';
import { getLatestLocation } from "@/apis/backend/v2/location";
import { App } from '@capacitor/app';

interface GeolocationTrackerProps {
  timeBetweenTrack?: number;
}

function GeolocationTracker({ timeBetweenTrack = 5000 }: GeolocationTrackerProps) {
  const { setError, setTracking } = useGeolocationStore();
  const user = useAuthStore((s) => s.user);
  const locationStore = useLocationStore(s => s);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
        });

        try {
          const addressRes = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          locationStore.setLastCalculatedlocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: addressRes?.display_name ?? undefined
          });
        } catch (error) {
          console.error("Error reverse geocoding initial position:", error);
          locationStore.setLastCalculatedlocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: undefined
          });
        }
      } catch (error) {
        console.error("Error getting initial position:", error);
      }
    })();

    try {
      startTracking((pos) => {
        console.log("New position from tracker:", pos);
        locationStore.setCurrentLocation({
          latitude: pos.latitude,
          longitude: pos.longitude,
          name: undefined,
        });
      });
    } catch (error) {
      console.error("Error starting tracking:", error);
    }

    return () => {
      try {
        stopTracking();
      } catch (error) {
        console.error("Error stopping tracking:", error);
      }
    };
  }, []);

  const updatePosition = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      let latestPosition = null; 
      try {
        latestPosition = await getLatestLocation();
      } catch (error) {
        console.error("Error fetching latest location:", error);
      }

      const state = await App.getState();

      let newUserposition = null;
      if (state.isActive) {
        try {
          const data = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });

          newUserposition = {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          };
        } catch (error) {
          console.error("Error getting current position:", error);
          return;
        }
      } else {
        try {
          const data = getLastKnownPosition();
          if (!data) return;
          
          newUserposition = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
        } catch (error) {
          console.error("Error getting last known position:", error);
          return;
        }
      }

      let currentAdress: string | undefined = undefined;
      let distance = 0;

      console.log("New user position:", JSON.stringify(newUserposition));

      if (newUserposition) {
        console.log("Calculating distance...");
        try {
          distance = calculateDistance(
            latestPosition?.data.latitude ?? newUserposition.latitude,
            latestPosition?.data.longitude ?? newUserposition.longitude,
            newUserposition.latitude,
            newUserposition.longitude
          );

          distance = distance < 0.0015 ? 0 : distance;

          console.log("Distance to previous location:", distance);
        } catch (error) {
          console.error("Error calculating distance:", error);
        }

        try {
          const addressRes = await reverseGeocode(newUserposition.latitude, newUserposition.longitude);

          if (addressRes && addressRes.display_name) {
            currentAdress = addressRes.display_name;
            locationStore.setLastCalculatedlocation({
              latitude: newUserposition.latitude,
              longitude: newUserposition.longitude,
              name: currentAdress,
            });
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        }

        if (!user?.id) return;

        try {
          const payload: ILocationCreateParams = {
            name: currentAdress ?? "realtime tracking",
            address: currentAdress ?? "realtime tracking",
            coordinates: { lat: newUserposition!.latitude, lng: newUserposition!.longitude },
            userId: user.id,
            latitude: newUserposition!.latitude,
            longitude: newUserposition!.longitude,
            length_to_previous_location: distance,
          };

          await createLocation(payload);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Lỗi không lưu được vị trí";
          console.error("Error creating location:", msg);
          setError(msg);
        }
      }
    } catch (error) {
      console.error("Unexpected error in updatePosition:", error);
    }
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
  }, [user?.id]);

  return null;
}

export default GeolocationTracker;
