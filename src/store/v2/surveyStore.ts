import { type IPreAppSurveyResponse, type ISurveyResponse } from "@/apis/backend/v2/survey";
import { create } from "zustand";

export interface ISurveyState {
  survey: ISurveyResponse | null;
  setSurvey: (survey: ISurveyResponse) => void;
  preAppSurvey: IPreAppSurveyResponse | null;
  setPreAppSurvey: (survey: IPreAppSurveyResponse) => void;
}

const initialState: ISurveyState = {
  survey: null,
  setSurvey: () => {},
  preAppSurvey: null,
  setPreAppSurvey: () => {},
};

export const useSurveyStore = create<ISurveyState>((set) => ({
  ...initialState,
  setSurvey: (survey) => set({ survey }),
  setPreAppSurvey: (preAppSurvey) => set({ preAppSurvey }),
}));