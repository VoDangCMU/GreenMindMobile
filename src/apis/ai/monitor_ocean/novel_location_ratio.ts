import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface INovelLocationRatio {
  locations_prev: string[];
  locations_now: string[];
  base_likert: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function novel_location_ratio(question_data: INovelLocationRatio) {
  return AIApi.post('/novel_location_ratio', question_data).then(res => res.data as IMonitorOceanResponse);
}