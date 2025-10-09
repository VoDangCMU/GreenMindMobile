import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/AppHeader";
import { toast } from "sonner";

type Ocean = "O" | "C" | "E" | "A" | "N";
type Kind = "frequency" | "yesno";

// Mocked behaviors for demonstration
const behaviors: Record<Ocean, string[]> = {
  O: ["đọc sách mới", "tham gia workshop sáng tạo"],
  C: ["lên kế hoạch", "giữ gìn ngăn nắp"],
  E: ["giao tiếp với người lạ", "tham gia sự kiện"],
  A: ["giúp đỡ bạn bè", "lắng nghe người khác"],
  N: ["lo lắng về công việc", "căng thẳng khi thi cử"],
};

const quizTemplate = {
  O: {
    frequency: [
      {
        template_id: "O_F_001",
        sentence: "Bạn có thường {behavior} không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: [
          "rất ít khi",
          "thỉnh thoảng",
          "thường xuyên",
          "gần như mọi lúc",
        ],
        ocean: "O",
      },
    ],
    yesno: [
      {
        template_id: "O_YN_001",
        sentence: "Bạn có thích {behavior} không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: ["Có", "Không"],
        ocean: "O",
      },
    ],
  },
  C: {
    frequency: [
      {
        template_id: "C_F_001",
        sentence: "Bạn có thường {behavior} khi làm việc không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: [
          "rất ít khi",
          "thỉnh thoảng",
          "thường xuyên",
          "gần như mọi lúc",
        ],
        ocean: "C",
      },
    ],
    yesno: [
      {
        template_id: "C_YN_001",
        sentence: "Bạn có thường chú ý đến chi tiết khi {behavior} không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: ["Có", "Không"],
        ocean: "C",
      },
    ],
  },
  E: {
    frequency: [
      {
        template_id: "E_F_001",
        sentence: "Bạn có thường {behavior} không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: [
          "rất ít khi",
          "thỉnh thoảng",
          "thường xuyên",
          "gần như mọi lúc",
        ],
        ocean: "E",
      },
    ],
    yesno: [
      {
        template_id: "E_YN_001",
        sentence: "Bạn có thích {behavior} không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: ["Có", "Không"],
        ocean: "E",
      },
    ],
  },
  A: {
    frequency: [
      {
        template_id: "A_F_001",
        sentence: "Khi làm việc nhóm, bạn {behavior} với tần suất như thế nào?",
        slot: "behavior",
        value_behavior: [],
        value_slot: [
          "rất ít khi",
          "thỉnh thoảng",
          "thường xuyên",
          "gần như mọi lúc",
        ],
        ocean: "A",
      },
    ],
    yesno: [
      {
        template_id: "A_YN_001",
        sentence: "Bạn có thích {behavior} để giúp đỡ người khác không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: ["Có", "Không"],
        ocean: "A",
      },
    ],
  },
  N: {
    frequency: [
      {
        template_id: "N_F_001",
        sentence:
          "Bạn {behavior} với tần suất như thế nào khi gặp tình huống căng thẳng?",
        slot: "behavior",
        value_behavior: [],
        value_slot: [
          "rất ít khi",
          "thỉnh thoảng",
          "thường xuyên",
          "gần như mọi lúc",
        ],
        ocean: "N",
      },
    ],
    yesno: [
      {
        template_id: "N_YN_001",
        sentence: "Bạn có cảm thấy lo lắng khi {behavior} không?",
        slot: "behavior",
        value_behavior: [],
        value_slot: ["Có", "Không"],
        ocean: "N",
      },
    ],
  },
};

function generateQuizQuestions() {
  const questions: {
    id: string;
    text: string;
    trait: Ocean;
    options: string[];
  }[] = [];
  (["O", "C", "E", "A", "N"] as Ocean[]).forEach((ocean) => {
    const behaviorList = behaviors[ocean];
    const kinds: Kind[] = ["frequency", "yesno"];
    kinds.forEach((kind, i) => {
      const template = quizTemplate[ocean][kind][0];
      const behavior = behaviorList[i % behaviorList.length];
      const text = template.sentence.replace("{behavior}", behavior);
      questions.push({
        id: `${ocean}_${kind}`,
        text,
        trait: ocean,
        options: template.value_slot,
      });
    });
  });
  return questions;
}

const questions = generateQuizQuestions();

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
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
      if (delta > 0) handleNext(); // vuốt sang trái → next
      else handlePrev(); // vuốt sang phải → prev
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

  const handleNext = () => {
    const currentQuestion = questions[current];
    const selected = answers[currentQuestion.id];

    // Nếu chưa chọn đáp án thì báo lỗi, không cho next
    if (!selected) {
      toast.warning("Bạn cần chọn một đáp án trước khi tiếp tục 💡");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  // Simple mock scoring: count "positive" answers
  const calculateResults = () => {
    const traitScores: Record<Ocean, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    questions.forEach((q) => {
      if (answers[q.id]) {
        // For demo, treat last option as most positive
        const score = q.options.indexOf(answers[q.id]) + 1;
        traitScores[q.trait] += score;
      }
    });
    return traitScores;
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <SafeAreaLayout header={<AppHeader title="Quiz Tính Cách" showBack />}>
        <div className="min-h-screen flex flex-col items-center justify-center px-2">
          <Card className="max-w-sm w-full border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-greenery-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-greenery-700">
                Quiz Complete!
              </CardTitle>
              <p className="text-sm text-gray-600">Kết quả tính cách của bạn</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results).map(([trait, score]) => (
                <div key={trait} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {trait}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {score}
                  </Badge>
                </div>
              ))}
              <Link to="/advice">
                <Button className="w-full mt-6 bg-greenery-500 hover:bg-greenery-600 text-white">
                  Xem gợi ý cá nhân hóa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SafeAreaLayout>
    );
  }

  const q = questions[current];
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
          {/* Progress */}
          <div className="mb-6">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-xs text-gray-600 text-center">
              {Math.round(progress)}% Hoàn thành
            </p>
          </div>
          {/* Question Card */}
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-base text-gray-800 leading-relaxed">
                {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[q.id] === option
                      ? "border-greenery-500 bg-greenery-50 text-greenery-700"
                      : "border-gray-200 bg-white hover:border-greenery-300 hover:bg-greenery-25"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[q.id] === option
                          ? "border-greenery-500 bg-greenery-500"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[q.id] === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Navigation fixed at bottom in safe area */}
      <div className="pb-8 w-full max-w-sm mx-auto pb-safe pt-2 fixed left-1/2 -translate-x-1/2 bottom-0 z-10 flex flex-col">
        <div className="flex justify-between space-x-4 px-2 pb-4">
          <Button
            onClick={handlePrev}
            disabled={current === 0}
            className="flex-1 rounded-full py-3 bg-white border border-greenery-200 text-greenery-700 shadow-sm transition-all duration-150 hover:bg-greenery-50 hover:border-greenery-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Trước
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[q.id]}
            className="flex-1 rounded-full py-3 bg-greenery-500 text-white shadow-sm transition-all duration-150 hover:bg-greenery-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {current === questions.length - 1 ? "Hoàn thành" : "Tiếp theo"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </SafeAreaLayout>
  );
}
