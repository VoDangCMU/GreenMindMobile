import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
import type { IMetricFeedback } from "@/store/v2/metricFeedbackStore";

interface MetricFeedbackCardProps {
  feedback: IMetricFeedback;
}

export function MetricFeedbackCard({ feedback }: MetricFeedbackCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to round to 3 decimal places
  const round3 = (num: number) => Math.round(num * 1000) / 1000;

  return (
    <Card className="mb-4 border-0 shadow-lg">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {feedback.contrib > 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <CardTitle className="text-base capitalize">{feedback.metric}</CardTitle>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              feedback.contrib > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {feedback.contrib > 0 ? '+' : ''}{round3(feedback.contrib)}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <p className="text-gray-500">Value Today (vt)</p>
              <p className="font-semibold text-gray-800">{round3(feedback.vt)}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">Baseline (bt)</p>
              <p className="font-semibold text-gray-800">{round3(feedback.bt)}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">Correlation (r)</p>
              <p className="font-semibold text-gray-800">{round3(feedback.r)}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-500">Contribution (contrib)</p>
              <p className="font-semibold text-gray-800">{round3(feedback.contrib)}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Reason</p>
            <p className="text-sm text-gray-800">{feedback.reason}</p>
          </div>

          {/* Mechanism Feedback */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Mechanism Feedback</p>
            <div className="space-y-2 p-2 bg-purple-50 rounded-lg">
              <div className="text-xs">
                <p className="text-gray-500">Awareness</p>
                <p className="text-gray-800">{feedback.mechanismFeedback.awareness}</p>
              </div>
              <div className="text-xs">
                <p className="text-gray-500">Motivation</p>
                <p className="text-gray-800">{feedback.mechanismFeedback.motivation}</p>
              </div>
              <div className="text-xs">
                <p className="text-gray-500">Capability</p>
                <p className="text-gray-800">{feedback.mechanismFeedback.capability}</p>
              </div>
              <div className="text-xs">
                <p className="text-gray-500">Opportunity</p>
                <p className="text-gray-800">{feedback.mechanismFeedback.opportunity}</p>
              </div>
            </div>
          </div>

          {/* OCEAN Score */}
          <div className="p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">New OCEAN Score</p>
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(feedback.new_ocean_score).map(([trait, score]) => (
                <div key={trait} className="text-center">
                  <p className="text-xs font-bold text-gray-700">{trait}</p>
                  <p className="text-sm text-green-600 font-semibold">{round3(score as number)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-400">
            {new Date(feedback.timestamp).toLocaleString("vi-VN")}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
