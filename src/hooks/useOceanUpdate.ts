import { useAppStore } from "@/store/appStore";
import { updateUserOcean } from "@/apis/backend/ocean";
import type { OceanScores } from "@/apis/backend/ocean";
import { useToast } from "./useToast";

export function useOceanUpdate() {
  const user = useAppStore((state) => state.user);
  const setOcean = useAppStore((state) => state.setOcean);
  const toast = useToast();

  const updateOcean = async (scores: OceanScores) => {
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