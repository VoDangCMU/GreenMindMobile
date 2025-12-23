import { useState } from 'react';
import public_transit_ratio, { type IPublicTransitRatio } from '@/apis/ai/monitor_ocean/public_transit_ratio';
import { useToast } from '@/hooks/useToast';
import { useOcean } from '@/hooks/v1/useOcean';
import { useMetricFeedbackStore } from '@/store/v2/metricFeedbackStore';

export const usePublicTransitRatio = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, saveOcean } = useOcean();
    const { setFeedback } = useMetricFeedbackStore();
    const toast = useToast();

    const callPublicTransitRatio = async (public_transit_trips: number, total_trips: number, base_likert: number) => {
        if (!ocean) return;

        setLoading(true);
        setError(null);
        try {
            const payload: IPublicTransitRatio = {
                public_transit_trips,
                total_trips,
                base_likert,
                weight: 0.25,
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

            const result = await public_transit_ratio(payload);

            if (result && result.new_ocean_score) {
                const newOceanScores = {
                    O: result.new_ocean_score.O,
                    C: result.new_ocean_score.C,
                    E: result.new_ocean_score.E,
                    A: result.new_ocean_score.A,
                    N: result.new_ocean_score.N,
                };
                await saveOcean(newOceanScores);
                setFeedback("public_transit_ratio", {
                    ...result,
                    new_ocean_score: newOceanScores,
                    timestamp: new Date().toISOString(),
                });
                toast.success("Public transit metric updated");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            // toast.error("Failed to update public transit metric");
        } finally {
            setLoading(false);
        }
    };

    return { callPublicTransitRatio, loading, error };
};
