import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function todoAffect({
    todos,
    base_likert,
    weight = 0.2,
    direction = "down",
    sigma_r = 1,
    alpha = 0.5,
    ocean_score
}: ITodoAffectParams) {
    return BackendInstance.post('/metrics/list-adherence', {
        todos,
        base_likert,
        weight,
        direction,
        sigma_r,
        alpha,
        ocean_score
    }, { headers: authHeader() }).then(res => res.data as IMonitorOceanResponse);
}
