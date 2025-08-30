import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, BarChart3, MessageCircle, Users, User, Camera, Lightbulb, Award, Leaf } from "lucide-react"
import {Link} from "react-router-dom"

export default function HomePage() {
  const menuItems = [
    {
      title: "Personality Quiz",
      description: "Discover your Big Five personality traits",
      icon: Brain,
      href: "/quiz",
      color: "bg-purple-100 text-purple-700",
      badge: "OCEAN Model",
    },
    {
      title: "Personalized Advice",
      description: "Get tailored sustainability recommendations",
      icon: Lightbulb,
      href: "/advice",
      color: "bg-yellow-100 text-yellow-700",
      badge: "AI-Powered",
    },
    {
      title: "Behavior Tracking",
      description: "Track eating, commuting & shopping habits",
      icon: Camera,
      href: "/tracking",
      color: "bg-blue-100 text-blue-700",
      badge: "OCR & GPS",
    },
    {
      title: "My Goals",
      description: "Set and track sustainability goals",
      icon: Target,
      href: "/goals",
      color: "bg-green-100 text-green-700",
      badge: "Goal Setting",
    },
    {
      title: "Impact Dashboard",
      description: "View your environmental & health impact",
      icon: BarChart3,
      href: "/impact",
      color: "bg-orange-100 text-orange-700",
      badge: "4 Dimensions",
    },
    {
      title: "AI Chatbot",
      description: "Chat with your sustainability assistant",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-indigo-100 text-indigo-700",
      badge: "Smart AI",
    },
    {
      title: "Community",
      description: "Connect with eco-conscious users",
      icon: Users,
      href: "/community",
      color: "bg-pink-100 text-pink-700",
      badge: "Social",
    },
    {
      title: "Profile",
      description: "Manage your account & achievements",
      icon: User,
      href: "/profile",
      color: "bg-gray-100 text-gray-700",
      badge: "Account",
    },
    {
      title: "Smart Recommendations",
      description: "AI-generated personalized suggestions",
      icon: Lightbulb,
      href: "/recommendations",
      color: "bg-emerald-100 text-emerald-700",
      badge: "Personalized",
    },
    {
      title: "Recommendation Feedback",
      description: "Understand why suggestions are made",
      icon: MessageCircle,
      href: "/feedback",
      color: "bg-teal-100 text-teal-700",
      badge: "Insights",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 p-4">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-greenery-500 rounded-full flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-greenery-700">GREEN MIND</h1>
          </div>
          <p className="text-gray-600 text-sm">Personalized Behavioral Insight Platform for Sustainable Living</p>
          <Badge className="bg-greenery-500 text-white">Demo Showcase</Badge>
        </div>

        {/* Stats Overview */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-greenery-700">10</div>
                <div className="text-xs text-gray-600">Features</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">4</div>
                <div className="text-xs text-gray-600">Impact Areas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">AI</div>
                <div className="text-xs text-gray-600">Powered</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={index} to={item.href}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-gray-800">{item.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Key Features */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Award className="w-4 h-4 text-greenery-600" />
              <span>Key Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-greenery-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Big Five Personality Analysis (OCEAN)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-greenery-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Behavioral Ontology Mapping (BCIO)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-greenery-500 rounded-full"></div>
              <span className="text-sm text-gray-700">4D Impact Measurement System</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-greenery-500 rounded-full"></div>
              <span className="text-sm text-gray-700">AI-Powered Recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-greenery-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Community & Gamification</span>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Built with Next.js, TypeScript & Tailwind CSS</p>
          <p>© 2024 Green Mind - Sustainable Living Platform</p>
        </div>
      </div>
    </div>
  )
}
