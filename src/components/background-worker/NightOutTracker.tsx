import { useEffect, useRef } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import { useAppStore } from "@/store/appStore";
import { useNightOutHistoryStore } from "@/store/nightOutHistoryStore";
import { calculateDistance } from "@/helpers/geolocationHelper";

interface NightOutTrackerProps {
  timeBetweenCheck?: number; // Thời gian kiểm tra (ms), default 60 seconds
  distanceThreshold?: number; // Khoảng cách ngưỡng (km), default 0.1km (100m)
  nightTimeStart?: number; // Giờ bắt đầu đêm (24h format), default 18
  testMode?: boolean; // Test mode to override time and distance checks
}

function NightOutTracker({
  timeBetweenCheck = 60000, // 60 seconds
  distanceThreshold = 0.1, // 100 meters in km
  nightTimeStart = 18, // 6 PM
  testMode = false, // Enable for testing
}: NightOutTrackerProps) {
  const { addNightOutRecord, hasNightOutToday } = useNightOutHistoryStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);

  const checkNightOutStatus = () => {
    const currentPosition = useGeolocationStore.getState().currentPosition;
    const { homeLocation, nightOutStatus, setNightOutStatus } = useAppStore.getState();

    // Cập nhật lastCheckTime mỗi lần check
    setNightOutStatus({ lastCheckTime: new Date().toISOString() });

    if (!mountedRef.current) return;

    if (!currentPosition || !homeLocation) return;

    // Calculate distance from home
    const distanceFromHome = calculateDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      homeLocation.latitude,
      homeLocation.longitude
    );

    // Check if distance is greater than threshold (100m = 0.1km)
    const isAwayFromHome = distanceFromHome > distanceThreshold;

    // Check if it's night time (after 6 PM)
    const currentHour = new Date().getHours();
    const isNightTime = testMode ? true : currentHour >= nightTimeStart; // Force true in test mode

    const isCurrentlyNightOut = isAwayFromHome && isNightTime;

    if (!isAwayFromHome) {
      // Reset status if back home
      if (nightOutStatus.isNightOut) {
        setNightOutStatus({
          isNightOut: false,
          lastDetectedTime: null,
          distanceFromHome: null,
          currentLocation: null,
        });
      }
      return;
    }

    if (isCurrentlyNightOut && !nightOutStatus.isNightOut) {
      const currentTime = new Date().toISOString();

      setNightOutStatus({
        isNightOut: true,
        lastDetectedTime: currentTime,
        distanceFromHome: distanceFromHome,
        currentLocation: {
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
        },
      });

      if (!hasNightOutToday()) {
        addNightOutRecord({
          timestamp: currentTime,
          distanceFromHome: distanceFromHome,
          location: {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          },
        });
      }
    } else if (!isCurrentlyNightOut && nightOutStatus.isNightOut) {
      setNightOutStatus({
        isNightOut: false,
        lastDetectedTime: null,
        distanceFromHome: null,
        currentLocation: null,
      });
    } else if (isCurrentlyNightOut && nightOutStatus.isNightOut) {
      // Update current position and distance even if still night out
      setNightOutStatus({
        distanceFromHome: distanceFromHome,
        currentLocation: {
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
        },
      });
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    // Check immediately
    checkNightOutStatus();

    // Setup interval for periodic checks
    intervalRef.current = setInterval(() => {
      checkNightOutStatus();
    }, timeBetweenCheck);

    return () => {
      mountedRef.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Reset night out status on cleanup
      useAppStore.getState().setNightOutStatus({
        isNightOut: false,
        lastDetectedTime: null,
        distanceFromHome: null,
        currentLocation: null,
      });
    };
  }, []);

  return null;
}

export default NightOutTracker;