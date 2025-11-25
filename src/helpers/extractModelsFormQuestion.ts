export default function extractModelsFormQuestion(
    questiondata: IGetQuestionResponse,
) {
    const models = questiondata.data.map(q => q.model).filter((model) => model !== null);

    const uniqueModels: IQuestionModel[] = [];

    models.forEach(model => {
        if (!uniqueModels.find(m => m.id === model.id)) {
            uniqueModels.push(model);
        }
    })

    return uniqueModels;
}