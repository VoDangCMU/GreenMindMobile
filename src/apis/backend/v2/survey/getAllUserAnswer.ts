import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface ISurveyQuestionsAnswerResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    status: string;
    createAt: string;

    scenario: {
      id: string;
      minAge: number;
      maxAge: number;
      location: string[];
      percentage: number;
      gender: string;
      status: string;
      createdAt: string;
      updatedAt: string;

      questionSet: {
        id: string;
        name: string;
        description: string;
        ownerId: string;
        createdAt: string;
        updatedAt: string;

        items: Array<{
          id: string;
          question: string;
          templateId: string;
          behaviorInput: string;
          behaviorNormalized: string;
          normalizeScore: number | null;
          trait: string;
          ownerId: string;
          createdAt: string;
          updatedAt: string;

          template: {
            id: string;
            name: string;
            description: string;
            intent: string;
            prompt: string;
            used_placeholders: string[];
            question_type: string;
            filled_prompt: string;
            trait: string | null;
            createdAt: string;
            updatedAt: string;
          };

          model: {
            id: string;
            ocean: string;
            behavior: string;
            keyword: string;
            setting: string;
            event: string;
            age: string;
            location: string;
            gender: string;
            keywords: string;
            urban: boolean;
            createdAt: string;
            updatedAt: string;
          };

          questionOptions: Array<{
            id: string;
            text: string;
            value: string;
            order: number;
            createdAt: string;
            updatedAt: string;
          }>;

          userAnswers: Array<{
            userId: string;
            questionId: string;
            answer: string;
            timestamp: string;
            createdAt: string;
            updatedAt: string;
          }>;
        }>;
      };
    };
  }>;
}

export default async function getAllUserAnswer() {
  const res = await BackendInstance.get(`/scenarios-survey/get-all-user-question`, { headers: authHeader() })
    return res.data as ISurveyQuestionsAnswerResponse;
}