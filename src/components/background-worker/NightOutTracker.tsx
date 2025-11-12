/* eslint-disable react-hooks/exhaustive-deps */
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
  logging?: boolean; // Chỉ log khi logging=true
}

function NightOutTracker({ 
  timeBetweenCheck = 60000, // 60 seconds
  distanceThreshold = 0.1, // 100 meters in km
  nightTimeStart = 18, // 6 PM
  testMode = false, // Enable for testing
  logging = false // Chỉ log khi logging=true
}: NightOutTrackerProps) {
  const { currentPosition } = useGeolocationStore();
  const homeLocation = useAppStore((state) => state.homeLocation);
  const nightOutStatus = useAppStore((state) => state.nightOutStatus);
  const setNightOutStatus = useAppStore((state) => state.setNightOutStatus);
  const { addNightOutRecord, hasNightOutToday } = useNightOutHistoryStore();
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);

  const checkNightOutStatus = () => {
    // Cập nhật lastCheckTime mỗi lần check
    setNightOutStatus({ lastCheckTime: new Date().toISOString() });

    if (!mountedRef.current) {
      if (logging) console.warn("⚠️ [NightOut] Component unmounted, skip check");
      return;
    }

    if (logging) {
      console.log("🔍 [NightOut] Checking status...");
      console.log("📍 [NightOut] Current position:", currentPosition);
      console.log("🏠 [NightOut] Home location:", homeLocation);
    }

    if (!currentPosition || !homeLocation) {
      if (logging) {
        console.log("📍 [NightOut] No current position or home location set");
        if (!currentPosition) console.log("❌ [NightOut] Missing current position");
        if (!homeLocation) console.log("❌ [NightOut] Missing home location");
      }
      return;
    }

    // Calculate distance from home
    const distanceFromHome = calculateDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      homeLocation.latitude,
      homeLocation.longitude
    );

    if (logging) {
      console.log(`📏 [NightOut] Distance calculation:`);
      console.log(`   Current: ${currentPosition.latitude}, ${currentPosition.longitude}`);
      console.log(`   Home: ${homeLocation.latitude}, ${homeLocation.longitude}`);
      console.log(`   Distance: ${(distanceFromHome * 1000).toFixed(0)}m (${distanceFromHome.toFixed(4)}km)`);
      console.log(`   Threshold: ${(distanceThreshold * 1000).toFixed(0)}m (${distanceThreshold}km)`);
    }

    // Check if distance is greater than threshold (100m = 0.1km)
    const isAwayFromHome = distanceFromHome > distanceThreshold;
    if (logging) console.log(`🚪 [NightOut] Away from home: ${isAwayFromHome}`);

    // Check if it's night time (after 6 PM)
    const currentHour = new Date().getHours();
    const isNightTime = testMode ? true : currentHour >= nightTimeStart; // Force true in test mode
    
    if (logging) {
      console.log(`🕐 [NightOut] Time check:`);
      console.log(`   Current hour: ${currentHour}`);
      console.log(`   Night time starts: ${nightTimeStart}`);
      console.log(`   Is night time: ${isNightTime}${testMode ? ' (TEST MODE)' : ''}`);
    }

    const isCurrentlyNightOut = isAwayFromHome && isNightTime;
    if (logging) {
      console.log(`🌙 [NightOut] Currently night out: ${isCurrentlyNightOut}`);
      console.log(`🌙 [NightOut] Previous night out status: ${nightOutStatus.isNightOut}`);
    }

    if (!isAwayFromHome) {
      // Reset status if back home
      if (nightOutStatus.isNightOut) {
        if (logging) console.log("🏠 [NightOut] Back home, resetting status");
        setNightOutStatus({
          isNightOut: false,
          lastDetectedTime: null,
          distanceFromHome: null,
          currentLocation: null,
        });
      }
      return;
    }

    // Only log if status changed to avoid spam
    if (isCurrentlyNightOut && !nightOutStatus.isNightOut) {
      const currentTime = new Date().toISOString();
      
      if (logging) {
        console.log("🌙 [NightOut] STATUS: User is out during night time!");
        console.log(`📏 [NightOut] Distance from home: ${(distanceFromHome * 1000).toFixed(0)}m`);
        console.log(`🕐 [NightOut] Current time: ${new Date().toLocaleTimeString()}`);
        console.log(`🏠 [NightOut] Home location: ${homeLocation.latitude.toFixed(6)}, ${homeLocation.longitude.toFixed(6)}`);
        console.log(`📍 [NightOut] Current location: ${currentPosition.latitude.toFixed(6)}, ${currentPosition.longitude.toFixed(6)}`);
      }
      
      // Update current night out status
      setNightOutStatus({
        isNightOut: true,
        lastDetectedTime: currentTime,
        distanceFromHome: distanceFromHome,
        currentLocation: {
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
        },
      });
      
      // Save to night out history (only once per day)
      if (!hasNightOutToday()) {
        addNightOutRecord({
          timestamp: currentTime,
          distanceFromHome: distanceFromHome,
          location: {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          },
        });
        
        if (logging) {
          console.log("📝 [NightOut] Added to night out history for today");
        }
      } else {
        if (logging) {
          console.log("📝 [NightOut] Night out already recorded for today");
        }
      }
    } else if (!isCurrentlyNightOut && nightOutStatus.isNightOut) {
      if (logging) {
        if (!isNightTime) {
          console.log("☀️ [NightOut] Day time now, resetting status");
        } else {
          console.log("🏠 [NightOut] Back within home range during night");
        }
      }
      setNightOutStatus({
        isNightOut: false,
        lastDetectedTime: null,
        distanceFromHome: null,
        currentLocation: null,
      });
    } else if (isCurrentlyNightOut && nightOutStatus.isNightOut) {
      // Debug logging and update current data
      if (logging) console.log(`🌙 [NightOut] Still out - Distance: ${(distanceFromHome * 1000).toFixed(0)}m, Time: ${new Date().toLocaleTimeString()}`);
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
    if (logging) console.log("🟢 [Effect] NightOutTracker mounted");
    mountedRef.current = true;

    if (!homeLocation) {
      if (logging) console.warn("⚠️ [NightOut] No home location set, tracker disabled");
      return;
    }

    if (logging) {
      console.log("⚙️ [NightOut] Starting night out tracking...");
      console.log(`🏠 [NightOut] Home location: ${homeLocation.address}`);
      console.log(`📏 [NightOut] Distance threshold: ${(distanceThreshold * 1000).toFixed(0)}m`);
      console.log(`🌙 [NightOut] Night time starts at: ${nightTimeStart}:00`);
    }

    // Check immediately
    checkNightOutStatus();

    // Setup interval for periodic checks
    if (logging) console.log(`⏱️ [NightOut] Setting check interval: ${timeBetweenCheck}ms`);
    intervalRef.current = setInterval(() => {
      if (logging) console.log("🕒 [NightOut] Interval check triggered");
      checkNightOutStatus();
    }, timeBetweenCheck);

    return () => {
      if (logging) console.log("🧹 [Cleanup] Cleaning up NightOutTracker...");
      mountedRef.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if (logging) console.log("🛑 [Cleanup] Cleared night out check interval");
      }

      // Reset night out status on cleanup
      setNightOutStatus({
        isNightOut: false,
        lastDetectedTime: null,
        distanceFromHome: null,
        currentLocation: null,
      });
    };
  }, [homeLocation, logging]); // Re-run when home location or logging changes

  return null;
}

export default NightOutTracker;