import { useState } from 'react';
import novel_location_ratio, { type INovelLocationRatio } from '@/apis/ai/monitor_ocean/novel_location_ratio';
import { useToast } from '@/hooks/useToast';
import { useOcean } from '@/hooks/v1/useOcean';
import { useMetricFeedbackStore } from '@/store/v2/metricFeedbackStore';

export const useNovelLocationRatio = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, saveOcean } = useOcean();
    const { setFeedback } = useMetricFeedbackStore();
    const toast = useToast();

    const callNovelLocationRatio = async (locations_prev: string[], locations_now: string[], base_likert: number) => {
        if (!ocean) return;

        setLoading(true);
        setError(null);
        try {
            const payload: INovelLocationRatio = {
                locations_prev,
                locations_now,
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

            const result = await novel_location_ratio(payload);

            if (result && result.new_ocean_score) {
                const newOceanScores = {
                    O: result.new_ocean_score.O,
                    C: result.new_ocean_score.C,
                    E: result.new_ocean_score.E,
                    A: result.new_ocean_score.A,
                    N: result.new_ocean_score.N,
                };
                await saveOcean(newOceanScores);
                setFeedback("novel_location_ratio", {
                    ...result,
                    new_ocean_score: newOceanScores,
                    timestamp: new Date().toISOString(),
                });
                toast.success("Novel location metric updated");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            // toast.error("Failed to update novel location metric");
        } finally {
            setLoading(false);
        }
    };

    return { callNovelLocationRatio, loading, error };
};
