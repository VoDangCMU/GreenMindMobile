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
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            feedback.contrib > 0 
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

export default function MetricsPage() {
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);
    const feedbacks = useMetricFeedbackStore((s) => s.feedbacks);

    // Get all feedbacks - simple selector
    const allFeedbacks = useMemo(() => {
        const arr = Object.values(feedbacks);
        return arr.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [feedbacks]);

    const handleUpdateAllMetrics = async () => {
        setIsUpdatingAll(true);
        try {
            toast.info("Update all metrics feature coming soon!");
            // TODO: Implement metric updates
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Failed to update metrics");
        } finally {
            setIsUpdatingAll(false);
        }
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
