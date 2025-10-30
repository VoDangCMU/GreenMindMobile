"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, CheckCircle } from "lucide-react"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout"
import AppHeader from "@/components/common/AppHeader"

interface BehaviorEntry {
  id: string
  description: string
  timestamp: Date
  impact: {
    environment: number
    health: number
    cost: number
  }
}

export default function TrackingPage() {
  const [entries, setEntries] = useState<BehaviorEntry[]>(
    [
      {
        id: "1",
        description: "Plant-based lunch at local restaurant",
        timestamp: new Date(),
        impact: { environment: 85, health: 90, cost: 75 },
      },
      {
        id: "2",
        description: "Took bus to work instead of car",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        impact: { environment: 80, health: 60, cost: 90 },
      },
    ]
  )
  const [newEntry, setNewEntry] = useState("")

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const entry: BehaviorEntry = {
        id: Date.now().toString(),
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

  return (
    <SafeAreaLayout header={<AppHeader title="Track Behavior" showBack />}>
      <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 pl-4 pr-4 pb-4">
        <div className="max-w-sm mx-auto">
          {/* Add New Entry */}
          <Card className="border-0 shadow-md mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Plus className="w-4 h-4 text-greenery-600" />
                <span>Add Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity" className="text-gray-700 font-medium">
                  Describe your activity
                </Label>
                <Input
                  id="activity"
                  placeholder="e.g., Had a vegetarian meal, Took the bus to work, Bought from local market"
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
                entries.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-greenery-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SafeAreaLayout>
  )
}
