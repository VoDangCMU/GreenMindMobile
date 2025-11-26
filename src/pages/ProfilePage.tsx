"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
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
  User,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyData } from "@/hooks/usePreAppSurveyData";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { MOCKED_OCEAN_SCORE } from "@/apis/ai/calculate_ocean_score";
import CurrentLocationCard from "@/components/app-components/CurrentLocationCard";
import LocationHistoryCard from "@/components/app-components/LocationHistoryCard";
import HomeLocationCard from "@/components/app-components/HomeLocationCard";
import NightOutStatusCard from "@/components/app-components/NightOutStatusCard";
import { useAuthStore } from "@/store/authStore";
import BottomNav from "@/components/app-components/HomeBottomNav";

export default function ProfilePage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const setBypassAuthGate = useAuthStore((state) => state.setBypassAuthGate);
  const ocean = useAppStore((state) => state.ocean) || MOCKED_OCEAN_SCORE;

  // Get Pre-App Survey data
  const { answers, isCompleted, completedAt } = usePreAppSurveyData();

  console.log("Pre-App Survey Data:", { answers, isCompleted, completedAt });

  const [userInfo, setUserInfo] = useState({
    name: user?.full_name || user?.username || "",
    email: user?.email || "",
    gender: user?.gender || "Unknown",
    bio: "Passionate about sustainable living and helping others make eco-friendly choices.",
    location: user?.location || "Unknown",
    joinDate: "",
  });

  const stats = {
    level: 15,
    totalPoints: 2650,
    nextLevelPoints: 3000,
    streak: 12,
    goalsCompleted: 127,
    impactScore: 8.4,
  };

  const achievements = [
    {
      id: 1,
      title: "Eco Warrior",
      description: "Completed 50 environmental goals",
      icon: Leaf,
      earned: true,
    },
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
    {
      id: 5,
      title: "Consistency King",
      description: "30-day activity streak",
      icon: Target,
      earned: false,
    },
    {
      id: 6,
      title: "Impact Master",
      description: "Achieved 9.0+ impact score",
      icon: Trophy,
      earned: false,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Completed goal: Reduce meat consumption",
      date: "2 hours ago",
      points: 25,
    },
    { id: 2, action: "Shared tip in community", date: "1 day ago", points: 10 },
    {
      id: 3,
      action: "Tracked sustainable commute",
      date: "2 days ago",
      points: 15,
    },
    {
      id: 4,
      action: "Joined Zero Waste Challenge",
      date: "3 days ago",
      points: 50,
    },
  ];

  const menuItems = [
    { icon: Bell, label: "Notifications", action: () => { } },
    { icon: Shield, label: "Privacy & Security", action: () => { } },
    { icon: HelpCircle, label: "Help & Support", action: () => { } },
    { icon: Settings, label: "App Settings", action: () => { } },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In real app, save to backend
  };

  const progressToNextLevel = ((stats.totalPoints % 1000) / 1000) * 100;

  return (
    <SafeAreaLayout
      header={<AppHeader showBack title="Profile"></AppHeader>}
      footer={<BottomNav></BottomNav>}
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
                      ? userInfo.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
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
                  <h2 className="text-xl font-bold text-gray-800">
                    {userInfo.name}
                  </h2>
                  <Badge className="bg-greenery-500 text-white">
                    {user?.role ? user.role : "User"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{userInfo.email}</p>

                {/* Gender */}
                <div className="flex items-center space-x-1 text-gray-600 mb-1">
                  <User className="w-4 h-4" />
                  <span>{userInfo.gender} 25</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{userInfo.location}</span>
                </div>
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
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, bio: e.target.value })
                    }
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
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, location: e.target.value })
                    }
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

        {/* OCEAN Score Vertical */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Users className="w-4 h-4 text-greenery-600" />
              <span>OCEAN Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 items-end h-40">
              {Object.entries(ocean).map(([trait, value]) => (
                <div
                  key={trait}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="w-3 h-32 bg-gray-200 relative rounded-md overflow-hidden">
                    <div
                      className="bg-greenery-500 w-full absolute bottom-0"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{trait}</span>
                  <span className="text-xs">{value.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pre-App Survey Card */}
        {answers && (
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Pre-App Survey</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(answers).map(([key, value]) => (
                  <div key={key} className="flex flex-col text-sm">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-blue-700 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              {isCompleted && completedAt && (
                <div className="mt-3 text-xs text-gray-500">
                  Đã hoàn thành: {new Date(completedAt).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Location Card */}
        <CurrentLocationCard />

        {/* Home Location Card */}
        <HomeLocationCard />

        {/* Night Out Status Card */}
        <NightOutStatusCard />

        {/* Location History Card */}
        <LocationHistoryCard />

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
              <p className="text-lg font-bold text-orange-700">
                {stats.streak}
              </p>
              <p className="text-xs text-gray-600">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-700">
                {stats.goalsCompleted}
              </p>
              <p className="text-xs text-gray-600">Goals Done</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-700">
                {stats.impactScore}
              </p>
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
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg text-center ${achievement.earned
                      ? "bg-greenery-50 border border-greenery-200"
                      : "bg-gray-50 border border-gray-200 opacity-50"
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${achievement.earned ? "bg-greenery-500" : "bg-gray-300"
                        }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${achievement.earned ? "text-white" : "text-gray-500"
                          }`}
                      />
                    </div>
                    <h4 className="text-xs font-medium text-gray-800 mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-tight">
                      {achievement.description}
                    </p>
                  </div>
                );
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
                <Badge className="bg-greenery-100 text-greenery-700 text-xs">
                  +{activity.points} XP
                </Badge>
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
              const Icon = item.icon;
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
              );
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
  );
}
