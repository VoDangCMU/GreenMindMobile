import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface IAvgDailySpend {
  daily_total: number;
  base_avg: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function avg_daily_spend(question_data: IAvgDailySpend) {
  return AIApi.post('/avg_daily_spend', question_data).then(res => res.data as IMonitorOceanResponse);
}
