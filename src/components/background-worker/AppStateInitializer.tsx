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
  const token = useAuthStore((s) => s.tokens?.access_token);
  const setAnswers = usePreAppSurveyStore((s) => s.setAnswers);
  const { call } = useFetch();
  const { setOcean } = useOcean();

  useEffect(() => {
    // Only initialize if we have both user ID and a token
    if (!user?.id || !token) {
      // Optional: clear state if logged out?
      return;
    }

    console.log("AppStateInitializer: Initializing for user", user.id);

    call([
      {
        fn: () => getUserOcean(user.id),
        onSuccess: (data) => {
          console.log("AppStateInitializer: Ocean fetched");
          setOcean(data.scores);
        },
        onFailed: (err) => {
          console.error("AppStateInitializer: Failed to fetch ocean", err);
          createUserOcean(user.id, DEFAULT_OCEAN).catch(e => console.error("Create ocean failed", e));
          setOcean(DEFAULT_OCEAN);
        },
      },
      {
        fn: () => getPreAppSurveyByUser(user.id),
        onSuccess: (data) => {
          console.log("AppStateInitializer: Survey fetched");
          const normalizedData = mapApiResponseToStore(data);
          setAnswers(normalizedData);
        },
        onFailed: (err) => {
          console.warn("AppStateInitializer: Failed to fetch pre-app survey (might not exist)", err);
        },
      }
    ]);
  }, [user?.id, token]); // Re-run if user or token changes

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