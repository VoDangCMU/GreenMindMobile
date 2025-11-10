import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight, Brain, Inbox, Star } from "lucide-react";
import { Link } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { toast } from "sonner";
import { getQuestionTemplates } from "@/apis/backend/question";
import { submitUserAnswers } from "@/apis/backend/userAnswer";
import { useAppStore } from "@/store/appStore";

interface QuestionOption {
  text: string;
  value: string;
  order: number;
}

interface Question {
  id: string;
  question: string;
  behaviorNormalized: string;
  options: QuestionOption[];
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAppStore((state) => state.user);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    setQuestions([]);
    setShowResults(false);
    setAnswers({});
    setCurrent(0);
    try {
      const res = await getQuestionTemplates();

      console.log("Fetched question templates:", res);

      const raw = res ?? {};

      setQuestions(raw);

      console.log(questions);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải câu hỏi. Vui lòng thử lại sau 😭");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[current].id]: option,
    }));
  };

  const handleNext = async () => {
    const q = questions[current];
    if (!answers[q.id]) {
      toast.warning("Bạn cần chọn một đáp án trước khi tiếp tục 💡");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      // Submit answers to backend
      try {
        const userId = user?.id || "test-user-id";
        const payload = {
          userId,
          answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
        };
        const res = await submitUserAnswers(payload);
        console.log("submitUserAnswers response:", res);
      } catch (err) {
        console.error("submitUserAnswers error:", err);
      }
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const calculateResults = () => ({
    totalQuestions: questions.length,
    answered: Object.keys(answers).length,
  });

  // 🧠 Loading
  if (loading) {
    return (
      <SafeAreaLayout header={<AppHeader title="Quiz Tính Cách" showBack />}>
        <div className="h-screen flex flex-col items-center justify-center space-y-3 text-center animate-pulse">
          <Brain className="w-12 h-12 text-greenery-500 animate-bounce" />
          <p className="text-gray-500 text-sm">Đang tải câu hỏi...</p>
        </div>
      </SafeAreaLayout>
    );
  }

  // 📭 Không có câu hỏi
  if (!loading && questions.length === 0) {
    return (
      <SafeAreaLayout header={<AppHeader title="Quiz Tính Cách" showBack />}>
        <div className="h-screen flex flex-col items-center justify-center text-center space-y-5">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <Inbox className="w-14 h-14 text-gray-400" />
            <p className="text-gray-600 font-medium">
              Không có câu hỏi khả dụng 😢
            </p>
          </div>
          <Button
            onClick={fetchQuestions}
            className="bg-greenery-500 hover:bg-greenery-600 text-white rounded-full px-6"
          >
            Thử lại
          </Button>
        </div>
      </SafeAreaLayout>
    );
  }

  // 🎉 Kết quả
  if (showResults) {
    const results = calculateResults();
    return (
      <SafeAreaLayout header={<AppHeader title="Quiz Tính Cách" showBack />}>
        <div className="min-h-screen flex flex-col items-center justify-center px-2">
          <Card className="max-w-sm w-full border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-greenery-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-greenery-700">
                Hoàn thành khảo sát 🎉
              </CardTitle>
              <p className="text-sm text-gray-600">
                Bạn đã trả lời {results.answered}/{results.totalQuestions} câu hỏi
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/advice">
                <Button className="w-full mt-6 bg-greenery-500 hover:bg-greenery-600 text-white rounded-full">
                  Xem gợi ý cá nhân hóa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SafeAreaLayout>
    );
  }

  // 📝 Quiz đang diễn ra
  const q: Question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <SafeAreaLayout header={<AppHeader title="Quiz Tính Cách" showBack />}>
      <div className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-2 pb-24 pt-16">
        <div
          className="w-full max-w-sm flex-1 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mb-6">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-xs text-gray-600 text-center">
              {Math.round(progress)}% Hoàn thành
            </p>
          </div>

          {/* 🧩 --- Chỗ hiển thị câu hỏi --- */}
          <Card className="border-0 shadow-xl mb-6 transition-all">
            <CardHeader className="flex items-start gap-2">
              <Star className="w-5 h-5 text-greenery-500 mt-1 animate-pulse" />
              <CardTitle className="text-base text-gray-800 leading-relaxed">
                {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.options.map((opt: QuestionOption) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.text)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[q.id] === opt.text
                      ? "border-greenery-500 bg-greenery-50 text-greenery-700"
                      : "border-gray-200 bg-white hover:border-greenery-300 hover:bg-greenery-25"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[q.id] === opt.text
                          ? "border-greenery-500 bg-greenery-500"
                          : "border-gray-300"
                      }`}
                    />
                    <span className="text-sm font-medium">{opt.text}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="pb-8 w-full max-w-sm mx-auto pb-safe pt-2 fixed left-1/2 -translate-x-1/2 bottom-0 z-10 flex flex-col">
        <div className="flex justify-between space-x-4 px-2 pb-4">
          <Button
            onClick={handlePrev}
            disabled={current === 0}
            className="flex-1 rounded-full py-3 bg-white border border-greenery-200 text-greenery-700 shadow-sm hover:bg-greenery-50 disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Trước
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[q.id]}
            className="flex-1 rounded-full py-3 bg-greenery-500 text-white shadow-sm hover:bg-greenery-600 ml-2 disabled:opacity-50"
          >
            {current === questions.length - 1 ? "Hoàn thành" : "Tiếp theo"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </SafeAreaLayout>
  );
}
