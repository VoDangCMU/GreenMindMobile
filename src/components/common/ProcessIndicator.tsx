import React from "react";

interface ProcessIndicatorProps {
  currentStep: number;
  maxStep: number;
  showSteps?: boolean;
}

const ProcessIndicator: React.FC<ProcessIndicatorProps> = ({ currentStep, maxStep, showSteps }) => {
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-2">
        {showSteps && <span className="text-sm text-gray-600">Step {currentStep} of {maxStep}</span>}
        <span className="text-sm text-gray-600">{Math.round((currentStep / maxStep) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-greenery-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / maxStep) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProcessIndicator;
