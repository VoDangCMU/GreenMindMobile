import BEApi from "@/apis/instances/BackendInstance";
import { storageKey } from "@/store/appStore";
import { authHeader } from "../instances/getToken";

export interface UserAnswerSubmitParams {
  userId: string;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

export interface UserAnswerSubmitResponse {
  message: string;
  totalAnswered: number;
  data: Array<{
    userId: string;
    questionId: string;
    answer: string;
    timestamp: string;
  }>;
}

export async function submitUserAnswers(params: UserAnswerSubmitParams) {
  const res = await BEApi.post<UserAnswerSubmitResponse>("/user-answers/submit", params, { headers: authHeader() });
  return res.data;
}

export async function getAllUserAnswers() {
  const res = await BEApi.get("/user-answers", { headers: authHeader() });
  return res.data;
}

export async function getUserAnswerByQuestionId(questionId: string) {
  const res = await BEApi.get(`/user-answers/get-UserAnswer-by-id/${questionId}`, { headers: authHeader() });
  return res.data;
}
