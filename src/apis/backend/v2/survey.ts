import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface IUser {
  id: string;
  email: string;
  [key: string]: any;
}

export interface ISurveyResponse {
  success: boolean
  message: string
  data: ISurveyData
}

export type ITrait = 'O' | 'C' | 'E' | 'A' | 'N' | null;

export interface ISurveyModel {
  id: string
  ocean: string
  behavior: string
  age: string
  location: string
  gender: string
  keywords: string
  createdAt: string
  updatedAt: string
}

export interface ISurveyData {
  questions: ISurveyQuestion[]
  count: number
}

export interface ISurveyQuestion {
  id: string
  question: string
  templateId: string
  behaviorInput: string
  behaviorNormalized: string
  normalizeScore: any
  trait: ITrait
  ownerId: string
  createdAt: string
  updatedAt: string
  template: ITemplate
  model: ISurveyModel
  questionOptions: ISurveyQuestionOption[]
}

export interface ITemplate {
  id: string
  name: string
  description: string
  intent: string
  prompt: string
  used_placeholders: string[]
  question_type: string
  filled_prompt: string
  trait: ITrait
  createdAt: string
  updatedAt: string
}

export interface ISurveyQuestionOption {
  id: string
  text: string
  value: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface ISubmitSurveyParams {
  userId: string;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

export interface ISubmitSurveyResponse {
  message: string;
  totalAnswered: number;
  data: Array<{
    userId: string;
    questionId: string;
    answer: string;
    timestamp: string;
  }>;
}

// Pre app survey
export interface IPreAppSurveyResponse {
  id: string
  userId: string
  dailySpending: string
  dailySpendingSigmoid: any
  dailySpendingWeight: any
  dailySpendingDirection: any
  dailySpendingAlpha: any
  spendingVariation: number
  spendingVariationSigmoid: any
  spendingVariationWeight: any
  spendingVariationDirection: any
  spendingVariationAlpha: any
  brandTrial: number
  brandTrialSigmoid: any
  brandTrialWeight: any
  brandTrialDirection: any
  brandTrialAlpha: any
  shoppingList: number
  shoppingListSigmoid: any
  shoppingListWeight: any
  shoppingListDirection: any
  shoppingListAlpha: any
  dailyDistance: string
  dailyDistanceSigmoid: any
  dailyDistanceWeight: any
  dailyDistanceDirection: any
  dailyDistanceAlpha: any
  newPlaces: number
  newPlacesSigmoid: any
  newPlacesWeight: any
  newPlacesDirection: any
  newPlacesAlpha: any
  publicTransport: number
  publicTransportSigmoid: any
  publicTransportWeight: any
  publicTransportDirection: any
  publicTransportAlpha: any
  stableSchedule: any
  stableScheduleSigmoid: any
  stableScheduleWeight: any
  stableScheduleDirection: any
  stableScheduleAlpha: any
  nightOutings: number
  nightOutingsSigmoid: any
  nightOutingsWeight: any
  nightOutingsDirection: any
  nightOutingsAlpha: any
  healthyEating: number
  healthyEatingSigmoid: any
  healthyEatingWeight: any
  healthyEatingDirection: any
  healthyEatingAlpha: any
  socialMedia: any
  goalSetting: any
  moodSwings: any
  isCompleted: boolean
  completedAt: string
  createdAt: string
  updatedAt: string
  user: IUser
}

export async function getSurveyQuestions(): Promise<ISurveyResponse> {
  const res = await BackendInstance.get("/survey/questions", { headers: authHeader() });
  return res.data as ISurveyResponse;
}

export async function submitSurveyResponses(params: ISubmitSurveyParams): Promise<ISubmitSurveyResponse> {
  const res = await BackendInstance.post("/user-answers/submit", params, { headers: authHeader() });
  return res.data as ISubmitSurveyResponse;
}

export async function getPreAppSurvey(userId: string) {
    const res = await BackendInstance.get(`/pre-app-survey/${userId}`, { headers: authHeader() })
    return res.data as IPreAppSurveyResponse;
}

export async function getAllQuestionSet() {
  const res = await BackendInstance.get(`/question-sets`, { headers: authHeader() })
    return res.data as IPreAppSurveyResponse;
}

// QS
export interface IQuestionSetResponse {
  message: string
  data: IQuestionSetData[]
  count: number
}




export async function getUserQuestionSet() {
  const res = await BackendInstance.get(`/question-sets/my-sets`, { headers: authHeader() })
    return res.data as IQuestionSetResponse;
}

export interface IQuestionSetData {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
  owner: IOwner
  items: IQuestionItem[]
}

export interface IOwner {
  id: string
  username: string
  email: string
  phoneNumber: any
  fullName: string
  gender: string
  location: string
  role: string
  dateOfBirth: string
  createdAt: string
  updatedAt: string
}

export interface IQuestionItem {
  id: string
  question: string
  templateId: string
  behaviorInput: string
  behaviorNormalized: string
  normalizeScore: any
  trait: string
  ownerId: any
  createdAt: string
  updatedAt: string
  questionOptions: IQuestionOption[]
  template: ITemplate
}

export interface IQuestionOption {
  id: string
  text: string
  value: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface ITemplate {
  id: string
  name: string
  description: string
  intent: string
  prompt: string
  used_placeholders: string[]
  question_type: string
  filled_prompt: string
  trait: ITrait
  createdAt: string
  updatedAt: string
}

export async function getQuestionSetById(id: string) {
  const res = await BackendInstance.get(`/question-sets/${id}`, { headers: authHeader() })
    return res.data as ISurveyResponse;
}