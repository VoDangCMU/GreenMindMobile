import type { IQuestionResponse } from "@/types/api/question";
import BackendInstance from "../../instances/BackendInstance";
import { authHeader } from "../../instances/getToken";

// export default async function getQuestions() {
//   const res = await BackendInstance.get("/questions/survey", { headers: authHeader() });
//   return res.data as IGetQuestionResponse;
// }

export default async function getQuestions() {
  const res = await BackendInstance.get("/scenarios-survey/get-user-survey-question", { headers: authHeader() });
  return res.data as IQuestionResponse;
}

// export async function getQuestionsTemplateForAI() {
//   const res = await BackendInstance.get(`/questions`, { headers: authHeader() });
//   return res.data as IGetQuestionResponse;
// }