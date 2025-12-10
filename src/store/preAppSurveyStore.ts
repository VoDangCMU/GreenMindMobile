import { create } from "zustand";
import { getPreAppSurveyByUser } from "@/apis/backend/v1/preAppSurvey";

export interface PreAppSurveyAnswers extends Record<string, string> {
  avg_daily_spend: string;          // Chi tiêu trung bình mỗi ngày
  spend_variability: string;        // Dao động chi tiêu
  brand_novel: string;              // Thử thương hiệu mới
  list_adherence: string;           // Thực hiện đúng kế hoạch
  daily_distance_km: string;        // Quãng đường di chuyển trung bình
  novel_location_ratio: string;     // Đến địa điểm mới
  public_transit_ratio: string;     // Phương tiện công cộng
  night_out_freq: string;           // Ra ngoài buổi đêm
  healthy_food_ratio: string;       // Ăn uống lành mạnh
}

export interface PreAppSurveyState {
  answers: PreAppSurveyAnswers | null;
  isCompleted: boolean;
  completedAt: Date | null;
  setAnswers: (answers: PreAppSurveyAnswers) => void;
  markCompleted: () => void;
  clearSurvey: () => void;
  getSurveyData: () => PreAppSurveyAnswers | null;
  fetchPreAppSurvey: (userId: string) => Promise<void>;
}

export const usePreAppSurveyStore = create<PreAppSurveyState>()(
  (set, get) => ({
    answers: null,
    isCompleted: false,
    completedAt: null,
    setAnswers: (answers) =>
      set({
        answers,
        isCompleted: true,
        completedAt: new Date(),
      }),
    markCompleted: () =>
      set({
        isCompleted: true,
        completedAt: new Date(),
      }),
    clearSurvey: () =>
      set({
        answers: null,
        isCompleted: false,
        completedAt: null,
      }),
    getSurveyData: () => get().answers,
    fetchPreAppSurvey: async (userId: string) => {
      try {
        const res = await getPreAppSurveyByUser(userId);
        if (res.data && res.data.answers) {
          set({
            answers: res.data.answers,
            isCompleted: !!res.data.isCompleted,
            completedAt: res.data.completedAt ? new Date(res.data.completedAt) : null,
          });
        }
      } catch {
        // Optionally handle error
      }
    },
  })
);