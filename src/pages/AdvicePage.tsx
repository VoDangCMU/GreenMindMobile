"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, Leaf, Heart, Target, Shield, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout"
import AppHeader from "@/components/AppHeader"

export default function AdvicePage() {
  // Mock personality results - in real app, this would come from quiz results
  const personalityResults = {
    Openness: 85,
    Conscientiousness: 72,
    Extraversion: 45,
    Agreeableness: 90,
    Neuroticism: 25,
  }

  const getAdviceForTrait = (trait: string, score: number) => {
    const adviceMap: Record<string, { high: string; low: string; icon: any; color: string }> = {
      Openness: {
        high: "Your high openness means you're likely to embrace sustainable innovations. Try experimenting with new eco-friendly products and alternative lifestyle choices.",
        low: "Focus on gradual, proven sustainable practices. Start with simple changes like reducing single-use plastics or choosing local produce.",
        icon: Lightbulb,
        color: "text-purple-600",
      },
      Conscientiousness: {
        high: "Your organized nature is perfect for systematic sustainability. Create detailed plans for reducing waste and tracking your environmental impact.",
        low: "Use apps and reminders to build sustainable habits gradually. Start with one small change at a time to avoid overwhelm.",
        icon: Target,
        color: "text-blue-600",
      },
      Extraversion: {
        high: "Share your sustainability journey with others! Join environmental groups and inspire friends through social activities like community gardens.",
        low: "Focus on personal sustainable practices that you can do independently, like home composting or energy-efficient home improvements.",
        icon: Heart,
        color: "text-pink-600",
      },
      Agreeableness: {
        high: "Your caring nature drives you to help others and the planet. Consider volunteering for environmental causes and supporting ethical businesses.",
        low: "Focus on how sustainable choices benefit you personally - cost savings, health improvements, and personal satisfaction.",
        icon: Shield,
        color: "text-green-600",
      },
      Neuroticism: {
        high: "Channel your concerns into positive action. Focus on the immediate benefits of sustainable living for your health and peace of mind.",
        low: "Your emotional stability helps you make consistent long-term changes. Set ambitious sustainability goals and stick to them.",
        icon: TrendingUp,
        color: "text-orange-600",
      },
    }

    const advice = adviceMap[trait]
    const isHigh = score > 60
    return {
      text: isHigh ? advice.high : advice.low,
      icon: advice.icon,
      color: advice.color,
      level: isHigh ? "High" : "Low",
    }
  }

  return (
    <SafeAreaLayout header={<AppHeader title="Personalized Advice" showBack />}>
      <div className="w-full max-w-sm mx-auto px-2 sm:px-0">
        {/* Introduction Card */}
        <Card className="border-0 shadow-xl mb-6">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-greenery-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-greenery-700">Your Green Journey</CardTitle>
            <p className="text-sm sm:text-base text-gray-600">
              Based on your personality traits, here are personalized recommendations for sustainable living
            </p>
          </CardHeader>
        </Card>
        {/* Advice Cards */}
        <div className="space-y-4">
          {Object.entries(personalityResults).map(([trait, score]) => {
            const advice = getAdviceForTrait(trait, score)
            const Icon = advice.icon

            return (
              <Card key={trait} className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${advice.color}`} />
                      <CardTitle className="text-base sm:text-lg text-gray-800">{trait}</CardTitle>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs sm:text-sm ${score > 60 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {advice.level} ({score}%)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{advice.text}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <Link to="/goals">
            <Button className="w-full bg-greenery-500 hover:bg-greenery-600 text-white text-sm sm:text-base py-3">
              <Target className="w-4 h-4 mr-2" />
              Set Sustainability Goals
            </Button>
          </Link>
          <Link to="/tracking">
            <Button
              variant="outline"
              className="w-full border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent text-sm sm:text-base py-3"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Tracking Behaviors
            </Button>
          </Link>
          <Link to="/home">
            <Button
              variant="outline"
              className="w-full border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent text-sm sm:text-base py-3"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </SafeAreaLayout>
  )
}
