import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function nightOut({
    night_out_count,
    base_night_out,
    weight = 0.2,
    direction = "up",
    sigma_r = 1,
    alpha = 0.5,
    ocean_score
}: INightOutParams) {
    return BackendInstance.patch('/night-out-freq/night-out', {
        night_out_count,
        base_night_out,
        weight,
        direction,
        sigma_r,
        alpha,
        ocean_score
    }, { headers: authHeader() }).then(res => res.data as IMonitorOceanResponse);
}
