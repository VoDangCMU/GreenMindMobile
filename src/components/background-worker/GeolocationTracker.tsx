import { useEffect } from "react";
import { toast } from "sonner";
import { useGeolocationStore } from "@/store/geolocationStore";
import { getCurrentPosition, isGeolocationAvailable, calculateDistance } from "@/helpers/geolocationHelper";

function GeolocationTracker() {
  const { currentPosition, setPosition, setError, setTracking } = useGeolocationStore();

  useEffect(() => {
    const startTracking = async () => {
      if (!isGeolocationAvailable()) {
        console.warn("Geolocation is not available");
        return;
      }

      setTracking(true);

      const updatePosition = async () => {
        try {
          const newPos = await getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });

          if (currentPosition) {
            const distance = calculateDistance(
              currentPosition.latitude,
              currentPosition.longitude,
              newPos.latitude,
              newPos.longitude
            );
            console.log(`Moved ${distance.toFixed(2)} km since last update`);
          }

          setPosition(newPos);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown location error";
          setError(msg);
          console.error("Failed to get position:", msg);
          toast.error(`Location error: ${msg}`);
        }
      };

      await updatePosition(); // Cập nhật ngay
      const intervalId = setInterval(updatePosition, 120000); // 2 phút

      return () => {
        clearInterval(intervalId);
        setTracking(false);
      };
    };

    const cleanup = startTracking();
    return () => {
      cleanup?.then(fn => fn?.());
    };
  }, [currentPosition, setPosition, setError, setTracking]);

  return null;
}

export default GeolocationTracker;
