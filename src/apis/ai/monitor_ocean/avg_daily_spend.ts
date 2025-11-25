import AIApi from "@/apis/instances/AIInstance";
import type { IMonitorOceanResponse, OceanScore } from "./types";

export default async function avg_daily_spend({
  daily_total,
  base_avg,
  weight = 0.2,
  direction = "down",
  sigma_r = 1,
  alpha = 0.5,
  ocean_score
}: IDailySpending) {
  return AIApi.post('/avg_daily_spend', {
    daily_total,
    base_avg,
    weight,
    direction,
    sigma_r,
    alpha,
    ocean_score
  }).then(res => res.data as IMonitorOceanResponse);
}
