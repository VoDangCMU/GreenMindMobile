import { useGeolocationStore } from "@/store/geolocationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Compass, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CurrentLocationCard() {
  const { currentPosition, isTracking, lastUpdate, error } = useGeolocationStore();

  const formatCoordinate = (coord: number) => coord.toFixed(6);
  const formatAccuracy = (accuracy?: number) => accuracy ? `${Math.round(accuracy)}m` : "N/A";
  const formatSpeed = (speed?: number | null) => speed ? `${(speed * 3.6).toFixed(1)} km/h` : "N/A";
  const formatAltitude = (altitude?: number | null) => altitude ? `${Math.round(altitude)}m` : "N/A";

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
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-greenery-600" />
            <span>Location Data</span>
          </CardTitle>
          <Badge variant={isTracking ? "default" : "outline"}>
            {isTracking ? "Tracking" : "Stopped"}
          </Badge>
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
            {/* Coordinates Section */}
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

            {/* Accuracy & Speed Section */}
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

            {/* Altitude Section */}
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

            {/* Timestamp Section */}
            {lastUpdate && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
