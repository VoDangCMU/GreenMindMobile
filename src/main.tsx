import { Toaster } from "sonner";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppStore } from "./store/appStore";
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
    const state = useAppStore.getState();

    if (state.user?.fullName) {
      toast.success(`Welcome back, ${state.user.fullName}!`);
    }
     
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthStateInitializer />
    <Toaster position="top-center" richColors closeButton />
    <RouterProvider router={router} />
  </StrictMode>
);
