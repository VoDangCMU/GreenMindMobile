import React from "react";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { AppBottomNavBar } from "./HomePage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, Navigation, Target, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuidePage() {
  return (
    <SafeAreaLayout header={<AppHeader title="How to use GreenMind" showBack />} footer={<AppBottomNavBar />}>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-24 space-y-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-greenery-600" /> Getting started</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>Register or log in to start using GreenMind.</li>
              <li>Complete the onboarding survey to personalize suggestions.</li>
              <li>Open the Quiz to discover your OCEAN personality traits.</li>
            </ol>
            <div className="mt-3">
              <Link to="/register"><Button variant="outline" size="sm">Create account</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Navigation className="w-5 h-5 text-greenery-600" /> Navigation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <p className="mb-2">Use the bottom navigation to quickly access main sections: Home, Surveys, Todos, Notifications, Profile.</p>
            <p className="mb-0">Tap any card on the Home screen to explore features.</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-greenery-600" /> Taking the quiz</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <ul className="list-disc list-inside space-y-2">
              <li>Answer each multiple-choice question. You can swipe left/right to navigate.</li>
              <li>All answers are saved locally while you complete the quiz.</li>
              <li>Submit appears when you reach the last question and all questions are answered.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-greenery-600" /> Location & Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <p className="mb-2">GreenMind can request location permissions to record distances and improve insights. You can stop tracking anytime on the Home screen.</p>
            <p className="mb-0">If tracking is off, the app uses the last known position.</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-greenery-600" /> Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <p className="mb-2">We store only necessary data (answers, basic profile, anonymized metrics). You can request data removal via Profile.</p>
            <p className="mb-0">For details, check the privacy page (coming soon).</p>
          </CardContent>
        </Card>

        <div className="pt-4 text-center">
          <Link to="/survey-list" className="inline-flex items-center gap-2 text-sm text-greenery-600 hover:underline">
            Explore surveys <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SafeAreaLayout>
  );
}
