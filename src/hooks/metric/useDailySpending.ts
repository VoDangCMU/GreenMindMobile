import { useState } from 'react';
import dailySpending from '@/apis/backend/ai-forward/metrics/dailySpending';
// import dailySpending from '@/apis/ai/monitor_ocean/avg_daily_spend';
import { toast } from 'sonner';
import { useOcean } from '@/hooks/useOcean';

export const useDailySpending = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, saveOcean } = useOcean();

    const callDailySpending = async (daily_total: number, base_avg: number) => {
        if (!ocean) {
            const msg = "Missing OCEAN scores";
            toast.error(msg);
            setError(msg);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const payload: IDailySpendingParams = {
                daily_total,
                base_avg,
                ocean_score: {
                    O: ocean.O / 100,
                    C: ocean.C / 100,
                    E: ocean.E / 100,
                    A: ocean.A / 100,
                    N: ocean.N / 100,
                },
            };

            const result = await dailySpending(payload);

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
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update daily spending metrics';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        callDailySpending,
        loading,
        error
    };
};
