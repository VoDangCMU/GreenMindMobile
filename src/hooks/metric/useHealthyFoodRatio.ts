import { useState } from 'react';
import { healthy_food_ratio } from '@/apis/ai/monitor_ocean';
import type { IHealthyFoodRatio } from '@/apis/ai/monitor_ocean';
import { toast } from 'sonner';
import { useOcean } from '@/hooks/v1/useOcean';
import { useMetricFeedbackStore } from '@/store/v2/metricFeedbackStore';

export const useHealthyFoodRatio = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, saveOcean } = useOcean();
    const { setFeedback } = useMetricFeedbackStore();

    const callHealthyFoodRatio = async (data: IHealthyFoodRatio) => {
        if (!ocean) {
            const msg = "Missing OCEAN scores";
            toast.error(msg);
            setError(msg);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await healthy_food_ratio(data);

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

            // Save feedback to store with timestamp
            setFeedback("healthy_food_ratio", {
                ...result,
                new_ocean_score: newOceanScores,
                timestamp: new Date().toISOString(),
            });

            toast.success("OCEAN scores updated successfully!");
            return result;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update healthy food ratio metrics';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        callHealthyFoodRatio,
        loading,
        error
    };
};
