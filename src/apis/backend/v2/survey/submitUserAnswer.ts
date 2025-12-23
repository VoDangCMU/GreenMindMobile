import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface ISubmitUserAnswerParams {
    userId: string;
    answers: Array<{
        questionId: string;
        answer: string;
    }>;
}

export interface ISubmitUserAnswerResponse {
    data: Array<{
        answer: string;
        questionId: string;
        timestamp: any[] | boolean | number | number | { [key: string]: any } | null | string;
        userId: string;
        [property: string]: any;
    }>;
    message: string;
    totalAnswered: number;
    [property: string]: any;
}

export default async function submitUserAnswer(params: ISubmitUserAnswerParams) {
  const res = await BackendInstance.post(`/user-answers/submit`, params, { headers: authHeader() });
    return res.data as ISubmitUserAnswerResponse;
}