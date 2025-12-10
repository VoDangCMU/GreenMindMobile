import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import combineQuestionWithTemplate from "@/helpers/combineQuestionWithTemplate";
import calculate_ocean from "@/apis/ai/calculate_ocean_score";
import { submitUserAnswers } from "@/apis/backend/v1/userAnswer";
import { createUserOcean } from "@/apis/backend/v1/ocean";
import { verifySurvey } from "@/apis/backend/v1/ai-forward/verify/verify-survey";
import type { IVerifySurveyPayload } from "@/apis/backend/v1/ai-forward/verify/verify-survey";
import extractModelsFormQuestion from "@/helpers/extractModelsFormQuestion";
import type { IQuestionResponse } from "@/types/api/question";

export const useSubmitSurvey = () => {
    const setOcean = useAppStore((state) => state.setOcean);
    const user = useAuthStore((state) => state.user);
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const submitSurvey = async (
        answers: Record<string, string>,
        rawQuestion: IQuestionResponse,
    ) => {
        setLoading(true);
        try {
            const userId = user?.id || "test-user-id";
            const payload = {
                userId,
                answers: Object.entries(answers).map(([questionId, answer]) => ({
                    questionId,
                    answer,
                })),
            };

            const combineRes = combineQuestionWithTemplate(rawQuestion, payload);

            // Convert all numeric answers to strings for calculate_ocean
            const normalizedCombineRes = {
                ...combineRes,
                answers: combineRes.answers.map(answer => ({
                    ...answer,
                    ans: String(answer.ans)
                }))
            };

            const ocean = await calculate_ocean(normalizedCombineRes);
            await submitUserAnswers(payload);

            console.log("ocean", ocean);
            setOcean(ocean.scores);
            createUserOcean(userId, ocean.scores);

            // Extract models from the question data
            const models = extractModelsFormQuestion(rawQuestion.data.questions);

            models.forEach(model => {
                const verifyPayload: IVerifySurveyPayload = {
                    model,
                    user_id: userId,
                    survey_result: ocean.scores
                }
                verifySurvey(verifyPayload);
            })

            toast.success(
                `Đã cập nhật điểm O: ${ocean.scores.O} C: ${ocean.scores.C} E: ${ocean.scores.E} A: ${ocean.scores.A} N: ${ocean.scores.N}`
            );
            return ocean;
        } catch (err) {
            console.error("submitUserAnswers error:", err);
            toast.error("Có lỗi xảy ra khi gửi câu trả lời");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitSurvey, loading };
};
