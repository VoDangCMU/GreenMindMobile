import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface ISpendVariability {
  daily_spend: Array<number>;
  base_likert: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function spend_variability(question_data: ISpendVariability) {
  return AIApi.post('/spend_variability', question_data).then(res => res.data as IMonitorOceanResponse);
}