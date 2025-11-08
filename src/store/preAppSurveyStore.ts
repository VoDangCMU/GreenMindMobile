import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PreAppSurveyAnswers extends Record<string, string> {
  daily_spending: string;
  spending_variation: string;
  brand_trial: string;
  shopping_list: string;
  daily_distance: string;
  new_places: string;
  public_transport: string;
  stable_schedule: string;
  night_outings: string;
  healthy_eating: string;
  social_media: string;
  goal_setting: string;
  mood_swings: string;
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
      setAnswers: (answers) => set({ 
        answers,
        isCompleted: true,
        completedAt: new Date()
      }),
      markCompleted: () => set({ 
        isCompleted: true,
        completedAt: new Date()
      }),
      clearSurvey: () => set({ 
        answers: null,
        isCompleted: false,
        completedAt: null
      }),
      getSurveyData: () => get().answers,
    }),
    {
      name: "greenmind_preapp_survey",
    }
  )
);