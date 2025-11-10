"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  Brain,
  Target,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const onboardingSteps = [
  {
    icon: Leaf,
    title: "Welcome to GREEN MIND",
    description:
      "Your personal guide to sustainable living through behavioral insights and personalized recommendations.",
    color: "text-greenery-600",
    bgColor: "bg-greenery-100",
  },
  {
    icon: Brain,
    title: "Understand Yourself",
    description:
      "Discover your personality traits and how they influence your daily behaviors and environmental impact.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Target,
    title: "Track Your Impact",
    description:
      "Monitor your eating, commuting, and consumption habits to see their effects on environment, health, and finances.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: TrendingUp,
    title: "Get Personalized Tips",
    description:
      "Receive tailored recommendations based on your personality and goals to live more sustainably.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Users,
    title: "Join the Community",
    description:
      "Connect with others on their sustainability journey and share your progress and achievements.",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
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
      if (delta > 0) handleNext(); // vuốt sang trái → next
      else handlePrev(); // vuốt sang phải → prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 p-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-sm mx-auto flex flex-col justify-between h-screen py-8">
        <div className="flex justify-end">
          <Link to="/home">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              Skip
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-8">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-8 space-y-6">
              <div
                className={`w-24 h-24 ${step.bgColor} rounded-full flex items-center justify-center mx-auto`}
              >
                <Icon className={`w-12 h-12 ${step.color}`} />
              </div>
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {step.title}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-greenery-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 rounded-full py-3 bg-white border border-greenery-200 text-greenery-700 shadow-sm transition-all duration-150 hover:bg-greenery-50 hover:border-greenery-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => {
              if (currentStep < onboardingSteps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                navigate("/onboarding-quiz");
              }
            }}
            className="flex-1 rounded-full py-3 bg-greenery-500 text-white shadow-sm transition-all duration-150 hover:bg-greenery-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === onboardingSteps.length - 1
              ? "Take Survey"
              : "Next"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
