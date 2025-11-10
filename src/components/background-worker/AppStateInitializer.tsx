
import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { getUserOcean, createUserOcean, DEFAULT_OCEAN } from "@/apis/backend/ocean";

export function AppStateInitializer() {
  const user = useAppStore((s) => s.user);
  const setOcean = useAppStore((s) => s.setOcean);
  const preAppSurvey = usePreAppSurveyStore((s) => s.answers);
  const fetchPreAppSurvey = usePreAppSurveyStore((s) => s.fetchPreAppSurvey);

  useEffect(() => {
    if (user?.id && !preAppSurvey) {
      fetchPreAppSurvey(user.id);
    }
  }, [user?.id, preAppSurvey, fetchPreAppSurvey]);

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
          } catch (e) {
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