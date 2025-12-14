import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Award, Users, MessageCircle, AlertCircle, CheckCircle2, Leaf, ClipboardList, Bell, User, Home, MapPin, Lightbulb, RefreshCw, Compass, Navigation, Gauge, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import OceanPersonalityCard from "@/components/app-components/commons/OceanPersonalityCard";
import NightOutCard from "@/components/app-components/page-components/home/NightOutCard";
import Logo from "@/components/app-components/page-components/login/Logo";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import { useDailyMoving } from "@/hooks/metric/useDailyMoving";
import { useOcean } from "@/hooks/v1/useOcean";
import { toast } from "sonner";
import { MetricFeedbackCard } from "./MetricsPage";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/store/notificationStore";
import { getDistanceToday } from "@/apis/backend/v2/location";


export const APP_HEADER_HEIGHT = 64 + (typeof window !== 'undefined' && window.CSS && CSS.supports('top: env(safe-area-inset-top)') ? 0 : 16);

const features = [
  {
    to: "/plant-scan-history",
    icon: (
      <svg
        className="w-8 h-8 text-greenery-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M8 12c1.5-2 6.5-2 8 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Tỷ lệ thực vật",
    desc: "Phân tích tỉ lệ thực vật trong món ăn từ ảnh.",
  },
  {
    to: "/invoice-history",
    icon: (
      <svg
        className="w-8 h-8 text-greenery-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
    title: "Invoice History",
    desc: "Show all your scanned invoices.",
  },
  {
    to: "/survey-list",
    icon: <ClipboardList className="w-8 h-8 text-greenery-600" />,
    title: "Surveys",
    desc: "Browse and take available surveys to personalize your experience.",
  },
  {
    to: "/quiz",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Personality Quiz",
    desc: "Discover your unique personality traits and get personalized insights.",
  },
  {
    to: "/todo",
    icon: <CheckCircle2 className="w-8 h-8 text-greenery-600" />,
    title: "Todo",
    desc: "Manage your tasks and subtasks.",
  },
  {
    to: "/register",
    icon: <Users className="w-8 h-8 text-greenery-600" />,
    title: "Register",
    desc: "Create a new account.",
  },
  {
    to: "/home",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Home",
    desc: "Go to the home dashboard.",
  },
  {
    to: "/onboarding",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Onboarding",
    desc: "Complete your onboarding steps.",
  },
  {
    to: "/onboarding-quiz",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Onboarding Survey",
    desc: "Take our comprehensive onboarding survey to personalize your experience.",
  },
  {
    to: "/advice",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Advice",
    desc: "Get advice and tips.",
  },
  {
    to: "/goals",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "My Goals",
    desc: "Set, track, and achieve your personal growth goals.",
  },
  {
    to: "/community",
    icon: <Users className="w-8 h-8 text-greenery-600" />,
    title: "Community",
    desc: "Connect, share, and grow with like-minded people.",
  },
  {
    to: "/chat",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Chat",
    desc: "Get advice and support from our smart assistant.",
  },
  {
    to: "/metrics",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Metrics & Feedback",
    desc: "View all metric feedbacks and update.",
  },
  {
    to: "/feedback",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Feedback",
    desc: "Send us your feedback.",
  },
  {
    to: "/impact",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Impact",
    desc: "See your impact stats.",
  },
  {
    to: "/profile",
    icon: <Users className="w-8 h-8 text-greenery-600" />,
    title: "Profile",
    desc: "View and edit your profile.",
  },
  {
    to: "/recommendations",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Recommendations",
    desc: "See personalized recommendations.",
  },
  {
    to: "/tracking",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Tracking",
    desc: "Track your progress.",
  },
];

export function HomeAppHeader() {
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());

  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 bg-greenery-50 shadow-sm fixed top-0 left-0 z-30"
      style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}
    >
      <div className="flex items-center gap-2">
        <Logo size={32} />
        <span className="text-xl font-bold text-greenery-700">GreenMind</span>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="w-6 h-6 text-greenery-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs font-bold items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-6 h-6 text-greenery-700" />
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function HomeBottomNav() {
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());

  return (
    <div className="sticky bottom-0 left-0 z-50 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div
        className="grid max-w-lg mx-auto grid-cols-5 font-medium"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Link
          to="/home"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/survey-list"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <ClipboardList className="w-6 h-6 mb-1" />
          <span className="text-xs">Surveys</span>
        </Link>

        <Link
          to="/todo"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group relative"
        >
          <div className="relative">
            <ListTodo className="w-6 h-6 mb-1" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </div>
          <span className="text-xs">Todos</span>
        </Link>

        <Link
          to="/notifications"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group relative"
        >
          <div className="relative">
            <Bell className="w-6 h-6 mb-1" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </div>
          <span className="text-xs">Notify</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  )
}

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

