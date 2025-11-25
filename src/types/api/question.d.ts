declare interface IUserTypeQuery {
    userId: string;
    location: string;
    age: number;
    filteredCount: number;
    validCount: number;
    randomCount: number;
}

declare enum IBehaviorNormalized {
    Frequency = "frequency",
    Likert5 = "likert5",
    Rating = "rating",
    Yesno = "yesno",
}

declare interface IAnswerOption {
    text: string;
    value: string;
    order: number;
}

declare interface IQuestionTemplate {
    id: string;
    name: string;
    description: string;
    intent: IBehaviorNormalized;
    question_type: IBehaviorNormalized;
}

declare interface IQuestionModel {
    id: string
    ocean: string
    behavior: string
    age: string
    location: string
    gender: string
    keywords: string
}

declare interface IQuestionData {
    id: string;
    question: string;
    templateId: string;
    behaviorInput: string;
    behaviorNormalized: IBehaviorNormalized;
    template: IQuestionTemplate;
    options: IAnswerOption[];
    trait: string;
    model: IQuestionModel;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IGetQuestionResponse {
    message: string;
    data: IQuestionData[];
    count: number;
    userInfo: IUserTypeQuery;
}