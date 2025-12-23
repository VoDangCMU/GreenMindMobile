import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, AlertCircle, CheckCircle2, ClipboardList, Bell, User, Home, MapPin, Lightbulb, RefreshCw, Wand, ListTodo, Camera, FileText, X, Bus, Trees, Coffee, ShoppingBag, Book, Dumbbell, Brain } from "lucide-react";
import { createCheckin } from "@/apis/backend/v2/checkin";
import { Link, useNavigate } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";


import { Button } from "@/components/ui/button";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { useGeolocationStore } from "@/store/geolocationStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import { useDailyMoving } from "@/hooks/metric/useDailyMoving";
import { useOcean } from "@/hooks/v1/useOcean";
// import { toast } from "sonner";
import { useToast } from "@/hooks/useToast";
import { MetricFeedbackCard } from "./MetricsPage";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/store/notificationStore";
import { getDistanceToday } from "@/apis/backend/v2/location";
import { useLocationStore } from "@/store/v2/locationStore";
import { useAppStore } from "@/store/appStore";
import OceanChart from "@/components/hardcore-coder/OceanChart";
import { useAuthStore } from "@/store/authStore";
// import NightOutCard from "@/components/app-components/page-components/home/NightOutCard";


export const APP_HEADER_HEIGHT = 64 + (typeof window !== 'undefined' && window.CSS && CSS.supports('top: env(safe-area-inset-top)') ? 0 : 16);

