import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse } from "./types";

export default async function night_out_freq(question_data: INightOutParams) {
  return AIApi.post('/night_out_freq', question_data).then(res => res.data as IMonitorOceanResponse);
}