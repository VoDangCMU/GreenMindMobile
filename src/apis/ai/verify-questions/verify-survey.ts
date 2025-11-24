import AIApi from "@/apis/instances/AIInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function verifySurvey(payload: IVerifySurveyPayload): Promise<IVerifySurveyResponse> {
    return AIApi.post("/verify-survey", payload, { headers: authHeader() }).then(res => res.data as IVerifySurveyResponse);
}