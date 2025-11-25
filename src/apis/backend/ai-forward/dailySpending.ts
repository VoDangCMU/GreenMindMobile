import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function dailySpending({
    daily_total,
    base_avg,
    weight = 0.2,
    direction = "down",
    sigma_r = 1,
    alpha = 0.5,
    ocean_score
}: IDailySpending) {
    return BackendInstance.post('/daily-spending/create-daily-spending', {
        daily_total,
        base_avg,
        weight,
        direction,
        sigma_r,
        alpha,
        ocean_score
    }, { headers: authHeader() }).then(res => res.data as IMonitorOceanResponse);
}
