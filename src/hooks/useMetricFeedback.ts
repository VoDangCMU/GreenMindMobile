import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import type { IMetricFeedback } from "@/store/v2/metricFeedbackStore";

/**
 * Hook to query metric feedback
 * @example
 * // Get exact metric feedback by name
 * const feedback = useMetricFeedback("list_adherence");
 * 
 * // Get latest feedback across all metrics
 * const latest = useMetricFeedback();
 */
export function useMetricFeedback(
  metricName?: string | null
): IMetricFeedback | null {
  return useMetricFeedbackStore((s) => {
    // If metricName is provided, get exact feedback
    if (metricName) {
      return s.getFeedback(metricName);
    }
    // If no metricName, return latest feedback
    return s.getLatestFeedback();
  });
}

/**
 * Hook to get all feedbacks sorted by timestamp (newest first)
 */
export function useAllMetricFeedbacks(): IMetricFeedback[] {
  return useMetricFeedbackStore((s) => Object.values(s.feedbacks).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ));
}

/**
 * Hook to set metric feedback
 */
export function useSetMetricFeedback() {
  return useMetricFeedbackStore((s) => s.setFeedback);
}
