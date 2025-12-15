import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Check } from "lucide-react";

import getQuestionSetById from "@/apis/backend/v2/survey/getQuestionSetById";
import { submitUserAnswers } from "@/apis/backend/v1/userAnswer";

import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";

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

  const [searchParams] = useSearchParams();
  const qsId = searchParams.get("surveyId");

  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  /* Fetch questions */
  useEffect(() => {
    if (!qsId) return;

    getQuestionSetById(qsId)
      .then((data) => {
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
      await submitUserAnswers({
        userId: user?.id || "test-user",
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
      });
      toast.success("Câu trả lời đã được gửi");
    } catch (err) {
      console.error(err);
      toast.error("Không thể gửi câu trả lời");
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
    <div className="w-full bg-white border-t" style={{paddingBottom: "env(safe-area-inset-bottom)",}}>
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
      </>
    </SafeAreaLayout>
  );
}
