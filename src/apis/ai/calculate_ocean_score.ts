import AIApi from "../instances/AIInstance";

export interface IQuestionData {
    user_id: string;
    answers: Answer[];
}

export interface Answer {
    trait:       string;
    template_id: string;
    intent:      string;
    question:    string;
    ans:         string;
    score:       number;
    key:         Key;
    kind:        string;
}

export type Key = 'neg' | 'pos';

export const MOCKED_QUESTION_DATA: IQuestionData = {
  "user_id": "user_001",
  "answers": [
    {
      "trait": "O",
      "template_id": "T_FREQ_01",
      "intent": "frequency",
      "question": "Người có tính cách O, giới tính Nữ, độ tuổi 24, mức độ yêu thích hành động mua sắm đồ thủ công mỹ nghệ Huế là như thế nào?",
      "ans": "thường xuyên",
      "score": 4,
      "key": "pos",
      "kind": "frequency"
    },
    {
      "trait": "O",
      "template_id": "T_FREQ_02",
      "intent": "frequency",
      "question": "Người có tính cách O, thường thực hiện hành động mua sắm đồ thủ công mỹ nghệ Huế với tần suất nào?",
      "ans": "rất thường xuyên",
      "score": 5,
      "key": "pos",
      "kind": "frequency"
    },
    {
      "trait": "O",
      "template_id": "T_FREQ_03",
      "intent": "frequency",
      "question": "Người mua sắm có tính cách O, độ tuổi 24, mức độ thực hiện mua sắm đồ thủ công mỹ nghệ Huế như thế nào?",
      "ans": "thỉnh thoảng",
      "score": 2,
      "key": "pos",
      "kind": "frequency"
    },
    {
      "trait": "C",
      "template_id": "T_YN_01",
      "intent": "yesno",
      "question": "Người có tính cách C, giới tính Nữ, độ tuổi 24, có thực hiện mua sắm đồ thủ công mỹ nghệ Huế không?",
      "ans": "Có",
      "score": 1,
      "key": "pos",
      "kind": "yesno"
    },
    {
      "trait": "C",
      "template_id": "T_YN_02",
      "intent": "yesno",
      "question": "Người mua sắm có tính cách C có thường thực hiện mua sắm đồ thủ công mỹ nghệ Huế không?",
      "ans": "Không",
      "score": 0,
      "key": "neg",
      "kind": "yesno"
    },
    {
      "trait": "C",
      "template_id": "T_YN_03",
      "intent": "yesno",
      "question": "Người có tính cách C và độ tuổi 24 có thực hiện hành động mua sắm đồ thủ công mỹ nghệ Huế không?",
      "ans": "Có",
      "score": 1,
      "key": "pos",
      "kind": "yesno"
    },
    {
      "trait": "E",
      "template_id": "T_LIKERT_01",
      "intent": "likert5",
      "question": "Người có tính cách E, giới tính Nữ, độ tuổi 24, yêu thích hành động mua sắm đồ thủ công mỹ nghệ Huế ở mức nào?",
      "ans": "4",
      "score": 4,
      "key": "pos",
      "kind": "likert5"
    },
    {
      "trait": "E",
      "template_id": "T_LIKERT_02",
      "intent": "likert5",
      "question": "Người mua sắm có tính cách E, mức độ yêu thích mua sắm đồ thủ công mỹ nghệ Huế là như thế nào?",
      "ans": "3",
      "score": 3,
      "key": "pos",
      "kind": "likert5"
    },
    {
      "trait": "E",
      "template_id": "T_LIKERT_03",
      "intent": "likert5",
      "question": "Người có tính cách E, độ tuổi 24, cảm thấy mức độ yêu thích hành động mua sắm đồ thủ công mỹ nghệ Huế như thế nào?",
      "ans": "5",
      "score": 5,
      "key": "pos",
      "kind": "likert5"
    },
    {
      "trait": "A",
      "template_id": "T_RATING_01",
      "intent": "rating",
      "question": "Người có tính cách A đánh giá hành động mua sắm đồ thủ công mỹ nghệ Huế theo mức độ thế nào?",
      "ans": "4",
      "score": 4,
      "key": "pos",
      "kind": "rating"
    },
    {
      "trait": "A",
      "template_id": "T_RATING_02",
      "intent": "rating",
      "question": "Người mua sắm có tính cách A đánh giá hành động mua sắm đồ thủ công mỹ nghệ Huế như thế nào?",
      "ans": "5",
      "score": 5,
      "key": "pos",
      "kind": "rating"
    },
    {
      "trait": "A",
      "template_id": "T_RATING_03",
      "intent": "rating",
      "question": "Người có tính cách A, độ tuổi 24, đánh giá hành động mua sắm đồ thủ công mỹ nghệ Huế theo mức độ thế nào?",
      "ans": "3",
      "score": 3,
      "key": "pos",
      "kind": "rating"
    },
    {
      "trait": "N",
      "template_id": "T_FREQ_01",
      "intent": "frequency",
      "question": "Người có tính cách N, giới tính Nữ, độ tuổi 24, mức độ yêu thích hành động mua sắm đồ thủ công mỹ nghệ Huế là như thế nào?",
      "ans": "hiếm khi",
      "score": 1,
      "key": "neg",
      "kind": "frequency"
    }
  ]
}

export const MOCKED_OCEAN_SCORE: IOceanTraitScore = {
    O: 11,
    C: 10,
    E: 12,
    A: 9,
    N: 8
};

export interface IOceanTraitScore {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
}

export default async function calculate_ocean(question_data: IQuestionData) {
  return AIApi.post('/calculate_ocean', question_data).then(res => res.data as IOceanTraitScore);
}