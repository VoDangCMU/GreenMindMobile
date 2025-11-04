import { Toaster } from "sonner";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppStore } from "./store/appStore";
import { useGeolocationStore } from "./store/geolocationStore";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import OnboardingPage from "./pages/OnboardingPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AdvicePage from "./pages/AdvicePage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import FeedbackPage from "./pages/FeedbackPage.tsx";
import GoalsPage from "./pages/GoalsPage.tsx";
import ImpactPage from "./pages/ImpactPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import QuizPage from "./pages/QuizPage.tsx";
import RecomendationPage from "./pages/RecomendationPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import TrackingPage from "./pages/TrackingPage.tsx";
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage.tsx";
import AuthGate from "./components/app-components/AuthGate.tsx";
import AnimatedLayout from "./components/layouts/AnimatedLayout.tsx";
import { getProfile } from "./apis/profile.ts";
import { getCurrentPosition, isGeolocationAvailable } from "./helpers/geolocationHelper";

const router = createHashRouter([
  {
    element: <AnimatedLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <AuthGate />,
        children: [
          { path: "/onboarding", element: <OnboardingPage /> },
          { path: "/home", element: <HomePage /> },
          { path: "/advice", element: <AdvicePage /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/community", element: <CommunityPage /> },
          { path: "/feedback", element: <FeedbackPage /> },
          { path: "/goals", element: <GoalsPage /> },
          { path: "/impact", element: <ImpactPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/quiz", element: <QuizPage /> },
          { path: "/recommendations", element: <RecomendationPage /> },
          { path: "/tracking", element: <TrackingPage /> },
          { path: "/invoice-history", element: <InvoiceHistoryPage /> },
        ],
      },
    ],
  },
]);

function AuthStateInitializer() {
  useEffect(() => {
    const initializer = async () => {
      const state = useAppStore.getState();

      try {
        const data = await getProfile(state.access_token || "");

        useAppStore.getState().setAuth({
          access_token: state.access_token || "",
          refresh_token: state.refresh_token || "",
          user: data,
        });
      } catch (error) {
        console.error("Failed to get profile:", error);

        useAppStore.getState().setAuth({
          access_token: "",
          refresh_token: "",
          user: null,
        });
      }

      if (state.user) {
        console.log("Token alive", JSON.stringify(state));
        toast.success(`Welcome back, ${state.user.fullName}!`);
      }
    }

    initializer();
  }, []);
  return null;
}

function GeolocationTracker() {
  const { setPosition, setError, setTracking } = useGeolocationStore();

  useEffect(() => {
    const startTracking = async () => {
      // Kiểm tra xem geolocation có khả dụng không
      if (!isGeolocationAvailable()) {
        console.warn("Geolocation is not available on this device");
        return;
      }

      setTracking(true);

      const updatePosition = async () => {
        try {
          const position = await getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
          });
          setPosition(position);
          console.log("Position updated:", position);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown geolocation error";
          setError(errorMessage);
          console.error("Failed to get position:", errorMessage);
          toast.error(`Location error: ${errorMessage}`);
        }
      };

      // Cập nhật vị trí ngay lập tức
      await updatePosition();

      // Thiết lập interval để cập nhật mỗi 2 phút (120000ms)
      const intervalId = setInterval(updatePosition, 120000);

      // Cleanup function
      return () => {
        clearInterval(intervalId);
        setTracking(false);
      };
    };

    const cleanup = startTracking();

    // Cleanup khi component unmount
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [setPosition, setError, setTracking]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthStateInitializer />
    <GeolocationTracker />
    <Toaster position="top-center" richColors closeButton />
    <RouterProvider router={router} />
  </StrictMode>
);
