import { storageKey } from "@/store/appStore";
import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

// API params and response types
export interface PreAppSurveyAnswers {
  avg_daily_spend: string;
  spend_variability: string;
  brand_novel: string;
  list_adherence: string;
  daily_distance_km: string;
  novel_location_ratio: string;
  public_transit_ratio: string;
  night_out_freq: string;
  healthy_food_ratio: string;
}

export interface PreAppSurveySubmitParams {
  userId: string;
  answers: PreAppSurveyAnswers;
  isCompleted: boolean;
  completedAt: string;
}

// Map store fields to API fields
function mapStoreToApi(answers: PreAppSurveyAnswers): Record<string, string> {
  return {
    daily_spending: answers.avg_daily_spend,
    spending_variation: answers.spend_variability,
    brand_trial: answers.brand_novel,
    shopping_list: answers.list_adherence,
    daily_distance: answers.daily_distance_km,
    new_places: answers.novel_location_ratio,
    public_transport: answers.public_transit_ratio,
    night_outings: answers.night_out_freq,
    healthy_eating: answers.healthy_food_ratio,
    // The following are not in store, so send empty string
    stable_schedule: "",
    social_media: "",
    goal_setting: "",
    mood_swings: ""
  };
}

export async function submitPreAppSurvey(params: PreAppSurveySubmitParams) {
  const apiAnswers = mapStoreToApi(params.answers);
  return BackendInstance.post("/pre-app-survey/submit", {
    userId: params.userId,
    answers: apiAnswers,
    isCompleted: params.isCompleted,
    completedAt: params.completedAt,
  }, { headers: authHeader() } );
}

export async function getPreAppSurveyByUser(userId: string) {
  return BackendInstance.get(`/pre-app-survey/${userId}`, { headers: authHeader() } );
}
