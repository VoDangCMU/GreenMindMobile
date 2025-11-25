import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function verifySurvey(payload: IVerifySurveyPayload) {
    return BackendInstance.post('/questions/survey-verify', payload, { headers: authHeader() }).then(res => res.data as IVerifySurveyResponse);
}
