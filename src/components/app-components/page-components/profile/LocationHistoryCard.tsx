import { useGeolocationStore } from "@/store/geolocationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocationHistoryCard() {
  const { positionHistory, clearHistory } = useGeolocationStore();

  const formatCoordinate = (coord: number) => coord.toFixed(6);
  const formatAccuracy = (accuracy?: number) => accuracy ? `${Math.round(accuracy)}m` : "N/A";
  const formatSpeed = (speed?: number | null) => speed ? `${(speed * 3.6).toFixed(1)} km/h` : "N/A";

  if (positionHistory.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>Lịch sử vị trí ({positionHistory.length})</span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearHistory}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {positionHistory.map((position, index) => (
            <div
              key={`${position.timestamp}-${index}`}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  #{positionHistory.length - index}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(position.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-gray-600">Lat</span>
                  <p className="text-xs font-mono text-blue-700">
                    {formatCoordinate(position.latitude)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Lng</span>
                  <p className="text-xs font-mono text-blue-700">
                    {formatCoordinate(position.longitude)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Accuracy</span>
                  <p className="text-xs text-orange-700">
                    {formatAccuracy(position.accuracy)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Speed</span>
                  <p className="text-xs text-green-700">
                    {formatSpeed(position.speed)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
