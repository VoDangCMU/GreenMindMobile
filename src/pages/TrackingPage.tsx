"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, MapPin, Utensils, Car, ShoppingBag, Plus, CheckCircle } from "lucide-react"
import {Link} from "react-router-dom"

type BehaviorCategory = "eating" | "commuting" | "shopping"

interface BehaviorEntry {
  id: string
  category: BehaviorCategory
  description: string
  timestamp: Date
  impact: {
    environment: number
    health: number
    cost: number
  }
}

export default function TrackingPage() {
  const [activeCategory, setActiveCategory] = useState<BehaviorCategory>("eating")
  const [entries, setEntries] = useState<BehaviorEntry[]>([
    {
      id: "1",
      category: "eating",
      description: "Plant-based lunch at local restaurant",
      timestamp: new Date(),
      impact: { environment: 85, health: 90, cost: 75 },
    },
    {
      id: "2",
      category: "commuting",
      description: "Took bus to work instead of car",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      impact: { environment: 80, health: 60, cost: 90 },
    },
  ])
  const [newEntry, setNewEntry] = useState("")

  const categories = [
    { id: "eating" as const, label: "Eating", icon: Utensils, color: "bg-green-100 text-green-700" },
    { id: "commuting" as const, label: "Commuting", icon: Car, color: "bg-blue-100 text-blue-700" },
    { id: "shopping" as const, label: "Shopping", icon: ShoppingBag, color: "bg-purple-100 text-purple-700" },
  ]

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const entry: BehaviorEntry = {
        id: Date.now().toString(),
        category: activeCategory,
        description: newEntry,
        timestamp: new Date(),
        impact: {
          environment: Math.floor(Math.random() * 40) + 60,
          health: Math.floor(Math.random() * 40) + 60,
          cost: Math.floor(Math.random() * 40) + 60,
        },
      }
      setEntries([entry, ...entries])
      setNewEntry("")
    }
  }

  const getCategoryIcon = (category: BehaviorCategory) => {
    const categoryData = categories.find((c) => c.id === category)
    return categoryData ? categoryData.icon : Utensils
  }

  const getCategoryColor = (category: BehaviorCategory) => {
    const categoryData = categories.find((c) => c.id === category)
    return categoryData ? categoryData.color : "bg-gray-100 text-gray-700"
  }

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
          <h1 className="text-lg font-bold text-greenery-700">Track Behavior</h1>
          <div className="w-9" />
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 h-12 ${
                  activeCategory === category.id
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="h-16 flex-col space-y-1 border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">Scan Receipt</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-1 border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs">Track Location</span>
          </Button>
        </div>

        {/* Add New Entry */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Plus className="w-4 h-4 text-greenery-600" />
              <span>Add {categories.find((c) => c.id === activeCategory)?.label} Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity" className="text-gray-700 font-medium">
                Describe your activity
              </Label>
              <Input
                id="activity"
                placeholder={`e.g., ${activeCategory === "eating" ? "Had a vegetarian meal" : activeCategory === "commuting" ? "Took the bus to work" : "Bought from local market"}`}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
              />
            </div>
            <Button
              onClick={handleAddEntry}
              disabled={!newEntry.trim()}
              className="w-full bg-greenery-500 hover:bg-greenery-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-greenery-600" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activities tracked yet</p>
            ) : (
              entries.map((entry) => {
                const Icon = getCategoryIcon(entry.category)
                return (
                  <div key={entry.id} className="border-l-4 border-greenery-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <Badge className={`text-xs ${getCategoryColor(entry.category)}`}>{entry.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-800 mb-2">{entry.description}</p>
                        <div className="flex space-x-3 text-xs">
                          <span className="text-green-600">🌱 {entry.impact.environment}%</span>
                          <span className="text-blue-600">💪 {entry.impact.health}%</span>
                          <span className="text-orange-600">💰 {entry.impact.cost}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="mt-6 space-y-3">
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
