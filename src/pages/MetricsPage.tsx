import { useMemo, useState } from "react";
import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
// MetricFeedbackCard moved here from app-components
// import { useState } from "react"; // (already imported above)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
import type { IMetricFeedback } from "@/store/v2/metricFeedbackStore";

export function MetricFeedbackCard({ feedback }: { feedback: IMetricFeedback }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const round3 = (num: number) => Math.round(num * 1000) / 1000;
    return (
        <Card className="mb-4 border-0 shadow-lg">
            <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {feedback.contrib > 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <CardTitle className="text-base capitalize">{feedback.metric}</CardTitle>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${feedback.contrib > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {feedback.contrib > 0 ? '+' : ''}{round3(feedback.contrib)}
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                            <p className="text-gray-500">Value Today (vt)</p>
                            <p className="font-semibold text-gray-800">{round3(feedback.vt)}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-500">Baseline (bt)</p>
                            <p className="font-semibold text-gray-800">{round3(feedback.bt)}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-500">Correlation (r)</p>
                            <p className="font-semibold text-gray-800">{round3(feedback.r)}</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-500">Contribution (contrib)</p>
                            <p className="font-semibold text-gray-800">{round3(feedback.contrib)}</p>
                        </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="text-sm text-gray-800">{feedback.reason}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Mechanism Feedback</p>
                        <div className="space-y-2 p-2 bg-purple-50 rounded-lg">
                            <div className="text-xs">
                                <p className="text-gray-500">Awareness</p>
                                <p className="text-gray-800">{feedback.mechanismFeedback.awareness}</p>
                            </div>
                            <div className="text-xs">
                                <p className="text-gray-500">Motivation</p>
                                <p className="text-gray-800">{feedback.mechanismFeedback.motivation}</p>
                            </div>
                            <div className="text-xs">
                                <p className="text-gray-500">Capability</p>
                                <p className="text-gray-800">{feedback.mechanismFeedback.capability}</p>
                            </div>
                            <div className="text-xs">
                                <p className="text-gray-500">Opportunity</p>
                                <p className="text-gray-800">{feedback.mechanismFeedback.opportunity}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">New OCEAN Score</p>
                        <div className="grid grid-cols-5 gap-1">
                            {Object.entries(feedback.new_ocean_score).map(([trait, score]) => (
                                <div key={trait} className="text-center">
                                    <p className="text-xs font-bold text-gray-700">{trait}</p>
                                    <p className="text-sm text-green-600 font-semibold">{round3(score as number)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">
                        {new Date(feedback.timestamp).toLocaleString("vi-VN")}
                    </p>
                </CardContent>
            )}
        </Card>
    );
}
import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Metric hooks and stores
import { useDailyMoving } from "@/hooks/metric/useDailyMoving";
import { useDailySpending } from "@/hooks/metric/useDailySpending";
import { useHealthyFoodRatio } from "@/hooks/metric/useHealthyFoodRatio";
import { useTodoAffect } from "@/hooks/metric/useTodoAffect";
import { useNightOutFeq } from "@/hooks/metric/useNightOutFeq";

import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import useInvoiceStore from "@/store/invoiceStore";
import usePlantScanStore from "@/store/plantScanStore";
import { useTodoStore } from "@/store/todoStore";
import { useNightOutHistoryStore } from "@/store/nightOutHistoryStore";
import { getDistanceToday } from "@/apis/backend/v2/location";
import { useAppStore } from "@/store/appStore";

export default function MetricsPage() {
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);
    const feedbacks = useMetricFeedbackStore((s) => s.feedbacks);

    // Metric hooks
    const { callDailyMoving } = useDailyMoving();
    const { callDailySpending } = useDailySpending();
    const { callHealthyFoodRatio } = useHealthyFoodRatio();
    const { callTodoAffect } = useTodoAffect();
    const { callNightOutFeq } = useNightOutFeq();

    // Stores for inputs
    const preAppAnswers = usePreAppSurveyStore((s) => s.answers);
    const invoices = useInvoiceStore((s) => s.invoices);
    const plantScans = usePlantScanStore((s) => s.scans);
    const todos = useTodoStore((s) => s.todos);
    const nightOutHistory = useNightOutHistoryStore((s) => s.records);
    const currentOcean = useAppStore((s) => s.ocean);

    // Get all feedbacks - simple selector
    const allFeedbacks = useMemo(() => {
        const arr = Object.values(feedbacks);
        return arr.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [feedbacks]);

    // Single function to update all metrics
    const updateAllMetrics = async () => {
        setIsUpdatingAll(true);
        try {
            // 1) Daily moving (use backend v2 helper to get today's distance)
            try {
                const distRes = await getDistanceToday();
                const distance_today = distRes?.data?.total_distance ?? 0;
                const base_avg_distance = parseFloat(preAppAnswers?.daily_distance_km || '5') || 5;
                await callDailyMoving(distance_today, base_avg_distance);
            } catch (err) {
                console.error('dailyMoving failed:', err);
            }

            // 2) Daily spending
            try {
                const today = new Date().toISOString().split('T')[0];
                const daily_total = (invoices || [])
                    .filter(inv => {
                        // Helper to normalize date to YYYY-MM-DD
                        const normalizeDate = (d: string | undefined) => {
                            if (!d) return '';
                            if (d.includes('/')) {
                                const [day, month, year] = d.split('/');
                                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            }
                            return d;
                        };

                        let invDate = normalizeDate(inv.datetime?.date);

                        // Fallback to createdAt if no issued date
                        if (!invDate && inv.createdAt) {
                            try {
                                invDate = new Date(inv.createdAt).toISOString().split('T')[0];
                            } catch (e) {
                                // ignore invalid date
                            }
                        }

                        return invDate === today;
                    })
                    .reduce((sum, inv) => sum + (parseFloat(inv.totals?.grand_total || '0') || 0), 0);

                const base_avg = 450000; // Hardcoded as per request

                // Only call if there's spending or to update with 0 if that's desired, 
                // but usually we want to track even if 0 if we are tracking daily. 
                // However, the previous logic was `if (daily_total > 0)`. 
                // Let's keep it but maybe the user wants to see it even if 0? 
                // For now, I'll stick to the logic but with the correct total.
                // Actually, if I have bills today, I should send it.
                if (daily_total >= 0) await callDailySpending(daily_total, base_avg);
            } catch (err) {
                console.error('dailySpending failed:', err);
            }

            // 3) Healthy food ratio (plant scans)
            try {
                const totalScans = plantScans.length;
                if (totalScans > 0) {
                    const plantScansCount = plantScans.filter(s => (s.vegetable_ratio_percent ?? 0) > 30).length;
                    const base_likert = parseFloat(preAppAnswers?.healthy_food_ratio || '3') || 3;
                    const payload = {
                        plant_meals: plantScansCount,
                        total_meals: totalScans,
                        base_likert,
                        ocean_score: currentOcean ? { O: currentOcean.O / 100, C: currentOcean.C / 100, E: currentOcean.E / 100, A: currentOcean.A / 100, N: currentOcean.N / 100 } : { O: 0, C: 0, E: 0, A: 0, N: 0 }
                    } as any;
                    await callHealthyFoodRatio(payload);
                }
            } catch (err) {
                console.error('healthyFoodRatio failed:', err);
            }

            // 4) Todo affect
            try {
                if (todos && todos.length > 0) {
                    await callTodoAffect(todos as any);
                }
            } catch (err) {
                console.error('todoAffect failed:', err);
            }

            // 5) Night out frequency
            try {
                const night_out_count = (nightOutHistory || []).length;
                const base_night_out = parseFloat(preAppAnswers?.night_out_freq || '0') || 0;
                if (night_out_count > 0) await callNightOutFeq(night_out_count, base_night_out);
            } catch (err) {
                console.error('nightOutFeq failed:', err);
            }

            toast.success('Metric updates triggered');
        } catch (err) {
            console.error('Update failed:', err);
            toast.error('Failed to update metrics');
        } finally {
            setIsUpdatingAll(false);
        }
    };

    // Call on mount once - REMOVED as per user request to only update on button click
    // useEffect(() => {
    //     updateAllMetrics();
    // }, []);

    // Reuse for button
    const handleUpdateAllMetrics = async () => {
        await updateAllMetrics();
    };

    return (
        <SafeAreaLayout
            header={
                <AppHeader
                    title="Metrics & Feedback"
                    showBack
                    rightActions={[
                        <AppHeaderButton
                            key="update-all"
                            icon={
                                isUpdatingAll ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                ) : (
                                    <RefreshCw className="h-6 w-6 text-blue-500" />
                                )
                            }
                            onClick={handleUpdateAllMetrics}
                        />,
                    ]}
                />
            }
        >
            <div className="flex flex-col bg-gradient-to-br">
                <div className="flex-1 w-full mx-auto px-3 pb-20">
                    {/* Update All Button */}
                    <div className="mb-4 mt-4">
                        <Button
                            onClick={handleUpdateAllMetrics}
                            disabled={isUpdatingAll}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {isUpdatingAll ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Updating All Metrics...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Update All Metrics
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Feedbacks List */}
                    {allFeedbacks.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-600 mb-3">
                                Recent Feedbacks ({allFeedbacks.length})
                            </p>
                            {allFeedbacks.map((feedback) => (
                                <MetricFeedbackCard key={feedback.metric} feedback={feedback} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <p className="text-gray-500 text-center">No feedback yet</p>
                            <p className="text-gray-400 text-sm text-center mt-2">
                                Update metrics to see feedback
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SafeAreaLayout>
    );
}
