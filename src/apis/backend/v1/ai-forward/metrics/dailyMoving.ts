import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function dailyMoving({
    distance_today,
    base_avg_distance,
    weight = 0.2,
    direction = "up",
    sigma_r = 1,
    alpha = 0.5,
    ocean_score
}: IDailyMovingParams) {
    return BackendInstance.post('/metrics/daily-distance-km', {
        distance_today,
        base_avg_distance,
        weight,
        direction,
        sigma_r,
        alpha,
        ocean_score
    }, { headers: authHeader() }).then(res => res.data as IMonitorOceanResponse);
}
