import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface IDailyDistanceKm {
  distance_today: number;
  base_avg_distance: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function daily_distance_km(question_data: IDailyDistanceKm) {
  return AIApi.post('/daily_distance_km', question_data).then(res => res.data as IMonitorOceanResponse);
}