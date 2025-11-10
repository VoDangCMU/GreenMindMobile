import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface INightOutFreq {
  night_out_count: number;
  base_night_out: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function night_out_freq(question_data: INightOutFreq) {
  return AIApi.post('/night_out_freq', question_data).then(res => res.data as IMonitorOceanResponse);
}