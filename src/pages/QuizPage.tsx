import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Check } from "lucide-react";

import getQuestionSetById from "@/apis/backend/v2/survey/getQuestionSetById";

import { useToast } from "@/hooks/useToast";
import OceanRadarChart from "@/components/hardcore-coder/OceanCard";
import calculate_ocean from "@/apis/ai/calculate_ocean_score";
import type { IQuestionData, IOceanTraitScore } from "@/apis/ai/calculate_ocean_score";
import { useAppStore } from "@/store/appStore";
import { ensureUserOcean } from "@/apis/backend/v1/ocean";
import type { ISubmitUserAnswerParams } from "@/apis/backend/v2/survey/submitUserAnswer";
import submitUserAnswer from "@/apis/backend/v2/survey/submitUserAnswer";
import { useAuthStore } from "@/store/authStore";
import getAllUserAnswer from "@/apis/backend/v2/survey/getAllUserAnswer";

const getLatestUserAnswer = (userAnswers: any[] = []) => {
  if (!userAnswers.length) return null;

  return userAnswers.reduce((latest, current) => {
    return new Date(current.timestamp) > new Date(latest.timestamp)
      ? current
      : latest;
  });
};

/* =========================
   Progress Icon Bar
========================= */

interface QuestionIconListProps {
  total: number;
  active?: number;
  selected?: number | null;
  onSelect?: (index: number) => void;
}

