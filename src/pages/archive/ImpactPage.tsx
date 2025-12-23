"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Leaf,
  Heart,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
} from "lucide-react"
import {Link} from "react-router-dom"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout"
import AppHeader from "@/components/common/AppHeader"

export default function ImpactPage() {
  // Mock data - in real app, this would come from user's tracked behaviors
  const impactData = {
    environment: {
      carbonSaved: 45.2,
      waterSaved: 1250,
      wasteReduced: 8.5,
      trend: 12,
    },
    health: {
      stepsWalked: 89500,
      healthyMeals: 28,
      sleepQuality: 8.2,
      trend: 8,
    },
    finance: {
      moneySaved: 156,
      budgetGoal: 200,
      savingsRate: 78,
      trend: 15,
    },
    community: {
      friendsInfluenced: 5,
      activitiesShared: 12,
      communityRank: 23,
      trend: 5,
    },
  }

  const achievements = [
    { id: 1, title: "Eco Warrior", description: "Saved 50kg CO2 this month", icon: Leaf, color: "text-green-600" },
    { id: 2, title: "Health Champion", description: "Walked 100k steps this week", icon: Heart, color: "text-red-600" },
    {
      id: 3,
      title: "Smart Saver",
      description: "Saved $150 on sustainable choices",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ]

  const weeklyData = [
    { day: "Mon", environment: 85, health: 70, finance: 60, community: 40 },
    { day: "Tue", environment: 78, health: 85, finance: 75, community: 55 },
    { day: "Wed", environment: 92, health: 65, finance: 80, community: 45 },
    { day: "Thu", environment: 88, health: 90, finance: 70, community: 60 },
    { day: "Fri", environment: 95, health: 75, finance: 85, community: 50 },
    { day: "Sat", environment: 82, health: 95, finance: 65, community: 70 },
    { day: "Sun", environment: 90, health: 80, finance: 90, community: 65 },
  ]

  const categories = [
    {
      id: "environment",
      label: "Environment",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-100",
      data: impactData.environment,
    },
    {
      id: "health",
      label: "Health",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      data: impactData.health,
    },
    {
      id: "finance",
      label: "Finance",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      data: impactData.finance,
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      data: impactData.community,
    },
  ]

  return (
    <SafeAreaLayout header={<AppHeader title="Impact" showBack />}>
      <div className="max-w-sm mx-auto">
        {/* Overall Impact Score */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-greenery-600" />
              <span>Overall Impact Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-greenery-700 mb-2">8.4</div>
            <p className="text-sm text-gray-600 mb-4">Great progress this month!</p>
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Impact Categories */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {categories.map((category) => {
            const Icon = category.icon
            const trend = category.data.trend
            const TrendIcon = trend > 0 ? TrendingUp : TrendingDown

            return (
              <Card key={category.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div
                    className={`w-10 h-10 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 text-center mb-2">{category.label}</h3>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendIcon className={`w-3 h-3 ${trend > 0 ? "text-green-600" : "text-red-600"}`} />
                    <span className={`text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                      {trend > 0 ? "+" : ""}
                      {trend}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Metrics */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">This Month's Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Environment */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Environment</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-green-700">{impactData.environment.carbonSaved}kg</div>
                  <div className="text-gray-600">CO2 Saved</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-700">{impactData.environment.waterSaved}L</div>
                  <div className="text-gray-600">Water Saved</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-700">{impactData.environment.wasteReduced}kg</div>
                  <div className="text-gray-600">Waste Reduced</div>
                </div>
              </div>
            </div>

            {/* Health */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Health</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-blue-700">{impactData.health.stepsWalked.toLocaleString()}</div>
                  <div className="text-gray-600">Steps</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-700">{impactData.health.healthyMeals}</div>
                  <div className="text-gray-600">Healthy Meals</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-700">{impactData.health.sleepQuality}/10</div>
                  <div className="text-gray-600">Sleep Quality</div>
                </div>
              </div>
            </div>

            {/* Finance */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Finance</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Savings Goal</span>
                  <span className="font-medium text-greenery-700">
                    ${impactData.finance.moneySaved}/${impactData.finance.budgetGoal}
                  </span>
                </div>
                <Progress value={impactData.finance.savingsRate} className="h-2" />
              </div>
            </div>

            {/* Community */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Community</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-blue-700">{impactData.community.friendsInfluenced}</div>
                  <div className="text-gray-600">Friends Influenced</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-700">{impactData.community.activitiesShared}</div>
                  <div className="text-gray-600">Activities Shared</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-700">#{impactData.community.communityRank}</div>
                  <div className="text-gray-600">Community Rank</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Award className="w-4 h-4 text-greenery-600" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-greenery-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                  <Badge className="bg-greenery-500 text-white text-xs">New!</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-greenery-600" />
              <span>Weekly Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{day.day}</span>
                  <div className="flex-1 flex space-x-1">
                    <div
                      className="h-2 bg-green-400 rounded"
                      style={{ width: `${day.environment / 4}%` }}
                      title={`Environment: ${day.environment}%`}
                    />
                    <div
                      className="h-2 bg-red-400 rounded"
                      style={{ width: `${day.health / 4}%` }}
                      title={`Health: ${day.health}%`}
                    />
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{ width: `${day.finance / 4}%` }}
                      title={`Finance: ${day.finance}%`}
                    />
                    <div
                      className="h-2 bg-blue-400 rounded"
                      style={{ width: `${day.community / 4}%` }}
                      title={`Community: ${day.community}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded"></div>
                <span className="text-gray-600">Environment</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded"></div>
                <span className="text-gray-600">Health</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded"></div>
                <span className="text-gray-600">Finance</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded"></div>
                <span className="text-gray-600">Community</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="space-y-3">
          <Link to="/tracking">
            <Button className="w-full bg-greenery-500 hover:bg-greenery-600 text-white">
              Continue Tracking Activities
            </Button>
          </Link>
          <Link to="/community">
            <Button
              variant="outline"
              className="w-full border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
            >
              Share Your Impact
            </Button>
          </Link>
        </div>
      </div>
    </SafeAreaLayout>
  )
}
