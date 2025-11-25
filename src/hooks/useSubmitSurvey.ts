import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import combineQuestionWithTemplate from "@/helpers/combineQuestionWithTemplate";
import calculate_ocean from "@/apis/ai/calculate_ocean_score";
import { submitUserAnswers } from "@/apis/backend/userAnswer";
import { createUserOcean } from "@/apis/backend/ocean";
import verifySurvey from "@/apis/backend/ai-forward/verify/verify-survey";
import extractModelsFormQuestion from "@/helpers/extractModelsFormQuestion";

export const useSubmitSurvey = () => {
    const setOcean = useAppStore((state) => state.setOcean);
    const user = useAuthStore((state) => state.user);
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const submitSurvey = async (
        answers: Record<string, string>,
        rawQuestion: IGetQuestionResponse,
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

            const ocean = await calculate_ocean(combineRes);
            await submitUserAnswers(payload);

            console.log("ocean", ocean);
            setOcean(ocean.scores);
            createUserOcean(userId, ocean.scores);

            const models = extractModelsFormQuestion(rawQuestion);

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
