import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, createHashRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import OnboardingPage from './pages/OnboardingPage.tsx';
import HomePage from './pages/HomePage.tsx';
import AdvicePage from './pages/AdvicePage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import CommunityPage from './pages/CommunityPage.tsx';
import FeedbackPage from './pages/FeedbackPage.tsx';
import GoalsPage from './pages/GoalsPage.tsx';
import ImpactPage from './pages/ImpactPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import QuizPage from './pages/QuizPage.tsx';
import RecomendationPage from './pages/RecomendationPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import TrackingPage from './pages/TrackingPage.tsx';
import BillHistoryPage from './pages/BillHistoryPage.tsx';

const router = createHashRouter([
  { path: "/", element: <LoginPage /> },
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
  { path: "/register", element: <RegisterPage /> },
  { path: "/tracking", element: <TrackingPage /> },
  { path: "/bill-history", element: <BillHistoryPage /> }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
