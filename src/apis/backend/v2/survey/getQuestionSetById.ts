import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface IGetQuestionSetByIdResponse {
  message: string
  data: Data
}

export interface Data {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
  owner: Owner
  items: Item[]
}

export interface Owner {
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
  questionOptions: QuestionOption[]
  template: Template
}

export interface QuestionOption {
  id: string
  text: string
  value: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  description: string
  intent: string
  prompt: string
  used_placeholders: string[]
  question_type: string
  filled_prompt: string
  trait: any
  createdAt: string
  updatedAt: string
}

export default async function getQuestionSetById(id: string) {
  const res = await BackendInstance.get(`/question-sets/${id}`, { headers: authHeader() })
    return res.data as IGetQuestionSetByIdResponse;
}