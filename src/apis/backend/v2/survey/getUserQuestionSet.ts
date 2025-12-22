import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface IQuestionSetResponse {
  success: boolean
  message: string
  data: IQuestionSetData[]
}

export interface IQuestionSetData {
  id: string
  status: string
  createAt: string
  scenario: Scenario
}

export interface Scenario {
  id: string
  minAge: number
  maxAge: number
  location: string[]
  percentage: number
  gender: any
  status: string
  createdAt: string
  updatedAt: string
  questionSet: IQuestionSet
}

export interface IQuestionSet {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
  items: Item[]
}

export interface Item {
  id: string
  question: string
  templateId: string
  behaviorInput: string
  behaviorNormalized: string
  normalizeScore: any
  trait: string
  ownerId: string
  createdAt: string
  updatedAt: string
}


export async function getUserQuestionSet() {
  const res = await BackendInstance.get(`/scenarios-survey/get-user-question-set-survey`, { headers: authHeader() })
    return res.data as IQuestionSetResponse;
}