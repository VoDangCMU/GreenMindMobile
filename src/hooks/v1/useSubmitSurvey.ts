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
            console.log("[useSubmitSurvey] Starting submission...");
            console.log("[useSubmitSurvey] Answers:", answers);
            console.log("[useSubmitSurvey] RawQuestion:", rawQuestion);

            const userId = user?.id || "test-user-id";
            const payload = {
                userId,
                answers: Object.entries(answers).map(([questionId, answer]) => ({
                    questionId,
                    answer,
                })),
            };

            console.log("[useSubmitSurvey] Payload:", payload);

            let combineRes;
            try {
                combineRes = combineQuestionWithTemplate(rawQuestion, payload);
                console.log("[useSubmitSurvey] Combined result:", combineRes);
            } catch (error) {
                console.error("[useSubmitSurvey] Error in combineQuestionWithTemplate:", error);
                throw new Error("Failed to combine question with template: " + (error as Error).message);
            }

            // Convert all numeric answers to strings for calculate_ocean
            const normalizedCombineRes = {
                ...combineRes,
                answers: combineRes.answers.map(answer => ({
                    ...answer,
                    ans: String(answer.ans)
                }))
            };

            console.log("[useSubmitSurvey] Normalized result:", normalizedCombineRes);

            let ocean;
            try {
                ocean = await calculate_ocean(normalizedCombineRes);
                console.log("[useSubmitSurvey] Ocean scores:", ocean);
            } catch (error) {
                console.error("[useSubmitSurvey] Error calculating ocean (likely CORS):", error);
                console.warn("[useSubmitSurvey] Skipping OCEAN score update");
                ocean = null;
            }

            try {
                await submitUserAnswers(payload);
                console.log("[useSubmitSurvey] Submitted user answers successfully");
            } catch (error) {
                console.error("[useSubmitSurvey] Error submitting user answers:", error);
                // Continue even if this fails
            }

            if (ocean) {
                setOcean(ocean.scores);

                try {
                    await createUserOcean(userId, ocean.scores);
                    console.log("[useSubmitSurvey] Created user ocean successfully");
                } catch (error) {
                    console.error("[useSubmitSurvey] Error creating user ocean:", error);
                    // Continue even if this fails
                }

                // Extract models from the question data
                try {
                    const models = extractModelsFormQuestion(rawQuestion.data.questions);
                    console.log("[useSubmitSurvey] Extracted models:", models);

                    models.forEach(model => {
                        try {
                            const verifyPayload: IVerifySurveyPayload = {
                                model,
                                user_id: userId,
                                survey_result: ocean.scores
                            }
                            verifySurvey(verifyPayload);
                        } catch (error) {
                            console.error("[useSubmitSurvey] Error verifying survey for model:", model, error);
                        }
                    });
                } catch (error) {
                    console.error("[useSubmitSurvey] Error extracting/verifying models:", error);
                    // Continue even if this fails
                }

                toast.success(
                    `Đã cập nhật điểm O: ${ocean.scores.O} C: ${ocean.scores.C} E: ${ocean.scores.E} A: ${ocean.scores.A} N: ${ocean.scores.N}`
                );
            } else {
                toast.info("Đã lưu câu trả lời (không tính được điểm OCEAN)");
            }

            return ocean;
        } catch (err) {
            console.error("[useSubmitSurvey] Fatal error:", err);
            toast.error("Có lỗi xảy ra khi gửi câu trả lời: " + (err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitSurvey, loading };
};
