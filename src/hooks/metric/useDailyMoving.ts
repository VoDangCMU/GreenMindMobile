import { useState } from 'react';
import dailyMoving from '@/apis/backend/ai-forward/metrics/dailyMoving';
import { toast } from 'sonner';
import { useOcean } from '@/hooks/useOcean';

export const useDailyMoving = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, saveOcean } = useOcean();

    const callDailyMoving = async (distance_today: number, base_avg_distance: number) => {
        if (!ocean) {
            const msg = "Missing OCEAN scores";
            toast.error(msg);
            setError(msg);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const payload: IDailyMovingParams = {
                distance_today,
                base_avg_distance,
                ocean_score: {
                    O: ocean.O / 100,
                    C: ocean.C / 100,
                    E: ocean.E / 100,
                    A: ocean.A / 100,
                    N: ocean.N / 100,
                },
            };

            const result = await dailyMoving(payload);

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

            // Update OCEAN scores
            await saveOcean(newOceanScores);

            toast.success("OCEAN scores updated successfully!");
            return result;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update daily moving metrics';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        callDailyMoving,
        loading,
        error
    };
};
