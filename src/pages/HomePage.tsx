import { Card } from "@/components/ui/card"
import { Target, Award, Users, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import AppHeader from "@/components/AppHeader"
import { useEffect, useRef, useState } from "react"
import { App as CapacitorApp } from "@capacitor/app"
import BottomNav from "@/components/BottomNav"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout"

const features = [
  {
    to: "/quiz",
    icon: <Target className="w-8 h-8 text-greenery-600" />,
    title: "Personality Quiz",
    desc: "Discover your unique personality traits and get personalized insights.",
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
    to: "/scan-bill",
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
    title: "Scan Bill",
    desc: "Scan receipts and bills using your camera or gallery.",
  },
]

export default function HomePage() {
  const backPressCount = useRef(0)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    let listenerHandle: any
    ;(async () => {
      listenerHandle = await CapacitorApp.addListener("backButton", () => {
        if (window.location.hash === "#/" || window.location.pathname === "/") {
          backPressCount.current++
          if (backPressCount.current < 2) {
            setShowToast(true)
            setTimeout(() => setShowToast(false), 1500)
          } else {
            CapacitorApp.exitApp()
          }
        } else {
          window.history.back()
        }
      })
    })()
    return () => {
      if (listenerHandle && typeof listenerHandle.remove === "function") {
        listenerHandle.remove()
      } else if (listenerHandle && typeof listenerHandle.then === "function") {
        listenerHandle.then((h: any) => h.remove && h.remove())
      }
    }
  }, [])

  return (
    <SafeAreaLayout
      className="bg-gradient-to-br from-greenery-50 to-greenery-100"
      header={<AppHeader />}
      footer={<BottomNav />}
    >
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-greenery-700 text-white px-4 py-2 rounded-xl shadow z-50 animate-fade-in">
          Nhấn back lần nữa để thoát
        </div>
      )}
      <div className="w-full max-w-md mx-auto pt-10 pb-6 px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-greenery-500 flex items-center justify-center shadow-md mb-3">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-greenery-700 mb-1 tracking-tight text-center drop-shadow-sm">
            Green Mind
          </h1>
          <p className="text-greenery-600 text-center">
            Your journey to a greener, more mindful life starts here.
          </p>
        </div>
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
  )
}
