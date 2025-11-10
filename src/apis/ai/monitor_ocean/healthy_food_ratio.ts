import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface IHealthyFoodRatio {
  plant_meals: number;
  total_meals: number;
  base_likert: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function healthy_food_ratio(question_data: IHealthyFoodRatio) {
  return AIApi.post('/healthy_food_ratio', question_data).then(res => res.data as IMonitorOceanResponse);
}