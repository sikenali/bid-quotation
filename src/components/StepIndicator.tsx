import React from 'react';

interface Props {
  currentStep: number;
  totalSteps?: number;
}

const steps = ['报价方法', '判定规则', '扣分规则', '投标报价'];

export function StepIndicator({ currentStep, totalSteps = 4 }: Props) {
  return (
    <div className="flex items-center gap-2">
      {steps.slice(0, totalSteps).map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-[#C43A31]'
                  : isDone
                  ? 'bg-[#5B8C5A]'
                  : 'bg-[#F0E8D5]'
              }`}
            >
              {isDone ? (
                <i className="ri-check-line text-white text-[16px]"></i>
              ) : (
                <span className={`text-sm font-medium ${
                  isActive ? 'text-white' : 'text-text-secondary'
                }`}>
                  {stepNum}
                </span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-6 h-0.5 rounded-full ${
                  stepNum < currentStep ? 'bg-[#5B8C5A]' : 'bg-[#D4C4A8]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
