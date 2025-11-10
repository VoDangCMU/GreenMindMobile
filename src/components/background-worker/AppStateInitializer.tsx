import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";

export function AppStateInitializer() {
  const user = useAppStore((s) => s.user);
  const preAppSurvey = usePreAppSurveyStore((s) => s.answers);
  const fetchPreAppSurvey = usePreAppSurveyStore((s) => s.fetchPreAppSurvey);

  useEffect(() => {
    if (user?.id && !preAppSurvey) {
      fetchPreAppSurvey(user.id);
    }
  }, [user?.id, preAppSurvey, fetchPreAppSurvey]);

  return null;
}