import React from "react";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressSteps({
  steps,
  currentStep,
}: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-colors duration-200
                  ${
                    isCompleted
                      ? "bg-success text-white"
                      : isActive
                        ? "bg-navy text-white"
                        : "bg-gray-200 text-text-muted"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-navy" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-1.5rem] ${
                  stepNum < currentStep ? "bg-success" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
