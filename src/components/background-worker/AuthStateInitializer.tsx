import { getProfile } from "@/apis/backend/profile";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthStateInitializer() {
    const toast = useToast();
    const { call } = useFetch();
    const state = useAuthStore.getState();

    useEffect(() => {
        call([
            {
                fn: () => getProfile(state.tokens?.access_token || ""),
                onSuccess: (data) => {
                    useAuthStore.getState().setUser(data)
                    toast.success(`Welcome back, ${data.full_name}!`);
                },
                onFailed: () => {
                    useAuthStore.getState().clearAuth()
                    toast.error("Session expired. Please log in again.");
                },
            }
        ]);
    }, []);

    return null;
}