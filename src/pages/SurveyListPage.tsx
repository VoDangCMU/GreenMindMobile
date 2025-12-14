import { Link } from "react-router-dom";
import AppHeader from "@/components/common/AppHeader";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, PlayCircle, Award, Users } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  estimatedTime: number; // in minutes
  category: string;
  completed: boolean;
  participants: number;
}

// Mock survey data
const mockSurveys: Survey[] = [
  {
    id: "1",
    title: "Personality Assessment",
    description: "Discover your unique personality traits through OCEAN model analysis",
    questionsCount: 15,
    estimatedTime: 5,
    category: "Personality",
    completed: false,
    participants: 1234,
  },
  {
    id: "2",
    title: "Lifestyle Survey",
    description: "Tell us about your daily habits and lifestyle choices",
    questionsCount: 20,
    estimatedTime: 8,
    category: "Lifestyle",
    completed: true,
    participants: 892,
  },
  {
    id: "3",
    title: "Environmental Awareness",
    description: "Assess your knowledge and practices for sustainable living",
    questionsCount: 12,
    estimatedTime: 6,
    category: "Environment",
    completed: false,
    participants: 2341,
  },
  {
    id: "4",
    title: "Health & Wellness",
    description: "Evaluate your physical and mental health habits",
    questionsCount: 18,
    estimatedTime: 7,
    category: "Health",
    completed: false,
    participants: 1567,
  },
  {
    id: "5",
    title: "Social Connections",
    description: "Understand your social relationships and networking patterns",
    questionsCount: 10,
    estimatedTime: 4,
    category: "Social",
    completed: true,
    participants: 678,
  },
  {
    id: "6",
    title: "Financial Behavior",
    description: "Analyze your spending habits and financial decision-making",
    questionsCount: 14,
    estimatedTime: 5,
    category: "Finance",
    completed: false,
    participants: 1890,
  },
];

export default function SurveyListPage() {

  const filteredSurveys = mockSurveys;

  const completedCount = mockSurveys.filter((s) => s.completed).length;

  return (
    <SafeAreaLayout
      header={<AppHeader title="Surveys" showBack />}
    >
      <div className="flex flex-col bg-gradient-to-br from-greenery-50 to-greenery-100 min-h-screen">
        <div className="flex-1 w-full mx-auto px-4 pb-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 mb-6 mt-4">
            <Card className="p-3 bg-white/90 border-greenery-200">
              <div className="flex flex-col items-center">
                <Award className="w-6 h-6 text-greenery-600 mb-1" />
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-bold text-greenery-700">{mockSurveys.length}</p>
              </div>
            </Card>
            <Card className="p-3 bg-white/90 border-green-200">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 mb-1" />
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-lg font-bold text-green-700">{completedCount}</p>
              </div>
            </Card>
            <Card className="p-3 bg-white/90 border-blue-200">
              <div className="flex flex-col items-center">
                <Clock className="w-6 h-6 text-blue-600 mb-1" />
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold text-blue-700">{mockSurveys.length - completedCount}</p>
              </div>
            </Card>
          </div>

          {/* categories removed per request */}

          {/* Survey List */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Available Surveys ({filteredSurveys.length})
            </p>
            {filteredSurveys.map((survey) => (
              <Link to={`/quiz?surveyId=${survey.id}`} key={survey.id}>
                <Card className="p-5 bg-white/95 hover:bg-greenery-50 transition-all border border-greenery-100 hover:shadow-lg group">
                  <div className="flex flex-col">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 group-hover:text-greenery-700 transition-colors">
                          {survey.title}
                        </h3>
                        {survey.completed && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {survey.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{survey.questionsCount} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{survey.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{survey.participants.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* category badge removed */}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredSurveys.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-500 text-center">No surveys found in this category</p>
            </div>
          )}
        </div>
      </div>
    </SafeAreaLayout>
  );
}
