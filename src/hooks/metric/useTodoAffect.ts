import { useState } from 'react';
import todoAffect from '@/apis/backend/v1/ai-forward/metrics/todoAffect';
import { toast } from 'sonner';
import { usePreAppSurveyStore } from '@/store/preAppSurveyStore';
import { useOcean } from '@/hooks/v1/useOcean';
import { useMetricFeedbackStore } from '@/store/v2/metricFeedbackStore';

export const useTodoAffect = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { ocean, saveOcean } = useOcean();
    const { answers } = usePreAppSurveyStore();
    const { setFeedback } = useMetricFeedbackStore();

    const callTodoAffect = async (todos: ITodo[]) => {
        if (!ocean) {
            const msg = "Missing OCEAN scores";
            toast.error(msg);
            setError(msg);
            return;
        }

        if (!answers) {
            const msg = "Missing survey data";
            toast.error(msg);
            setError(msg);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const base_likert = parseFloat(answers.list_adherence) || 3; // Default to 3 (neutral) if missing

            const payload: ITodoAffectParams = {
                todos,
                base_likert,
                ocean_score: {
                    O: ocean.O / 100,
                    C: ocean.C / 100,
                    E: ocean.E / 100,
                    A: ocean.A / 100,
                    N: ocean.N / 100,
                },
            };

            const result = await todoAffect(payload);

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
            setFeedback("list_adherence", {
                ...result,
                new_ocean_score: newOceanScores,
                timestamp: new Date().toISOString(),
            });

            toast.success("OCEAN scores updated successfully!");
            return result;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update todo affect metrics';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        callTodoAffect,
        loading,
        error
    };
};
