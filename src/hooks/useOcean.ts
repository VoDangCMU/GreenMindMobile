import { useCallback } from "react";
import { useAppStore } from "@/store/appStore";
import { getUserOcean } from "@/apis/backend/ocean";
import { useAuthStore } from "@/store/authStore";

export function useOcean() {
    const ocean = useAppStore((s) => s.ocean);
    const setOcean = useAppStore((s) => s.setOcean);
    const user = useAuthStore((s) => s.user);

    // Side-effect: fetch + update store
    const fetchOcean = useCallback(async () => {
        const data = await getUserOcean(user?.id || ""); // call API của bạn
        setOcean(data); // store tự normalize
        return data;
    }, [setOcean]);

    return {
        ocean,
        setOcean,
        fetchOcean,
    };
}
