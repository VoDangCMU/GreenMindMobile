import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export const usePreAppSurveyStore = create<PreAppSurveyState>()(
  persist(
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
    }),
    {
      name: "greenmind_preapp_survey",
    }
  )
);