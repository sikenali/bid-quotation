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
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white'
                  : isDone
                  ? 'bg-success text-white'
                  : 'bg-step-inactive text-text-secondary'
              }`}
            >
              {isDone ? '✓' : stepNum}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  stepNum < currentStep ? 'bg-success' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