export function CurrentLocationCard() {
  const { currentPosition, isTracking, lastUpdate, error } = useGeolocationStore();
  const { answers } = usePreAppSurveyStore();
  const mapRef = useRef<L.Map | null>(null);
  const address = useGeolocationStore((s) => s.currentPositionDisplayName);
  const [todayDistanceKm, setTodayDistanceKm] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const movingFeedback = useMetricFeedbackStore((s) => s.getFeedback("daily_moving"));

  const formatCoordinate = (coord: number) => coord.toFixed(6);
  const formatAccuracy = (accuracy?: number) => accuracy ? `${Math.round(accuracy)}m` : "N/A";
  const formatSpeed = (speed?: number | null) => speed ? `${(speed * 3.6).toFixed(1)} km/h` : "N/A";
  const formatAltitude = (altitude?: number | null) => altitude ? `${Math.round(altitude)}m` : "N/A";

  // Load distance data on component mount
  useEffect(() => {
    const loadTodayDistance = async () => {
      const distanceTodayData = await getDistanceToday();
      setTodayDistanceKm(distanceTodayData?.data.total_distance ?? 0);
    };

    loadTodayDistance();
  }, [currentPosition]);

  // Update OCEAN scores using daily distance
  const { callDailyMoving, loading: updatingOcean } = useDailyMoving();
  const { fetchOcean } = useOcean();

  const updateOceanWithDistance = async () => {
    if (!answers) {
      toast.error("Missing survey data");
      return;
    }

    try {
      // Get latest distance from backend
      const latestDistanceData = await getDistanceToday();
      const latestDistance = latestDistanceData?.data.total_distance ?? 0;
      setTodayDistanceKm(latestDistance);

      const baseAvgDistance = parseFloat(answers.daily_distance_km) || 5; // Default 5km if not available

      await callDailyMoving(latestDistance, baseAvgDistance);
      await fetchOcean();

    } catch (error) {
      console.error("Failed to update OCEAN scores:", error);
      // Silently ignore API errors as requested
    }
  };
  // Distance to previous location (meters)
  // Use value from store
  const lengthToPreviousLocation = useGeolocationStore((s) => s.lengthToPreviousLocation);

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
              variant="ghost"
              size="sm"
              onClick={() => setShowFeedback(!showFeedback)}
              className="h-8 px-2"
            >
              <Lightbulb className="w-4 h-4 text-yellow-500" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={updateOceanWithDistance}
              className="h-8"
            >
              <RefreshCw className={`w-4 h-4 ${updatingOcean ? 'animate-spin' : ''}`} />
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

        {/* Feedback Section */}
        {showFeedback && (
          <div className="mb-4">
            {movingFeedback ? (
              <MetricFeedbackCard feedback={movingFeedback} />
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 text-center">Feedback unavailable</p>
                <p className="text-xs text-gray-400 text-center mt-1">Update OCEAN to see feedback</p>
              </div>
            )}
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
            {lengthToPreviousLocation !== null && lengthToPreviousLocation !== undefined && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Distance to Previous</span>
                  <span className="text-sm text-blue-700 font-mono">{(lengthToPreviousLocation * 1000).toFixed(2)} m</span>
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

export default function HomePage() {
  return (
    <SafeAreaLayout
      className="bg-gradient-to-br from-greenery-50 to-greenery-100"
      header={<HomeAppHeader />}
      footer={<HomeBottomNav />}
    >
      <div className="w-full max-w-md mx-auto pt-10 pb-6 px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-greenery-500 flex items-center justify-center shadow-md mb-3">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-greenery-700 mb-1 tracking-tight text-center drop-shadow-sm">
            Green Mind
          </h1>
          <p className="text-greenery-600 text-center">
            Your journey to a greener, more mindful life starts here.
          </p>
        </div>

        <OceanPersonalityCard />

        <div className="mb-4">
          <CurrentLocationCard />
        </div>

        <div className="mb-6">
          <NightOutCard />
        </div>

        {/* Onboarding Quiz Status */}
        <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1">
                Hoàn thành khảo sát onboarding
              </h3>
              <p className="text-sm text-blue-600 mb-3">
                Để GreenMind hiểu rõ hơn về bạn và đưa ra những gợi ý phù hợp nhất.
              </p>
              <Link to="/onboarding-quiz">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Bắt đầu khảo sát
                </button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          {features.map((f) => (
            <Link to={f.to} key={f.title} className="block group">
              <Card className="flex flex-row items-center gap-4 rounded-2xl shadow-lg p-5 bg-white/95 hover:bg-greenery-50 transition-all border border-greenery-100 group-hover:scale-[1.025]">
                <div className="flex-shrink-0">{f.icon}</div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-greenery-700 text-lg mb-1 truncate group-hover:text-greenery-600 transition-colors">
                    {f.title}
                  </span>
                  <span className="text-xs text-greenery-500 leading-tight truncate">
                    {f.desc}
                  </span>
                </div>
                <span className="ml-auto text-greenery-400 text-xl font-bold group-hover:text-greenery-600 transition-colors">
                  ›
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SafeAreaLayout>
  );
}