const features = [
  {
    to: "/guide",
    icon: <Lightbulb className="w-5 h-5 text-greenery-600" />,
    title: "Guide",
    desc: "Quick start guide for new users.",
  },
  {
    to: "/plant-scan-history",
    icon: (
      <svg
        className="w-5 h-5 text-greenery-600"
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
    title: "Plant Ratio",
    desc: "Analyze plant ratio in your dish.",
  },
  {
    to: "/invoice-history",
    icon: (
      <svg
        className="w-5 h-5 text-greenery-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
    title: "Invoices",
    desc: "Show all your scanned invoices.",
  },
  {
    to: "/survey-list",
    icon: <ClipboardList className="w-6 h-6 text-greenery-600" />,
    title: "Surveys",
    desc: "Take surveys to find your type.",
  },
  // {
  //   to: "/quiz",
  //   icon: <Target className="w-5 h-5 text-greenery-600" />,
  //   title: "Personality Quiz",
  //   desc: "Discover your unique personality traits and get personalized insights.",
  // },
  {
    to: "/todo",
    icon: <CheckCircle2 className="w-5 h-5 text-greenery-600" />,
    title: "Todo",
    desc: "Manage your tasks.",
  },
  // {
  //   to: "/register",
  //   icon: <Users className="w-5 h-5 text-greenery-600" />,
  //   title: "Register",
  //   desc: "Create a new account.",
  // },
  // {
  //   to: "/home",
  //   icon: <Target className="w-5 h-5 text-greenery-600" />,
  //   title: "Home",
  //   desc: "Go to the home dashboard.",
  // },
  // {
  //   to: "/onboarding",
  //   icon: <Award className="w-5 h-5 text-greenery-600" />,
  //   title: "Onboarding",
  //   desc: "Complete your onboarding steps.",
  // },
  // {
  //   to: "/onboarding-quiz",
  //   icon: <Target className="w-5 h-5 text-greenery-600" />,
  //   title: "Onboarding Survey",
  //   desc: "Take our comprehensive onboarding survey to personalize your experience.",
  // },
  // {
  //   to: "/advice",
  //   icon: <MessageCircle className="w-5 h-5 text-greenery-600" />,
  //   title: "Advice",
  //   desc: "Get advice and tips.",
  // },
  // {
  //   to: "/goals",
  //   icon: <Award className="w-5 h-5 text-greenery-600" />,
  //   title: "My Goals",
  //   desc: "Set, track, and achieve your personal growth goals.",
  // },
  // {
  //   to: "/community",
  //   icon: <Users className="w-5 h-5 text-greenery-600" />,
  //   title: "Community",
  //   desc: "Connect, share, and grow with like-minded people.",
  // },
  // {
  //   to: "/chat",
  //   icon: <MessageCircle className="w-5 h-5 text-greenery-600" />,
  //   title: "Chat",
  //   desc: "Get advice and support from our smart assistant.",
  // },
  {
    to: "/metrics",
    icon: <Award className="w-5 h-5 text-greenery-600" />,
    title: "Feedback",
    desc: "View all metric feedbacks.",
  },
  // {
  //   to: "/feedback",
  //   icon: <MessageCircle className="w-5 h-5 text-greenery-600" />,
  //   title: "Feedback",
  //   desc: "Send us your feedback.",
  // },
  // {
  //   to: "/impact",
  //   icon: <Award className="w-5 h-5 text-greenery-600" />,
  //   title: "Impact",
  //   desc: "See your impact stats.",
  // },
  // {
  //   to: "/profile",
  //   icon: <Users className="w-5 h-5 text-greenery-600" />,
  //   title: "Profile",
  //   desc: "View and edit your profile.",
  // },
  // {
  //   to: "/recommendations",
  //   icon: <Award className="w-5 h-5 text-greenery-600" />,
  //   title: "Recommendations",
  //   desc: "See personalized recommendations.",
  // },
  // {
  //   to: "/tracking",
  //   icon: <MessageCircle className="w-5 h-5 text-greenery-600" />,
  //   title: "Tracking",
  //   desc: "Track your progress.",
  // },
];

export function HomeAppHeader() {
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());
  const user = useAuthStore((s) => s.user);

  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 bg-greenery-50 shadow-sm fixed top-0 left-0 z-30"
      style={{ paddingTop: 'env(safe-area-inset-top, 24px)' }}
    >
      <div className="flex flex-col">
        <span className="text-xl font-bold text-greenery-900 leading-tight">Welcome back</span>
        <span className="text-sm text-greenery-700 font-medium">{user?.full_name || 'Friend'}</span>
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

export function AppBottomNavBar() {
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
  const { isTracking, error } = useGeolocationStore();
  const lastCalculatedLocation = useLocationStore(s => s.lastCalculatedlocation);
  const { answers } = usePreAppSurveyStore();
  const mapRef = useRef<L.Map | null>(null);
  const [todayDistanceKm, setTodayDistanceKm] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const movingFeedback = useMetricFeedbackStore((s) => s.getFeedback("daily_moving"));
  const toast = useToast();


  // Load distance data on component mount
  useEffect(() => {
    const loadTodayDistance = async () => {
      try {
        const distanceTodayData = await getDistanceToday();
        setTodayDistanceKm(distanceTodayData?.data.total_distance ?? 0);
      } catch (error) {
        console.error("Error loading today's distance:", error);
        setTodayDistanceKm(0);
      }
    };

    loadTodayDistance();
  }, [lastCalculatedLocation]);

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

      try {
        await callDailyMoving(latestDistance, baseAvgDistance);
      } catch (error) {
        console.error("Error calling dailyMoving API:", error);
      }

      try {
        await fetchOcean();
      } catch (error) {
        console.error("Error fetching OCEAN scores:", error);
      }

    } catch (error) {
      console.error("Failed to update OCEAN scores:", error);
      toast.error("Không thể cập nhật OCEAN scores");
    }
  };
  // Distance to previous location (meters)
  // Use value from store
  const lengthToPreviousLocation = useGeolocationStore((s) => s.lengthToPreviousLocation);

  if (!lastCalculatedLocation && !error) {
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
            <p className="text-sm">No location data available</p>
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

        {lastCalculatedLocation && (
          <>
            {/* Coordinates */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-600">Latitude</span>
                <span className="text-sm font-mono text-blue-700">
                  {formatCoordinate(lastCalculatedLocation.latitude)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-600">Longitude</span>
                <span className="text-sm font-mono text-blue-700">
                  {formatCoordinate(lastCalculatedLocation.longitude)}
                </span>
              </div>
            </div> */}
            {/* Reverse Geocode Address */}
            <div className="pt-2">
              <span className="text-xs font-medium text-gray-600">Address</span>
              <span className="block text-sm text-greenery-700 min-h-[20px]">
                {lastCalculatedLocation.name || "Unable to retrieve address"}
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
            {/* Timestamp */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last updated: {lastCalculatedLocation.issueAt?.toLocaleTimeString()}
              </p>
            </div>
            {/* Map Section */}
            <div className="h-60 rounded-lg overflow-hidden border border-gray-200 mt-3">
              <MapContainer
                center={[lastCalculatedLocation.latitude, lastCalculatedLocation.longitude]}
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
                  position={[lastCalculatedLocation.latitude, lastCalculatedLocation.longitude]}
                  icon={markerIcon}
                >
                  <Popup>You're here</Popup>
                </Marker>
                <RecenterMap
                  lat={lastCalculatedLocation.latitude}
                  lng={lastCalculatedLocation.longitude}
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
  const preAppSurveyAnswers = usePreAppSurveyStore((s) => s.answers);
  const navigate = useNavigate();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isQuickActionsMounted, setIsQuickActionsMounted] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const toast = useToast();

  // Check-in modal states
  const [isCheckInMounted, setIsCheckInMounted] = useState(false);
  const [checkInVisible, setCheckInVisible] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);



  useEffect(() => {
    if (showQuickActions) {
      setIsQuickActionsMounted(true);
      // allow next paint to apply transition
      requestAnimationFrame(() => setCardVisible(true));
    } else {
      setCardVisible(false);
      const t = setTimeout(() => setIsQuickActionsMounted(false), 220); // match transition duration
      return () => clearTimeout(t);
    }
  }, [showQuickActions]);
  const scores = useAppStore((s) => s.ocean);

  const handleScanBill = () => {
    setShowQuickActions(false);
    navigate('/invoice-history', { state: { startScan: true } });
  };

  const handleScanPlant = () => {
    setShowQuickActions(false);
    navigate('/plant-scan-history', { state: { startScan: true } });
  };

  const handleCheckin = () => {
    setShowQuickActions(false);
    // Open check-in modal with transition
    setIsCheckInMounted(true);
    requestAnimationFrame(() => setCheckInVisible(true));
  };

  const closeCheckIn = () => {
    setCheckInVisible(false);
    // unmount after animation
    setTimeout(() => setIsCheckInMounted(false), 220);
    // ensure no selection remains visible
    setSelectedCheckIn(null);
  };

  const checkInPlaces = [
    { id: 'bus_station', label: 'Bus Station', icon: <Bus className="w-6 h-6 text-greenery-600" /> },
    { id: 'park', label: 'Park', icon: <Trees className="w-6 h-6 text-greenery-600" /> },
    { id: 'restaurant', label: 'Restaurant', icon: <MapPin className="w-6 h-6 text-greenery-600" /> },
    { id: 'cafe', label: 'Cafe', icon: <Coffee className="w-6 h-6 text-greenery-600" /> },
    { id: 'mall', label: 'Shopping Mall', icon: <ShoppingBag className="w-6 h-6 text-greenery-600" /> },
    { id: 'museum', label: 'Museum', icon: <Book className="w-6 h-6 text-greenery-600" /> },
    { id: 'gym', label: 'Gym', icon: <Dumbbell className="w-6 h-6 text-greenery-600" /> },
    { id: 'library', label: 'Library', icon: <Book className="w-6 h-6 text-greenery-600" /> },
    { id: 'market', label: 'Market', icon: <ShoppingBag className="w-6 h-6 text-greenery-600" /> },
    { id: 'school', label: 'School', icon: <Home className="w-6 h-6 text-greenery-600" /> },
  ];

  // Prefer location from locationStore (updated by GeolocationTracker), fallback to geolocationStore, then 0
  const lastCalculatedLocation = useLocationStore((s) => s.lastCalculatedlocation);
  const currentLoc = useLocationStore((s) => s.currentLocation);
  const gpsPosition = useGeolocationStore((s) => s.currentPosition);

  const handleCheckInPlace = async (_id: string, label: string) => {
    // Close modal immediately (per UX requirement)
    closeCheckIn();

    // Prefer lastCalculatedLocation -> currentLoc -> gpsPosition -> fallback 0,0
    const latitude = lastCalculatedLocation?.latitude ?? currentLoc?.latitude ?? gpsPosition?.latitude ?? 0;
    const longitude = lastCalculatedLocation?.longitude ?? currentLoc?.longitude ?? gpsPosition?.longitude ?? 0;

    try {
      const payload = { location: label, coordinate: { latitude, longitude } };
      const res = await createCheckin(payload);
      // Broadcast new check-in so other pages (e.g., CheckinsPage) can update immediately
      try {
        if (res?.checkin) {
          window.dispatchEvent(new CustomEvent('checkin:created', { detail: res.checkin }));
        }
      } catch (e) {
        console.error('Failed to dispatch checkin:created event', e);
      }
      toast.success(res?.message ?? `Checked in to ${label}`);
    } catch (error) {
      console.error("createCheckin failed:", error);
      toast.error("Failed to create check-in");
    }
  };

  useEffect(() => {
    if (!showQuickActions) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowQuickActions(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showQuickActions]);

  useEffect(() => {
    if (!checkInVisible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setCheckInVisible(false); setTimeout(() => setIsCheckInMounted(false), 220); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [checkInVisible]);

  return (
    <SafeAreaLayout
      className="bg-gradient-to-br from-greenery-50 to-greenery-100"
      header={<HomeAppHeader />}
      footer={<AppBottomNavBar />}
    >
      <div className="w-full max-w-md mx-auto pt-20 pb-6 px-4">


        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-greenery-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <CardContent className="pt-5 pb-8 relative z-10">
            <div className="flex flex-col items-center mb-1">
              <div className="flex items-center gap-2 text-greenery-800 mb-1">
                <Brain className="w-5 h-5" />
                <h3 className="font-bold text-lg">Personality Profile</h3>
              </div>
              <p className="text-xs text-center text-greenery-700 max-w-[200px]">
                Visualize your unique trait composition
              </p>
            </div>

            <div className="flex justify-center -my-2">
              <OceanChart scores={scores || undefined} size="md" />
            </div>
          </CardContent>
        </Card>

        {!preAppSurveyAnswers &&
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">
                  Complete the onboarding survey
                </h3>
                <p className="text-sm text-blue-600 mb-3">
                  Help GreenMind understand you better and provide personalized suggestions.
                </p>
                <div className="flex gap-2">
                  <Link to="/onboarding-quiz">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Start Survey
                    </button>
                  </Link>
                  <Link to="/guide">
                    <Button variant="outline" size="sm" className="h-8">Quick Guide</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        }

        <div className="mb-4">
          <CurrentLocationCard />
        </div>

        {/* <div className="mb-6">
          <NightOutCard />
        </div> */}

        {/* Onboarding Quiz Status */}



        <div className="grid gap-2 grid-cols-2">
          {features.map((f) => (
            <Link to={f.to} key={f.title} className="block group">
              <Card className="flex flex-row items-center gap-4 rounded-2xl shadow-lg p-5 bg-white/95 hover:bg-greenery-50 transition-all border border-greenery-100 group-hover:scale-[1.025]">
                <div className="flex-shrink-0">{f.icon}</div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-greenery-800 text-xs mb-1 truncate group-hover:text-greenery-900 transition-colors">
                    {f.title}
                  </span>
                  <span className="text-[10px] text-greenery-600 leading-tight whitespace-normal break-words">
                    {f.desc}
                  </span>
                </div>
                <span className="ml-auto text-greenery-400 text-sm font-bold group-hover:text-greenery-600 transition-colors">
                  ›
                </span>
              </Card>
            </Link>
          ))}
        </div>

        {/* Floating Action Button (fixed above footer) */}
        <button
          aria-label="Quick actions"
          aria-expanded={showQuickActions}
          onClick={() => setShowQuickActions((s) => !s)}
          className="fixed right-4 z-40"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
        >
          <Button size="icon" className={`rounded-full shadow-lg bg-greenery-500 text-white hover:bg-greenery-600 h-12 w-12 flex items-center justify-center transform transition-all duration-200 ${showQuickActions ? 'rotate-0 scale-95' : 'rotate-6 scale-100'}`}>
            {showQuickActions ? <X className="w-5 h-5" /> : <Wand className="w-5 h-5" />}
          </Button>
        </button>

        {/* Quick Actions overlay & card */}
        {isQuickActionsMounted && (
          <>
            <div
              className={`fixed inset-0 z-30 bg-black/20 transition-opacity duration-200 ${cardVisible ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setShowQuickActions(false)}
              aria-hidden
            />

            <div
              className={`fixed right-4 z-40 w-64 bg-white rounded-xl shadow-lg p-3 transform transition-all duration-200 ${cardVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
              style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 136px)' }}
              role="dialog"
              aria-label="Quick actions"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Quick actions</div>
                <button className="p-1 rounded-md text-gray-500 hover:bg-gray-100" onClick={() => setShowQuickActions(false)} aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={handleScanBill} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <FileText className="w-5 h-5 text-greenery-600" />
                  <div className="flex-1 text-sm text-left">Scan bill</div>
                </button>

                <button onClick={handleScanPlant} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Camera className="w-5 h-5 text-greenery-600" />
                  <div className="flex-1 text-sm text-left">Scan plant</div>
                </button>

                <button onClick={handleCheckin} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <MapPin className="w-5 h-5 text-greenery-600" />
                  <div className="flex-1 text-sm text-left">Check-in</div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Check-in Modal (UI-only) */}
        {isCheckInMounted && (
          <>
            <div
              className={`fixed inset-0 z-30 bg-black/20 transition-opacity duration-200 ${checkInVisible ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => closeCheckIn()}
              aria-hidden
            />

            <div
              className={`fixed left-1/2 top-1/2 z-40 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-4 transform transition-all duration-200 ${checkInVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
              role="dialog"
              aria-label="Check-in"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">Check-in</div>
                <button onClick={() => closeCheckIn()} className="p-1 rounded-md text-gray-500 hover:bg-gray-100" aria-label="Close check-in">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {checkInPlaces.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleCheckInPlace(p.id, p.label)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg text-center min-h-[88px] hover:bg-gray-50 ${selectedCheckIn === p.id ? 'bg-greenery-50 border border-greenery-200' : 'bg-white'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCheckIn === p.id ? 'bg-greenery-100' : 'bg-gray-100'}`}>
                      {p.icon}
                    </div>
                    <div className="text-sm mt-1">{p.label}</div>
                    {selectedCheckIn === p.id && (
                      <div className="absolute translate-y-[-10px] translate-x-10">{/* decorative */}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}


      </div>
    </SafeAreaLayout>
  );
}
