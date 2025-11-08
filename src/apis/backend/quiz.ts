import AIInstance from "../instances/AIInstance";

export interface IGenQuizPayload {
  ocean: string;
  behavior_input: string;
}

export async function getQuiz(payload: IGenQuizPayload) {
  const res = await AIInstance.post("/gen-question", payload);
  return res.data;
}
