import { storageKey } from "@/store/appStore";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.state.access_token || null;
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
