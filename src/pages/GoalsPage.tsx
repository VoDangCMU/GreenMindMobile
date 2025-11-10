"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Plus, CheckCircle2, Calendar, Leaf, Heart, DollarSign, Users } from "lucide-react"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout"
import AppHeader from "@/components/common/AppHeader"

interface Goal {
  id: string
  title: string
  description: string
  category: "environment" | "health" | "finance" | "community"
  progress: number
  target: number
  unit: string
  deadline: Date
  completed: boolean
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Reduce Meat Consumption",
      description: "Eat vegetarian meals to reduce carbon footprint",
      category: "environment",
      progress: 12,
      target: 20,
      unit: "meals",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      id: "2",
      title: "Walk 10,000 Steps Daily",
      description: "Improve health and reduce transportation emissions",
      category: "health",
      progress: 7,
      target: 30,
      unit: "days",
      deadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      id: "3",
      title: "Save on Energy Bills",
      description: "Reduce electricity usage by using efficient appliances",
      category: "finance",
      progress: 45,
      target: 100,
      unit: "USD saved",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      completed: false,
    },
  ])

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "environment" as Goal["category"],
    target: 0,
    unit: "",
    deadline: "",
  })

  const categories = [
    { id: "environment" as const, label: "Environment", icon: Leaf, color: "bg-green-100 text-green-700" },
    { id: "health" as const, label: "Health", icon: Heart, color: "bg-red-100 text-red-700" },
    { id: "finance" as const, label: "Finance", icon: DollarSign, color: "bg-yellow-100 text-yellow-700" },
    { id: "community" as const, label: "Community", icon: Users, color: "bg-blue-100 text-blue-700" },
  ]

  const getCategoryData = (category: Goal["category"]) => {
    return categories.find((c) => c.id === category) || categories[0]
  }

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        progress: 0,
        target: newGoal.target,
        unit: newGoal.unit,
        deadline: new Date(newGoal.deadline),
        completed: false,
      }
      setGoals([goal, ...goals])
      setNewGoal({
        title: "",
        description: "",
        category: "environment",
        target: 0,
        unit: "",
        deadline: "",
      })
      setShowAddGoal(false)
    }
  }

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const newProgress = Math.min(goal.progress + increment, goal.target)
          return {
            ...goal,
            progress: newProgress,
            completed: newProgress >= goal.target,
          }
        }
        return goal
      }),
    )
  }

  const completedGoals = goals.filter((g) => g.completed).length
  const totalGoals = goals.length

  return (
    <SafeAreaLayout header={<AppHeader title="Goals" showBack />}>
      <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 pl-4 pr-4 pb-8">
        <div className="max-w-sm mx-auto">
          {/* Progress Overview */}
          <Card className="border-0 shadow-md mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Target className="w-4 h-4 text-greenery-600" />
                <span>Goal Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Overall Progress</span>
                <span className="text-sm font-medium text-greenery-700">
                  {completedGoals}/{totalGoals} completed
                </span>
              </div>
              <Progress value={(completedGoals / totalGoals) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Add Goal Form */}
          {showAddGoal && (
            <Card className="border-0 shadow-md mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-greenery-600" />
                  <span>Add New Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Goal Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Reduce plastic usage"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brief description of your goal"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="target" className="text-gray-700 font-medium">
                      Target
                    </Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="100"
                      value={newGoal.target || ""}
                      onChange={(e) => setNewGoal({ ...newGoal, target: Number.parseInt(e.target.value) || 0 })}
                      className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-gray-700 font-medium">
                      Unit
                    </Label>
                    <Input
                      id="unit"
                      placeholder="days, meals, USD"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-gray-700 font-medium">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <Button
                          key={category.id}
                          variant={newGoal.category === category.id ? "default" : "outline"}
                          onClick={() => setNewGoal({ ...newGoal, category: category.id })}
                          className={`h-12 ${
                            newGoal.category === category.id
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
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1 border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddGoal}
                    disabled={!newGoal.title || newGoal.target <= 0}
                    className="flex-1 bg-greenery-500 hover:bg-greenery-600 text-white"
                  >
                    Add Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Goals List */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Goals Yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first sustainability goal</p>
                  <Button
                    onClick={() => setShowAddGoal(true)}
                    className="bg-greenery-500 hover:bg-greenery-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              goals.map((goal) => {
                const categoryData = getCategoryData(goal.category)
                const Icon = categoryData.icon
                const progressPercentage = (goal.progress / goal.target) * 100
                const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                return (
                  <Card key={goal.id} className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon className="w-4 h-4 text-gray-600" />
                            <Badge className={`text-xs ${categoryData.color}`}>{categoryData.label}</Badge>
                            {goal.completed && (
                              <Badge className="text-xs bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-800">{goal.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Progress</span>
                        <span className="font-medium text-greenery-700">
                          {goal.progress}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}</span>
                        </div>
                        <span>{Math.round(progressPercentage)}% complete</span>
                      </div>

                      {!goal.completed && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateGoalProgress(goal.id, 1)}
                            className="flex-1 border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                          >
                            +1 {goal.unit}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateGoalProgress(goal.id, 5)}
                            className="flex-1 bg-greenery-500 hover:bg-greenery-600 text-white"
                          >
                            +5 {goal.unit}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </SafeAreaLayout>
  )
}
