import { useEffect } from "react";
import { toast } from "sonner";
import { useGeolocationStore } from "@/store/geolocationStore";
import { getCurrentPosition, isGeolocationAvailable, calculateDistance } from "@/helpers/geolocationHelper";

function GeolocationTracker() {
  const { currentPosition, setPosition, setError, setTracking } = useGeolocationStore();

  useEffect(() => {
    if (!isGeolocationAvailable()) {
      console.warn("Geolocation is not available");
      setError("Thiết bị không hỗ trợ định vị.");
      return;
    }

    setTracking(true);
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const updatePosition = async () => {
      try {
        const newPos = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        if (!isMounted) return;

        if (currentPosition) {
          const distance = calculateDistance(
            currentPosition.latitude,
            currentPosition.longitude,
            newPos.latitude,
            newPos.longitude
          );
          console.log(`📍 Moved ${distance.toFixed(2)} km since last update`);
        }

        setPosition(newPos);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown location error";
        setError(msg);
        console.error("❌ Failed to get position:", msg);
        toast.error(`Location error: ${msg}`);
      }
    };

    // chạy ngay lần đầu
    updatePosition();

    // cập nhật liên tục mỗi 10 giây
    intervalId = setInterval(updatePosition, 10000);

    // cleanup
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      setTracking(false);
    };
  }, [currentPosition, setPosition, setError, setTracking]);

  return null;
}

export default GeolocationTracker;
