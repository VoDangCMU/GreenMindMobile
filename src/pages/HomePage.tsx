import { Card } from "@/components/ui/card";
import { Target, Award, Users, MessageCircle, AlertCircle, CheckCircle2, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/app-components/HomeAppHeader";
import BottomNav from "@/components/app-components/HomeBottomNav";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import OceanPersonalityCard from "@/components/app-components/OceanPersonalityCard";
import NightOutCard from "@/components/app-components/NightOutCard";
import CurrentLocationCard from "@/components/app-components/CurrentLocationCard";

const features = [
  {
    to: "/plant-scan-history",
    icon: (
      <svg
        className="w-8 h-8 text-greenery-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M8 12c1.5-2 6.5-2 8 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Tỷ lệ rau củ",
    desc: "Phân tích tỉ lệ rau củ trong món ăn từ ảnh.",
  },
  {
    to: "/invoice-history",
    icon: (
      <svg
        className="w-8 h-8 text-greenery-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
    title: "Invoice History",
    desc: "Show all your scanned invoices.",
  },
  {
    to: "/quiz",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Personality Quiz",
    desc: "Discover your unique personality traits and get personalized insights.",
  },
  {
    to: "/todo",
    icon: <CheckCircle2 className="w-8 h-8 text-greenery-600" />,
    title: "Todo",
    desc: "Manage your tasks and subtasks.",
  },
  {
    to: "/register",
    icon: <Users className="w-8 h-8 text-greenery-600" />,
    title: "Register",
    desc: "Create a new account.",
  },
  {
    to: "/home",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Home",
    desc: "Go to the home dashboard.",
  },
  {
    to: "/onboarding",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Onboarding",
    desc: "Complete your onboarding steps.",
  },
  {
    to: "/onboarding-quiz",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Onboarding Survey",
    desc: "Take our comprehensive onboarding survey to personalize your experience.",
  },
  {
    to: "/advice",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Advice",
    desc: "Get advice and tips.",
  },
  {
    to: "/goals",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "My Goals",
    desc: "Set, track, and achieve your personal growth goals.",
  },
  {
    to: "/community",
    icon: <Users className="w-8 h-8 text-greenery-600" />,
    title: "Community",
    desc: "Connect, share, and grow with like-minded people.",
  },
  {
    to: "/chat",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Chat",
    desc: "Get advice and support from our smart assistant.",
  },
  {
    to: "/feedback",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Feedback",
    desc: "Send us your feedback.",
  },
  {
    to: "/impact",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Impact",
    desc: "See your impact stats.",
  },
  {
    to: "/profile",
    icon: <Users className="w-8 h-8 text-greenery-600" />,
    title: "Profile",
    desc: "View and edit your profile.",
  },
  {
    to: "/recommendations",
    icon: <Award className="w-8 h-8 text-greenery-600" />,
    title: "Recommendations",
    desc: "See personalized recommendations.",
  },
  {
    to: "/tracking",
    icon: <MessageCircle className="w-8 h-8 text-greenery-600" />,
    title: "Tracking",
    desc: "Track your progress.",
  },
];

export default function HomePage() {
  return (
    <SafeAreaLayout
      className="bg-gradient-to-br from-greenery-50 to-greenery-100"
      header={<AppHeader />}
      footer={<BottomNav />}
    >
      <div className="w-full max-w-md mx-auto pt-10 pb-6 px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-greenery-500 flex items-center justify-center shadow-md mb-3">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-greenery-700 mb-1 tracking-tight text-center drop-shadow-sm">
            Green Mind
          </h1>
          <p className="text-greenery-600 text-center">
            Your journey to a greener, more mindful life starts here.
          </p>
        </div>

        <OceanPersonalityCard />

        <div className="mb-4">
          <CurrentLocationCard />
        </div>

        <div className="mb-6">
          <NightOutCard />
        </div>

        {/* Onboarding Quiz Status */}
        <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1">
                Hoàn thành khảo sát onboarding
              </h3>
              <p className="text-sm text-blue-600 mb-3">
                Để GreenMind hiểu rõ hơn về bạn và đưa ra những gợi ý phù hợp nhất.
              </p>
              <Link to="/onboarding-quiz">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Bắt đầu khảo sát
                </button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          {features.map((f) => (
            <Link to={f.to} key={f.title} className="block group">
              <Card className="flex flex-row items-center gap-4 rounded-2xl shadow-lg p-5 bg-white/95 hover:bg-greenery-50 transition-all border border-greenery-100 group-hover:scale-[1.025]">
                <div className="flex-shrink-0">{f.icon}</div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-greenery-700 text-lg mb-1 truncate group-hover:text-greenery-600 transition-colors">
                    {f.title}
                  </span>
                  <span className="text-xs text-greenery-500 leading-tight truncate">
                    {f.desc}
                  </span>
                </div>
                <span className="ml-auto text-greenery-400 text-xl font-bold group-hover:text-greenery-600 transition-colors">
                  ›
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SafeAreaLayout>
  );
}
