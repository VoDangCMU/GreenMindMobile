import BackendInstance from "@/apis/instances/BackendInstance";

export interface OnboardingAnswers {
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

export async function submitOnboardingAnswers(answers: OnboardingAnswers, token: string) {
  const res = await BackendInstance.post("/onboarding/submit", answers, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}