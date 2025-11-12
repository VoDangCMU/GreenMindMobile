import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useAppStore } from "./store/appStore";
import { getProfile } from "./apis/backend/profile.ts";

// Components
import AuthGate from "./components/app-components/AuthGate.tsx";
// import AnimatedLayout from "./components/layouts/AnimatedLayout.tsx";
import GeolocationTracker from "./components/background-worker/GeolocationTracker.tsx";
import NightOutTracker from "./components/background-worker/NightOutTracker.tsx";
import { AppStateInitializer } from "./components/background-worker/AppStateInitializer.tsx";

// Pages (import trực tiếp tất cả)
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import OnboardingQuizPage from "./pages/OnboardingQuizPage";
import HomePage from "./pages/HomePage";
import AdvicePage from "./pages/AdvicePage";
import ChatPage from "./pages/ChatPage";
import CommunityPage from "./pages/CommunityPage";
import FeedbackPage from "./pages/FeedbackPage";
import GoalsPage from "./pages/GoalsPage";
import ImpactPage from "./pages/ImpactPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import RecomendationPage from "./pages/RecomendationPage";
import TrackingPage from "./pages/TrackingPage";
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage";
import TodoPage from "./pages/TodoPage";
import PlantScanHistoryPage from "./pages/PlantScanPage";

// -----------------
// Auth initializer
// -----------------
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
      } catch {
        useAppStore.getState().setAuth({ access_token: "", refresh_token: "", user: null });
      }

      if (state.user) {
        toast.success(`Welcome back, ${state.user.full_name}!`);
      }
    };

    initializer();
  }, []);

  return null;
}

// -----------------
// Router
// -----------------
const router = createHashRouter([
  {
    // element: <AnimatedLayout />,
    element: null,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <AuthGate />,
        children: [
          { path: "/onboarding", element: <OnboardingPage /> },
          { path: "/onboarding-quiz", element: <OnboardingQuizPage /> },
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
          { path: "/todo", element: <TodoPage /> },
          { path: "/plant-scan-history", element: <PlantScanHistoryPage /> },
        ],
      },
    ],
  },
]);

// -----------------
// Render
// -----------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthStateInitializer />
    <AppStateInitializer />
    <GeolocationTracker logging={true}/>
    <NightOutTracker timeBetweenCheck={10000}  testMode={true}/>
    <Toaster position="top-center" richColors closeButton />
    <RouterProvider router={router} />
  </StrictMode>
);
