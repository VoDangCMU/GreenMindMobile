import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowLeft, ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { submitPreAppSurvey } from "@/apis/backend/preAppSurvey";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { toast } from "sonner";

interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'likert5' | 'number' | 'text';
  placeholder?: string;
  unit?: string;
}

const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'avg_daily_spend',
    question: 'Chi tiêu trung bình mỗi ngày của bạn là bao nhiêu?',
    type: 'number',
    placeholder: 'Ví dụ: 50000',
    unit: 'VNĐ'
  },
  {
    id: 'spend_variability',
    question: 'Mức độ dao động chi tiêu trong 1 tuần của bạn như thế nào?',
    type: 'likert5'
  },
  {
    id: 'brand_novel',
    question: 'Bạn có thường xuyên thử những thương hiệu mới không?',
    type: 'likert5'
  },
  {
    id: 'list_adherence',
    question: 'Bạn có thường xuyên thực hiện đúng theo danh sách, kế hoạch đã chuẩn bị không?',
    type: 'likert5'
  },
  {
    id: 'daily_distance_km',
    question: 'Trung bình mỗi ngày bạn di chuyển bao nhiêu km?',
    type: 'number',
    placeholder: 'Ví dụ: 5.5',
    unit: 'km'
  },
  {
    id: 'novel_location_ratio',
    question: 'Bạn có thường xuyên đến những địa điểm mới không?',
    type: 'likert5'
  },
  {
    id: 'public_transit_ratio',
    question: 'Bạn có thường xuyên sử dụng phương tiện công cộng không?',
    type: 'likert5'
  },
  {
    id: 'night_out_freq',
    question: 'Số lần bạn ra ngoài buổi đêm trong tuần là bao nhiêu?',
    type: 'number',
    placeholder: 'Ví dụ: 2',
    unit: 'lần/tuần'
  },
  {
    id: 'healthy_food_ratio',
    question: 'Bạn có thường ăn uống lành mạnh, ưu tiên thực phẩm thực vật không?',
    type: 'likert5'
  }
];

const LIKERT_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' }
];

export default function OnboardingQuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const { setAnswers: saveToStore, markCompleted, getSurveyData } = usePreAppSurveyStore();
  const user = useAppStore((s) => s.user);

  // Load existing answers from localStorage on component mount
  useEffect(() => {
    const existingData = getSurveyData();
    if (existingData) {
      setAnswers({...existingData});
    }
  }, [getSurveyData]);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  const handleSelect = (value: string) => {
    const newAnswers = {
      ...answers,
      [ONBOARDING_QUESTIONS[current].id]: value,
    };
    setAnswers(newAnswers);
    
    // Auto-save to localStorage on every change
    saveToStore(newAnswers as any);
  };

  const handleInputChange = (value: string) => {
    const newAnswers = {
      ...answers,
      [ONBOARDING_QUESTIONS[current].id]: value,
    };
    setAnswers(newAnswers);
    
    // Auto-save to localStorage on every change
    saveToStore(newAnswers as any);
  };

  const handleNext = () => {
    const q = ONBOARDING_QUESTIONS[current];
    if (!answers[q.id] || answers[q.id].trim() === '') {
      toast.warning("Bạn cần trả lời câu hỏi trước khi tiếp tục 💡");
      return;
    }

    if (current < ONBOARDING_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSubmit = async () => {
    try {
      // Lưu vào localStorage trước
      saveToStore(answers as any);
      if (!user?.id) {
        toast.error("Bạn cần đăng nhập để tiếp tục");
        return;
      }
      await submitPreAppSurvey({
        userId: user.id,
        answers: answers as any,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      });
      markCompleted();
      toast.success("Cảm ơn bạn đã hoàn thành khảo sát! 🎉");
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại 😭");
    }
  };

  const calculateResults = () => ({
    totalQuestions: ONBOARDING_QUESTIONS.length,
    answered: Object.keys(answers).length,
  });

  // 🎉 Kết quả
  if (showResults) {
    const results = calculateResults();
    return (
      <SafeAreaLayout header={<AppHeader title="Khảo Sát Onboarding" showBack />}>
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
              <Link to="/home">
                <Button className="w-full mt-6 bg-greenery-500 hover:bg-greenery-600 text-white rounded-full">
                  Bắt đầu sử dụng GreenMind
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SafeAreaLayout>
    );
  }

  // 📝 Quiz đang diễn ra
  const q: OnboardingQuestion = ONBOARDING_QUESTIONS[current];
  const progress = ((current + 1) / ONBOARDING_QUESTIONS.length) * 100;

  return (
    <SafeAreaLayout header={<AppHeader title="Khảo Sát Onboarding" showBack />}>
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
              <User className="w-5 h-5 text-greenery-500 mt-1 animate-pulse" />
              <CardTitle className="text-base text-gray-800 leading-relaxed">
                {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.type === 'likert5' ? (
                <>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {LIKERT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`p-3 text-center rounded-lg border-2 transition-all font-semibold ${
                          answers[q.id] === opt.value
                            ? "border-greenery-500 bg-greenery-50 text-greenery-700"
                            : "border-gray-200 bg-white hover:border-greenery-300 hover:bg-greenery-25"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    1 = Rất ít/Ít &nbsp;&nbsp;&nbsp; 3 = Bình thường &nbsp;&nbsp;&nbsp; 5 = Rất nhiều/Nhiều
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <Input
                    type={q.type === 'number' ? 'number' : 'text'}
                    placeholder={q.placeholder}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full p-4 text-left rounded-lg border-2 border-gray-200 focus:border-greenery-500"
                  />
                  {q.unit && (
                    <p className="text-xs text-gray-500 text-center">
                      Đơn vị: {q.unit}
                    </p>
                  )}
                </div>
              )}
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
            disabled={!answers[q.id] || answers[q.id].trim() === ''}
            className="flex-1 rounded-full py-3 bg-greenery-500 text-white shadow-sm hover:bg-greenery-600 ml-2 disabled:opacity-50"
          >
            {current === ONBOARDING_QUESTIONS.length - 1 ? "Hoàn thành" : "Tiếp theo"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </SafeAreaLayout>
  );
}