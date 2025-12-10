export interface IQuestionResponse {
  success: boolean
  message: string
  data: IQuestionData
}

export interface IQuestionData {
  questions: IQuestion[]
  count: number
}

export interface IQuestion {
  id: string
  question: string
  templateId: string
  behaviorInput: string
  behaviorNormalized: string
  normalizeScore: any
  trait: any
  ownerId: string
  createdAt: string
  updatedAt: string
  template: IQuestionTemplate
  model: any
  questionOptions: IQuestionData[]
}

export interface IQuestionTemplate {
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

export interface IQuestionData {
  id: string
  text: string
  value: string
  order: number
  createdAt: string
  updatedAt: string
}
