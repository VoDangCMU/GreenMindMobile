import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

export default function AuthGate() {
  const access_token = useAppStore(state => state.access_token);
  const bypassAuthGate = useAppStore(state => state.bypassAuthGate);
  const isLoggedIn = !!access_token || bypassAuthGate;
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}