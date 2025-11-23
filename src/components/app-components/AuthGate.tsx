import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function AuthGate() {
  const access_token = useAuthStore(state => state.tokens?.access_token);
  const bypassAuthGate = useAuthStore(state => state.bypassAuthGate);
  const isLoggedIn = !!access_token || bypassAuthGate;
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}