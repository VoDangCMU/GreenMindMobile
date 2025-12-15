import { useEffect } from "react";
import { usePreAppSurveyStore, type PreAppSurveyAnswers } from "@/store/preAppSurveyStore";
import { getUserOcean, createUserOcean, DEFAULT_OCEAN } from "@/apis/backend/v1/ocean";
import { getPreAppSurveyByUser } from "@/apis/backend/v1/preAppSurvey";
import { useAuthStore } from "@/store/authStore";
import useFetch from "@/hooks/useFetch";
import { useOcean } from "@/hooks/v1/useOcean";
import { App } from "@capacitor/app";

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
  const setAnswers = usePreAppSurveyStore((s) => s.setAnswers);
  const { call } = useFetch();
  const { setOcean } = useOcean();

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
          const normalizedData = mapApiResponseToStore(data);
          setAnswers(normalizedData);
        },
        onFailed: () => {
          console.log("Failed to fetch pre-app survey");
        },
      }
    ]);
  }, [user?.id]);

  // Listen for app state changes (pause/resume)
  useEffect(() => {
    const appStateListener = App.addListener("appStateChange", ({ isActive }) => {
      console.log("App state changed. isActive:", isActive);
      
      if (isActive) {
        console.log("App resumed from background");
        // App is back to foreground - state should be preserved by Zustand persist
        // No need to do anything as Zustand will restore from localStorage
      } else {
        console.log("App went to background");
        // App is going to background - Zustand automatically persists
      }
    });

    return () => {
      appStateListener.then((listener) => listener.remove());
    };
  }, []);

  return null;
}