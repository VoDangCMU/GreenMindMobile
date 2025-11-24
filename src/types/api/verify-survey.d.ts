declare interface ISurveyModel {
    id: string;
    ocean: string;
    behavior: string;
    age: string;
    location: string;
    gender: string;
    keywords: string;
}

declare interface IVerifySurveyPayload {
    model: ISurveyModel;
    user_id: string;
    survey_result: IOcean;
}

declare interface IVerifySurveyResponse {
    model_id: string;
    user_id: string;
    trait_checked: string;
    expected: number;
    actual: number;
    deviation: number;
    match: boolean;
    level: string;
    feedback: string[];
}