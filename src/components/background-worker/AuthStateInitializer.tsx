import { getProfile } from "@/apis/backend/v1/profile";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthStateInitializer() {
    const toast = useToast();
    const { call } = useFetch();
    // Use reactive hook to ensure we get updates
    const token = useAuthStore((s) => s.tokens?.access_token);

    useEffect(() => {
        // If no token, nothing to validate. 
        // If user is already set (e.g. fresh login), we might still want to refresh profile,
        // but let's be careful not to wipe state if it fails due to network.
        if (!token) return;

        call([
            {
                fn: () => getProfile(token),
                onSuccess: (data) => {
                    useAuthStore.getState().setUser(data);
                    // Only toast if it's a restore (user wasn't there), otherwise it's spammy on login?
                    // But for now keeping it to be safe/consistent with user expectation.
                    //if (!user) toast.success(`Welcome back, ${user!.full_name}!`);
                },
                onFailed: (err: any) => {
                    console.error("AuthStateInitializer: Token validation failed", err);
                    // Only clear auth if it's strictly a 401/403, otherwise it might be network error
                    if (err?.response?.status === 401 || err?.response?.status === 403) {
                        useAuthStore.getState().clearAuth();
                        toast.error("Session expired. Please log in again.");
                    }
                },
            }
        ]);
    }, [token]);



    return null;
}