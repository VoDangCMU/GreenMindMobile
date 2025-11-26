import { useCallback } from "react";
import { useAppStore } from "@/store/appStore";
import { createUserOcean, getUserOcean, ensureUserOcean } from "@/apis/backend/ocean";
import { useAuthStore } from "@/store/authStore";



export function useOcean() {
    const ocean = useAppStore((s) => s.ocean);
    const setOcean = useAppStore((s) => s.setOcean);
    const user = useAuthStore((s) => s.user);

    // Side-effect: fetch + update store
    const fetchOcean = useCallback(async () => {
        const response = await getUserOcean(user?.id || "");
        const safeData = ensureUserOcean(response.scores);
        setOcean(ensureUserOcean(safeData));
        return safeData;
    }, [setOcean, user]);


    const saveOcean = useCallback(
        async (newOcean: IOcean) => {
            if (!user?.id) return null;
            const safeData = ensureUserOcean(newOcean);
            const response = await createUserOcean(user.id, safeData);
            setOcean(ensureUserOcean(response.scores));
            return ensureUserOcean(response.scores);
        },
        [setOcean, user]
    );

    return {
        ocean,
        setOcean,
        fetchOcean,
        saveOcean
    };
}
