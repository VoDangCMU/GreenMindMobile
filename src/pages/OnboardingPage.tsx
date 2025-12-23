"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Info,
  Navigation,
  Target,
  MapPin,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";

const onboardingSteps = [
  {
    icon: Info,
    title: "Getting started",
    description: "Register or log in to start using GreenMind. Complete the onboarding survey and open the Quiz to discover your OCEAN personality traits.",
    color: "text-greenery-600",
    bgColor: "bg-greenery-100",
  },
  {
    icon: Navigation,
    title: "Navigation",
    description: "Use the bottom navigation to quickly access main sections: Home, Surveys, Todos, Notifications, and Profile. Tap any card on Home to explore.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Target,
    title: "Taking the quiz",
    description: "Answer each multiple-choice question. You can swipe left/right to navigate. All answers are saved locally until you submit.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: MapPin,
    title: "Location & Tracking",
    description: "GreenMind can request location permissions to record distances and improve insights. You can stop tracking anytime.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: ShieldCheck,
    title: "Privacy",
    description: "We store only necessary data (answers, basic profile, anonymized metrics). You can request data removal via Profile.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, onboardingSteps.length - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const delta = touchStartX.current - touchEndX.current;

    if (Math.abs(delta) > 50) {
      if (delta > 0) handleNext(); // swipe left -> next
      else handlePrev(); // swipe right -> prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <SafeAreaLayout
      header={
        <AppHeader
          title="Onboarding"
          showBack
          rightActions={[
            <Link to="/home" key="skip">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                Skip
              </Button>
            </Link>,
          ]}
        />
      }
    >
      <div
        className="flex-1 flex flex-col h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 flex flex-col justify-center px-4 space-y-8">
          <Card className="border-0 shadow-none bg-transparent text-center">
            <CardContent className="p-4 space-y-6">
              <div
                className={`w-32 h-32 ${step.bgColor} rounded-full flex items-center justify-center mx-auto transition-colors duration-300`}
              >
                <Icon className={`w-16 h-16 ${step.color}`} />
              </div>
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {step.title}
                </h1>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentStep ? "bg-greenery-500 w-8" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 pb-8 min-h-[100px] flex items-center justify-center">
          {currentStep === onboardingSteps.length - 1 && (
            <Button
              onClick={() => navigate("/onboarding-quiz")}
              className="w-full rounded-full py-6 bg-greenery-600 hover:bg-greenery-700 text-white shadow-lg shadow-greenery-200 animate-in fade-in zoom-in duration-300"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </SafeAreaLayout>
  );
}
