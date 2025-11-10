import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface IPublicTransitRatio {
  public_transit_trips: number;
  total_trips: number;
  base_likert: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function public_transit_ratio(question_data: IPublicTransitRatio) {
  return AIApi.post('/public_transit_ratio', question_data).then(res => res.data as IMonitorOceanResponse);
}