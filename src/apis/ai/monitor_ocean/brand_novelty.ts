import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface IBrandNovelty {
  brands_prev: string[];
  brands_now: string[];
  base_likert: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function brand_novelty(question_data: IBrandNovelty) {
  return AIApi.post('/brand_novelty', question_data).then(res => res.data as IMonitorOceanResponse);
}