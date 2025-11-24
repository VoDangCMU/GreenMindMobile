import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore, type PreAppSurveyAnswers } from "@/store/preAppSurveyStore";
import { getUserOcean, createUserOcean, DEFAULT_OCEAN } from "@/apis/backend/ocean";
import { getPreAppSurveyByUser } from "@/apis/backend/preAppSurvey";
import { useAuthStore } from "@/store/authStore";
import useFetch from "@/hooks/useFetch";

// Map API response to store format
function mapApiResponseToStore(apiData: any): PreAppSurveyAnswers {
  return {
    avg_daily_spend: apiData.dailySpending || "",
    spend_variability: apiData.spendingVariation?.toString() || "",
    brand_novel: apiData.brandTrial?.toString() || "",
    list_adherence: apiData.shoppingList?.toString() || "",
    daily_distance_km: apiData.dailyDistance || "",
    novel_location_ratio: apiData.newPlaces?.toString() || "",
    public_transit_ratio: apiData.publicTransport?.toString() || "",
    night_out_freq: apiData.nightOutings?.toString() || "",
    healthy_food_ratio: apiData.healthyEating?.toString() || "",
  };
}

export function AppStateInitializer() {
  const user = useAuthStore((s) => s.user);
  const setOcean = useAppStore((s) => s.setOcean);
  const setAnswers = usePreAppSurveyStore((s) => s.setAnswers);
  const { call } = useFetch();

  useEffect(() => {
    call([
      {
        fn: () => getUserOcean(user?.id || ""),
        onSuccess: (data) => {
          setOcean(data.scores);
        },
        onFailed: () => {
          createUserOcean(user?.id || "", DEFAULT_OCEAN);
          setOcean(DEFAULT_OCEAN);
        },
      },
      {
        fn: () => getPreAppSurveyByUser(user?.id || ""),
        onSuccess: (data) => {
          setAnswers(mapApiResponseToStore(data));
        },
        onFailed: () => {
          //ignore
        },
      }
    ]);
  }, []);

  return null;
}