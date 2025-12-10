import type { IQuestionResponse } from "@/types/api/question";

interface ICombineOutput { user_id: string; answers: IAnswer[]; }
interface IAnswer { trait: string; template_id: string; intent: string; question: string; ans: string | number; score: number; key: IKey; kind: string; }
declare type IKey = "pos" | "neg";

interface IUserAnswer { userId: string; answers: Array<{ questionId: string; answer: string; }>; }

const KEY_PER_QUESTION_TYPE: Record<string, IKey> = {
    "yesno": "pos",
    "likert5": "pos",
    "frequency": "pos",
    "rating": "pos",
}

const SCORE_PER_QUESTION_TYPE: Record<string, Record<string, number>> = {
    yesno: {
        "Không": 0,
        "Có": 1,
    },

    likert5: {
        "Rất không thích": 1,
        "Không thích": 2,
        "Bình thường": 3,
        "Thích": 4,
        "Rất thích": 5,
    },

    frequency: {
        "Không bao giờ": 1,
        "Hiếm khi": 1,
        "Thỉnh thoảng": 2,
        "Thường xuyên": 3,
        "Rất thường xuyên": 4,
    },

    rating: {
        "Rất tệ": 1,
        "Tệ": 2,
        "Bình thường": 3,
        "Tốt": 4,
        "Rất tốt": 5,
    },
};

const ANS_PER_QUESTION_TYPE: Record<string, Record<string, string>> = {
    likert5: {
        "Rất không thích": "1",
        "Không thích": "2",
        "Bình thường": "3",
        "Thích": "4",
        "Rất thích": "5",
    },
    rating: {
        "Rất tệ": "1",
        "Tệ": "2",
        "Bình thường": "3",
        "Tốt": "4",
        "Rất tốt": "5",
    },
}

function randomOCEAN(): string {
    const traits = ["O", "C", "E", "A", "N"];
    const index = Math.floor(Math.random() * traits.length);
    return traits[index];
}

export default function combineQuestionWithTemplate(
    questiondata: IQuestionResponse,
    userAnswers: IUserAnswer
): ICombineOutput {
    const answers: IAnswer[] = userAnswers.answers.map(userAnswer => {
        const q = questiondata.data.questions.find(q => q.id === userAnswer.questionId);

        if (!q) {
            return {
                trait: "unknown",
                template_id: "unknown",
                intent: "unknown",
                question: "unknown",
                ans: userAnswer.answer,
                score: 0,
                key: "pos",
                kind: "unknown",
            };
        }

        const behavior = q.behaviorNormalized;

        const key = KEY_PER_QUESTION_TYPE[behavior] ?? "pos";
        const score =
            SCORE_PER_QUESTION_TYPE[behavior]?.[userAnswer.answer] ?? 0;

        return {
            trait: q.trait ?? randomOCEAN(),
            template_id: q.templateId,
            intent: q.template.intent,
            question: q.question,
            // ans: userAnswer.answer,
            ans: ANS_PER_QUESTION_TYPE[behavior]?.[userAnswer.answer] ?? userAnswer.answer,
            score,
            key,
            kind: behavior,
        };
    });

    return {
        user_id: userAnswers.userId,
        answers,
    };
}
