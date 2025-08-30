"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Heart,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  X,
  RefreshCw,
  Info,
} from "lucide-react"
import {Link} from "react-router-dom"

interface Recommendation {
  id: string
  title: string
  description: string
  category: "environment" | "health" | "finance" | "community"
  priority: "high" | "medium" | "low"
  difficulty: "easy" | "medium" | "hard"
  estimatedImpact: number
  timeToComplete: string
  personalityMatch: number
  reasons: string[]
  actionSteps: string[]
  potentialSavings?: string
  carbonReduction?: string
  healthBenefit?: string
  completed: boolean
}

export default function RecommendationsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "environment" | "health" | "finance" | "community">("all")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      title: "Switch to Plant-Based Meals 3x/Week",
      description:
        "Replace meat with plant-based alternatives in 3 meals per week to reduce environmental impact and improve health.",
      category: "environment",
      priority: "high",
      difficulty: "easy",
      estimatedImpact: 85,
      timeToComplete: "2 weeks to form habit",
      personalityMatch: 92,
      reasons: [
        "Your high Openness (85%) suggests you're willing to try new foods",
        "Your Agreeableness (90%) indicates care for environmental impact",
        "Current tracking shows 70% meat-based meals - room for improvement",
      ],
      actionSteps: [
        "Start with familiar dishes like pasta with marinara",
        "Try plant-based proteins like lentils and chickpeas",
        "Use meal planning apps for recipe ideas",
        "Track your progress in the app",
      ],
      carbonReduction: "2.1 kg CO2/week",
      healthBenefit: "Reduced cholesterol, increased fiber",
      completed: false,
    },
    {
      id: "2",
      title: "Implement 15-Minute Daily Walks",
      description:
        "Add a short walk to your daily routine to improve health and reduce reliance on transportation for short trips.",
      category: "health",
      priority: "high",
      difficulty: "easy",
      estimatedImpact: 78,
      timeToComplete: "1 week to establish",
      personalityMatch: 88,
      reasons: [
        "Your moderate Extraversion (45%) suggests you'd enjoy solo reflection time",
        "High Conscientiousness (72%) means you'll stick to a routine",
        "Current step count is below recommended 8,000 daily steps",
      ],
      actionSteps: [
        "Schedule walks at the same time daily",
        "Start with 10 minutes and gradually increase",
        "Use a walking app to track progress",
        "Find scenic routes near your home or office",
      ],
      healthBenefit: "Improved cardiovascular health, better mood",
      completed: false,
    },
    {
      id: "3",
      title: "Bulk Buy Non-Perishables Monthly",
      description: "Purchase non-perishable items in bulk once per month to reduce packaging waste and save money.",
      category: "finance",
      priority: "medium",
      difficulty: "medium",
      estimatedImpact: 72,
      timeToComplete: "1 month to optimize",
      personalityMatch: 85,
      reasons: [
        "Your high Conscientiousness (72%) suits planned shopping",
        "Current spending shows frequent small purchases",
        "Personality profile suggests you value efficiency and savings",
      ],
      actionSteps: [
        "Create a list of regularly used non-perishables",
        "Research bulk buying options and warehouse stores",
        "Calculate cost savings vs. regular shopping",
        "Set up monthly bulk shopping schedule",
      ],
      potentialSavings: "$45-60/month",
      carbonReduction: "Reduced packaging waste",
      completed: false,
    },
    {
      id: "4",
      title: "Join Local Environmental Group",
      description: "Connect with like-minded individuals in your community to amplify your environmental impact.",
      category: "community",
      priority: "medium",
      difficulty: "medium",
      estimatedImpact: 68,
      timeToComplete: "2-3 weeks to find group",
      personalityMatch: 82,
      reasons: [
        "Your high Agreeableness (90%) suggests you enjoy helping others",
        "Moderate Extraversion means you'd benefit from social activities",
        "Community impact score shows room for growth",
      ],
      actionSteps: [
        "Search for local environmental groups online",
        "Attend one meeting or event as a trial",
        "Identify how you can contribute your skills",
        "Commit to regular participation",
      ],
      healthBenefit: "Social connection, sense of purpose",
      completed: false,
    },
    {
      id: "5",
      title: "Install Smart Power Strips",
      description: "Use smart power strips to eliminate phantom energy draw from electronics when not in use.",
      category: "finance",
      priority: "low",
      difficulty: "easy",
      estimatedImpact: 65,
      timeToComplete: "1 day to install",
      personalityMatch: 75,
      reasons: [
        "Your Conscientiousness suggests you'd maintain good habits",
        "Current energy usage shows potential for optimization",
        "Low effort, high reward matches your efficiency preference",
      ],
      actionSteps: [
        "Research smart power strip options",
        "Install in high-usage areas (entertainment center, office)",
        "Set up automated schedules",
        "Monitor energy savings through app",
      ],
      potentialSavings: "$15-25/month",
      carbonReduction: "0.8 kg CO2/week",
      completed: false,
    },
  ])

  const categories = [
    { id: "all" as const, label: "All", icon: Sparkles, color: "text-purple-600" },
    { id: "environment" as const, label: "Environment", icon: Leaf, color: "text-green-600" },
    { id: "health" as const, label: "Health", icon: Heart, color: "text-red-600" },
    { id: "finance" as const, label: "Finance", icon: DollarSign, color: "text-yellow-600" },
    { id: "community" as const, label: "Community", icon: Users, color: "text-blue-600" },
  ]

  const filteredRecommendations =
    activeFilter === "all" ? recommendations : recommendations.filter((rec) => rec.category === activeFilter)

  const getCategoryIcon = (category: Recommendation["category"]) => {
    const categoryData = categories.find((c) => c.id === category)
    return categoryData ? categoryData.icon : Sparkles
  }

  const getCategoryColor = (category: Recommendation["category"]) => {
    switch (category) {
      case "environment":
        return "bg-green-100 text-green-700"
      case "health":
        return "bg-red-100 text-red-700"
      case "finance":
        return "bg-yellow-100 text-yellow-700"
      case "community":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityColor = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getDifficultyColor = (difficulty: Recommendation["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleCompleteRecommendation = (id: string) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, completed: true } : rec)))
  }

  const handleDismissRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.id !== id))
  }

  const generateNewRecommendations = () => {
    // In real app, this would call an API to generate new recommendations
    console.log("Generating new recommendations...")
  }

  const completedCount = recommendations.filter((r) => r.completed).length
  const totalCount = recommendations.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 p-4">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/home">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="w-5 h-5 text-greenery-700" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-greenery-700">Smart Recommendations</h1>
          <Button variant="ghost" onClick={generateNewRecommendations} className="p-2">
            <RefreshCw className="w-5 h-5 text-greenery-700" />
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-greenery-600" />
              <span>Recommendation Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Completed Recommendations</span>
              <span className="text-sm font-medium text-greenery-700">
                {completedCount}/{totalCount}
              </span>
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="h-2 mb-3" />
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {completedCount > 0
                  ? `Great progress! ${completedCount} completed`
                  : "Start with your first recommendation"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                onClick={() => setActiveFilter(category.id)}
                className={`flex-shrink-0 h-10 ${
                  activeFilter === category.id
                    ? "bg-greenery-500 hover:bg-greenery-600 text-white"
                    : "border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            )
          })}
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Recommendations</h3>
                <p className="text-gray-600 mb-4">No recommendations found for this category</p>
                <Button
                  onClick={() => setActiveFilter("all")}
                  className="bg-greenery-500 hover:bg-greenery-600 text-white"
                >
                  View All Recommendations
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRecommendations.map((recommendation) => {
              const CategoryIcon = getCategoryIcon(recommendation.category)

              return (
                <Card
                  key={recommendation.id}
                  className={`border-0 shadow-md ${recommendation.completed ? "opacity-75" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CategoryIcon className="w-4 h-4 text-gray-600" />
                          <Badge className={`text-xs ${getCategoryColor(recommendation.category)}`}>
                            {recommendation.category}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority} priority
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-800 mb-1">{recommendation.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{recommendation.description}</p>
                      </div>
                      {recommendation.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">Time: {recommendation.timeToComplete}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">Impact: {recommendation.estimatedImpact}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">Match: {recommendation.personalityMatch}%</span>
                        </div>
                        {recommendation.potentialSavings && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">Save: {recommendation.potentialSavings}</span>
                          </div>
                        )}
                        {recommendation.carbonReduction && (
                          <div className="flex items-center space-x-1">
                            <Leaf className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">CO2: {recommendation.carbonReduction}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Personality Match */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Personality Match</span>
                        <span className="font-medium text-greenery-700">{recommendation.personalityMatch}%</span>
                      </div>
                      <Progress value={recommendation.personalityMatch} className="h-2" />
                    </div>

                    {/* Action Buttons */}
                    {!recommendation.completed && (
                      <div className="flex space-x-2">
                        <Link to={`/feedback?id=${recommendation.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Why This?
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleCompleteRecommendation(recommendation.id)}
                          className="flex-1 bg-greenery-500 hover:bg-greenery-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDismissRecommendation(recommendation.id)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 space-y-3">
          <Link to="/goals">
            <Button
              variant="outline"
              className="w-full border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
            >
              Convert to Goals
            </Button>
          </Link>
          <Link to="/impact">
            <Button
              variant="outline"
              className="w-full border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
            >
              View Impact Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
