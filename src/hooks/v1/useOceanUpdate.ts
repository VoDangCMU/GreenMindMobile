import { useAppStore } from "@/store/appStore";
import { updateUserOcean } from "@/apis/backend/v1/ocean";
import { useToast } from "../useToast";
import { useAuthStore } from "@/store/authStore";

export function useOceanUpdate() {
  const user = useAuthStore((state) => state.user);
  const setOcean = useAppStore((state) => state.setOcean);
  const toast = useToast();

  const updateOcean = async (scores: IOcean) => {
    if (!user?.id) {
      console.error("Cannot update OCEAN scores: No user ID found");
      toast.error("Cannot update OCEAN scores: Not logged in");
      return;
    }

    try {
      await updateUserOcean(user.id, scores);
      setOcean(scores);
    } catch (error) {
      console.error("Failed to update OCEAN scores:", error);
      toast.error("Failed to update OCEAN scores");
      throw error;
    }
  };

  return { updateOcean };
}