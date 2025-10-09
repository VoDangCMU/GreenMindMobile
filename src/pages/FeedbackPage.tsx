"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  BarChart3,
  Target,
  Lightbulb,
  TrendingUp,
  User,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react"
import {Link} from "react-router-dom"
import { useLocation } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/AppHeader";

interface FeedbackData {
  recommendationId: string
  recommendationTitle: string
  personalityFactors: {
    trait: string
    score: number
    influence: string
    weight: number
  }[]
  behaviorAnalysis: {
    currentPatterns: string[]
    gaps: string[]
    opportunities: string[]
  }
  dataInsights: {
    trackingHistory: string
    trends: string[]
    comparisons: string[]
  }
  algorithmExplanation: {
    primaryReason: string
    secondaryFactors: string[]
    confidenceScore: number
    methodology: string
  }
  expectedOutcomes: {
    shortTerm: string[]
    longTerm: string[]
    metrics: {
      environmental: string
      health: string
      financial: string
      social: string
    }
  }
  similarUsers: {
    successRate: number
    commonChallenges: string[]
    tips: string[]
  }
}

export default function FeedbackPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const recommendationId = searchParams.get("id") || "1";

  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [activeSection, setActiveSection] = useState<
    "personality" | "behavior" | "data" | "algorithm" | "outcomes" | "community"
  >("personality")

  useEffect(() => {
    // In real app, this would fetch from API based on recommendationId
    const mockFeedbackData: FeedbackData = {
      recommendationId,
      recommendationTitle: "Switch to Plant-Based Meals 3x/Week",
      personalityFactors: [
        {
          trait: "Openness",
          score: 85,
          influence:
            "Your high openness to experience suggests you're willing to try new foods and cooking methods, making dietary changes more likely to succeed.",
          weight: 35,
        },
        {
          trait: "Agreeableness",
          score: 90,
          influence:
            "Your caring nature and concern for others extends to environmental impact, motivating sustainable food choices.",
          weight: 30,
        },
        {
          trait: "Conscientiousness",
          score: 72,
          influence: "Your organized approach helps with meal planning and maintaining consistent dietary changes.",
          weight: 25,
        },
        {
          trait: "Neuroticism",
          score: 25,
          influence: "Your emotional stability helps you adapt to dietary changes without stress or anxiety.",
          weight: 10,
        },
      ],
      behaviorAnalysis: {
        currentPatterns: [
          "70% of tracked meals contain meat",
          "Frequent dining out (4x/week)",
          "Limited vegetarian cooking experience",
          "High grocery spending on protein sources",
        ],
        gaps: [
          "Lack of plant-based protein knowledge",
          "Limited vegetarian recipes in rotation",
          "No meal planning system in place",
        ],
        opportunities: [
          "High cooking frequency suggests willingness to prepare meals",
          "Interest in health tracking indicates motivation for change",
          "Social dining habits could influence others positively",
        ],
      },
      dataInsights: {
        trackingHistory: "30 days of meal tracking data analyzed",
        trends: [
          "Meat consumption increased 15% over past month",
          "Vegetable intake below recommended levels",
          "Protein sources lack variety",
          "Weekend meals show different patterns than weekdays",
        ],
        comparisons: [
          "Your meat consumption is 40% above platform average",
          "Similar users reduced meat by 60% within 3 months",
          "Your cooking frequency is 25% higher than average",
        ],
      },
      algorithmExplanation: {
        primaryReason:
          "Personality-behavior alignment analysis shows 92% compatibility with plant-based dietary changes",
        secondaryFactors: [
          "Current tracking data indicates readiness for change",
          "Environmental values align with recommendation goals",
          "Cooking skills provide foundation for implementation",
          "Social influence potential amplifies impact",
        ],
        confidenceScore: 92,
        methodology:
          "Multi-factor analysis combining Big Five personality traits, behavioral patterns, and predictive modeling based on 10,000+ user outcomes",
      },
      expectedOutcomes: {
        shortTerm: [
          "Reduced grocery costs within 2 weeks",
          "Increased vegetable intake by 40%",
          "Discovery of 5-10 new favorite recipes",
          "Improved meal planning habits",
        ],
        longTerm: [
          "2.1kg CO2 reduction per week",
          "15% reduction in food-related expenses",
          "Improved cardiovascular health markers",
          "Positive influence on 2-3 friends/family members",
        ],
        metrics: {
          environmental: "2.1kg CO2 saved weekly, reduced water usage",
          health: "Lower cholesterol, increased fiber intake",
          financial: "$30-45 monthly savings on groceries",
          social: "Potential to influence 2-3 people in your network",
        },
      },
      similarUsers: {
        successRate: 78,
        commonChallenges: [
          "Finding satisfying protein alternatives",
          "Meal prep time management",
          "Social dining situations",
          "Family member resistance",
        ],
        tips: [
          "Start with familiar dishes and substitute ingredients",
          "Batch cook proteins like lentils and chickpeas",
          "Research restaurant options in advance",
          "Share successful recipes with family",
        ],
      },
    }

    setFeedbackData(mockFeedbackData)
  }, [recommendationId])

  if (!feedbackData) {
    return (
      <SafeAreaLayout>
        <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 p-4">
          <div className="max-w-sm mx-auto flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-greenery-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading feedback...</p>
            </div>
          </div>
        </div>
      </SafeAreaLayout>
    )
  }

  const sections = [
    { id: "personality" as const, label: "Personality", icon: Brain, color: "text-purple-600" },
    { id: "behavior" as const, label: "Behavior", icon: Activity, color: "text-blue-600" },
    { id: "data" as const, label: "Data", icon: BarChart3, color: "text-green-600" },
    { id: "algorithm" as const, label: "Algorithm", icon: Lightbulb, color: "text-yellow-600" },
    { id: "outcomes" as const, label: "Outcomes", icon: Target, color: "text-red-600" },
    { id: "community" as const, label: "Community", icon: User, color: "text-indigo-600" },
  ]

  return (
    <SafeAreaLayout header={<AppHeader title="Why This Recommendation?" showBack />}> 
      <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 pr-4 pl-4 pb-4">
        <div className="max-w-sm mx-auto">
          {/* Recommendation Title */}
          <Card className="border-0 shadow-md mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-greenery-600" />
                <span>{feedbackData.recommendationTitle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">AI Confidence Score</span>
                <span className="text-sm font-medium text-greenery-700">
                  {feedbackData.algorithmExplanation.confidenceScore}%
                </span>
              </div>
              <Progress value={feedbackData.algorithmExplanation.confidenceScore} className="h-2" />
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <div className="flex space-x-1 mb-6 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-shrink-0 h-10 text-xs ${
                    activeSection === section.id
                      ? "bg-greenery-500 hover:bg-greenery-600 text-white"
                      : "border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                  }`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {section.label}
                </Button>
              )
            })}
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            {/* Personality Analysis */}
            {activeSection === "personality" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span>Personality Factor Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {feedbackData.personalityFactors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{factor.trait}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {factor.score}%
                            </Badge>
                            <Badge className="text-xs bg-purple-100 text-purple-700">{factor.weight}% weight</Badge>
                          </div>
                        </div>
                        <Progress value={factor.score} className="h-2" />
                        <p className="text-xs text-gray-600 leading-relaxed">{factor.influence}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Behavior Analysis */}
            {activeSection === "behavior" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Current Behavior Patterns</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {feedbackData.behaviorAnalysis.currentPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{pattern}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span>Identified Gaps</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {feedbackData.behaviorAnalysis.gaps.map((gap, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{gap}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>Growth Opportunities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {feedbackData.behaviorAnalysis.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{opportunity}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data Insights */}
            {activeSection === "data" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span>Your Data Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Tracking Period</span>
                      </div>
                      <p className="text-sm text-green-700">{feedbackData.dataInsights.trackingHistory}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Observed Trends</h4>
                      <div className="space-y-2">
                        {feedbackData.dataInsights.trends.map((trend, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{trend}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Peer Comparisons</h4>
                      <div className="space-y-2">
                        {feedbackData.dataInsights.comparisons.map((comparison, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <BarChart3 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{comparison}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Algorithm Explanation */}
            {activeSection === "algorithm" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span>AI Decision Process</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Primary Reasoning</h4>
                      <p className="text-sm text-yellow-700">{feedbackData.algorithmExplanation.primaryReason}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Supporting Factors</h4>
                      <div className="space-y-2">
                        {feedbackData.algorithmExplanation.secondaryFactors.map((factor, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Methodology</h4>
                      <p className="text-sm text-gray-700">{feedbackData.algorithmExplanation.methodology}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Expected Outcomes */}
            {activeSection === "outcomes" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Target className="w-4 h-4 text-red-600" />
                      <span>Predicted Outcomes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Short-term (2-4 weeks)</h4>
                      <div className="space-y-2">
                        {feedbackData.expectedOutcomes.shortTerm.map((outcome, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Long-term (3+ months)</h4>
                      <div className="space-y-2">
                        {feedbackData.expectedOutcomes.longTerm.map((outcome, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="text-xs font-medium text-green-800 mb-1">Environmental</h5>
                        <p className="text-xs text-green-700">{feedbackData.expectedOutcomes.metrics.environmental}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h5 className="text-xs font-medium text-red-800 mb-1">Health</h5>
                        <p className="text-xs text-red-700">{feedbackData.expectedOutcomes.metrics.health}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h5 className="text-xs font-medium text-yellow-800 mb-1">Financial</h5>
                        <p className="text-xs text-yellow-700">{feedbackData.expectedOutcomes.metrics.financial}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-xs font-medium text-blue-800 mb-1">Social</h5>
                        <p className="text-xs text-blue-700">{feedbackData.expectedOutcomes.metrics.social}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Community Insights */}
            {activeSection === "community" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>Similar Users' Experience</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-indigo-800">Success Rate</span>
                        <span className="text-lg font-bold text-indigo-700">
                          {feedbackData.similarUsers.successRate}%
                        </span>
                      </div>
                      <Progress value={feedbackData.similarUsers.successRate} className="h-2" />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Common Challenges</h4>
                      <div className="space-y-2">
                        {feedbackData.similarUsers.commonChallenges.map((challenge, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Success Tips</h4>
                      <div className="space-y-2">
                        {feedbackData.similarUsers.tips.map((tip, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </SafeAreaLayout>
  )
}
