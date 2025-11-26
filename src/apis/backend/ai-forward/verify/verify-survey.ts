import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

function normalizeOCEAN(ocean: IOcean): IOcean {
    return {
        O: ocean.O > 1 ? ocean.O / 100 : ocean.O,
        C: ocean.C > 1 ? ocean.C / 100 : ocean.C,
        E: ocean.E > 1 ? ocean.E / 100 : ocean.E,
        A: ocean.A > 1 ? ocean.A / 100 : ocean.A,
        N: ocean.N > 1 ? ocean.N / 100 : ocean.N,
    };
}

export default async function verifySurvey(payload: IVerifySurveyPayload) {
    const normalizedPayload = {
        ...payload,
        survey_result: normalizeOCEAN(payload.survey_result),
    };
    return BackendInstance.post('/questions/survey-verify', normalizedPayload, { headers: authHeader() }).then(res => res.data as IVerifySurveyResponse);
}
