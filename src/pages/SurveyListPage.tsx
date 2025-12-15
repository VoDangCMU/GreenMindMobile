import { Link } from "react-router-dom";
import AppHeader from "@/components/common/AppHeader";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, PlayCircle, Users } from "lucide-react";
import { AppBottomNavBar } from "./HomePage";
import { useEffect, useState } from "react";
import { getUserQuestionSet, type IQuestionSetData } from "@/apis/backend/v2/survey";
// import { set } from "date-fns";

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

export default function SurveyListPage() {
  const [surveyList, setSurveyList] = useState<Survey[]>([]);

  useEffect(() => {

    getUserQuestionSet()
      .then((res) => {


        const surveys = res.data.reduce((acc: Survey[], item: IQuestionSetData) => {
          acc.push({
            id: item.id,
            title: item.name,
            completed: false,
            description: item.description,
            questionsCount: item.items.length,
            estimatedTime: Math.ceil(item.items.length / 3), 
            category: "General",
            participants: 0,
          });

          return acc;
        }, []);
      
        setSurveyList(surveys);
      });
  }, []);

  return (
    <SafeAreaLayout
      header={<AppHeader title="Surveys" showBack />}
      footer={<AppBottomNavBar />}
    >
      <div className="flex flex-col bg-gradient-to-br from-greenery-50 to-greenery-100 min-h-screen">
        <div className="flex-1 w-full mx-auto px-4 pb-6">

          {/* Survey List */}
          <div className="space-y-4">
            {surveyList.map((survey) => (
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

          {surveyList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-500 text-center">No surveys found in this category</p>
            </div>
          )}
        </div>
      </div>
    </SafeAreaLayout>
  );
}
