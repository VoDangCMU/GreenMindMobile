import { useMemo, useState } from "react";
import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import { MetricFeedbackCard } from "@/components/app-components/MetricFeedbackCard";
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
