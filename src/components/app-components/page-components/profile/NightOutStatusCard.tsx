import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Home, Clock, MapPin } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export default function NightOutStatusCard() {
  const nightOutStatus = useAppStore((state) => state.nightOutStatus);

  const formatDistance = (distance: number | null) => {
    if (!distance) return "N/A";
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(2)}km`;
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const formatLocation = (location: { latitude: number; longitude: number } | null) => {
    if (!location) return "N/A";
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center space-x-2">
          <Moon className="w-4 h-4 text-blue-600" />
          <span>Night Out Status</span>
        </CardTitle>
        <Badge 
          variant={nightOutStatus.isNightOut ? "destructive" : "secondary"}
          className={nightOutStatus.isNightOut ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"}
        >
          {nightOutStatus.isNightOut ? "Out" : "Home"}
        </Badge>
      </CardHeader>
      <CardContent>
        {nightOutStatus.isNightOut ? (
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Started</p>
                <p className="text-xs text-gray-500">
                  {formatTime(nightOutStatus.lastDetectedTime)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Home className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Distance from home</p>
                <p className="text-xs text-gray-500">
                  {formatDistance(nightOutStatus.distanceFromHome)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Current location</p>
                <p className="text-xs text-gray-500 font-mono">
                  {formatLocation(nightOutStatus.currentLocation)}
                </p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-700 text-center">
                🌙 You're currently out during night time
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-green-500" />
              <p className="text-sm text-gray-600">You're currently at home or it's day time</p>
            </div>
            
            {nightOutStatus.lastDetectedTime && (
              <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Last night out:</span>{" "}
                  {formatTime(nightOutStatus.lastDetectedTime)}
                </p>
              </div>
            )}
          </div>
        )}
        {/* Luôn hiển thị thời gian kiểm tra gần nhất */}
        <div className="mt-2 text-xs text-gray-400 text-right">
          Last check: {formatTime(nightOutStatus.lastCheckTime || null)}
        </div>
      </CardContent>
    </Card>
  );
}