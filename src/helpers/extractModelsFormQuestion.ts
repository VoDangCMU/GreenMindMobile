import type { ISurveyQuestion } from "@/apis/backend/v2/survey";

export default function extractModelsFormQuestion(
    questiondata: ISurveyQuestion[],
) {
    const models = questiondata.map(q => q.model).filter((model) => model !== null);

    const uniqueModels: any[] = [];

    models.forEach(model => {
        if (!uniqueModels.find(m => m.id === model.id)) {
            uniqueModels.push(model);
        }
    })

    return uniqueModels;
}