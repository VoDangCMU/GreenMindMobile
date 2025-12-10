import { create } from "zustand";

export interface IMetricFeedback {
  metric: string;
  vt: number;
  bt: number;
  r: number;
  n: number;
  contrib: number;
  new_ocean_score: IOcean;
  mechanismFeedback: IMechanismFeedback;
  reason: string;
  timestamp: string;
}

declare interface IOcean {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

declare interface IMechanismFeedback {
  awareness: string;
  motivation: string;
  capability: string;
  opportunity: string;
}

export interface IMetricFeedbackState {
  feedbacks: Record<string, IMetricFeedback>; // metric -> feedback
  setFeedback: (metric: string, feedback: IMetricFeedback) => void;
  getFeedback: (metric: string) => IMetricFeedback | null;
  getFeedbackByMetricType: (metricType: string) => IMetricFeedback | null; // Query by partial match (e.g., "daily_distance" matches "daily_distance_km")
  getLatestFeedback: () => IMetricFeedback | null; // Get the most recent feedback
  clearFeedback: (metric: string) => void;
  getAllFeedbacks: () => IMetricFeedback[];
  getAllFeedbacksSorted: () => IMetricFeedback[]; // Get all feedbacks sorted by timestamp (newest first)
}

export const useMetricFeedbackStore = create<IMetricFeedbackState>((set, get) => ({
  feedbacks: {},
      
      setFeedback: (metric, feedback) =>
        set((state) => ({
          feedbacks: {
            ...state.feedbacks,
            [metric]: {
              ...feedback,
              metric, // Ensure metric name is stored
              timestamp: new Date().toISOString(),
            },
          },
        })),
      
      getFeedback: (metric) => {
        const feedback = get().feedbacks[metric];
        return feedback || null;
      },

      getFeedbackByMetricType: (metricType) => {
        const feedbacks = get().feedbacks;
        // Try exact match first
        if (feedbacks[metricType]) {
          return feedbacks[metricType];
        }
        // Try partial match (e.g., "daily_distance" matches "daily_distance_km")
        const matchedKey = Object.keys(feedbacks).find(key =>
          key.startsWith(metricType) || key.includes(metricType)
        );
        return matchedKey ? feedbacks[matchedKey] : null;
      },

      getLatestFeedback: () => {
        const feedbacks = Object.values(get().feedbacks);
        if (feedbacks.length === 0) return null;
        return feedbacks.reduce((latest, current) =>
          new Date(current.timestamp).getTime() > new Date(latest.timestamp).getTime()
            ? current
            : latest
        );
      },
      
      clearFeedback: (metric) =>
        set((state) => {
          const { [metric]: _, ...rest } = state.feedbacks;
          return { feedbacks: rest };
        }),
      
      getAllFeedbacks: () => {
        return Object.values(get().feedbacks);
      },

      getAllFeedbacksSorted: () => {
        return Object.values(get().feedbacks).sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },
    })
);
