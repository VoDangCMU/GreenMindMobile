import { useState } from 'react';
import nightOut from '@/apis/backend/ai-forward/metrics/nightOut';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { updateUserOcean } from '@/apis/backend/ocean';


export const useNightOutFeq = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, setOcean } = useAppStore();
    const user = useAuthStore((s) => s.user);

    const callNightOutFeq = async (night_out_count: number, base_night_out: number) => {
        if (!ocean) {
            const msg = "Missing OCEAN scores";
            toast.error(msg);
            setError(msg);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const payload: INightOutParams = {
                night_out_count,
                base_night_out,
                weight: 0.2,
                direction: "up",
                sigma_r: 1.0,
                alpha: 0.5,
                ocean_score: {
                    O: ocean.O / 100,
                    C: ocean.C / 100,
                    E: ocean.E / 100,
                    A: ocean.A / 100,
                    N: ocean.N / 100,
                },
            };

            const result = await nightOut(payload);

            if (!result || !result.new_ocean_score) {
                console.warn("API returned invalid response: missing new_ocean_score", result);
                return result;
            }

            // Prepare new OCEAN scores
            const newOceanScores = {
                O: result.new_ocean_score.O,
                C: result.new_ocean_score.C,
                E: result.new_ocean_score.E,
                A: result.new_ocean_score.A,
                N: result.new_ocean_score.N,
            };

            // Update OCEAN scores in the store
            setOcean(newOceanScores);

            // Update OCEAN scores in the backend
            if (user?.id) {
                try {
                    await updateUserOcean(user.id, newOceanScores);
                } catch (backendError) {
                    console.error("Failed to update OCEAN scores in backend:", backendError);
                    // Continue anyway, as the store is already updated
                }
            }

            toast.success("OCEAN scores updated successfully!");
            return result;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update night out frequency metrics';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        callNightOutFeq,
        loading,
        error
    };
};
