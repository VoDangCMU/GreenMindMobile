"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MessageCircle, Share2, Trophy, TrendingUp, Leaf, Target, Award, Search, Home } from "lucide-react"
import {Link} from "react-router-dom"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout"
import AppHeader from "@/components/AppHeader"

interface CommunityPost {
  id: string
  user: {
    name: string
    avatar: string
    level: number
    badge: string
  }
  content: string
  category: "achievement" | "tip" | "question" | "challenge"
  likes: number
  comments: number
  timestamp: Date
  liked: boolean
}

interface LeaderboardUser {
  rank: number
  name: string
  avatar: string
  score: number
  badge: string
  trend: "up" | "down" | "same"
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "leaderboard" | "challenges">("feed")

  const communityPosts: CommunityPost[] = [
    {
      id: "1",
      user: { name: "Sarah Chen", avatar: "SC", level: 15, badge: "Eco Warrior" },
      content:
        "Just completed my 30-day plastic-free challenge! 🌱 Saved an estimated 2.5kg of plastic waste. The hardest part was finding alternatives for food packaging, but I discovered some amazing local zero-waste stores!",
      category: "achievement",
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      liked: false,
    },
    {
      id: "2",
      user: { name: "Mike Johnson", avatar: "MJ", level: 8, badge: "Health Champion" },
      content:
        "Pro tip: Meal prepping on Sundays has helped me stick to plant-based eating AND save $50/week on groceries! 💪 Anyone else doing meal prep? Share your favorite recipes!",
      category: "tip",
      likes: 18,
      comments: 12,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      liked: true,
    },
    {
      id: "3",
      user: { name: "Emma Wilson", avatar: "EW", level: 22, badge: "Community Leader" },
      content:
        "Question for the community: What's your biggest challenge with sustainable commuting? I'm trying to bike to work more but the weather has been unpredictable 🚴‍♀️",
      category: "question",
      likes: 15,
      comments: 20,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      liked: false,
    },
    {
      id: "4",
      user: { name: "David Park", avatar: "DP", level: 12, badge: "Smart Saver" },
      content:
        "Challenge accepted! ✅ Reduced my energy bill by 30% this month using smart home automation. Next goal: solar panels! Who's with me on the renewable energy journey?",
      category: "challenge",
      likes: 31,
      comments: 6,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      liked: true,
    },
  ]

  const leaderboard: LeaderboardUser[] = [
    { rank: 1, name: "Emma Wilson", avatar: "EW", score: 2840, badge: "Community Leader", trend: "same" },
    { rank: 2, name: "Alex Rodriguez", avatar: "AR", score: 2650, badge: "Eco Master", trend: "up" },
    { rank: 3, name: "Sarah Chen", avatar: "SC", score: 2420, badge: "Eco Warrior", trend: "up" },
    { rank: 4, name: "Mike Johnson", avatar: "MJ", score: 2180, badge: "Health Champion", trend: "down" },
    { rank: 5, name: "You", avatar: "YU", score: 1950, badge: "Green Enthusiast", trend: "up" },
  ]

  const challenges = [
    { id: 1, title: "Zero Waste Week", participants: 156, reward: "50 points", difficulty: "Medium" },
    { id: 2, title: "10K Steps Daily", participants: 89, reward: "30 points", difficulty: "Easy" },
    { id: 3, title: "Plant-Based Month", participants: 234, reward: "100 points", difficulty: "Hard" },
    { id: 4, title: "Energy Saver", participants: 67, reward: "40 points", difficulty: "Medium" },
  ]

  const getCategoryIcon = (category: CommunityPost["category"]) => {
    switch (category) {
      case "achievement":
        return Trophy
      case "tip":
        return Leaf
      case "question":
        return MessageCircle
      case "challenge":
        return Target
      default:
        return MessageCircle
    }
  }

  const getCategoryColor = (category: CommunityPost["category"]) => {
    switch (category) {
      case "achievement":
        return "bg-yellow-100 text-yellow-700"
      case "tip":
        return "bg-green-100 text-green-700"
      case "question":
        return "bg-blue-100 text-blue-700"
      case "challenge":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleLike = (postId: string) => {
    // In real app, this would update the backend
    console.log(`Liked post ${postId}`)
  }

  const navTabs = [
    { id: "feed", label: "Feed", icon: MessageCircle },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "challenges", label: "Challenges", icon: Target },
  ]

  const rightActions = [
    <button key="search" className="p-2" aria-label="Search">
      <Search className="w-5 h-5 text-greenery-700" />
    </button>
  ]

  return (
    <SafeAreaLayout header={<AppHeader title="Community" showBack rightActions={rightActions} />}>
      <div className="max-w-sm mx-auto pb-20">
        {/* Feed Content */}
        <div className="pl-4 pr-4 space-y-4">
          {/* Posts */}
          {communityPosts.map((post) => {
            const CategoryIcon = getCategoryIcon(post.category)
            return (
              <Card key={post.id} className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-greenery-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{post.user.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-800">{post.user.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            Lv.{post.user.level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {post.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`p-1 ${post.liked ? "text-red-500" : "text-gray-500"}`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.liked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 text-gray-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1 text-gray-500">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="p-4 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-greenery-600" />
                  <span>Top Contributors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((user) => {
                  const TrendIcon = user.trend === "up" ? TrendingUp : user.trend === "down" ? TrendingUp : null
                  return (
                    <div
                      key={user.rank}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        user.name === "You" ? "bg-greenery-50 border border-greenery-200" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank <= 3 ? "bg-yellow-400 text-yellow-900" : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 bg-greenery-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-800">{user.name}</h3>
                          {TrendIcon && (
                            <TrendIcon
                              className={`w-3 h-3 ${user.trend === "up" ? "text-green-600" : "text-red-600"}`}
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{user.badge}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-greenery-700">{user.score.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div className="p-4 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Target className="w-4 h-4 text-greenery-600" />
                  <span>Active Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-600">{challenge.participants} participants</span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              challenge.difficulty === "Easy"
                                ? "bg-green-100 text-green-700"
                                : challenge.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">{challenge.reward}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-greenery-500 hover:bg-greenery-600 text-white">
                      Join Challenge
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-greenery-100 shadow-lg z-20 flex justify-around items-center py-2">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-col items-center justify-center px-2 py-1 focus:outline-none transition-all ${active ? "text-greenery-600" : "text-gray-400"}`}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? "text-greenery-600" : "text-gray-400"}`} />
              <span className={`text-xs font-medium ${active ? "text-greenery-700" : "text-gray-400"}`}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </SafeAreaLayout>
  )
}
