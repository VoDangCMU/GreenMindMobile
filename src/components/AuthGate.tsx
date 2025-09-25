import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

export default function AuthGate() {
  const access_token = useAppStore(state => state.access_token);
  const isLoggedIn = !!access_token;
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}