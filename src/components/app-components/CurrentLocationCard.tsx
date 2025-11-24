import { useEffect, useRef, useState } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Compass, Gauge, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "@/apis/nominatim/reverseGeocode";
import daily_distance_km, { type IDailyDistanceKm } from "@/apis/ai/monitor_ocean/daily_distance_km";
import { getAllUserLocation } from "@/apis/backend/location";
import { updateUserOcean } from "@/apis/backend/ocean";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
}

function SetMapRef({ setRef }: { setRef: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    setRef(map);
  }, [map, setRef]);
  return null;
}

export default function CurrentLocationCard() {
  const { currentPosition, isTracking, lastUpdate, error, positionHistory } = useGeolocationStore();
  const { ocean, setOcean } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const { answers } = usePreAppSurveyStore();
  const mapRef = useRef<L.Map | null>(null);
  const address = useGeolocationStore((s) => s.currentPositionDisplayName);
  const [updatingOcean, setUpdatingOcean] = useState(false);
  const [todayDistanceKm, setTodayDistanceKm] = useState<number>(0);

  const formatCoordinate = (coord: number) => coord.toFixed(6);
  const formatAccuracy = (accuracy?: number) => accuracy ? `${Math.round(accuracy)}m` : "N/A";
  const formatSpeed = (speed?: number | null) => speed ? `${(speed * 3.6).toFixed(1)} km/h` : "N/A";
  const formatAltitude = (altitude?: number | null) => altitude ? `${Math.round(altitude)}m` : "N/A";

  // Fetch today's distance from backend API
  const fetchTodayDistanceFromBackend = async (): Promise<number> => {
    try {
      const response = await getAllUserLocation();
      const locations = response.data.data;

      if (!locations || locations.length === 0) return 0;

      // Filter locations from today only
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();

      const todayLocations = locations.filter(location => {
        const locationDate = new Date(location.createdAt).getTime();
        return locationDate >= todayTimestamp;
      });

      // Sum up the lengthToPreviousLocation for today's movements
      let totalDistance = 0;
      todayLocations.forEach(location => {
        if (location.lengthToPreviousLocation && location.lengthToPreviousLocation > 0) {
          totalDistance += location.lengthToPreviousLocation;
        }
      });

      // Convert meters to kilometers
      return totalDistance / 1000;
    } catch (error) {
      console.error("Failed to fetch backend locations:", error);
      return 0;
    }
  };

  // Load distance data on component mount
  useEffect(() => {
    const loadTodayDistance = async () => {
      const distance = await fetchTodayDistanceFromBackend();
      setTodayDistanceKm(distance);
    };

    loadTodayDistance();
    // Refresh every 30 seconds
    const interval = setInterval(loadTodayDistance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update OCEAN scores using daily distance
  const updateOceanWithDistance = async () => {
    if (!ocean || !answers) {
      toast.error("Missing OCEAN scores or survey data");
      return;
    }

    setUpdatingOcean(true);
    try {
      // Get latest distance from backend
      const latestDistance = await fetchTodayDistanceFromBackend();
      setTodayDistanceKm(latestDistance);

      const baseAvgDistance = parseFloat(answers.daily_distance_km) || 5; // Default 5km if not available

      const payload: IDailyDistanceKm = {
        distance_today: latestDistance,
        base_avg_distance: baseAvgDistance,
        weight: 0.2, // Default weight
        direction: "up", // Assume positive direction
        sigma_r: 1.0, // Default sigma
        alpha: 0.5, // Default alpha
        ocean_score: {
          O: ocean.O / 100,
          C: ocean.C / 100,
          E: ocean.E / 100,
          A: ocean.A / 100,
          N: ocean.N / 100,
        },
      };

      const response = await daily_distance_km(payload);

      // Prepare new OCEAN scores
      const newOceanScores = {
        O: response.new_ocean_score.O,
        C: response.new_ocean_score.C,
        E: response.new_ocean_score.E,
        A: response.new_ocean_score.A,
        N: response.new_ocean_score.N,
      };

      // Update OCEAN scores in the store
      setOcean(newOceanScores);

      // Update OCEAN scores in the backend
      if (user?.id) {
        try {
          await updateUserOcean(user.id, newOceanScores);
        } catch (backendError) {
          console.error("Failed to update OCEAN scores in backend:", backendError);
          // Continue anyway, as the store is already updated
        }
      }

      toast.success("OCEAN scores updated successfully!");
    } catch (error) {
      console.error("Failed to update OCEAN scores:", error);
      // Silently ignore API errors as requested
    } finally {
      setUpdatingOcean(false);
    }
  };
  // Distance to previous location (meters)
  let lengthToPreviousLocation: number | null = null;
  if (positionHistory && positionHistory.length > 1) {
    const prev = positionHistory[1];
    const curr = positionHistory[0];
    if (prev && curr) {
      const dLat = curr.latitude - prev.latitude;
      const dLon = curr.longitude - prev.longitude;
      // Use helper if needed, but GeolocationTracker already calculates and sends this
      // For display, use the value from GeolocationTracker if available in backend, but here we recalc for UI
      // For now, just show the straight-line distance
      const R = 6371000; // meters
      const toRad = (deg: number) => deg * Math.PI / 180;
      const a = Math.sin(toRad(dLat) / 2) * Math.sin(toRad(dLat) / 2) +
        Math.cos(toRad(prev.latitude)) * Math.cos(toRad(curr.latitude)) *
        Math.sin(toRad(dLon) / 2) * Math.sin(toRad(dLon) / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      lengthToPreviousLocation = R * c;
    }
  }

  if (!currentPosition && !error) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-greenery-600" />
            <span>Location Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            <p className="text-sm">Chưa có dữ liệu vị trí</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-greenery-600" />
            <span>Location Data</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={updateOceanWithDistance}
              className="h-8"
            >
              <RefreshCw className={`w-4 h-4 ${updatingOcean ? 'animate-spin' : ''}`} />
              <span className="ml-1">Update OCEAN</span>
            </Button>
            <Badge variant={isTracking ? "default" : "outline"}>
              {isTracking ? "Tracking" : "Stopped"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {currentPosition && (
          <>
            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-600">Latitude</span>
                <span className="text-sm font-mono text-blue-700">
                  {formatCoordinate(currentPosition.latitude)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-600">Longitude</span>
                <span className="text-sm font-mono text-blue-700">
                  {formatCoordinate(currentPosition.longitude)}
                </span>
              </div>
            </div>
            {/* Reverse Geocode Address */}
            <div className="pt-2">
              <span className="text-xs font-medium text-gray-600">Địa chỉ</span>
              <span className="block text-sm text-greenery-700 min-h-[20px]">
                {address || "Không lấy được địa chỉ"}
              </span>
            </div>
            {/* Distance to Previous Location */}
            {lengthToPreviousLocation !== null && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-600">Distance to Previous Location</span>
                  <span className="text-sm text-blue-700 font-mono">{lengthToPreviousLocation.toFixed(1)} m</span>
                </div>
              </div>
            )}
            {/* Today's Total Distance */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600">Today's Distance</span>
                <span className="text-sm text-green-700 font-mono">{todayDistanceKm.toFixed(2)} km</span>
              </div>
            </div>
            {/* Accuracy & Speed */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-600">Accuracy</span>
                  <span className="text-sm text-orange-700">{formatAccuracy(currentPosition.accuracy)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-600">Speed</span>
                  <span className="text-sm text-green-700">{formatSpeed(currentPosition.speed)}</span>
                </div>
              </div>
            </div>
            {/* Altitude */}
            {currentPosition.altitude !== null && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-purple-500" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">Altitude</span>
                    <span className="text-sm text-purple-700">{formatAltitude(currentPosition.altitude)}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Timestamp */}
            {lastUpdate && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            )}
            {/* Map Section */}
            <div className="h-60 rounded-lg overflow-hidden border border-gray-200 mt-3">
              <MapContainer
                center={[currentPosition.latitude, currentPosition.longitude]}
                zoom={16}
                scrollWheelZoom={false}
                className="h-full w-full z-0 [&_.leaflet-control-zoom]:hidden"
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <Marker
                  position={[currentPosition.latitude, currentPosition.longitude]}
                  icon={markerIcon}
                >
                  <Popup>Bạn đang ở đây</Popup>
                </Marker>
                <RecenterMap
                  lat={currentPosition.latitude}
                  lng={currentPosition.longitude}
                />
                <SetMapRef setRef={(map) => (mapRef.current = map)} />
              </MapContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
