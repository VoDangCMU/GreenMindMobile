import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore, type PreAppSurveyAnswers } from "@/store/preAppSurveyStore";
import { getUserOcean, createUserOcean, DEFAULT_OCEAN } from "@/apis/backend/ocean";
import { getPreAppSurveyByUser } from "@/apis/backend/preAppSurvey";

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
  const user = useAppStore((s) => s.user);
  const setOcean = useAppStore((s) => s.setOcean);
  const preAppSurvey = usePreAppSurveyStore((s) => s.answers);
  const setAnswers = usePreAppSurveyStore((s) => s.setAnswers);

  useEffect(() => {
    if (user?.id && !preAppSurvey) {
      async function fetchPreAppData() {
        try {
          const res = await getPreAppSurveyByUser(user?.id || "");
          if (res.data) {
            // Map the API response to store format
            const mappedAnswers = mapApiResponseToStore(res.data);
            setAnswers(mappedAnswers);
          }
        } catch (error) {
          console.error("Failed to fetch pre-app survey:", error);
        }
      }
      fetchPreAppData();
    }
  }, [user?.id]);

  useEffect(() => {
    let ignore = false;
    async function ensureOcean() {
      if (!user?.id) return;
      try {
        const res = await getUserOcean(user.id);
        if (!ignore && res?.scores) {
          setOcean(res.scores);
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // Not found, create default
          try {
            const created = await createUserOcean(user.id, DEFAULT_OCEAN);
            if (!ignore && created?.scores) {
              setOcean(created.scores);
            }
          } catch {
            // handle error if needed
          }
        }
      }
    }
    ensureOcean();
    return () => { ignore = true; };
  }, [user?.id, setOcean]);

  return null;
}