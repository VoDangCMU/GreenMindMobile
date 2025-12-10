import AIApi from "@/apis/instances/AIInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface IVerifySurveyPayload {
    model: string;
    user_id: string;
    survey_result: Record<string, number>;
}

export interface IVerifySurveyResponse {
    success: boolean;
    message: string;
    data?: any;
}

export async function verifySurvey(payload: IVerifySurveyPayload): Promise<IVerifySurveyResponse> {
    return AIApi.post("/verify-survey", payload, { headers: authHeader() }).then(res => res.data as IVerifySurveyResponse);
}