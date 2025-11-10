import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export interface IListAdherence {
  todos: Array<{
    task: string;
    done: boolean;
  }>;
  base_likert: number;
  weight: number;
  direction: string;
  sigma_r: number;
  alpha: number;
  ocean_score: OceanScore;
}

export default async function list_adherence(question_data: IListAdherence) {
  return AIApi.post('/list_adherence', question_data).then(res => res.data as IMonitorOceanResponse);
}