export function ProgressIconBar({
  total,
  active,
  selected,
  onSelect,
}: QuestionIconListProps) {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selected == null) return;
    const el = scrollRef.current?.querySelector(
      `[data-num="${selected}"]`
    ) as HTMLElement | null;
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selected]);

  return (
    <div className="w-full rounded-xl border bg-background p-2 overflow-hidden">
      <div className="overflow-x-auto" ref={scrollRef}>
        <div className="grid grid-flow-col grid-rows-1 gap-2 w-max pb-1">
          {items.map((num) => {
            const isActive = num === active;

            return (
              <Button
                key={num}
                size="icon"
                variant={isActive ? "default" : "outline"}
                data-num={num}
                onClick={() => onSelect?.(num - 1)}
                className={cn(
                  "h-11 w-11 rounded-full shrink-0",
                  num === selected && "ring-2 ring-primary ring-inset"
                )}
              >
                <span className="text-xs font-semibold">{num}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================
   MCQ Card
========================= */

export interface MCQOption {
  id: string;
  text: string;
}

interface MCQCardProps {
  question: string;
  options: MCQOption[];
  selected?: string | null;
  onSelect?: (id: string) => void;
  footer?: React.ReactNode;
  className?: string;
}

export function MCQCard({
  question,
  options,
  selected,
  onSelect,
  footer,
  className,
}: MCQCardProps) {
  return (
    <Card className={cn("w-full h-full border-0 shadow-xl flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {question}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 overflow-hidden">
        <div className="grid gap-3 overflow-auto pr-1">
          {options.map((opt, i) => {
            const isSelected = selected === opt.id;
            const label = String.fromCharCode(65 + i);

            return (
              <button
                key={opt.id}
                onClick={() => onSelect?.(opt.id)}
                aria-pressed={isSelected}
                className={cn(
                  "w-full p-3 rounded-lg border transition flex items-center gap-3 text-left",
                  isSelected
                    ? "bg-greenery-50 border-greenery-300"
                    : "bg-white border-gray-200 hover:border-greenery-200"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    isSelected
                      ? "bg-greenery-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {label}
                </div>

                <div className="flex-1 text-sm text-gray-800">
                  {opt.text}
                </div>

                <div className="w-6 flex items-center justify-center">
                  {isSelected && (
                    <Check className="w-4 h-4 text-greenery-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {footer && (
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* =========================
   Quiz Page
========================= */

export interface INormalizeSurveyQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  type: string;
  trait: string;
  templateId: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<INormalizeSurveyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [showOceanResult, setShowOceanResult] = useState(false);
  const [oceanResult, setOceanResult] = useState<IOceanTraitScore | null>(null);

  const [searchParams] = useSearchParams();
  const qsId = searchParams.get("surveyId");

  const toast = useToast();
  const currentOcean = useAppStore((s) => s.ocean);
  const setAppOcean = useAppStore((s) => s.setOcean);
  const user = useAuthStore(s => s.user);

  const navigator = useNavigate();

  /* Fetch questions */
  useEffect(() => {
    if (!qsId) return;

    getQuestionSetById(qsId)
      .then((data) => {
        // Map to normalized questions for UI
        const normalized = data.data.items.map((curr: any) => ({
          id: curr.id,
          question: curr.question,
          options: curr.questionOptions.map((opt: any) => ({
            id: opt.id,
            text: opt.text,
          })),
          type: curr.behaviorNormalized,
          trait: curr.trait,
          templateId: curr.templateId,
        }));

        setQuestions(normalized);
        setCurrentIndex(0);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [qsId]);

  /* Swipe handlers */
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const delta = touchStartX.current - touchEndX.current;

    if (Math.abs(delta) > 50) {
      if (delta > 0)
        setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
      else
        setCurrentIndex((i) => Math.max(i - 1, 0));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* Answer select */
  const handleSelect = (optionId: string) => {
    const q = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 180);
    }
  };

  /* Submit */
  const handleSubmitAnswers = async () => {
    setSubmitting(true);
    try {
      // Build IQuestionData from current questions + answers (no combine or store usage)
      // const userId = 'user_' + (Date.now());
      const calculateOceanParams: IQuestionData = { user_id: user?.id ?? '', answers: [] };
      const submitUserAnswersParams: ISubmitUserAnswerParams = {
        userId: user?.id ?? '',
        answers: [],
      };

      const KEY_PER_QUESTION_TYPE: Record<string, 'pos' | 'neg'> = {
        yesno: 'pos',
        likert5: 'pos',
        frequency: 'pos',
        rating: 'pos',
      };

      const SCORE_PER_QUESTION_TYPE: Record<string, Record<string, number>> = {
        yesno: { 'Không': 0, 'Có': 1 },
        likert5: { 'Rất không thích': 1, 'Không thích': 2, 'Bình thường': 3, 'Thích': 4, 'Rất thích': 5 },
        frequency: { 'Không bao giờ': 1, 'Hiếm khi': 1, 'Thỉnh thoảng': 2, 'Thường xuyên': 3, 'Rất thường xuyên': 4 },
        rating: { 'Rất tệ': 1, 'Tệ': 2, 'Bình thường': 3, 'Tốt': 4, 'Rất tốt': 5 },
      };

      const ANS_PER_QUESTION_TYPE: Record<string, Record<string, string>> = {
        likert5: { 'Rất không thích': '1', 'Không thích': '2', 'Bình thường': '3', 'Thích': '4', 'Rất thích': '5' },
        rating: { 'Rất tệ': '1', 'Tệ': '2', 'Bình thường': '3', 'Tốt': '4', 'Rất tốt': '5' },
      };

      const isNumeric = (v: string) => /^\d+$/.test(String(v));

      for (const q of questions) {
        const selectedOptionId = answers[q.id];
        const opt = q.options.find((o) => o.id === selectedOptionId);
        const rawAns = opt?.text ?? '';
        const kind = q.type || 'unknown';
        const key = KEY_PER_QUESTION_TYPE[kind] ?? 'pos';
        const score = SCORE_PER_QUESTION_TYPE[kind]?.[rawAns] ?? (isNumeric(rawAns) ? parseInt(rawAns) : 0);
        const ans = ANS_PER_QUESTION_TYPE[kind]?.[rawAns] ?? rawAns;

        calculateOceanParams.answers.push({
          trait: q.trait ?? 'O',
          template_id: q.templateId ?? '',
          intent: kind,
          question: q.question,
          ans: String(ans),
          score,
          key,
          kind,
        });

        submitUserAnswersParams.answers.push({
          questionId: q.id,
          answer: opt?.text ?? '',
        });

      }

      try {
        await submitUserAnswer(submitUserAnswersParams);
      } catch (err) {
        console.error('submitUserAnswer failed:', err);
      }


      // Call calculate_ocean directly
      try {
        const all_answers = await getAllUserAnswer();

        const new_calculate_params: IQuestionData = {
          user_id: user?.id ?? '',
          answers: [],
        };

        for (const qa of all_answers.data) {
          for (const item of qa.scenario.questionSet.items) {

            const latestAnswer = getLatestUserAnswer(item.userAnswers);

            const answerText = latestAnswer?.answer ?? '';
            const intent = item.behaviorNormalized ?? 'unknown';

            new_calculate_params.answers.push({
              trait: item.trait ?? 'O',
              template_id: item.templateId ?? '',
              intent,
              question: item.question,
              ans: answerText,
              score: SCORE_PER_QUESTION_TYPE[intent]?.[answerText] ?? 0,
              key: KEY_PER_QUESTION_TYPE[intent] ?? 'pos',
              kind: intent,
            });
          }
        }

        const res = await calculate_ocean(new_calculate_params);
        setShowOceanResult(true);

        // Filter traits: Only update traits that are present in the current question set
        const relevantTraits = new Set(questions.map(q => q.trait).filter(Boolean));

        let initialOcean = { ...currentOcean };
        // If currentOcean is missing (null/undefined), initialize with defaults or zeros
        if (!initialOcean.O) initialOcean = { O: 50, C: 50, E: 50, A: 50, N: 50 }; // Or 0 if preferred, but existing code used currentOcean

        const mergedScores = { ...initialOcean };

        // Only update relevant traits
        for (const t of relevantTraits) {
          const traitKey = t as keyof IOceanTraitScore;
          if (res.scores[traitKey] !== undefined) {
            mergedScores[traitKey] = res.scores[traitKey];
          }
        }

        setOceanResult(mergedScores as IOceanTraitScore);
        toast.success('OCEAN calculated (Partial Update)');

        setAppOcean(ensureUserOcean(mergedScores as IOceanTraitScore));
      } catch (err) {
        console.error('calculate_ocean failed:', err);

        // Fallback: use ocean currently in store (if available), otherwise zeros
        if (currentOcean) {
          setOceanResult(currentOcean);
        } else {
          setOceanResult({ O: 0, C: 0, E: 0, A: 0, N: 0 });
        }
        setShowOceanResult(true);
      }

    } catch (err) {
      console.error(err);
      toast.error('Không thể gửi câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered =
    questions.length > 0 &&
    Object.keys(answers).length === questions.length;

  /* Footer */
  const FooterContent = (
    <div className="w-full bg-white border-t" style={{ paddingBottom: "env(safe-area-inset-bottom)", }}>
      <div className="max-w-md mx-auto p-3">
        {!isLastQuestion && (
          <Button
            className="w-full"
            onClick={() =>
              setCurrentIndex((i) =>
                Math.min(i + 1, questions.length - 1)
              )
            }
          >
            Next
          </Button>
        )}

        {isLastQuestion && (
          <Button
            className="w-full h-14 bg-greenery-500 text-white"
            disabled={!allAnswered || submitting}
            onClick={handleSubmitAnswers}
          >
            {submitting
              ? "Đang gửi..."
              : allAnswered
                ? "Submit"
                : "Trả lời tất cả để gửi"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <SafeAreaLayout
      header={<AppHeader title="Quiz" showBack />}
      footer={FooterContent}
    >
      <>
        <div className="px-2">
          <ProgressIconBar
            total={questions.length}
            active={currentIndex + 1}
            selected={currentIndex + 1}
            onSelect={setCurrentIndex}
          />
        </div>

        {questions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading questions...</p>
          </div>
        ) : (
          <div
            className="flex-1 p-2 flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <MCQCard
              question={questions[currentIndex].question}
              options={questions[currentIndex].options}
              selected={answers[questions[currentIndex].id] ?? null}
              onSelect={handleSelect}
              className="flex-1"
              footer={
                <Button
                  variant="ghost"
                  onClick={() =>
                    setAnswers((a) => {
                      const copy = { ...a };
                      delete copy[questions[currentIndex].id];
                      return copy;
                    })
                  }
                >
                  Clear
                </Button>
              }
            />
          </div>
        )}

        {/* Ocean result modal / card */}
        {showOceanResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="max-w-xl w-full bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your OCEAN Result</h3>
                <button className="p-1 rounded-md text-gray-500 hover:bg-gray-100" onClick={() => setShowOceanResult(false)} aria-label="Close">
                  ✕
                </button>
              </div>
              <OceanRadarChart scores={oceanResult ?? undefined} />
              <div className="mt-4 flex justify-end">
                <Button onClick={() => {
                  setShowOceanResult(false);
                  navigator(-1);
                }}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </>
    </SafeAreaLayout>
  );
}
