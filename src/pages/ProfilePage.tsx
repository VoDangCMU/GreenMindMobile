"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit3,
  Settings,
  Trophy,
  Target,
  Calendar,
  Leaf,
  Heart,
  DollarSign,
  Users,
  Award,
  Camera,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/AppHeader"

export default function ProfilePage() {
  const navigate = useNavigate();
  const clearAuth = useAppStore(state => state.clearAuth);
  const user = useAppStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false)
  const setBypassAuthGate = useAppStore(state => state.setBypassAuthGate);
  // Nếu user null, có thể redirect về login hoặc hiển thị thông báo
  const [userInfo, setUserInfo] = useState({
    name: user?.fullName || user?.username || "",
    email: user?.email || "",
    bio: "Passionate about sustainable living and helping others make eco-friendly choices.",
    location: "",
    joinDate: "",
  })

  const stats = {
    level: 15,
    totalPoints: 2650,
    nextLevelPoints: 3000,
    streak: 12,
    goalsCompleted: 127,
    impactScore: 8.4,
  }

  const achievements = [
    { id: 1, title: "Eco Warrior", description: "Completed 50 environmental goals", icon: Leaf, earned: true },
    {
      id: 2,
      title: "Health Champion",
      description: "Maintained healthy habits for 30 days",
      icon: Heart,
      earned: true,
    },
    {
      id: 3,
      title: "Smart Saver",
      description: "Saved $500 through sustainable choices",
      icon: DollarSign,
      earned: true,
    },
    {
      id: 4,
      title: "Community Leader",
      description: "Helped 10 friends join the platform",
      icon: Users,
      earned: false,
    },
    { id: 5, title: "Consistency King", description: "30-day activity streak", icon: Target, earned: false },
    { id: 6, title: "Impact Master", description: "Achieved 9.0+ impact score", icon: Trophy, earned: false },
  ]

  const recentActivity = [
    { id: 1, action: "Completed goal: Reduce meat consumption", date: "2 hours ago", points: 25 },
    { id: 2, action: "Shared tip in community", date: "1 day ago", points: 10 },
    { id: 3, action: "Tracked sustainable commute", date: "2 days ago", points: 15 },
    { id: 4, action: "Joined Zero Waste Challenge", date: "3 days ago", points: 50 },
  ]

  const menuItems = [
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: Shield, label: "Privacy & Security", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: Settings, label: "App Settings", action: () => {} },
  ]

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In real app, save to backend
  }

  const progressToNextLevel = ((stats.totalPoints % 1000) / 1000) * 100

  return (
    <SafeAreaLayout
      header={
        <AppHeader showBack title="Profile"></AppHeader>
      }
    >
      <div className="max-w-sm mx-auto pl-4 pr-4 pb-8 space-y-4">
        {/* Profile Info */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-greenery-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {userInfo.name
                        ? userInfo.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2)
                        : "--"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-greenery-500 p-0"
                  >
                    <Camera className="w-3 h-3 text-greenery-700" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-800">{userInfo.name}</h2>
                    <Badge className="bg-greenery-500 text-white">{user?.role ? user.role : "User"}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{userInfo.email}</p>
                  {/* Có thể bổ sung location, joinDate nếu backend trả về */}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      value={userInfo.bio}
                      onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                      className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={userInfo.location}
                      onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                      className="border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-greenery-500 hover:bg-greenery-600 text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">{userInfo.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-greenery-600" />
                <span>Level Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Level {stats.level}</span>
                <span className="font-medium text-greenery-700">
                  {stats.totalPoints}/{stats.nextLevelPoints} XP
                </span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-xs text-gray-600 text-center">
                {stats.nextLevelPoints - stats.totalPoints} XP to next level
              </p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-lg font-bold text-orange-700">{stats.streak}</p>
                <p className="text-xs text-gray-600">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-700">{stats.goalsCompleted}</p>
                <p className="text-xs text-gray-600">Goals Done</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-700">{stats.impactScore}</p>
                <p className="text-xs text-gray-600">Impact Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Award className="w-4 h-4 text-greenery-600" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg text-center ${
                        achievement.earned
                          ? "bg-greenery-50 border border-greenery-200"
                          : "bg-gray-50 border border-gray-200 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          achievement.earned ? "bg-greenery-500" : "bg-gray-300"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${achievement.earned ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <h4 className="text-xs font-medium text-gray-800 mb-1">{achievement.title}</h4>
                      <p className="text-xs text-gray-600 leading-tight">{achievement.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-greenery-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <Badge className="bg-greenery-100 text-greenery-700 text-xs">+{activity.points} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Settings Menu */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Settings className="w-4 h-4 text-greenery-600" />
                <span>Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={item.action}
                    className="w-full justify-start h-12 text-gray-700 hover:bg-greenery-50"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-red-600 hover:bg-red-50"
                onClick={() => {
                  clearAuth();
                  setBypassAuthGate(false);
                  navigate("/", { replace: true });
                }}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
      </div>
    </SafeAreaLayout>
  )
}
