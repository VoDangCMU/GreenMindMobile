import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface IVerifySurveyPayload {
    model: string;
    user_id: string;
    survey_result: IOcean;
}

export interface IVerifySurveyResponse {
    success: boolean;
    message: string;
    data?: any;
}

function normalizeOCEAN(ocean: IOcean): IOcean {
    return {
        O: ocean.O > 1 ? ocean.O / 100 : ocean.O,
        C: ocean.C > 1 ? ocean.C / 100 : ocean.C,
        E: ocean.E > 1 ? ocean.E / 100 : ocean.E,
        A: ocean.A > 1 ? ocean.A / 100 : ocean.A,
        N: ocean.N > 1 ? ocean.N / 100 : ocean.N,
    };
}

export async function verifySurvey(payload: IVerifySurveyPayload) {
    const normalizedPayload = {
        ...payload,
        survey_result: normalizeOCEAN(payload.survey_result),
    };
    return BackendInstance.post('/questions/survey-verify', normalizedPayload, { headers: authHeader() }).then(res => res.data as IVerifySurveyResponse);
}
