import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import AuthGate from "./components/app-components/AuthGate.tsx";
// import AnimatedLayout from "./components/layouts/AnimatedLayout.tsx";
import GeolocationTracker from "./components/background-worker/GeolocationTracker.tsx";
import NightOutTracker from "./components/background-worker/NightOutTracker.tsx";
import { AppStateInitializer } from "./components/background-worker/AppStateInitializer.tsx";
import AuthStateInitializer from "./components/background-worker/AuthStateInitializer.tsx";

// Lazy load pages for better performance
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const OnboardingQuizPage = lazy(() => import("./pages/OnboardingQuizPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AdvicePage = lazy(() => import("./pages/archive/AdvicePage"));
const ChatPage = lazy(() => import("./pages/archive/ChatPage"));
const CommunityPage = lazy(() => import("./pages/archive/CommunityPage"));
const FeedbackPage = lazy(() => import("./pages/archive/FeedbackPage"));
const GoalsPage = lazy(() => import("./pages/archive/GoalsPage"));
const ImpactPage = lazy(() => import("./pages/archive/ImpactPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const RecomendationPage = lazy(() => import("./pages/archive/RecomendationPage"));
const TrackingPage = lazy(() => import("./pages/archive/TrackingPage"));
const InvoiceHistoryPage = lazy(() => import("./pages/InvoiceHistoryPage"));
const TodoPage = lazy(() => import("./pages/TodoPage"));
const PlantScanHistoryPage = lazy(() => import("./pages/PlantScanPage"));
const MetricsPage = lazy(() => import("./pages/MetricsPage"));
const SurveyListPage = lazy(() => import("./pages/SurveyListPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

// -----------------
// Router
// -----------------
const router = createHashRouter([
  {
    // element: <AnimatedLayout />,
    element: null,
    children: [
      { path: "/", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
      {
        element: <AuthGate />,
        children: [
          { path: "/onboarding", element: <Suspense fallback={<PageLoader />}><OnboardingPage /></Suspense> },
          { path: "/onboarding-quiz", element: <Suspense fallback={<PageLoader />}><OnboardingQuizPage /></Suspense> },
          { path: "/home", element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
          { path: "/advice", element: <Suspense fallback={<PageLoader />}><AdvicePage /></Suspense> },
          { path: "/chat", element: <Suspense fallback={<PageLoader />}><ChatPage /></Suspense> },
          { path: "/community", element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
          { path: "/feedback", element: <Suspense fallback={<PageLoader />}><FeedbackPage /></Suspense> },
          { path: "/goals", element: <Suspense fallback={<PageLoader />}><GoalsPage /></Suspense> },
          { path: "/impact", element: <Suspense fallback={<PageLoader />}><ImpactPage /></Suspense> },
          { path: "/profile", element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
          { path: "/quiz", element: <Suspense fallback={<PageLoader />}><QuizPage /></Suspense> },
          { path: "/recommendations", element: <Suspense fallback={<PageLoader />}><RecomendationPage /></Suspense> },
          { path: "/tracking", element: <Suspense fallback={<PageLoader />}><TrackingPage /></Suspense> },
          { path: "/invoice-history", element: <Suspense fallback={<PageLoader />}><InvoiceHistoryPage /></Suspense> },
          { path: "/todo", element: <Suspense fallback={<PageLoader />}><TodoPage /></Suspense> },
          { path: "/plant-scan-history", element: <Suspense fallback={<PageLoader />}><PlantScanHistoryPage /></Suspense> },
          { path: "/metrics", element: <Suspense fallback={<PageLoader />}><MetricsPage /></Suspense> },
          { path: "/survey-list", element: <Suspense fallback={<PageLoader />}><SurveyListPage /></Suspense> },
          { path: "/notifications", element: <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense> },
        ],
      },
    ],
  },
]);

// -----------------
// Render
// -----------------
createRoot(document.getElementById("root")!).render(
  <>
    <AuthStateInitializer />
    <AppStateInitializer />
    <GeolocationTracker timeBetweenTrack={7000} />
    <NightOutTracker timeBetweenCheck={30000} />
    <Toaster position="top-center" richColors closeButton />
    <RouterProvider router={router} />
  </>
);
