import { useAuthStore } from "@/store/authStore";

export function getToken(): string | null {
  try {
    // Read directly from store state (in-memory) which is faster and more reliable during state transitions
    const state = useAuthStore.getState();
    return state.tokens?.access_token || null;
  } catch {
    return null;
  }
}

export function authHeader(): { Authorization: string } | {} {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
